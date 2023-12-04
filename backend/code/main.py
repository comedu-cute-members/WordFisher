from google.cloud import speech
from google.cloud import storage
from fastapi import FastAPI, UploadFile, Request, HTTPException, Form, Depends
import os
import librosa
import soundfile
from moviepy.editor import VideoFileClip
from pydub import AudioSegment 
import csv
import shutil
from fastapi.responses import JSONResponse
import pandas as pd
from collections import Counter
from datetime import datetime
from pydantic import BaseModel
import json
import wave

# 구글 서비스 계정 인증을 위한 환경변수 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "word_fisher_credentials.json"

# 구글 클라우드 스토리지 내 버킷 이름 설정
bucket_name = "word_fisher"

# FastAPI 애플리케이션 객체 생성
app = FastAPI()

##################### 함수 구현부 #######################
# 구글 클라우드에 파일 업로드
def upload_to_bucket(IP, audio_name, file_path):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)

    # 클라이언트의 IP주소에 따른 개별 폴더 생성
    folder_blob = bucket.blob(f"clients/client_{IP}/")
    folder_blob.upload_from_string("")

    # 오디오 파일 업로드
    blob = bucket.blob(f"clients/client_{IP}/{audio_name}")
    blob.upload_from_filename(file_path)

# 사용자가 업로드한 비디오 파일 저장
def save_uploaded_file(file: UploadFile, destination: str):
    with open(destination, "wb") as f:
        f.write(file.file.read())

# 비디오에서 오디오 추출 및 오디오 파일(16비트 wav 파일) 저장
def convert_video_to_audio(video_filename: str, audio_filename: str):
    video_clip = VideoFileClip(video_filename)
    audio_clip = video_clip.audio
    audio_clip.write_audiofile(audio_filename, codec='pcm_s16le')
    video_clip.close()
    audio_clip.close()

    audio_time_series, sampleing_rate = librosa.core.load(audio_filename, sr=None)
    soundfile.write(audio_filename, audio_time_series, sampleing_rate)

def get_audio_length(audio_filename:str):
    with wave.open(audio_filename, "rb") as audio_file:
        total_frames = audio_file.getnframes()
        sample_rate = audio_file.getframerate()
        duration_seconds = total_frames / float(sample_rate)

    return duration_seconds
    
# Speech to text 후 script.txt(전체 대본)와 data.csv(단어별 시작시간, 끝시간) 생성
def recognize_speech(file_path: str, client_folder, gcs_client_folder, audio_name) -> speech.RecognizeResponse:
    result_files = os.path.join(client_folder, "STT_results")
    os.makedirs(result_files, exist_ok=True)
    # script = os.path.join(result_files, "script.txt")
    data = os.path.join(result_files, "data.csv")

    # f1 = open(script,"w+", encoding="utf-8")
    f2 = open(data, "w+", newline='', encoding="utf-8")
    csv_writer = csv.writer(f2)

    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=f"gs://word_fisher/{gcs_client_folder}/{audio_name}")
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=AudioSegment.from_wav(file_path).frame_rate,  
        language_code="ko-KR",
        enable_word_time_offsets=True,
    )

    operation = client.long_running_recognize(config=config, audio=audio)
    result = operation.result()

    csv_writer.writerow(["word", "start_time", "end_time"])
    for result in result.results:
        alternative = result.alternatives[0]
        # f1.write(f"{alternative.transcript} ")

        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time

            data = [word, start_time, end_time]

            csv_writer.writerow(data)

    # f1.close()
    f2.close()

# 구글 클라우드 스토리지 내 파일 삭제
def delete_gcs_file(file_path):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)

    folder_prefix = f"{file_path}/"
    blobs = bucket.list_blobs(prefix=folder_prefix)

    for blob in blobs:
        blob.delete()

# 총 영상 시간을 10초 단위로 분할
def divide_into_intervals(number):
    intervals = []
    for start in range(0, number + 1, 10):
        end = min(start + 10, number + 1)
        intervals.append((start, end - 1))
    return intervals

# 어떤 영상 구간에 포함되는지 체크
def check(intervals, num):
    for start, end in intervals:
        if start <= num <= end:
            return (start, end)
    return None  # 범위에 속하지 않는 경우 None 반환

########################################################     


############### Base Model 클래스 정의부 #################
class Upload(BaseModel):
    file: UploadFile
    ip: str

    @classmethod
    def as_form(
        cls,
        file: UploadFile = Form(...),
        ip: str = Form(...)
    ):
        return cls(file=file,ip = ip)
########################################################


################### HTTP 요청 처리부 ####################
# 비디오 파일 업로드
@app.post("/upload")
def upload_and_process(upload: Upload = Depends(Upload.as_form)):
    try: 
        # 클라이언트의 IP주소에 따른 개별 로컬폴더 생성
        IP = upload.ip
        clients_list = "clients"
        client_folder = os.path.join(clients_list, f"client_{IP}")
        os.makedirs(clients_list, exist_ok=True)
        os.makedirs(client_folder, exist_ok=True)
        
        # 비디오파일과 오디오파일 경로 설정
        uploaded_folder = os.path.join(client_folder, "uploaded_files")
        os.makedirs(uploaded_folder, exist_ok=True)
        video_filename = os.path.join(uploaded_folder, upload.file.filename)
        audio_name = os.path.splitext(upload.file.filename)[0] + '_audio.wav'
        audio_filename = os.path.join(uploaded_folder, audio_name)

        # gcs내 클라이언트별 폴더 이름
        gcs_client_folder = f"clients/client_{IP}"

        # 업로드된 비디오 파일 저장
        save_uploaded_file(upload.file, video_filename)

        # 비디오에서 오디오 추출 및 오디오 파일 저장
        convert_video_to_audio(video_filename, audio_filename)

        video_length = get_audio_length(audio_filename)

        # 오디오 파일을 구글 클라우드 스토리지에 업로드
        upload_to_bucket(IP, audio_name, audio_filename)

        # Speech to text 후 script(전체 대본)와 data(단어별 시작시간, 끝시간) 생성
        recognize_speech(audio_filename, client_folder, gcs_client_folder, audio_name)

        # csv 데이터를 JSON으로 변환
        result_files = os.path.join(client_folder, "STT_results")
        data = os.path.join(result_files, "data.csv")
        csv_file = open(data, "r", encoding="utf-8")
        audio_data_list = list(csv.reader(csv_file))[1:]
        csv_file.close()

        # 클라이언트의 IP주소에 따른 개별 폴더 삭제(로컬, 구글 클라우드 스토리지)
        file_path = f"clients/client_{IP}"
        shutil.rmtree(file_path)
        delete_gcs_file(gcs_client_folder)

        return JSONResponse(content={
            "audio_data_list": audio_data_list,
            "video_length": video_length
                                    })  
                                
    except Exception as e:
        return {"Error in upload_and_process": str(e)}

# 탐색 단어 입력
@app.post("/word_input/{word}")
def word_count(word: str, word_input: dict):
    try:
        df = pd.DataFrame(data=word_input["audio_data_list"], columns=["word", "start_time", "end_time"])
        df['start_time'] = df['start_time'].astype(str)
        df['end_time'] = df['end_time'].astype(str)

        video_length = int(word_input['video_length'])

        # 시작 시간의 밀리초 제거
        for i in range(len(df['start_time'])):
            each = df['start_time'][i]
            if '.' in each:
                # 밀리초가 있는 경우
                format_str = '%H:%M:%S.%f'
            else:
                # 밀리초가 없는 경우
                format_str = '%H:%M:%S'
            df['start_time'][i] = datetime.strptime(each, format_str).strftime('%H:%M:%S')

        # 끝 시간의 밀리초 제거
        for i in range(len(df['end_time'])):
            each = df['end_time'][i]
            if '.' in each:
                # 밀리초가 있는 경우
                format_str = '%H:%M:%S.%f'
            else:
                # 밀리초가 없는 경우
                format_str = '%H:%M:%S' 
            df['end_time'][i] = datetime.strptime(each, format_str).strftime('%H:%M:%S')

        # 시분초 > 초
        for i in range(len(df['start_time'])):
            hour, minute, second = df['start_time'][i].split(':')
            hour = int(hour)
            minute = int(minute)
            second = int(second)

            time = hour * 3600 + minute * 60 + second

            df['start_time'][i] = time

        # 시분초 > 초
        for i in range(len(df['end_time'])):
            hour, minute, second = df['end_time'][i].split(':')
            hour = int(hour)
            minute = int(minute)
            second = int(second)

            time = hour * 3600 + minute * 60 + second

            df['end_time'][i] = time


        # 타임라인 탐색과 빈도수 계산
        occurrences = {}
        intervals = divide_into_intervals(video_length)
        
        for interval in intervals:
            occurrences[interval] = 0

        timeline_list = []

        for i in range(len(df['start_time'])):
            if df['word'][i].lower() == word.lower():
                start_time = df['start_time'][i]
                interval = check(intervals, start_time)
                timeline_list.append({
                    "start_time" : df['start_time'][i],
                    "end_time": df['end_time'][i]
                })

                if interval is not None:
                    occurrences[interval] += 1

        result_list = [[start, end, value] for (start, end), value in occurrences.items()]

        # 타임라인과 빈도수 반환
        return JSONResponse(content={"timeline_list" : timeline_list , "result_list": result_list})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
########################################################
from google.cloud import speech
from google.cloud import storage
from fastapi import FastAPI, UploadFile, Request, HTTPException
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

# 시작 시간이 어떤 시간 구간에 속하는 지 반환
def get_time_interval(timestamp):
    hours = datetime.strptime(timestamp, '%H:%M:%S').hour
    minutes = datetime.strptime(timestamp, '%H:%M:%S').minute
    seconds = datetime.strptime(timestamp, '%H:%M:%S').second

    second_interval_start = seconds - (seconds % 10)
    if (second_interval_start == 50):
        second_interval_end = 00
    else:
        second_interval_end = second_interval_start + 10
    
    minute_interval_start = minutes
    if (second_interval_start == 50) and (minute_interval_start == 59):
        minute_interval_end = 00
    elif (second_interval_start == 50) and (minute_interval_start != 59):
        minute_interval_end = minute_interval_start + 1
    else:
        minute_interval_end = minute_interval_start

    hour_interval_start = hours
    if (second_interval_start == 50) and (minute_interval_start == 59):
        hour_interval_end = hour_interval_end + 1
    else:
        hour_interval_end = hour_interval_start

    return f"{hour_interval_start:02d}:{minute_interval_start:02d}:{second_interval_start:02d}-{hour_interval_end:02d}:{minute_interval_end:02d}:{second_interval_end:02d}"

# 구글 클라우드 스토리지 내 파일 삭제
def delete_gcs_file(file_path):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)

    folder_prefix = f"{file_path}/"
    blobs = bucket.list_blobs(prefix=folder_prefix)

    for blob in blobs:
        blob.delete()
########################################################     

################### HTTP 요청 처리부 ####################
# 비디오 파일 업로드
@app.post("/upload")
def upload_and_process(file: UploadFile, request: Request):
    try: 
        # 클라이언트의 IP주소에 따른 개별 로컬폴더 생성
        IP = request.client.host
        clients_list = "clients"
        client_folder = os.path.join(clients_list, f"client_{IP}")
        os.makedirs(clients_list, exist_ok=True)
        os.makedirs(client_folder, exist_ok=True)

        # 비디오파일과 오디오파일 경로 설정
        uploaded_folder = os.path.join(client_folder, "uploaded_files")
        os.makedirs(uploaded_folder, exist_ok=True)
        video_filename = os.path.join(uploaded_folder, file.filename)
        audio_name = os.path.splitext(file.filename)[0] + '_audio.wav'
        audio_filename = os.path.join(uploaded_folder, audio_name)

        # gcs내 클라이언트별 폴더 이름
        gcs_client_folder = f"clients/client_{IP}"

        # 업로드된 비디오 파일 저장
        save_uploaded_file(file, video_filename)

        # 비디오에서 오디오 추출 및 오디오 파일 저장
        convert_video_to_audio(video_filename, audio_filename)

        # 오디오 파일을 구글 클라우드 스토리지에 업로드
        upload_to_bucket(IP, audio_name, audio_filename)

        # Speech to text 후 script(전체 대본)와 data(단어별 시작시간, 끝시간) 생성
        recognize_speech(audio_filename, client_folder, gcs_client_folder, audio_name)

        # csv 데이터를 JSON으로 변환
        result_files = os.path.join(client_folder, "STT_results")
        data = os.path.join(result_files, "data.csv")
        df = pd.read_csv(data)
        json_audio_data_list = [df.iloc[i].to_json() for i in range(df.shape[0])]

        # 클라이언트의 IP주소에 따른 개별 폴더 삭제(로컬, 구글 클라우드 스토리지)
        file_path = f"clients/client_{IP}"
        shutil.rmtree(file_path)
        delete_gcs_file(gcs_client_folder)

        return JSONResponse(content= {"audio_data": json_audio_data_list})
    except Exception as e:
        return {"Error in upload_and_process": str(e)}

# 탐색 단어 입력
@app.post("/word_input/{word}")
async def word_count(word: str, request: Request):
    try:
        json_audio_data = await request.json()
        key = list(json_audio_data)[0]
        df = pd.DataFrame(json_audio_data[key])
        df['start_time'] = df['start_time'].astype(str)
        df['end_time'] = df['end_time'].astype(str)

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
            each = df['start_time'][i]
            if '.' in each:
                # 밀리초가 있는 경우
                format_str = '%H:%M:%S.%f'
            else:
                # 밀리초가 없는 경우
                format_str = '%H:%M:%S' 
            df['end_time'][i] = datetime.strptime(each, format_str).strftime('%H:%M:%S')

        # 타임라인 탐색과 빈도수 계산
        occurrences = Counter()
        timeline_list = []
        for i in range(len(df['word'])):
            if df['word'][i].lower() == word.lower():
                interval = get_time_interval(df['start_time'][i])
                occurrences[interval] += 1

                timeline_list.append({
                    "start_time": df['start_time'][i],
                    "end_time": df['end_time'][i]
                })

        # 타임라인과 빈도수 반환
        return JSONResponse(content={"timeline": timeline_list, "occurrences": occurrences})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
########################################################
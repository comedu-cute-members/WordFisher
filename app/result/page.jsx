"use client";
import Navigation from "../../components/navigation";
import VideoArea from "../../components/videoarea";
import ListArea from "../../components/listarea";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useRef } from "react";
import axios from "axios";

async function searchWord(word, setResponse) {
  //get data, word from search page
  var word_input = {
    audio_data_list: [
      ["알고리즘", "0:00:00", "0:00:03"],
      ["네", "0:00:03", "0:00:06"],
      ["알고리즘", "0:00:11.300000", "0:00:14.500000"],
    ],
    video_length: 34.2,
  };

  await axios
    .post("http://localhost:8000/word_input/" + word, word_input)
    .then((response) => {
      setResponse(response.data);
    });
}

export default function Result() {
  const [videoState, setVideoState] = useState({
    seeking: false,
    playing: false,
    muted: false,
    played: 0,
  });
  const videoPlayerRef = useRef(null);
  const [response, setResponse] = useState(null);

  //get data
  var word = "알고리즘";

  // call api
  if (!response) {
    searchWord(word, setResponse);
  }

  const setTimeHandler = (second) => {
    videoPlayerRef.current.seekTo(second, "seconds");
  };

  const handleVideoUpload = (event) => {
    if (event.target.files.length) {
      var path = URL.createObjectURL(event.target.files[0]);
      var video = document.createElement("video");
      video.src = path;
      video.ondurationchange = () => {
        console.log(video.duration);
      };
    }
  };

  var breadcrumbs = [
    { type: "home", name: "Home", link: "/" },
    {
      type: "search",
      name: "알고리즘 4주차 강의",
      link: "/search",
    },
    {
      type: "result",
      name: "brute force",
      link: "/result",
    },
  ];

  if (response != null) {
    return (
      <NextThemesProvider attribute="class" defaultTheme="light">
        <div className="w-full h-screen flex flex-col items-center bg-background">
          <Navigation breadcrumbs={breadcrumbs} />
          <div className="w-full h-[calc(100vh-65px)] flex flex-row gap-8 py-8 justify-center">
            <VideoArea
              videoState={videoState}
              setVideoState={setVideoState}
              videoPlayerRef={videoPlayerRef}
              setTimeHandler={setTimeHandler}
              occurrence={response.result_list}
            />
            <ListArea
              word={word}
              timeline={response.timeline_list}
              setTimeHandler={setTimeHandler}
            />
          </div>
        </div>
      </NextThemesProvider>
    );
  } else return <></>;
}

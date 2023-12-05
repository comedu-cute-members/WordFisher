"use client";
import Navigation from "../../components/navigation";
import VideoArea from "../../components/videoarea";
import ListArea from "../../components/listarea";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { dataState } from "../../components/recoil";

async function searchWord(word, word_input, setResponse) {
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
  const [data, setData] = useRecoilState(dataState);

  // call api
  if (!response) {
    searchWord(data.word, data.response, setResponse);
  }

  const setTimeHandler = (second) => {
    videoPlayerRef.current.seekTo(second, "seconds");
  };

  var breadcrumbs = [
    { type: "home", name: "Home", link: "/" },
    {
      type: "search",
      name: data.file.name,
      link: "/search",
    },
    {
      type: "result",
      name: data.word,
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
              videoURL={data.url}
              videoState={videoState}
              setVideoState={setVideoState}
              videoPlayerRef={videoPlayerRef}
              setTimeHandler={setTimeHandler}
              occurrence={response.result_list}
            />
            <ListArea
              word={data.word}
              timeline={response.timeline_list}
              setTimeHandler={setTimeHandler}
            />
          </div>
        </div>
      </NextThemesProvider>
    );
  } else return <></>;
}

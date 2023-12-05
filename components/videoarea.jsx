"use client";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { Skeleton, Button, Slider } from "@nextui-org/react";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

function formatTime(time) {
  if (isNaN(time)) return "00:00";

  const date = new Date(time * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  if (hours) {
    return `${hours}:${minutes.toString().padStart(2, "0")} `;
  } else return `${minutes}:${seconds}`;
}

function VideoChart(props) {
  var occurrence = props.occurrence;
  //occurrence.unshift([0, 0, 0]);
  var color = props.textColor ? "#ffffff" : "#000000";
  const option = {
    chart: {
      id: "word-frequency-chart",
      toolbar: { show: false },
      events: {
        click: (event, chartContext, config) => {
          props.setTimeHandler(occurrence[config.dataPointIndex][0]);
        },
      },
      zoom: { enabled: false },
    },
    stroke: {
      colors: ["#338EF7"],
      curve: "smooth",
      width: 3,
    },
    grid: {
      show: false,
      padding: { top: -20, right: 0, bottom: 0, left: 0 },
    },
    fill: { colors: ["#66AAF9"] },
    yaxis: {
      show: false,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    xaxis: {
      type: "category",
      categories: occurrence.map(
        (value) => formatTime(value[0]) + "-" + formatTime(value[1])
      ),
      labels: { show: true, style: { colors: color } },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: { x: { show: false } },
  };

  const series = [
    {
      name: "등장 횟수",
      data: occurrence.map((value) => value[2]),
    },
  ];

  return (
    <div className="h-[150px]">
      <ApexChart
        type="area"
        options={option}
        series={series}
        height="100%"
        width="100%"
      />
    </div>
  );
}

export default function VideoArea({
  videoURL,
  videoState,
  setVideoState,
  videoPlayerRef,
  setTimeHandler,
  occurrence,
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [wasPlaying, setWasPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  const progressHandler = (state) => {
    if (!videoState.seeking) {
      setVideoState({ ...videoState, ...state });
      setSliderValue(state.played * 100);
    }
  };

  const seekHandler = (value) => {
    setSliderValue(value);
    videoPlayerRef.current.seekTo(value / 100);
    setVideoState({
      ...videoState,
      playing: false,
      played: value / 100,
      seeking: true,
    });
  };

  const seekMouseUpHandler = (value) => {
    setVideoState({ ...videoState, playing: wasPlaying, seeking: false });
  };

  var pauseIcon;
  if (videoState.playing) pauseIcon = <BsFillPauseFill size="25" />;
  else pauseIcon = <BsFillPlayFill size="25" />;

  var audioIcon;
  if (!videoState.muted) audioIcon = <BsFillVolumeUpFill size="23" />;
  else audioIcon = <BsFillVolumeMuteFill size="23" />;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[45vw] h-fit flex flex-col">
        <div className="flex flex-col h-[calc(45vw*9/16)]">
          <Skeleton className=" h-full w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[45vw] h-fit flex flex-col">
      <div className="flex flex-col h-[calc(45vw*9/16)]">
        <ReactPlayer
          ref={videoPlayerRef}
          width={"100%"}
          height={"100%"}
          url={videoURL}
          controls={false}
          playing={videoState.playing}
          muted={videoState.muted}
          onProgress={progressHandler}
          onEnded={() => {
            videoState.playing = false;
          }}
        />
      </div>
      <div className="flex flex-row items-center">
        <Button
          isIconOnly
          className="bg-transparent"
          radius="full"
          size="sm"
          onPress={() => {
            setVideoState({ ...videoState, playing: !videoState.playing });
            setWasPlaying(!wasPlaying);
          }}
        >
          {pauseIcon}
        </Button>
        <Button
          isIconOnly
          className="bg-transparent"
          radius="full"
          size="sm"
          onPress={() =>
            setVideoState({ ...videoState, muted: !videoState.muted })
          }
        >
          {audioIcon}
        </Button>
        <div className="pl-2.5 dark:text-white light:text-black">
          {videoPlayerRef.current
            ? formatTime(videoPlayerRef.current.getCurrentTime())
            : "0:00"}
        </div>
      </div>
      <Slider
        aria-label="VideoTimeline"
        size="sm"
        minValue={0}
        maxValue={100}
        value={sliderValue}
        onChange={seekHandler}
        onChangeEnd={seekMouseUpHandler}
        classNames={{
          track: "border-s-blue-400",
          filler: "bg-blue-400",
        }}
      />
      <VideoChart
        setTimeHandler={setTimeHandler}
        textColor={theme == "light"}
        occurrence={occurrence}
      />
    </div>
  );
}

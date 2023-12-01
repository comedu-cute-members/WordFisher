"use client";
import ReactPlayer from "react-player";
import { use, useEffect, useState } from "react";
import { Skeleton, Button, Slider, slider } from "@nextui-org/react";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import { useRef } from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

function VideoChart() {
  const option = {
    chart: {
      id: "apexchart-example",
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          console.log(chartContext, config);
        },
      },
    },
    stroke: {
      colors: ["#338EF7"],
      curve: "smooth",
      width: 3,
    },
    grid: {
      show: false,
      padding: { top: -50, right: 0, bottom: 0, left: 0 },
    },
    fill: { colors: ["#66AAF9"] },
    yaxis: {
      show: false,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    xaxis: {
      labels: { show: true, style: { colors: "#ffffff" } },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: { x: { show: false } },
    annotations: {
      xaxis: [
        {
          x: 5,
          x2: 6,
          fillColor: "#000000",
        },
      ],
    },
  };

  const series = [
    {
      name: "등장 횟수",
      data: [
        30, 40, 35, 50, 100, 60, 70, 91, 125, 30, 40, 35, 50, 100, 60, 70, 91,
        125, 30, 40, 35, 50, 100, 60, 70, 91, 125, 30, 40, 35, 50, 100, 60, 70,
        91, 125, 30, 40, 35, 50, 100,
      ],
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

export default function VideoArea() {
  const [mounted, setMounted] = useState(false);
  const [videoState, setVideoState] = useState({
    seeking: false,
    playing: false,
    muted: false,
    played: 0,
  });
  const videoPlayerRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);

  const progressHandler = (state) => {
    if (!videoState.seeking) {
      setVideoState({ ...videoState, ...state });
      setSliderValue(state.played * 100);
    }
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

  /** call api **/

  return (
    <div className="w-[45vw] h-fit flex flex-col">
      <div className="flex flex-col h-[calc(45vw*9/16)]">
        <ReactPlayer
          ref={videoPlayerRef}
          width={"100%"}
          height={"100%"}
          url="https://www.youtube.com/watch?v=pSUydWEqKwE"
          controls={false}
          playing={videoState.playing}
          muted={videoState.muted}
          onProgress={progressHandler}
        />
      </div>
      <div className="flex flex-row items-center">
        <Button
          isIconOnly
          className="bg-transparent"
          radius="full"
          size="sm"
          onPress={() =>
            setVideoState({ ...videoState, playing: !videoState.playing })
          }
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
        <div className="pl-2.5">
          {videoPlayerRef.current
            ? formatTime(videoPlayerRef.current.getCurrentTime())
            : "0:00"}
        </div>
      </div>
      <Slider
        size="sm"
        minValue={0}
        maxValue={100}
        value={sliderValue}
        classNames={{
          track: "border-s-blue-400",
          filler: "bg-blue-400",
        }}
      />
      <VideoChart />
    </div>
  );
}

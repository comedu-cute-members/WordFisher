"use client";
import Navigation from "../../components/navigation";
import VideoArea from "../../components/videoarea";
import ListArea from "../../components/listarea";
import { BiSolidHome, BiSolidVideos, BiSolidSearchAlt2 } from "react-icons/bi";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

export default function Result() {
  var breadcrumbs = [
    { type: "home", name: "Home", icon: <BiSolidHome /> },
    {
      type: "video",
      name: "알고리즘 4주차 강의",
      icon: <BiSolidVideos />,
    },
    { type: "search", name: "brute force", icon: <BiSolidSearchAlt2 /> },
  ];
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <div className="w-full h-screen flex flex-col items-center">
          <Navigation breadcrumbs={breadcrumbs} />
          <div className="w-full h-full flex flex-row p-8 gap-8 justify-center">
            <VideoArea />
            <ListArea />
          </div>
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

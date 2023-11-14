"use client";
import Navigation from "../../components/navigation";
import VideoArea from "../../components/videoarea";
import ListArea from "../../components/listarea";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Result() {
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
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <div className="w-full h-screen flex flex-col items-center bg-background">
        <Navigation breadcrumbs={breadcrumbs} />
        <div className="w-full h-[calc(100vh-65px)] flex flex-row gap-8 py-8 justify-center">
          <VideoArea />
          <ListArea />
        </div>
      </div>
    </NextThemesProvider>
  );
}

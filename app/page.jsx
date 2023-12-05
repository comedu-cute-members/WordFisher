"use client";
import Navigation from "../components/navigation";
import { Button, Spacer } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/react";
import axios from "axios";
import ButtonProvider from "../components/buttonProvider";

function Home() {
  const [ip, setIp] = useState();
  const [file, setFile] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);

  // get user's ip
  useEffect(() => {
    axios.get("https://geolocation-db.com/json/").then((res) => {
      console.log("ip: ", res.data.IPv4);
      setIp(res.data.IPv4);
    });
  }, []);

  const videoUpload = (e) => {
    const video = e.target.files[0];

    setFile({
      url: URL.createObjectURL(e.target.files[0]),
      send: video,
      video: video.type.includes("video"),
    });
    setIsDisabled(false);
  };

  const ShowVideo = () => {
    if (isDisabled == true) {
      return (
        <div className="justify-center">
          <input type="file" onChange={videoUpload} />
        </div>
      );
    } else if (isDisabled == false) {
      return (
        <div>
          {file.video && <video src={file.url} controls width="450px" />}
        </div>
      );
    }
  };

  var breadcrumbs = [{ type: "home", name: "Home", link: "/" }];

  return (
    <div className="bg-background">
      <div>
        <Navigation breadcrumbs={breadcrumbs} />
      </div>

      <Spacer y={50} />
      <div className="flex flex-col h-[400px] justify-center items-center bg-background light:text-black dark:text-white">
        <Card
          radius="lg"
          className="flex text-center justify-center border-none h-[250px] items-center"
        >
          <ShowVideo isDisabled={isDisabled} />
        </Card>
      </div>
      <ButtonProvider isDisabled={isDisabled} link="home" file={file} ip={ip} />
    </div>
  );
}

export default Home;

"use client";
import Navigation from "../components/navigation";
import { Button, Spacer } from "@nextui-org/react";
import React, {useEffect, useState} from 'react';
import { Card } from "@nextui-org/react";
import axios from 'axios';
import ButtonProvider from '../components/buttonProvider';

async function onDrop(files, ip) {
  let formData = new FormData();
  formData.append("file",files[0])
  formData.append('ip', new Blob([JSON.stringify(ip)]))
  
  await axios
  .post("http://localhost:8000/upload", formData,{
    headers: {
        "Contest-Type": "multipart/form-data"
    }})
  
  .then(response=>{
    console.log(response);
    // let variable = {
    //   ip: ip,
    // };
    // axios.post("http://localhost:8000/upload", variable).then((response)=>{
    //   console.log(response.data);
    // })
  })
  // 오류발생시
  .catch(error=>{
      console.error(error);
  });
};

function Home() {
  // get user's ip
  useEffect(() =>{
    const res = axios.get('https://geolocation-db.com/json/')
      .then((res) => {
        console.log("ip: ", res.data.IPv4)
        setIp(res.data.IPv4)
      })
  }, [])
  const [ip, setIp] = useState();
  const [file, setFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const videoUpload = e => {
    const videoTpye = e.target.files[0].type.includes('video');

    setFile({
      url: URL.createObjectURL(e.target.files[0]),
      video: videoTpye,
    });
    setIsDisabled(false);
  };


  const ShowVideo = () => {
    if(isDisabled == true){
      return <input type="file" onChange={videoUpload}/>
    }
    else if(isDisabled == false){
      return(
        <div>{file.video && <video src={file.url} controls width="450px"/>}</div>
      )
    } 
  }

  const test = () => {
    onDrop(file, ip);
  }

  var breadcrumbs = [
    { type: "home", name: "Home", link: "/" },
    {
      type: "uploade",
      name: "알고리즘 4주차 강의",
      link: "/",
    },
  ];

  return (
    <div className="bg-background">
      <div>
        <Navigation breadcrumbs={breadcrumbs} />
      </div>
      
      <Spacer y={50}/>
      <div className="flex flex-col h-[400px] justify-center items-center bg-background light:text-black dark:text-white border-4">
        <Card
          
          radius="lg"
          className="flex text-center justify-center border-none h-[250px] items-center"
        >
          <ShowVideo isDisabled = {isDisabled}/>
          {/* <input type="file" onChange={videoUpload}/> */}
          {/* <div>file.video && <video src={file.url} controls width="400px" /></div> */}
        </Card>
        <Button
        onClick={test}
        >axios post test</Button>
      </div>
      <ButtonProvider isDisabled={isDisabled} link="home" data = {file}/>
    </div>
  );
}

export default Home;
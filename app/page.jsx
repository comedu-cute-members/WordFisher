"use client";
import Navigation from "../components/navigation";
import { Spacer } from "@nextui-org/react";
import React, {useState} from 'react';
import { Card } from "@nextui-org/react";
import axios from 'axios';
import ButtonProvider from '../components/buttonProvider';


function Home() {
  //const navigate = useNavigate();
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

  const onDrop= async (files)=>{
    let formData = new FormData();

    formData.append("files",files[0])
    
    axios({
      data: formData,
      headers:{'Content-Type': 'multipart/form-data'},
    })
    // 통신 성공했을 때
    .then(response=>{
      console.log(response.data);
    })
    // 오류발생시
    .catch(error=>{
      console.error(error);
    });
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
      </div>
      <ButtonProvider isDisabled={isDisabled} link="home"/>
    </div>
  );
}

export default Home;
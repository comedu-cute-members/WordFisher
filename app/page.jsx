"use client";
import Navigation from "../components/navigation";
import { Button, Link, ButtonGroup, Spacer } from "@nextui-org/react";
import { ThemeSwitcher } from "../components/themeSwitcher";
import styled from 'styled-components';
import React, {useState} from 'react';
import { BrowserRouter, BrowserTouter, useLinkClickHandler, useNavigate } from "react-router-dom";
import axios from 'axios'

function Home() {
  //const navigate = useNavigate();
  const [mode, setMode] = useState('BLANK');
  const [file, setFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const videoUpload = e => {
    const videoTpye = e.target.files[0].type.includes('video');

    setFile({
      url: URL.createObjectURL(e.target.files[0]),
      video: videoTpye,
    });
    setIsDisabled(false);
    console.log(videoTpye);
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

  const clickHandler = ({ item }) =>{
    //navigate('/search', {state: {item},});

    setIsLoading(true);
    onDrop(file);

    setTimeout(()=>{
      setIsLoading(false);
    }, 30000);
  };

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
      <div class="bg-background light:text-black dark:text-white border-4">
        <Wrap> 
          <UploadBox>
            <h1>Upload your video</h1>
              <p>
                <input type="file" onChange={videoUpload}/>
                {file.video && <video src={file.url} controls width="350px" />}
              </p>
              <Button
                className="text-black/50 bg-blue-100 dark:bg-blue-500 dark:text-white"
                //onClick={() => clickHandler({file})}
                onClick={clickHandler}
                isDisabled={isDisabled}
                isLoading={isLoading}
                loadingText="Loading..."
                as={Link} 
                href="/search"
              >
                Next
                </Button>
          </UploadBox>
          
        </Wrap>

        
      </div>

    </div>
  );
}

const UploadBox = styled.div`
  flex-direction: column;
  justify-content: space-between;
`
const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70dvh;
  backgroundColor:'powderblue';
`;

export default Home;
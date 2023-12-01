"use client";
import Navigation from "../components/navigation";
import { Button, Link, ButtonGroup } from "@nextui-org/react";
import { ThemeSwitcher } from "../components/themeSwitcher";
import styled from 'styled-components';
import React, {useState} from 'react';
import axios from 'axios'
import Header from "../components/spacer";


function Home() {

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
    onDrop(e.target.files)
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
    .catch(error=>{
      console.error(error);
    });
  };

  const clickHandler = () =>{
    setIsLoading(true);

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
    <>
      <div>
        <Navigation breadcrumbs={breadcrumbs} />
      </div>

      <ThemeSwitcher />

      <div class="light light:bg-gray-100 light:text-black bg-black text-white">

        <Wrap> 
          <UploadBox>
            <h1>Upload your video</h1>
              <p>
                <input type="file" onChange={videoUpload}/>
                {file.video && <video src={file.url} controls width="350px" />}
              </p>
              <Spacer>
                <Button
                    onClick={clickHandler}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    loadingText="Loading..."
                    flat color='primary'
                    variant="flat"
                    as={Link} 
                    href="/search"
                  >
                    Next
                </Button>
              </Spacer>
          </UploadBox>
          
        </Wrap>

        
      </div>

    </>
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
  backgroundColor;'powderblue',
`;

const Spacer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;
export default Home;
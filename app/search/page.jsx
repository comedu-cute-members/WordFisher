"use client";
import { Button, Link, Spacer, Input } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";
import Navigation from "../../components/navigation";
import React, {useState} from 'react';
import styled from 'styled-components';
import {SearchIcon} from "./SearchIcon";
import { useLocation } from 'react-router-dom';

//const location = useLocation();
//const file = {location};

// const string = "give me give me now give me give me now JJJJ"
function Search() {
  const [searchText, setSearchText] = useState("");

  var breadcrumbs = [
    { type: "home", name: "Home", link: "/" },
    {
      type: "search",
      name: "알고리즘 4주차 강의",
      link: "/search",
    },
  ];

<style>
  .button-info{ 
     "text-black/50 bg-blue-100 max-w-30 shadow-lg dark:bg-blue-500 dark:text-white"
  }
</style>

  // const onDrop= async (files)=>{
  //   let formData = new FormData();

  //   formData.append("files",files[0])
    
  //   axios({
  //     data: formData,
  //     headers:{'Content-Type': 'multipart/form-data'},
  //   })
  //   // 통신 성공했을 때
  //   .then(response=>{
  //     console.log(response.data);
  //   })
  //   // 오류발생시
  //   .catch(error=>{
  //     console.error(error);
  //   });
  // };
  

  return (
    <div className="bg-background">
      <div className="flex flex-col">
        <Navigation breadcrumbs={breadcrumbs} />
      </div>
      <div className="grid place-items-center mt-4 h-[300px] p-10 bg-background border-4">

        <div>
          <p>
            {/* {file.video && <video src={file.url} controls width="350px" />} */}
          </p>
        </div>
        <Input
            isClearable
            label="Search"
            variant="bordered"
            placeholder="Enter what you wanna search"
            className="w-[400px] dark:text-white/90"
            onValueChange={setSearchText}
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0"/>
            }
          />
        <p className="text-default-500">Search Text: {searchText}</p>
        <Spacer y={50}/>
      </div>
      
      {/* button place */}
      <div className="flex flex-row my-auto justify-center border-4">
        <Button className="text-black/50 bg-blue-100 max-w-30 shadow-lg dark:bg-blue-500 dark:text-white" as={Link} href="../">
          Back
        </Button>
        <Spacer x={300}/>
        <Button 
        className="text-black/50 bg-blue-100 max-w-30 shadow-lg dark:bg-blue-500 dark:text-white" as={Link} href="/result"
        //onClick={onDrop()}
        >
          Search!
        </Button>
      </div>
    </div>
  );
}

export default Search;
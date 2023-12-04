"use client";
import { Spacer, Input } from "@nextui-org/react";
import Navigation from "../../components/navigation";
import React, {useEffect, useState} from 'react';
import {SearchIcon} from "./SearchIcon";
import ButtonProvider from "../../components/buttonProvider";

//const location = useLocation();
//const file = {location};

// const string = "give me give me now give me give me now JJJJ"
function Search() {
  const [searchText, setSearchText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  var breadcrumbs = [
    { type: "home", name: "Home", link: "/" },
    {
      type: "search",
      name: "알고리즘 4주차 강의",
      link: "/search",
    },
  ];
  
  useEffect(()=>{
    if(searchText.length > 1){
      console.log("HI");
      setIsDisabled(false);
    }  
    else{
      console.log("Hello");
      setIsDisabled(true);
    }
  })


  return (
    <div className="bg-background">
      <div className="flex flex-col">
        <Navigation breadcrumbs={breadcrumbs} />
      </div>
      <div className="flex flex-col h-[400px] justify-center items-center bg-background light:text-black dark:text-white border-4">

        <div>
          <p>
            {/* {file.video && <video src={file.url} controls width="350px" />} */}
          </p>
        </div>
        <Input
            isClearable
            label="Search"
            variant="bordered"
            placeholder="Enter what you want to search"
            className="w-[400px] dark:text-white/90"
            onValueChange={setSearchText}
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0"/>
            }
          />
        <p className="text-default-500">Search Text: {searchText}</p>
        <p className="text-default-500">length Text: {searchText.length}</p>
        <Spacer y={50}/>
      </div>
      
      <ButtonProvider isDisabled={isDisabled} link="search"/>
    </div>
  );
}

export default Search;
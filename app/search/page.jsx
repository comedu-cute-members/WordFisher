"use client";
import { Spacer, Input } from "@nextui-org/react";
import Navigation from "../../components/navigation";
import React, { useEffect, useState } from "react";
import { SearchIcon } from "./SearchIcon";
import ButtonProvider from "../../components/buttonProvider";
import { useRecoilState } from "recoil";
import { dataState } from "../../components/recoil";

function Search() {
  const [searchText, setSearchText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useRecoilState(dataState);

  var breadcrumbs = [
    { type: "home", name: "Home", link: "/" },
    {
      type: "search",
      name: data.file.name,
      link: "/search",
    },
  ];

  useEffect(() => {
    if (searchText.length > 1) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [searchText.length]);

  return (
    <div className="bg-background h-screen">
      <div className="flex flex-col h-full">
        <Navigation breadcrumbs={breadcrumbs} />
        <div className="flex-1 flex flex-col justify-center items-center bg-background light:text-black dark:text-white">
          <div className="">
            {data.file && <video src={data.url} controls width="450px" />}
          </div>
          <Input
            isClearable
            label="Search"
            variant="bordered"
            placeholder="Enter what you want to search"
            className="w-[400px] dark:text-white/90 py-10"
            onValueChange={setSearchText}
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />
          <ButtonProvider
            isDisabled={isDisabled}
            link="search"
            word={searchText}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;

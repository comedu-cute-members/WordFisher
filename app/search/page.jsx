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

  console.log(data);

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
    <div className="bg-background">
      <div className="flex flex-col">
        <Navigation breadcrumbs={breadcrumbs} />
      </div>
      <div className="flex flex-col h-[400px] justify-center items-center bg-background light:text-black dark:text-white">
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
            <SearchIcon className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0" />
          }
        />
        <Spacer y={50} />
      </div>

      <ButtonProvider isDisabled={isDisabled} link="search" word={searchText} />
    </div>
  );
}

export default Search;

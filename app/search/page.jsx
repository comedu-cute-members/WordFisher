"use client";
import { Button, Link, image } from "@nextui-org/react";
import Navigation from "../../components/navigation";
import React, {useState} from 'react';
import styled from 'styled-components';


function Search() {

  var breadcrumbs = [
    { type: "home", name: "Home", link: "/" },
    {
      type: "search",
      name: "알고리즘 4주차 강의",
      link: "/search",
    },
  ];

  return (
    <div className="flex flex-col">
      <Navigation breadcrumbs={breadcrumbs} />

      <Button className="max-w-30" as={Link} href="/result">
          search!
      </Button>
    </div>
  );
}


export default Search;
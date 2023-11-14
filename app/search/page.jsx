"use client";
import { Button, Link } from "@nextui-org/react";
import Navigation from "../../components/navigation";

export default function Search() {
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
        click me!
      </Button>
    </div>
  );
}

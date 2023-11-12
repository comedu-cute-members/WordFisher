"use client";
import Image from "next/image";
import { NextUIProvider, Button } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <Button>실험용 버튼</Button>
    </NextUIProvider>
  );
}

"use client";
import { Button } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";

export default function Result() {
  return (
    <NextUIProvider>
      <Button>click me!</Button>
    </NextUIProvider>
  );
}

import Main from "./main.js";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <Main />
    </NextUIProvider>
  );
}

"use client";
import { Button, Link } from "@nextui-org/react";
import { ThemeSwitcher } from "../components/themeSwitcher";

export default function Home() {
  return (
    <>
      <ThemeSwitcher />
      <Button as={Link} href="/search">
        실험용 버튼
      </Button>
    </>
  );
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (theme == "light")
    return (
      <Button
        isIconOnly
        onClick={() => setTheme("dark")}
        className="bg-blue-100 text-blue-300"
        startContent={<BsFillMoonFill size="20" />}
      ></Button>
    );
  else
    return (
      <Button
        isIconOnly
        onClick={() => setTheme("light")}
        className="bg-zinc-800 text-blue-400"
        startContent={<BsFillSunFill size="23" />}
      ></Button>
    );
}

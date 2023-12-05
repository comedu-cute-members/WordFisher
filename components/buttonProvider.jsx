import { Button, Link, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { dataState } from "./recoil";
import { useRouter } from "next/navigation";
import axios from "axios";

async function onDrop(file, ip, setIsLoading, data, setData, router) {
  let formData = new FormData();
  formData.append("file", file.send);
  formData.append("ip", ip);

  setData((prev) => ({
    ...prev,
    file: file.send,
    url: file.url,
    ip: ip,
  }));

  await axios
    .post("http://localhost:8000/upload", formData, {
      headers: {
        "Contest-Type": "multipart/form-data",
      },
    })
    // 통신 성공했을 때
    .then((response) => {
      setData((prev) => ({ ...prev, response: response.data }));
      setIsLoading(false);
      router.push("/search");
    })
    // 오류발생시
    .catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
}

// props은 home일 때 영상 업로드의 여부를, search땐 검색 단어 입력 여부를 받음
export default function ButtonProvider(props) {
  const [backIsDisabled, setBackIsDisabled] = useState(true);
  const [searchIsDisabled, setSearchIsDisabled] = useState(true);
  const [nextLink, setNextLink] = useState("");
  const [backLink, setBackLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useRecoilState(dataState);
  const router = useRouter();

  useEffect(() => {
    if (props.link == "home") {
      setNextLink("/search");
      if (props.isDisabled == false) {
        setSearchIsDisabled(false);
      }
    }
    if (props.link == "search") {
      setNextLink("/result");
      setBackLink("../");
      setBackIsDisabled(false);
      if (props.isDisabled == false) {
        setSearchIsDisabled(false);
      } else {
        setSearchIsDisabled(true);
      }
    }
  }, [props.isDisabled, props.link]);

  const clickHandler = () => {
    setIsLoading(true);

    // if it is home, send video to server
    if (props.link == "home") {
      onDrop(props.file, props.ip, setIsLoading, data, setData, router);
    }

    // if it is search page, send word to result
    if (props.link == "search") {
      setData({ ...data, word: props.word });
      router.push("/result");
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <Button
        onClick={clickHandler}
        isLoading={isLoading}
        className="text-black/50 bg-blue-100 max-w-30 shadow-lg dark:bg-blue-500 dark:text-white"
        as={Link}
        href={backLink}
        isDisabled={backIsDisabled}
      >
        Back
      </Button>

      <Spacer x={300} />

      <Button
        onClick={clickHandler}
        isLoading={isLoading}
        className="text-black/50 bg-blue-100 max-w-30 shadow-lg dark:bg-blue-500 dark:text-white"
        isDisabled={searchIsDisabled}
      >
        Next
      </Button>
    </div>
  );
}

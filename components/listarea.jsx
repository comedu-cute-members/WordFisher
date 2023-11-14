import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Code,
} from "@nextui-org/react";

export default function ListArea() {
  // TODO: call api

  var wordList = [
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
    "00:06:32",
  ];

  return (
    <div className="flex-auto max-w-[300px]">
      <Card className="h-fit max-h-full dark:bg-content2">
        <CardHeader>{'"brute force"의 검색결과'}</CardHeader>
        <Divider />
        <CardBody className="gap-2 px-5">
          {wordList.map((time, i) => (
            <Code className="w-fit" color="primary" key={i}>
              {time}
            </Code>
          ))}
        </CardBody>
        <Divider />
        <CardFooter>총 {wordList.length}개의 검색 결과</CardFooter>
      </Card>
    </div>
  );
}

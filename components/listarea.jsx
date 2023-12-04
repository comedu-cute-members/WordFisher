import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Code,
} from "@nextui-org/react";

function formatTime(time) {
  if (isNaN(time)) return "00:00";

  const date = new Date(time * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  if (hours) {
    return `${hours}:${minutes.toString().padStart(2, "0")} `;
  } else return `${minutes}:${seconds}`;
}

export default function ListArea({ word, timeline, setTimeHandler }) {
  return (
    <div className="flex-auto max-w-[300px]">
      <Card className="h-fit max-h-full dark:bg-content2">
        <CardHeader>{'"' + word + '"의 검색결과'}</CardHeader>
        <Divider />
        <CardBody className="gap-2 px-5">
          {timeline.map((time, i) => (
            <Code className="w-fit" color="primary" key={i}>
              <Link onPress={(event) => setTimeHandler(time.start_time)}>
                {formatTime(time.start_time) + "-" + formatTime(time.end_time)}
              </Link>
            </Code>
          ))}
        </CardBody>
        <Divider />
        <CardFooter>총 {timeline.length}개의 검색 결과</CardFooter>
      </Card>
    </div>
  );
}

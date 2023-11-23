import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { Skeleton, Button } from "@nextui-org/react";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";

export default function VideoArea() {
  const [mounted, setMounted] = useState(false);
  const [videoState, setVideoState] = useState({
    playing: true,
    muted: false,
  });

  var pauseIcon;
  if (videoState.playing) pauseIcon = <BsFillPauseFill size="25" />;
  else pauseIcon = <BsFillPlayFill size="25" />;

  var audioIcon;
  if (!videoState.muted) audioIcon = <BsFillVolumeUpFill size="23" />;
  else audioIcon = <BsFillVolumeMuteFill size="23" />;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="w-[45vw] h-fit flex flex-col">
        <div className="flex flex-col h-[calc(45vw*9/16)]">
          <Skeleton className=" h-full w-full rounded-lg" />
        </div>
        <div className="h-[150px] bg-blue-100">I am chart area</div>
      </div>
    );

  /** call api **/

  return (
    <div className="w-[45vw] h-fit flex flex-col">
      <div className="flex flex-col h-[calc(45vw*9/16)]">
        <ReactPlayer
          width={"100%"}
          height={"100%"}
          url="https://www.youtube.com/watch?v=pSUydWEqKwE"
          controls={false}
          playing={videoState.playing}
          muted={videoState.muted}
        />
      </div>
      <div className="flex flex-row">
        <Button
          isIconOnly
          className="bg-transparent"
          radius="full"
          onPress={() =>
            setVideoState({ ...videoState, playing: !videoState.playing })
          }
        >
          {pauseIcon}
        </Button>
        <Button
          isIconOnly
          className="bg-transparent"
          radius="full"
          onPress={() =>
            setVideoState({ ...videoState, muted: !videoState.muted })
          }
        >
          {audioIcon}
        </Button>
      </div>
      <div className="h-[150px] bg-blue-100">I am chart area</div>
    </div>
  );
}

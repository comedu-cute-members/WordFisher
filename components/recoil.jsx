import { atom } from "recoil";

export const dataState = atom({
  key: "dataState",
  default: {
    file: {
      name: "default",
    },
    ip: "127.0.0.1",
    response: {
      audio_data_list: [
        ["default", "0:00:00", "0:00:03"],
        ["네", "0:00:03", "0:00:06"],
        ["default", "0:00:11.300000", "0:00:14.500000"],
      ],
      video_length: 34.2,
    },
    word: "default",
  },
});

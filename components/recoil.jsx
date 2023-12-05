import { atom } from "recoil";

export const dataState = atom({
  key: "dataState",
  default: {
    file: null,
    ip: null,
    response: null,
  },
});

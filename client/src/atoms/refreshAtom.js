import { atom } from "recoil";

export const refreshAtom = atom({
  key: "refresh",
  default: false,
});

export default refreshAtom;

import { atom } from "recoil";

export const authScreenAtom = atom({
  key: "authScreenAtom",
  default: "login",
});

export default authScreenAtom;

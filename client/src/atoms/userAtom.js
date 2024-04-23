import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
  default: localStorage.getItem("threads-user"),
});

export default userAtom;
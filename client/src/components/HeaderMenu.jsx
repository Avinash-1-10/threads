import React from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import LogoutButton from "./LogoutButton";
import { IoSettingsOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { GrUserAdmin } from "react-icons/gr";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdInfoOutline } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoMdCode } from "react-icons/io";

const HeaderMenu = () => {
  const { colorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  const menuItems = [
    {
      label: "Settings",
      icon: IoSettingsOutline,
      link: "/settings",
    },
    {
      label: "Dashboard",
      icon: RxDashboard,
      link: "/dashboard",
    },
    {
      label: "Admin",
      icon: GrUserAdmin,
      link: "/admin",
    },
    {
      label: "Bookmarks",
      icon: IoBookmarkOutline,
      link: "/bookmarks",
    },
    {
      label: "About",
      icon: MdInfoOutline,
      link: "/about",
    },
    {
      label: "Help",
      icon: IoIosHelpCircleOutline,
      link: "/help",
    },
    {
      label: "Source Code",
      icon: IoMdCode,
      link: "/source",
    },
  ];

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={
          <HiOutlineMenuAlt3
            fontSize="24px"
            color={colorMode === "dark" ? "white" : "black"}
          />
        }
      />
      <Portal>
        <MenuList bg={colorMode === "dark" ? "#101010" : "#EDF2F6"} zIndex={60}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              bg={colorMode === "dark" ? "#101010" : "#EDF2F6"}
            >
              <Link to={item.link}>
                <Flex alignItems={"center"} gap={2}>
                  <item.icon size={20} />
                  <Text>{item.label}</Text>
                </Flex>
              </Link>
            </MenuItem>
          ))}
          {user && (
            <MenuItem bg={colorMode === "dark" ? "#101010" : "#EDF2F6"}>
              <LogoutButton />
            </MenuItem>
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default HeaderMenu;

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";

const UpdateProfileCard = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const {handleImageChange, imgUrl} = usePreviewImg()
  const [userData, setUserData] = useState({
    name: user?.name,
    username: user?.username,
    email: user?.email,
  });
  const fileRef = useRef(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData)
    // try {
    //   const { data } = await axios.put("/api/v1/user/update", userData);
    //   setUser(data?.data?.user);
    //   showToast("Success", data.message, "success");
    // } catch (error) {
    //   showToast("Error", error.response.data.message, "error");
    // }
  }
  return (
    <Flex align={"center"} justify={"center"} bg={"gray.dark"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading
          lineHeight={1.1}
          textAlign={"center"}
          fontSize={{ base: "2xl", sm: "3xl" }}
        >
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || user?.avatar} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
              <input
                type="file"
                accept="image/*"
                id="avatar"
                style={{ display: "none" }}
                ref={fileRef}
                onChange={handleImageChange}
              />
            </Center>
          </Stack>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder="John Doe"
            _placeholder={{ color: "gray.500" }}
            defaultValue={userData?.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            type="text"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Johndoe"
            _placeholder={{ color: "gray.500" }}
            defaultValue={userData?.username}
            type="text"
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            defaultValue={userData?.email}
            type="email"
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Bio"
            _placeholder={{ color: "gray.500" }}
            defaultValue={userData?.bio}
            type="text"
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.500",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default UpdateProfileCard;

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Avatar,
  Center,
  useColorMode,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

const UpdateProfileCard = ({ onClose }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const showToast = useShowToast();
  const { colorMode } = useColorMode();
  const { handleImageChange, imgUrl, imgFile } = usePreviewImg();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    bio: user?.bio,
  });
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("bio", userData.bio);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("avatar", imgFile);
    try {
      const { data } = await axios.put("/api/v1/user/update", formData);
      setUser(data?.data);
      localStorage.setItem("threads-user", JSON.stringify(data?.data));
      showToast("Success", data.message, "success");
      onClose();
      window.location.reload();
    } catch (error) {
      console.log(error);
      showToast("Error", error.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={colorMode === "dark" ? "gray.dark" : "#EDF2F6"}
      borderRadius={"lg"}
    >
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
              <Button
                w="full"
                onClick={() => fileRef.current.click()}
                variant={"outline"}
              >
                Change Avatar
              </Button>
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
            readOnly
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            defaultValue={userData?.email}
            type="email"
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            cursor={loading ? "not-allowed" : "pointer"}
            w="full"
            _hover={{
              bg: "green.500",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <Spinner /> : "Update Profile"}
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default UpdateProfileCard;

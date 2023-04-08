import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import { getDatabase, ref, set, remove, get, child } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import firebase_app from "@/firebase/config";
import { getAuth } from "firebase/auth";
import like_icon from "../images/like.svg";
import share from "../images/share.svg";
import comment from "../images/comment.svg";
import bin from "../images/delete.svg";
import filled_like from "../images/filled_like.svg";

export default function Post({ name, text, id, post, likes, photo, img}) {
  const app = firebase_app;
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [likedPosts, setLikedPosts] = useState([]);

  function postClick() {
    window.open(`/posts/${id}`, "_self");
  }

  const [user, setUser] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        console.log("signed in");
        setUser(user);
        // ...
      } else {
        console.log("not signed in");
        window.open("/signup", "_self");
        // User is signed out
        // ...
      }
    });
  }, []);

  function like(e) {}

  function delPost(e) {
    remove(ref(db, `/posts/post${e.target.id}`));
  }

  return (
    <Card maxW="md" width="100%">
      <div
        onClick={!post ? postClick : undefined}
        className={`${!post ? "cursor-pointer" : ""}`}
      >
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar
                name="Segun Adebayo"
                src={photo}
              />

              <Box>
                <Heading size="sm">{name}</Heading>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          <Text>{text}</Text>
        </CardBody>
      </div>
      <CardFooter
        justify="center"
        alignItems="center"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <div className="flex w-full justify-between">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={likedPosts.includes(id) ? filled_like : like_icon}
              style={{ width: "30px" }}
              id={id}
              onClick={like}
              alt="like-button"
            />
            <h1>{likes}</h1>
          </div>
          <Image src={comment} style={{ width: "30px" }} alt="comment-button" />
          <Image src={share} style={{ width: "30px" }} alt="share-button" />
          {user.displayName === name && (
            <Image
              variant="ghost"
              onClick={delPost}
              id={id}
              src={bin}
              style={{ width: "30px" }}
              alt="delete-button"
              className="cursor-pointer"
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

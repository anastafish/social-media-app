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
import { getDatabase, ref, set, remove, get, child, onValue } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import firebase_app from "@/firebase/config";
import { getAuth } from "firebase/auth";
import like_icon from "../images/like.svg";
import share from "../images/share.svg";
import comment from "../images/comment.svg";
import bin from "../images/delete.svg";
import filled_like from "../images/filled_like.svg";
import { useRouter } from "next/router";

export default function Post({
  name,
  text,
  id,
  post,
  likes,
  photo,
  image,
  postDate,
}) {
  const app = firebase_app;
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [likedPosts, setLikedPosts] = useState([]);
  const router = useRouter();

  function postClick() {
    router.push(`/posts/${id}`);
  }

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const starCountRef = ref(db, "/posts");
    onValue(starCountRef, (snapshot) => {
      if (snapshot.val()) {
        setPosts(Object.values(snapshot.val()).slice(0).reverse());
      }
    });
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        // ...
      } else {
        console.log("not signed in");
        router.push("/login");
        // User is signed out
        // ...
      }
    });
  }, []);

  function like(e) {}

  function delPost(e) {
    remove(ref(db, `/posts/${e.target.id}`));
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
              <Avatar name="Segun Adebayo" src={photo} />

              <Box>
                <Heading size="sm">{name}</Heading>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <Text>{text}</Text>
          {image && (
            <Image
              src={image}
              alt="post_image"
              width={20}
              height={20}
              className="w-full h-[25rem] rounded-md"
            />
          )}
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
          {user.displayName === name && !post && (
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
      {post && <h1 className={`text-[15px] p-[1rem]`}>{postDate}</h1>}
    </Card>
  );
}

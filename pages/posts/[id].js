import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import firebase_app from "@/firebase/config";
import { useRouter } from "next/router";
import { ChakraProvider, Textarea, Input, Button, Avatar, Card, CardBody, Text } from "@chakra-ui/react";
import Post from "@/components/post";
import arrow from '../../images/arrow.svg'
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Head from "next/head";
import { avatarClasses } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState();
  const [user, setUser] = useState({});

  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);

  useEffect(() => {

    // check if user is logged in or not
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        // ...
      } else {
        router.push('/login');
        // User is signed out
        // ...
      }
    });
  }, []);

  useEffect(() => {
    // get the specific post from the database depending on the url query
    const starCountRef = ref(db, `/posts/${id}`);
    onValue(starCountRef, (snapshot) => {
      setPost(snapshot.val());
    });
  }, [id]);

  return (
    <ChakraProvider>
      <Head>
            <title>{`${post ? post.name :'user'}'s Post`}</title>
          </Head>
        <Header user={user}>
          <Button onClick={signOut}>Sign Out</Button>
        </Header>
        <div className="flex flex-col gap-5 items-center justify-center relative">
          <div className="w-full mt-2 p-2">
            <Link href='/' className="sm:cursor-pointer cursor-default">
              <Image priority src={arrow} alt='back' className="self-start "/>
            </Link>
          </div>
          <div
            className="
            flex flex-col items-center justify-center
            m-5 overflow-y-clip gap-4 w-full
            "
          >
            {post && (
              <Post
              name={post.name}
              text={post.text}
              id={post.id}
              likes={post.likes}
              photo={post.photo}
              postDate={post.date}
              image={post.image}
              post={true}
              uid={post.uid}
              postComment={post.comments}
              shares={post.shares}
              key={post.date}
              />
            )}
            <h1>Comments</h1>
            {post && Array.isArray(post.comments) && post.comments.map((comment,index) => {
            return  (         
              <Card key={index}>
                <CardBody className="flex gap-5 justify-between items-center">
                <div 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => router.push(`/profile/${comment.uid}`)}
                  >
                <Avatar src={comment.image}/>
                <h1>{comment.user}</h1>
              </div>
                  <Text className="overflow-y-hidden">{comment.comment}</Text>
                </CardBody>
              </Card>)
          })}
          </div>
          
        </div>
    </ChakraProvider>
  );
}

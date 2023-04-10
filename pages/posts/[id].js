import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import firebase_app from "@/firebase/config";
import { useRouter } from "next/router";
import { ChakraProvider, Textarea, Input, Button } from "@chakra-ui/react";
import Post from "@/components/post";
import arrow from '../../images/arrow.svg'
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState();
  const [user, setUser] = useState({});

  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        console.log("signed in");
        setUser(user);
        // ...
      } else {
        console.log("not signed in");
        router.push('/login');
        // User is signed out
        // ...
      }
    });
  }, []);

  useEffect(() => {
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
            <Link href='/'>
              <Image src={arrow} alt='back' className="self-start"/>
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
                post={true}
                postDate={post.date}
                image={post.image}
              />
            )}
          </div>
        </div>
    </ChakraProvider>
  );
}

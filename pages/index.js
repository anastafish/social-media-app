import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  ChakraProvider,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  Button
} from "@chakra-ui/react";
import Post from "@/components/post";
import firebase_app from "@/firebase/config";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import gallery from '../images/gallery.svg' 
import ClipLoader from "react-spinners/ClipLoader";
import uniqid from 'uniqid';


export default function Home() {
  const [posts, setPosts] = useState(undefined);
  const [text, setText] = useState("");
  const [user, setUser] = useState({});
  const [valid, setValid] = useState(true);
  const [file, setFile] = useState('')
  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);
  const router = useRouter()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        console.log("signed in");
        setUser(user);
        // ...
      } else {
        console.log("not signed in");
        router.push('/login')
        // User is signed out
        // ...
      }
    });
  }, []);

  function handleChange(e) {
    setText(e.target.value);
  }

  useEffect(() => {
    const starCountRef = ref(db, "/posts");
    onValue(starCountRef, (snapshot) => {
      if (snapshot.val()) {
        const values = Object.values(snapshot.val()).slice(0).reverse()
        setPosts(() => {
          return [...values].sort((a,b) => {
            a.date < b.date ? 1 : -1 
          })
        })
      }
      else {
        setPosts(null)
      }
    });    
  }, []);

  function newPost() {
    const date = new Date()    
    const id = uniqid()
    if (text.trim()) {
        set(ref(db, `/posts/${id}`), {
          name: user.displayName,
          text: text,
          id: id,
          likes: 0,
          photo:
            user.photoURL ||
            "data:image/png;base64,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",
          date:date.toLocaleString(),
          image:file
          });
          setFile('');
          const starCountRef = ref(db, "/posts");
    } else {
      setValid(false);
      setTimeout(() => {
        setValid(true);
      }, 4000);
    }
    setText("");
  }
  
  function handleFile(e){
    const file = e.target.files[0]
    const reader = new FileReader()     
    reader.addEventListener('load', () => {
      setFile(reader.result)
    })
    reader.readAsDataURL(file)
  }

  return (
    <ChakraProvider>
      <Head>
            <title>Home</title>
          </Head>
      <Header user={user}>
      </Header>
      <div
        className="
      flex flex-col items-center justify-center
      m-5 overflow-y-clip gap-16  
      "
      >
        {!valid && (
          <Alert
            status="error"
            position="absolute"
            top="20px"
            width="fit-content"
            rounded="4px"
          >
            <AlertIcon />
            <AlertTitle>Type Somthing before posting</AlertTitle>
          </Alert>
        )} 
        <div className="flex flex-col gap-2 items-center w-[60%] h-[5rem] relative">
          <Textarea
            placeholder="Type Something"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                newPost();
              }
            }}
            onChange={handleChange}
            value={text}
            variant="outline"
            backgroundColor="gray.50"
            resize="none"
            focusBorderColor="transparent"
          />
              <input
               type="file"
               id="file"
               onChange={handleFile}
               className="absolute bottom-1 right-1 w-[30px] h-[30px] z-10 opacity-0 cursor-pointer"
               />
                <Image
                src={gallery}
                className="cursor-pointer absolute bottom-1
                right-1 w-[30px] h-[40px] z-[9]"
                alt='choose_image'
                />
                <Button 
                onClick={newPost}
                className="p-2"
                >Post</Button>
        </div>
        {file && <Image
                 src={file}
                alt="post_image"
                width={20}
                height={20}
                className="w-[10rem] h-[10rem] rounded-md"
                 />}

        {posts && (
          posts.map((post, index) => {
            return (
              <Post
                name={post.name}
                text={post.text}
                key={index}
                id={post.id}
                likes={post.likes}
                photo={post.photo}
                postDate={post.date}
                image={post.image}
                post={false}
              />
            );
          })
        ) 
          }
          {posts === undefined && <ClipLoader size={75}/>}
          {posts === null && <h1>No Posts</h1>}
      </div>
    </ChakraProvider>
  );
}

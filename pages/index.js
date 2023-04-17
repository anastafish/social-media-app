import { getDatabase, ref, onValue, set, query, startAt, orderByChild, limitToFirst, limitToLast, startAfter, endAt, endBefore } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState, useContext} from "react";
import {
  ChakraProvider,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
} from "@chakra-ui/react";
import Post from "@/components/post";
import firebase_app from "@/firebase/config";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import gallery from "../images/gallery.svg";
import ClipLoader from "react-spinners/ClipLoader";
import uniqid from "uniqid";
import { UserContext } from "./_app";

export default function Home() {
  const [posts, setPosts] = useState(undefined);
  const [text, setText] = useState("");
  const [user, setUser] = useState({});
  const [valid, setValid] = useState(true);
  const [file, setFile] = useState("");
  const [theme, setTheme] = useContext(UserContext)
  const [lastDate, setLastDate] = useState('')
  const [morePosts, setMorePosts] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        // ...
      } else {
        router.push("/login");
        // User is signed out
        // ...
      }
    });
  }, []);

  function handleChange(e) {
    setText(e.target.value);
  }

  function getPosts(){
    const starCountRef = query(ref(db, "/posts"), orderByChild('date'), limitToLast(5));
    onValue(starCountRef, (snapshot) => {
      if (snapshot.val()) {
        const newPosts = Object.values(snapshot.val()).reverse() 
        setPosts(newPosts)
        setLastDate(newPosts[newPosts.length -1].date)
        setMorePosts(true)
      } else {
        setPosts(null);
      }
    });
  }

  function getMorePosts(){
    const starCountRef = query(ref(db, "/posts"), orderByChild('date'), endBefore(lastDate), limitToLast(5));
    onValue(starCountRef, (snapshot) => {
      if (snapshot.val()) { 
        const newPosts = Object.values(snapshot.val()).reverse() 
        setPosts(prevPost => [...prevPost, ...newPosts])
        setLastDate(newPosts[newPosts.length -1].date)
        setMorePosts(true)
      } 
      else{
        setMorePosts(false)
      }
    });
  }

  useEffect(() => {
    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          getMorePosts()
      }
  };
  })

  useEffect(() => {        
    getPosts()
  }, []);

  function newPost() {
    const date = new Date();
    const id = uniqid();
    if (text.trim()) {
      set(ref(db, `/posts/${id}`), {
        name: user.displayName,
        text: text,
        id: id,
        likes: 0,
        photo: user.photoURL,
        date: date.toLocaleString(),
        image: file,
        uid: auth.currentUser.uid,
        comments: "",
        shares: 0,
      });
      setFile("");
    } else if (file) {
      set(ref(db, `/posts/${id}`), {
        name: user.displayName,
        text: "",
        id: id,
        likes: 0,
        photo: user.photoURL,
        date: date.toLocaleString(),
        image: file,
        uid: auth.currentUser.uid,
        comments: "",
        shares: 0,
      });
      setFile("");
    } else {
      setValid(false);
      setTimeout(() => {
        setValid(true);
      }, 4000);
    }
    setText("");
    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
    }, 1500);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFile(reader.result);
    });
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Anas's App</title>
      </Head>
      <Header user={user}></Header>
      <div
        className={`
      flex flex-col items-center justify-start
      p-5 overflow-y-clip gap-16 ${!posts && 'h-[100vh]'} ${theme ? 'bg-[#4B5150]' : 'bg-[#CEDEDA]'}
      `}
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
          backgroundColor={theme ? 'gray.300' : 'gray.50'}
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
            resize="none"
            focusBorderColor="transparent"
            disabled={disabled ? true : false}
          />
          <input
            type="file"
            id="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleFile}
            className="absolute bottom-1 right-1 w-[30px] h-[30px] z-10 opacity-0 cursor-pointer"
          />
          <Image
            src={gallery}
            className="cursor-pointer absolute bottom-1
                right-1 w-[30px] h-[40px] z-[9]"
            alt="choose_image"
          />
          <Button 
            onClick={newPost} 
            className="p-2"
            backgroundColor={theme ? 'gray.300' : 'gray.50'}
            >
            Post
          </Button>
        </div>
        {file && (
          <Image
            src={file}
            alt="post_image"
            width={20}
            height={20}
            className="w-[10rem] h-[10rem] rounded-md"
          />
        )}           
          {posts &&
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
                    uid={post.uid}
                    postComment={post.comments}
                    shares={post.shares}
                  />
              );
            })}
          {posts === undefined && <ClipLoader size={75} />}
          {posts === null && <h1>No Posts</h1>}
            {morePosts && <Button onClick={getMorePosts}>Load More</Button> }
            {posts !== undefined && !morePosts &&  <h1>You have reached the End</h1>}
      </div>
    </ChakraProvider>
  );
}
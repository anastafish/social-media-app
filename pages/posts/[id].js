import { getDatabase, ref, onValue, set, remove} from "firebase/database";
import {getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import firebase_app from "@/firebase/config";
import { useRouter } from "next/router";
import { ChakraProvider, Textarea, Input, Button} from "@chakra-ui/react";
import Post from "@/components/post";



export default function Home() {
    const router = useRouter()
    const { id } = router.query
  
  const [post, setPost] = useState();
  const [user, setUser] = useState({})

  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;    
    console.log('signed in')
    setUser(user)
    // ...
  } else {
    console.log('not signed in')
    window.open('/signup', '_self')
    // User is signed out
    // ...
  }
});
  },[])

  useEffect(() => {
    const starCountRef = ref(db, `/posts/post${id}`);
    onValue(starCountRef, (snapshot) => {
      setPost(snapshot.val())
    });
  }, [id]);

  return (
    <ChakraProvider>
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">
        <div
            className="
          flex flex-col items-center justify-center
          m-5 overflow-y-clip gap-4 w-full
          "
          >
            {post && <Post name={post.name} text={post.text} id={post.id} post={true}/>}
        </div>
    </div>
    </ChakraProvider>
  );
}

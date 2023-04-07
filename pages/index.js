import { getDatabase, ref, onValue, set, remove} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { ChakraProvider, Textarea, Input, Button} from "@chakra-ui/react";
import Post from "@/components/post";
import firebase_app from "@/firebase/config";
import Header from "@/components/Header";

export default function Home() {
  
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
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

  function handleChange(e) {
    setText(e.target.value);
  }

  useEffect(() => {
    const starCountRef = ref(db, "/");
    onValue(starCountRef, (snapshot) => {
      setPosts(Object.values(Object.values(snapshot.val())[0]));
      setPosts((prevPosts) => prevPosts.slice(0).reverse());
    });
  }, []);

  function newPost() {
    const postNum = posts.length + 1 < 10 ? '0'+String(posts.length+1) : String(posts.length+1) 
    set(ref(db, `/posts/post${postNum}`), {
      name: user.displayName,
      text: text,
      id:postNum,
      likes:0
    });
    console.log(auth.currentUser)
    setText('');
  }

  // function like(e){
  //   const starCountRef = ref(db, `/posts/post${e.target.id}`);
  //   onValue(starCountRef, (snapshot) => {
  //     set(ref(db, `/posts/post${e.target.id}`), {
  //       ...snapshot.val(),
  //       likes:Number(snapshot.val().likes) + 1
  //     });
  //   });    
  // }


  // function delPost(e){
  //   remove(ref(db, `/posts/post${e.target.id}`))
  // }

  function signOut(){
    auth.signOut().then(() => {
      console.log('singout')
      window.open('/login', '_self')
    }).catch('failed')
  }

  return (
    <ChakraProvider>
      <Header user={user}>
        <Button onClick={signOut}>Sign Out</Button>
      </Header>
      <div
        className="
      flex flex-col items-center justify-center
      m-5 overflow-y-clip gap-4  
      "
      >
        <Textarea
          placeholder="type Something"
          onKeyDown={(e) => e.key === "Enter" && newPost()}
          onChange={handleChange}
          value={text}
        />         
        {posts.map((post, index) => {
          return <Post name={post.name} text={post.text} key={index} id={post.id} likes={post.likes}/>;
        })}
      </div>
    </ChakraProvider>
  );
}

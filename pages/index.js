import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import { ChakraProvider, Textarea } from "@chakra-ui/react";
import Post from "@/components/post";
import firebase_app from "@/firebase/config";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const app = firebase_app;
  const database = getDatabase(app);
  const db = getDatabase();

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
    const db = getDatabase();
    set(ref(db, `/posts/post${posts.length + 1}`), {
      name: "testUser",
      text: text,
    });
    setText("");
  }

  return (
    <ChakraProvider>
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
          return <Post name={post.name} text={post.text} key={index} />;
        })}
      </div>
    </ChakraProvider>
  );
}

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
import { useState, useEffect,createElement } from "react";
import firebase_app from "@/firebase/config";
import { getAuth, } from "firebase/auth";
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
  const [userLiked, setUserLiked] = useState('')

  
  useEffect(() => {
    const postsDb = ref(db, "/posts");
    onValue(postsDb, (snapshot) => {
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
        const userDb = ref(db, `/users/${user.uid}`);
        onValue(userDb, (snapshot) => {
      if (snapshot.val()) {
        setUserLiked(snapshot.val().liked)
      }
      else{
        console.log('err')
      }
    });
        // ...
      } else {
        router.push("/login");
        // User is signed out
        // ...
      }
    });
  }, []);

  function like(e) {
    const liked = userLiked.split(',')
    if (!liked.includes(id)){
    set(ref(db, `/posts/${id}`), {
      name: name,
      text: text,
      id: id,
      likes: ++likes,
      photo:photo,
      date:postDate,
      image:image
      });
      set(ref(db, `/users/${auth.currentUser.uid}`), {
        name: user.displayName,
        liked: userLiked + ',' + id
      });
    } 
    else {
      const liked = userLiked.split(',')
      const index = liked.indexOf(id);
      if (index > -1) { // only splice array when item is found
        liked.splice(index, 1); // 2nd parameter means remove one item only
      }

      set(ref(db, `/posts/${id}`), {
        name: name,
        text: text,
        id: id,
        likes: --likes,
        photo:photo,
        date:postDate,
        image:image
        });
        set(ref(db, `/users/${auth.currentUser.uid}`), {
          name: user.displayName,
          liked: liked.toString()
        });
      console.log('already liked')
    }
  }

  async function delPost(e) {
    remove(ref(db, `/posts/${e.target.id}`));

    const liked = userLiked.split(',')
      const index = liked.indexOf(id);
      if (index > -1) { // only splice array when item is found
        liked.splice(index, 1); // 2nd parameter means remove one item only
      }

    const dbRef = ref(getDatabase());
    get(child(dbRef, `/users`)).then((snapshot) => {
      if (snapshot.exists()) {
        const values = Object.values(snapshot.val())
        const keys = Object.keys(snapshot.val())
        for (let i = 0; i < values.length; i++){
         set(ref(db, `/users/${keys[i]}`), {
           name: values[i].name,
           liked: liked.toString()
         });    
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });       
      
    
  }


  return (
    <Card maxW="md" width="100%">
      <div        
      >
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name="Segun Adebayo" src={photo} />
            
              <Box>
                <Heading size="sm">{name}</Heading>
              </Box>
              
            </Flex>
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
          </Flex>
        </CardHeader>
        <CardBody
         onClick={!post ? postClick : undefined}
         className={`${!post ? "cursor-pointer" : ""} flex flex-col gap-5`}
         >
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
        <div className="flex w-full justify-between mr-5">
              <div 
              className={`heart ${userLiked.split(',').includes(id) ? 'is-active' : ''}`}
              onClick={like}
              ></div>
          <Image src={comment} style={{ width: "30px" }} alt="comment-button" />
          <Image src={share} style={{ width: "30px" }} alt="share-button" />
        </div>
        <div className='flex w-full items-center justify-between mr-5 ml-[2.8rem]'>
          <h1 className="text-[18px]">{likes}</h1>
          <h1 className="text-[18px]">0</h1>
          <h1 className="text-[18px]">0</h1>
        </div>
      </CardFooter>
      {post && <h1 className={`text-[15px] p-[1rem]`}>{postDate}</h1>}
    </Card>
  );
}

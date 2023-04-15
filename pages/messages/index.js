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
  Avatar,
} from "@chakra-ui/react";
import Post from "@/components/post";
import firebase_app from "@/firebase/config";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../_app";
import Link from "next/link";
import arrow from '../../images/arrow.svg'

function Messages() {

  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]) 
  const [allUsers, setAllUsers] = useState([])
  const [theme, setTheme] = useContext(UserContext)
  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);
  const router = useRouter();

  function getUserMessages(){
    const starCountRef = ref(db, `/users/${user.uid}/messages`);
    onValue(starCountRef, (snapshot) => {
     if (snapshot.val()) {
        const values = Object.values(snapshot.val())
        setMessages(values)
     } 
    });
  } 

  function getAllUsers(){
    const starCountRef = ref(db, `/users`);
    onValue(starCountRef, (snapshot) => {
     const keys = Object.keys(snapshot.val())
     const values = Object.values(snapshot.val())
     const arr = []
     for (let i = 0; i < keys.length; i++){
        const item = {id:keys[i], ...values[i]} 
        arr.push(item)
     }
     setAllUsers(arr)
    });
  } 

  useEffect(() => {
    getAllUsers()
  }, [])

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

  useEffect(() => {
    getUserMessages()
  }, [user])

  return (      
    <ChakraProvider>
      <div className={`flex flex-col items-center justify-start h-[100vh] gap-2
                       ${theme ? 'bg-[#4B5150]' : 'bg-[#CEDEDA]'}                 
      `}>
        <Header user={user}/>         
        <div className="flex flex-col gap-5 items-center justify-center">
            {allUsers.filter(friends => friends.id != user.uid).map(user => {
                return (
                  <div
                    onClick={() => router.push(`messages/${user.id}`)} key={user.id}
                    className="cursor-pointer flex flex-col items-center justify-center"
                    >
                    <h1>{user.name}</h1>
                    <Avatar
                        src={user.image}
                        width={100}
                        height={100}
                        alt="profile_img"
                        className="rounded-md"/>
                    </div>
                )
            })}
            
        </div>
      </div>
      </ChakraProvider>
  )
}

export default Messages
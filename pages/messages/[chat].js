import { getDatabase, ref, onValue, set, query, startAt, orderByChild, limitToFirst, limitToLast, startAfter, endAt, endBefore } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState, useContext, useRef} from "react";
import {
  ChakraProvider,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Input,
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
import arrow from '../../images/arrow.svg'
import Link from "next/link";

function Chat() {

  const [user, setUser] = useState({});
  const [friend, setFriend] = useState({})
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null);
  const [theme, setTheme] = useContext(UserContext)

  
  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);
  const router = useRouter();
  const [msg, setMsg] = useState('')
  const { chat } = router.query

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

    const starCountRef = ref(db, `/users/${chat}`);
    onValue(starCountRef, (snapshot) => {
     if (snapshot.val()) {
        setFriend(snapshot.val())
     } 
    });

    const msgRef = query(ref(db, `/users/${chat}/messages/${user.uid}/message`), orderByChild('date'));
    onValue(msgRef, (snapshot) => {
      if (snapshot.val()) {
        setMessages(Object.values(snapshot.val()))
      } 
    });
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
},[messages])

  function handleChange(e){
    setMsg(e.target.value)
  }

  function sendMessage(){    
    const uid = user.uid
    if (Object.keys(friend.messages).includes(uid)){
    if (msg){
        const date = new Date();
    set(ref(db, `/users/${user.uid}/messages/${chat}`), {
        id:chat,
        name:friend.name,
        message:{
            ...friend.messages[uid].message,
            [Object.keys(friend.messages[uid].message).length]:{
                text:msg,
                date:date.toLocaleString(),
                name:user.displayName
            }
        }
      });
      set(ref(db, `/users/${chat}/messages/${user.uid}`), {
        id:user.uid,
        name:user.displayName,
        message:{
            ...friend.messages[uid].message,
            [Object.keys(friend.messages[uid].message).length]:{
                text:msg,
                date:date.toLocaleString(),
                name:user.displayName
            }
        }
      });
    }    
}
else {
    if (msg){
        console.log(user.uid)
        const date = new Date();
    set(ref(db, `users/${user.uid}/messages/${chat}`), {
        id:chat,
        name:friend.name,
        message:{
            0:{
                text:msg,
                date:date.toLocaleString(),
                name:user.displayName
            }
        }
      });
      set(ref(db, `/users/${chat}/messages/${user.uid}`), {
        id:user.uid,
        name:user.displayName,
        message:{
            0:{
                text:msg,
                date:date.toLocaleString(),
                name:user.displayName
            }
        }
      });
    }     
}
 setMsg('')   
  }     

  
  return (      
    <ChakraProvider>
      <div className={`flex flex-col items-center justify-center h-[100vh] gap-2
                        ${theme ? 'bg-[#4B5150]' : 'bg-[#CEDEDA]'} pb-2
      `}>  
      <Header user={user}/>      
      <div className="flex items-center justify-center gap-2">
      <div className="w-full mt-2 p-2 absolute bottom-0-0">
            <Link href="/" className="sm:cursor-pointer cursor-default">
              <Image priority src={arrow} alt="back" className="self-start" />
            </Link>
          </div>   
        <Avatar src={friend.image} width={50} height={50} />
        <h1>{friend.name}</h1>
        </div>   
        <div className="flex flex-col items-center overflow-y-auto m-[4px]
         p-[4px]  h-full gap-5 scroll
         overflow-x-hidden text-justify
         ">
            {friend.messages && messages.map((msg, index) => {
                return <div key={index}
                className={`${msg.name === user.displayName ? 'bg-green-300' : 'bg-gray-400'}
                 p-3 rounded-md
                 `}>
                    <h1 className="text-[20px] max-w-sm">{msg.text}</h1>
                    <h6 className="text-[10px]">{msg.date}</h6>
                </div>
            })}
            <div ref={bottomRef}></div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
            <Input
                value={msg}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className='p-3 bg-slate-300 rounded-md'
                placeholder='type a message'
                />
            <Button 
                onClick={sendMessage}
                className='bg-green-400 p-3 rounded-md'
                >
                    Send
                    </Button>
        </div>
      </div>
      </ChakraProvider>
  )
}

export default Chat
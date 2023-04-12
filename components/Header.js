import React, {useState, useEffect} from 'react'
import { Avatar } from '@chakra-ui/react'
import { getAuth } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import logout from '../images/logout.svg'
import Image from 'next/image';
import Link from 'next/link';


function Header({children}) {
  const app = firebase_app;
  const auth = getAuth(app);
  const router = useRouter()
  const [user, setUser] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        console.log("signed in");
        setUser(user);
        console.log(user)
        // ...
      } else {
        console.log("not signed in");
        router.push('/login')
        // User is signed out
        // ...
      }
    });
  }, []);

  function signOut() {
    auth
      .signOut()
      .then(() => {
        console.log("singout");
        router.push('/login');
      })
      .catch("failed");
  }

  return (
    <div className='flex items-center w-full p-3
     justify-between border-b-[2px] border-gray-400
     border-opacity-20
     '>
      <div 
      className='flex gap-7 items-center'
      >
        <div 
          className='flex flex-col items-center justify-center gap-1 cursor-pointer'
          onClick={() => router.push(`/profile/${auth.currentUser.uid}`)}>
          <Avatar
            src={user.photoURL}
          />
              <h1 className='font-semibold'>{user.displayName}</h1>
        </div>
      </div>     

      <Button onClick={signOut}  _hover={{backgroundColor:"red.500"}}>
        <div className='w-full flex justify-between items-center gap-3'>
          <Image src={logout} className="w-[25px] h-[25px]" alt='sign_out'/>
        </div>
        </Button>

    </div>
  )
}

export default Header
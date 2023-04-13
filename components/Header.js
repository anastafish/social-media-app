import React, { useState, useEffect, useContext } from "react";
import { Avatar } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import logout from "../images/logout.svg";
import Image from "next/image";
import Link from "next/link";
import { Switch } from '@chakra-ui/react'
import { UserContext } from "../pages/_app";
import dark from '../images/dark.svg'


function Header({ children }) {
  const app = firebase_app;
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState({});
  const [theme, setTheme] = useContext(UserContext)


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

  function signOut() {
    auth
      .signOut()
      .then(() => {
        router.push("/login");
      })
      .catch("failed");
  }

  return (
    <div
      className={`flex items-center w-full p-3
     justify-between border-b-[2px] border-gray-400
     border-opacity-20 ${theme ? 'bg-[#899391]' : 'bg-gray-100'}
     `}
    >
      <div className="flex gap-7 items-center">
        <div
          className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          onClick={() => router.push(`/profile/${auth.currentUser.uid}`)}
        >
          <Avatar src={user.photoURL} />
          <h1 className="font-semibold">{user.displayName}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center gap-1">
          <Switch isChecked={theme} onChange={() => setTheme(prevState => !prevState)}/>
          <Image src={dark} width='35'/>
        </div>
        <Button onClick={signOut} _hover={{ backgroundColor: "red.500" }}>
          <div className="w-full flex justify-between items-center gap-3">
            <Image src={logout} className="w-[25px] h-[25px]" alt="sign_out" />
          </div>
        </Button>
      </div>
    </div>
  );
}

export default Header;

import React, { useState } from "react";
import { ChakraProvider, Input, Button} from "@chakra-ui/react";
import firebase_app from "@/firebase/config";
import { getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";

function index() {
  const app = firebase_app;
  const auth = getAuth(app)

  async function newUser(){
    try{
      await createUserWithEmailAndPassword(auth, user.email, user.password).catch((err) => {
        console.log(err)
      })
      await updateProfile(auth.currentUser, { displayName: user.user_name }).catch(
        (err) => console.log(err)
      );
      window.open('/', '_self')
    } catch (err) {
      console.log(err);
    }
    }

  const [user, setUser] = useState({
    email: "",
    user_name: "",
    password: "",
    confirm_password: "",
  });

  function handleChange(e) {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <ChakraProvider>
      <div className="flex flex-col items-center justify-center">
        <Input
          value={user.email}
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        />
        <Input
          value={user.user_name}
          name="user_name"
          placeholder="Full Name"
          type="text"
          onChange={handleChange}
        />
        <Input
          value={user.password}
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />
        <Input
          value={user.confirm_password}
          name="confirm_password"
          placeholder="Confirm Password"
          type="password"
          onChange={handleChange}
        />
        <Button onClick={newUser}>Sign Up</Button>
      </div>
    </ChakraProvider>
  );
}

export default index;

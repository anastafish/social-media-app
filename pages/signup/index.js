import React, { useState } from "react";
import {
  ChakraProvider,
  Input,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText
} from "@chakra-ui/react";
import firebase_app from "@/firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set} from "firebase/database";


function index() {
  const app = firebase_app;
  const auth = getAuth(app);
  const db = getDatabase(app);

  if (auth.currentUser) {
    console.log(auth.currentUser);
    window.open("/", "_self");
  }

  async function newUser() {
    if (
      !validate.email &&
      !validate.user_name &&
      !validate.password &&
      !validate.confirm_password &&
      user.email &&
      user.user_name &&
      user.password === user.confirm_password &&
      user.password &&
      user.confirm_password
    ) {
      try {
        await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        ).catch((err) => {
          console.log(err);
        });
        await updateProfile(auth.currentUser, {
          displayName: user.user_name,
        }).catch((err) => console.log(err));
        console.log(auth.currentUser.uid)
        await set(ref(db, `/users/${auth.currentUser.uid}`), {
          name: user.user_name,
          liked: ''
        });
        auth.currentUser && window.open("/", "_self");
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("error");
    }
  }

  const [user, setUser] = useState({
    email: "",
    user_name: "",
    password: "",
    confirm_password: "",
  });

  const [validate, setValidate] = useState({
    email: false,
    user_name: false,
    password: false,
    confirm_password: false,
  });

  function handleChange(e) {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));

    if (e.target.value) {
      setValidate((prevState) => ({
        ...prevState,
        [e.target.name]: false,
      }));
    } else {
      setValidate((prevState) => ({
        ...prevState,
        [e.target.name]: true,
      }));
    }
  }

  return (
    <ChakraProvider>
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <div className="flex flex-col items-center justify-center gap-4 w-[50%]">
          <h1>Sign Up</h1>
          <div className="flex flex-col items-center justify-center w-[20rem] gap-2">
            <FormControl isInvalid={validate.email}>
              <Input
                value={user.email}
                name="email"
                placeholder="Email"
                type="email"
                onChange={handleChange}
              />
              <FormErrorMessage>Email is required.</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={validate.user_name}>
              <Input
                value={user.user_name}
                name="user_name"
                placeholder="Full Name"
                type="text"
                onChange={handleChange}
              />
              <FormErrorMessage>Full Name is required.</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={validate.password}>
            <FormHelperText>Password should be at least 6 characters</FormHelperText>
              <Input
                value={user.password}
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
              />
              <FormErrorMessage>Password is required.</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={validate.confirm_password}>
              <Input
                value={user.confirm_password}
                name="confirm_password"
                placeholder="Confirm Password"
                type="password"
                onChange={handleChange}
              />
              <FormErrorMessage>Confirm Password is required.</FormErrorMessage>
            </FormControl>
          </div>
          <Button onClick={newUser}>Sign Up</Button>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default index;

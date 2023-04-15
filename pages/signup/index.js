import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Input,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import firebase_app from "@/firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";
import Link from "next/link";
import google from "../../images/google.png";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import bg from '../../images/bg.jpg'

function index() {
  const app = firebase_app;
  const auth = getAuth(app);
  const db = getDatabase(app);
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  useEffect(() => {
    // check if user is logged in or not
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        router.push("/");
        // ...
      }
    });
  }, []);

  async function newUser() {
    // create new user if all the fileds are filled and the passwords match
    if (
      !validate.email &&
      !validate.user_name &&
      !validate.password &&
      !validate.confirm_password &&
      user.password === user.confirm_password &&
      user.email &&
      user.user_name &&
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

        // create a user copy in the database to store the profile image and the liked posts
        await set(ref(db, `/users/${auth.currentUser.uid}`), {
          name: user.user_name,
          liked: "",
          image: auth.currentUser.photoURL || "",
          messages:""
        });
      } catch (err) {
        setValid({
          isValid: false,
          message: "Please make sure to fill the required fields correctly",
        });
        setTimeout(() => {
          setValid({
            isValid: true,
            message: "",
          });
        }, 4000);
      }
    } else if (user.password !== user.confirm_password) {
      setValid({
        isValid: false,
        message: "The passwords don't match",
      });
      setTimeout(() => {
        setValid({
          isValid: true,
          message: "",
        });
      }, 4000);
    } else {
      setValid({
        isValid: false,
        message: "Fill all the required fields!",
      });
      setTimeout(() => {
        setValid({
          isValid: true,
          message: "",
        });
      }, 4000);
    }
  }

  function googleLogin() {
    // create new user using google account
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        const dbRef = ref(getDatabase());
        // create a user copy in the database to store the profile image and the liked posts
        get(child(dbRef, `/users/${user.uid}`))
          .then((snapshot) => {
            if (!snapshot.exists()) {
              set(ref(db, `/users/${result.user.uid}`), {
                name: result.user.displayName,
                liked: "",
                image: auth.currentUser.photoURL || "",
                messages:""
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
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

  const [valid, setValid] = useState({ isValid: true, message: "" });

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
      <Head>
        <title>SignUp</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <Image 
            src={bg}
            fill
            style={{objectFit:'cover', objectPosition:'center'}}
            alt="background_image"
          />
        {!valid.isValid && (
          <Alert
            status="error"
            position="absolute"
            top="20px"
            width="fit-content"
            rounded="4px"
          >
            <AlertIcon />
            <AlertTitle>{valid.message}</AlertTitle>
          </Alert>
        )}
        <div className="flex flex-col items-center justify-center gap-4 w-[50%]">
          <div className="flex flex-col items-center justify-center w-[20rem] gap-2">
            <FormControl isInvalid={validate.email}>
              <Input
                value={user.email}
                name="email"
                placeholder="Email"
                type="email"
                onChange={handleChange}
                backgroundColor="gray.200"
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
                backgroundColor="gray.200"
              />
              <FormErrorMessage>Full Name is required.</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={validate.password}>
              <FormHelperText color={'white'}>
                Password should be at least 6 characters
              </FormHelperText>
              <Input
                value={user.password}
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
                backgroundColor="gray.200"
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
                backgroundColor="gray.200"
              />
              <FormErrorMessage>Confirm Password is required.</FormErrorMessage>
            </FormControl>
            <Link href="login" className="z-10 text-white">Already have an account?</Link>
          </div>
          <Button onClick={newUser}>Sign Up</Button>
          <Button className="flex gap-2" onClick={googleLogin}>
            <Image
              src={google}
              className="w-[30px] h-[30xp]"
              alt="google_logo"
            />
            Login With Google
          </Button>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default index;

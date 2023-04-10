import React, { useState, useEffect } from "react";
import { ChakraProvider, Input, Button, FormControl, FormErrorMessage , Alert, AlertIcon, AlertTitle} from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import firebase_app from "@/firebase/config";
import { getDatabase, ref, set, get, child} from "firebase/database";
import Link from "next/link";
import google from '../../images/google.png'
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";

function index() {
    const app = firebase_app;
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider();
    const db = getDatabase(app);
    const router = useRouter()

    const [user, setUser] = useState({
        email: "",
        password: "",
      });
    const [validate, setValidate] = useState({
        email: false,
        password: false,
      });  

    const [valid, setValid]  = useState({isValid:true, message:''})
  
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          console.log("signed in");
          setUser(user);
          router.push('/')
          // ...
        } else {
          console.log("not signed in");
          // User is signed out
          // ...
        }
      });
    }, []);

    function login(){
      if (
        !validate.email &&
        !validate.password &&
        user.email &&
        user.password
      ) {
        signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('signed in')
            // ...
        })
        .catch((error) => {
          setValid({
            isValid:false,
            message:'Email or Password is incorrect'
          }) 
        setTimeout(() => {
          setValid({
            isValid:true,
            message:''
          })
        }, 4000);
        });
      }      
      else{
        setValid({
          isValid:false,
          message:'Fill all the required fields!'
        }) 
        setTimeout(() => {
          setValid({
            isValid:true,
            message:''
          })
        }, 4000);
      }  
    }  

    function googleLogin(){
      signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const dbRef = ref(getDatabase());
    get(child(dbRef, `/users/${user.uid}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        set(ref(db, `/users/${result.user.uid}`), {
          name: result.user.displayName,
          liked: ''
        });
      }
    }).catch((error) => {
      console.error(error);
    });   

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
    }
    
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
            <title>Login</title>
          </Head>
          <div className="flex flex-col items-center justify-center h-[100vh]">
          {!valid.isValid && <Alert status='error' position='absolute' top='20px' width='fit-content' rounded='4px'>
        <AlertIcon />
        <AlertTitle>{valid.message}</AlertTitle>
      </Alert>}
          <div className="flex flex-col items-center justify-center gap-4">
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
            <FormControl isInvalid={validate.password}>
            <Input
              value={user.user_name}
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              backgroundColor="gray.200"
            />      
            <FormErrorMessage>Password is required.</FormErrorMessage>
           </FormControl> 
           <Link href='signup'>Don't have an account?</Link>
            </div>      
            <Button onClick={login}>Login</Button>
            <Button className="flex gap-2" onClick={googleLogin}>
              <Image src={google} className="w-[30px] h-[30xp]" alt="google_logo"/>
              Login With Google
            </Button>     
            </div>
          </div>
        </ChakraProvider>
      );
    }


export default index
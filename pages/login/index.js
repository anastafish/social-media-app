import React, { useState } from "react";
import { ChakraProvider, Input, Button, FormControl, FormErrorMessage} from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase_app from "@/firebase/config";

function index() {
    const app = firebase_app;
    const auth = getAuth(app)

    const [user, setUser] = useState({
        email: "",
        password: "",
      });
    const [validate, setValidate] = useState({
        email: false,
        password: false,
      });  

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
            window.open('/', '_self')
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
      }      
      else{
        console.log('err')
      }  
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
          <div className="flex flex-col items-center justify-center h-[100vh]">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1>Login</h1>
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
            <FormControl isInvalid={validate.password}>
            <Input
              value={user.user_name}
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
            />      
            <FormErrorMessage>Password is required.</FormErrorMessage>

           </FormControl> 
            </div>      
            <Button onClick={login}>Login</Button>
          </div>
          </div>
        </ChakraProvider>
      );
    }


export default index
import React, { useState } from "react";
import { ChakraProvider, Input, Button} from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase_app from "@/firebase/config";

function index() {
    const app = firebase_app;
    const auth = getAuth(app)

    const [user, setUser] = useState({
        email: "",
        password: "",
      });

    function login(){
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
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
            />            
            <Button onClick={login}>Login</Button>
          </div>
        </ChakraProvider>
      );
    }


export default index
import { getDatabase, ref, set, get, child } from "firebase/database";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useRef, useState, useContext } from "react";
import firebase_app from "@/firebase/config";
import { useRouter } from "next/router";
import arrow from "../../images/arrow.svg";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Head from "next/head";
import {
  getStorage,
  ref as sRef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ChakraProvider,
  Textarea,
  Input,
  Button,
  Avatar,
  Alert,
  AlertTitle,
  AlertIcon,
} from "@chakra-ui/react";
import { UserContext } from "../_app";
import { ClipLoader } from "react-spinners";


export default function Profile() {
  const router = useRouter();
  const { profile } = router.query;
  const [valid, setValid] = useState(true);
  const [theme, setTheme] = useContext(UserContext)


  useEffect(() => {
    // check if user is logged in or not
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
    // gets the specific user from the database by the uid from the url
    const dbRef = ref(getDatabase());
    get(child(dbRef, `/users/${profile}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [profile]);

  const [user, setUser] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [file, setFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const app = firebase_app;
  const db = getDatabase(app);
  const auth = getAuth(app);
  const storage = getStorage(app, "gs://social-media-app-753cb.appspot.com");

  function handleChange(e) {
    // convert the file to base64 url
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFile(reader.result);
    });
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  async function changePicture() {
    // uploads the selected image to firebase storage to use as profile pic
    if (file) {
      const storageRef = sRef(storage, `users/${user.uid}` || "");

      // gets the picture from firebase storage to set it as profile picture
      getDownloadURL(sRef(storage, `users/${user.uid}`))
        .then((url) => {
          updateProfile(auth.currentUser, {
            photoURL: url,
          }).catch((err) => console.log(err));

          // change the user's image proparty to the new image
          set(ref(db, `/users/${profile}`), {
            name: auth.currentUser.displayName,
            image: url,
            liked: userProfile.liked,
            messages:userProfile.messages
          });

          setIsOpen(false);
          router.reload();
        })
        .catch((error) => {
          // Handle any errors
        });
    } else {
      setValid(false);
      setTimeout(() => {
        setValid(true);
      }, 4000);
    }
  }

  return (
    <ChakraProvider>
      <Head>
        <title>{userProfile.name} Profile</title>
      </Head>
      <div className="flex flex-col h-[100vh]">
        <Header user={user}>
          <Button onClick={signOut}>Sign Out</Button>
        </Header>

        {!userProfile.name && <div className={`flex flex-col items-center justify-start h-full  pt-5 gap-2
                          ${theme ? 'bg-[#4B5150]' : 'bg-[#CEDEDA]'}
        `}><ClipLoader size={75} /></div>}
        {userProfile.name && <div className={`flex flex-col items-center justify-start h-full  pt-5 gap-2
                          ${theme ? 'bg-[#4B5150]' : 'bg-[#CEDEDA]'}
        `}>
          {!valid && (
            <Alert
              status="error"
              position="absolute"
              top="20px"
              width="fit-content"
              rounded="4px"
            >
              <AlertIcon />
              <AlertTitle>Choose an Image!</AlertTitle>
            </Alert>
          )}
          <div className="w-full mt-2 p-2">
            <Link href="/" className="sm:cursor-pointer cursor-default">
              <Image priority src={arrow} alt="back" className="self-start" />
            </Link>
          </div>
          {!userProfile  && <ClipLoader size={75} />}

          <div className="flex flex-col items-center">
            <Avatar
              src={userProfile.image}
              width={20}
              height={20}
              className="w-[100px] h-[100px] rounded-full"
              alt="profile_image"
            />
            {userProfile.name}
          </div>
          {user.displayName !== userProfile.name && 
          <Button onClick={() => router.push(`/messages/${profile}`)}>Message</Button>}
          {user.displayName === userProfile.name && (
            <div>
              <Button onClick={() => setIsOpen(true)}>
                Change Profile Picture
              </Button>
              <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
                <ModalOverlay />
                <ModalContent className="flex flex-col items-center gap-3">
                  <ModalHeader>Change Profile Picture</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      className="border border-black rounded-md"
                      onChange={handleChange}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="solid"
                      bgColor={"green.300"}
                      onClick={changePicture}
                    >
                      Apply
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          )}
        </div>}
      </div>
    </ChakraProvider>
  );
}

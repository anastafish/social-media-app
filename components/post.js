import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import Image from "next/image";
import {
  getDatabase,
  ref,
  set,
  remove,
  get,
  child,
  onValue,
} from "firebase/database";
import { updateProfile } from "firebase/auth";
import { useState, useEffect, useContext, useRef } from "react";
import firebase_app from "@/firebase/config";
import { getAuth } from "firebase/auth";
import like_icon from "../images/like.svg";
import share from "../images/share.svg";
import commentIcon from "../images/comment.svg";
import bin from "../images/delete.svg";
import filled_like from "../images/filled_like.svg";
import { useRouter } from "next/router";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramShareButton,
} from "react-share";
import copy from "../images/copy.svg";
import { UserContext } from "../pages/_app";
import { motion, useInView, AnimatePresence} from "framer-motion";


export default function Post({
  name,
  text,
  id,
  post,
  likes,
  photo,
  image,
  postDate,
  uid,
  postComment,
  shares,
  delay
}) {
  const app = firebase_app;
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [likedPosts, setLikedPosts] = useState([]);
  const [delToggle, setDelToggle] = useState(false);
  const [shareToggle, setShareToggle] = useState(false);
  const [theme, setTheme] = useContext(UserContext)
  const router = useRouter();
  const postRef = useRef(null)
  const isInView = useInView(postRef, {once:true})
  const [isDeleted, setIsDeleted] = useState(false)

  function postClick() {
    router.push(`/posts/${id}`);
  }

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [userLiked, setUserLiked] = useState("");
  const [comment, setComment] = useState("");
  const [valid, setValid] = useState({ isValid: true, msg: "" });
  const [userProfile, setUserProfile] = useState({})

  useEffect(() => {
    const postsDb = ref(db, "/posts");
    onValue(postsDb, (snapshot) => {
      if (snapshot.val()) {
        setPosts(Object.values(snapshot.val()).slice(0).reverse());
      }
    });

    const dbRef = ref(getDatabase());
    get(child(dbRef, `/users/${user.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        const userDb = ref(db, `/users/${user.uid}`);
        onValue(userDb, (snapshot) => {
          if (snapshot.val()) {
            setUserLiked(snapshot.val().liked);
          } else {
          }
        });
        // ...
      } else {
        router.push("/login");
        // User is signed out
        // ...
      }
    });
  }, []);

  function like(e) {
    const liked = userLiked.split(",");
    if (!liked.includes(id)) {
      set(ref(db, `/posts/${id}`), {
        name: name,
        text: text,
        id: id,
        likes: ++likes,
        photo: photo || "",
        date: postDate,
        image: image,
        uid: uid,
        comments: postComment,
        shares: shares,
      });
      set(ref(db, `/users/${auth.currentUser.uid}`), {
        name: user.displayName,
        liked: userLiked + "," + id,
        image: auth.currentUser.photoURL || "",
        messages:userProfile.messages
      });
    } else {
      const liked = userLiked.split(",");
      const index = liked.indexOf(id);
      if (index > -1) {
        // only splice array when item is found
        liked.splice(index, 1); // 2nd parameter means remove one item only
      }

      set(ref(db, `/posts/${id}`), {
        name: name,
        text: text,
        id: id,
        likes: --likes,
        photo: photo,
        date: postDate,
        image: image,
        uid: uid,
        comments: postComment,
        shares: shares,
      });
      set(ref(db, `/users/${auth.currentUser.uid}`), {
        name: user.displayName,
        liked: liked.toString(),
        image: auth.currentUser.photoURL || "",
        messages:userProfile.messages
      });
    }
  }

  function newComment() {
    if (comment.trim()) {
      set(ref(db, `/posts/${id}`), {
        name: name,
        text: text,
        id: id,
        likes: likes,
        photo: photo,
        date: postDate,
        image: image,
        uid: uid,
        comments: {
          ...postComment,
          [Object.keys(postComment).length]: {
            comment: comment,
            user: user.displayName,
            image: user.photoURL,
            uid: user.uid,
          },
        },
        shares: shares,
      });
      setComment("");
      setValid({ isValid: false, msg: "Comment Sent Successfully!", type:'success'});
      setTimeout(() => {
        setValid({ isValid: true, msg: "", type:''});
      }, 4000);
    } else {
      setComment("")
      setValid({ isValid: false, msg: "Type something first!",type:'error'});
      setTimeout(() => {
        setValid({ isValid: true, msg: "", type:''});
      }, 4000);
    }
  }

  function shareClick() {
    set(ref(db, `/posts/${id}`), {
      name: name,
      text: text,
      id: id,
      likes: likes,
      photo: photo,
      date: postDate,
      image: image,
      uid: uid,
      comments: postComment,
      shares: ++shares,
    });
  }

  function handleChange(e) {
    setComment(e.target.value);
  }

  function copied(){
    setValid({ isValid: false, msg: "Copied to Clipboard", type:'success'});
      setTimeout(() => {
        setValid({ isValid: true, msg: "", type:''});
      }, 4000);
  }

  async function delPost(e) {
    remove(ref(db, `/posts/${e.target.id}`));

    const liked = userLiked.split(",");
    const index = liked.indexOf(id);
    if (index > -1) {
      // only splice array when item is found
      liked.splice(index, 1); // 2nd parameter means remove one item only
    }

    const dbRef = ref(getDatabase());
    get(child(dbRef, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const values = Object.values(snapshot.val());
          const keys = Object.keys(snapshot.val());
          for (let i = 0; i < values.length; i++) {
            set(ref(db, `/users/${keys[i]}`), {
              name: values[i].name,
              liked: liked.toString(),
              image: values[i].image || "",
              messages:userProfile.messages
            });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setDelToggle(false);
    setIsDeleted(true)
  }

  return (
    <AnimatePresence>
      <Card
        as={motion.div}
        maxW="md"
        width="100%"
        backgroundColor={theme ? '#899391' : 'white'}
        initial={{opacity:0, scale:0}}
        animate={{
              opacity:isInView ? [0,0.3,1] : 0,
              scale:isInView ? [0.2,1] : 0,
              x:isInView ? [300,200,0] : 500
              }}
        transition={{delay:0.1 * delay}}
        ref={postRef}
        >
        <div>
          <CardHeader>
            <Flex spacing="4">
              <Flex
                flex="1"
                gap="4"
                alignItems="center"
                flexWrap="wrap"
                cursor="pointer"
                onClick={() => router.push(`/profile/${uid}`)}
              >
                <Avatar src={photo} name={name} />
                <Box>
                  <Heading size="sm">{name}</Heading>
                </Box>
              </Flex>
              {user.displayName === name && !post && (
                <Image
                  variant="ghost"
                  onClick={() => setDelToggle(true)}
                  src={bin}
                  style={{ width: "30px" }}
                  alt="delete-button"
                  className="sm:cursor-pointer cursor-default"
                />
              )}
              <Modal
                isOpen={delToggle}
                onClose={() => setDelToggle(false)}
                isCentered
              >
                <ModalOverlay />
                <ModalContent className="top-0 flex flex-col items-center">
                  <ModalHeader>Delete Post</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <h1>Are you Sure you want to delete the Post?</h1>
                  </ModalBody>
                  <ModalFooter className="flex items-center justify-center gap-5">
                    <Button
                      variant="solid"
                      bgColor={"red.400"}
                      id={id}
                      onClick={delPost}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="solid"
                      bgColor={"green.300"}
                      onClick={() => setDelToggle(false)}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          </CardHeader>
          <CardBody
            onClick={!post ? postClick : undefined}
            className={`${!post ? "cursor-pointer" : ""} flex flex-col gap-5`}
          >
            <Text>{text}</Text>
            {image && (
              <Image
                src={image}
                alt="post_image"
                width={20}
                height={20}
                className="w-full h-[25rem] rounded-md"
              />
            )}
          </CardBody>
        </div>
        <CardFooter
          justify="center"
          gap={0}
          alignItems="center"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          {!valid.isValid && (
            <Alert
              status={valid.type}
              position="absolute"
              bottom="100px"
              width="fit-content"
              rounded="4px"
              zIndex={10}
            >
              <AlertIcon />
              <AlertTitle>{valid.msg}</AlertTitle>
            </Alert>
          )}
          <div className="flex flex-col w-full justify-between mr-5 h-fit relative">
            <div className="flex items-center w-full justify-between ">
              <div
                className={`heart ${
                  userLiked.split(",").includes(id) ? "is-active" : ""
                } sm:cursor-pointer cursor-default`}
                onClick={like}
              ></div>
              <Image
                src={commentIcon}
                style={{ width: "30px" }}
                className={`${!post && "sm:cursor-pointer cursor-default"}`}
                alt="comment-button"
                onClick={!post ? postClick : undefined}
              />
              <Image
                onClick={() => {
                  setShareToggle(true);
                  shareClick();
                }}
                src={share}
                style={{ width: "30px" }}
                alt="share-button"
                className="sm:cursor-pointer cursor-default"
              />
            </div>
            <div className="flex w-full items-center justify-between
            absolute pr-11 ml-[2.8rem] bottom-0 ">
            <h1 className="text-[18px]">{likes}</h1>
            <h1 className="text-[18px]">{postComment.length}</h1>
            <h1 className="text-[18px] mr-1">{shares}</h1>
          </div>
            <Modal
              isOpen={shareToggle}
              onClose={() => setShareToggle(false)}
              isCentered
            >
              <ModalOverlay />
              <ModalContent className="top-0 flex flex-col items-center">
                <ModalHeader>Share Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody className="flex">
                  <FacebookShareButton
                    url={`https://social-media-app-fslc.vercel.app/posts/${id}`}
                  >
                    <FacebookIcon />
                  </FacebookShareButton>
                  <WhatsappShareButton
                    url={`https://social-media-app-fslc.vercel.app/posts/${id}`}
                  >
                    <WhatsappIcon />
                  </WhatsappShareButton>
                  <TwitterShareButton
                    url={`https://social-media-app-fslc.vercel.app/posts/${id}`}
                  >
                    <TwitterIcon />
                  </TwitterShareButton>
                  <TelegramShareButton
                    url={`https://social-media-app-fslc.vercel.app/posts/${id}`}
                  >
                    <TelegramIcon />
                  </TelegramShareButton>
                  <div className="border-[2px] flex items-center justify-center border-black">
                    <Image
                      src={copy}
                      alt="copy_icon"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://social-media-app-fslc.vercel.app/posts/${id}`
                        );
                        copied()
                      }
                    }
                      className="cursor-pointer"
                    />
                  </div>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
          <div className="flex items-center mt-3">
            <Input
              placeholder="Type a comment"
              className=""
              value={comment}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && newComment()}
              backgroundColor={theme ? 'gray.300' : 'gray.50'}
              borderRightRadius='none'
            />
            <Button
              onClick={newComment}
              backgroundColor={theme ? 'gray.300' : 'gray.50'}
              borderLeftRadius='none'
              fontSize={13}
              >
                Comment
                </Button>
          </div>
        </CardFooter>
        {post && <h1 className={`text-[15px] p-[1rem]`}>{postDate}</h1>}
      </Card>
    </AnimatePresence>
  );
}

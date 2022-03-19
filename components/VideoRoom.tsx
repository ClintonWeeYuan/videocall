import {NextPage} from "next";
import {
  Box, Text, Button, useToast, Grid, GridItem, SimpleGrid, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, Flex, Heading, List, ListItem, ListIcon, Input
} from '@chakra-ui/react';
import Pusher from "pusher-js";
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Peer from "peerjs";
import * as PusherTypes from 'pusher-js';
import {CheckCircleIcon} from "@chakra-ui/icons";
import axios from "axios";
import styles from "../styles/chat.module.css";


type Props = {
  username: string;
}
type VideoProps = {
  stream: MediaStream;
}

interface PeerMediaStreams {
  [id: string]: MediaStream;
}

interface PeerObject {
  peerId: string;
  username: string;
}

interface ChatObject {
  message: string;
  username: string;
}

const Video: NextPage<VideoProps> = ({stream}) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay={true}
      controls={false}
      height="100%"
      width="100%"
      playsInline
    ></video>
  );
};

const VideoRoom: NextPage<Props> = ({username}) => {
  
  
  //Online Users State
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  //Peer and Video States
  const [remotePeerId, setRemotePeerId] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  // const [peerMedia, setPeerMedia] = useState<MediaStream[]>([]);
  const [peerMedia, setPeerMedia] = useState<PeerMediaStreams>({});
  const userVideo = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [peers, setPeers] = useState<PeerObject[]>([]);
  const peerInstance = useRef<any>();
  const remotePeerInstance = useRef(null);
  
  //Chat Messages
  const [chats, setChats] = useState<ChatObject[]>([]);
  const [message, setMessage] = useState<string>("");
  
  //Toast Message upon joining
  const toast = useToast()
  
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY ? process.env.NEXT_PUBLIC_KEY : '', {
      cluster: "ap1",
      authEndpoint: "api/pusher/auth",
      auth: {params: {username}},
    });
    console.log(`presence-${router.query.room}`)
    const channel: any = pusher.subscribe(`presence-${router.query.room}`);
    //When user subscribes to channel
    
    channel.bind("pusher:subscription_succeeded", (members: PusherTypes.Members) => {
      console.log("Subscribed to channel")
      toast({
        title: 'Entered Room',
        description: "You have successfully entered the room!",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setOnlineUsersCount(members.count);
      members.each((member: any) => {
        if (member.id != members.me.id) {
          setOnlineUsers((prevState) => [...prevState, member.info.username]);
          
          setPeers((prevState) => [
            ...prevState,
            {peerId: member.id, username: member.info.username},
          ]);
        }
        
      });
      console.log(peers)
      setUserId(members.me.id);
      
    });
    
    //When new member joins the chat
    channel.bind("pusher:member_added", async (member: any) => {
      toast({
        title: 'New Member',
        description: `${member.info.username} has entered the room!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setOnlineUsersCount(channel.members.count);
      setOnlineUsers((prevState) => [...prevState, member.info.username]);
      setPeers((prevState) => [
        ...prevState,
        {peerId: member.id, username: member.info.username},
      ]);
      console.log("New User Entered the Chat");
    });
    
    //When member leaves the chat
    channel.bind("pusher:member_removed", (member: any) => {
      console.log("User has left the Chat");
      setOnlineUsers([]);
      channel.members.each((member: any) => {
        setOnlineUsers((prevState) => [...prevState, member.info.username]);
      });
    });
    
    //When receive new message
    channel.bind("chat-update", (data: ChatObject) => {
      const {message, username} = data;
      setChats((prevState) => [...prevState, {username, message}]);
      console.log("Message Received");
      console.log(chats);
    });
    
    return () => {
      pusher.unsubscribe(`presence-${router.query.room}`);
      
    };
  }, []);
  
  //Creates own Peer Id from Member Id
  useEffect(() => {
    async function createPeer() {
      if (userId) {
        const peer = new Peer(userId);
        peerInstance.current = peer;
        peer.on("open", (id) => {
          console.log("My peer id is " + id);
        });
        
        peer.on("call", async function (call) {
          console.log("Someone is attempting to call you");
          const stream = await getMedia();
          call.answer(stream);
          call.on("stream", function (remoteStream) {
            // remotePeerInstance.current.srcObject = remoteStream;
            setPeerMedia(prevState => ({...prevState, [call.peer]: remoteStream}))
          });
          
        });
        
        peer.on("error", (err) => {
          console.log(err);
        });
        
        peer.on("disconnected", () => {
          console.log("Peer connection disconnected");
        });
        
        peer.on("close", () => {
          console.log("Peer Connection is Closed");
        });
        
        // await axios.post("/api/pusher/newmember", { userId });
      }
    }
    
    createPeer();
  }, [userId]);
  
  //Call People Function
  const callPeer = (remotePeerId: string) => {
    console.log("Calling " + remotePeerId);
    
    async function call() {
      const stream = await getMedia();
      if (peerInstance.current) {
        const mediaConnection = peerInstance.current.call(remotePeerId, stream);
        mediaConnection.on("stream", function (remoteStream: MediaStream) {
          // remotePeerInstance.current.srcObject = remoteStream;
          // setPeerMedia((prevState) =>
          //   [...prevState, remoteStream]);
          setPeerMedia(prevState => ({...prevState, [remotePeerId]: remoteStream}))
          
        });
      }
    }
    
    call();
    
  };
  
  //Get Media Stream Function
  async function getMedia() {
    let stream = null;
    //   navigator.mediaDevices.webkitGetUserMedia ||
    //   navigator.mediaDevices.mozGetUserMedia;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return stream;
    }
    catch (err) {
      console.log(err);
    }
  }
  
  //Gets User's Own Video Stream
  useEffect(() => {
    async function startMedia() {
      const stream = await getMedia();
      if (userVideo.current && stream) {
        userVideo.current.srcObject = stream;
      }
    }
    
    startMedia();
  }, []);
  
  //Submits Chat Message
  // const handleSubmit = async (e: KeyboardEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   await axios.post("/api/pusher", {message, username, channel: `presence-${router.query.room}`});
  // };
  
  //Modal Control
  
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const callEveryone = () => {
    peers.forEach((peer) => {
        console.log("Calling" + peer.username)
        callPeer(peer.peerId);
      }
    );
    setIsOpen(false);
  }
  
  //Scroll to Bottom of ChatBox
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [chats]);
  
  return (<Box> <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <ModalOverlay/>
    <ModalContent>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton/>
      <ModalBody>
        <Text>Would you like to enter the call?</Text>
      </ModalBody>
      
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={callEveryone}>
          Join Audio
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
    <Grid h='90vh'
          templateRows='repeat(3, 1fr)'
          templateColumns={{base: 'repeat(6, 1fr)', md: 'repeat(8, 1fr)'}}
          gap={4}>
      <GridItem display={{base: 'none', md: 'block'}} rowSpan={3} colSpan={1}><Flex direction="column" justify="center"
                                                                                    align="center"><Heading
        size="medium"
        p={5}>Online
        Users</Heading><List spacing={3} p={3}>
        {onlineUsers.map((onlineUser, index) => (
          <ListItem key={index}> <ListIcon as={CheckCircleIcon} color='green.500'/>
            {onlineUser}</ListItem>
        ))}
        
        {/* You can also use custom icons from react-icons */}
      
      </List></Flex></GridItem>
      <GridItem rowSpan={3} colSpan={5}> <SimpleGrid columns={{base: 2, md: 3}} spacing='10px' p={50}>
        <Box bg='white' height='100%'>
          <video ref={userVideo}
                 autoPlay={true}
                 height="100%"
                 width="100%"
                 muted={true} playsInline></video>
        </Box>
        {Object.values(peerMedia).map((stream, index) => {
          return (
            <Box bg="white" key={index} height='100%'>
              <Video stream={stream}/>
            </Box>
          );
        })}
      </SimpleGrid></GridItem>
      <GridItem display={{base: 'none', md: 'block'}} rowSpan={3}
                colSpan={2}><Box p={3}><Heading size="medium">Chat Box</Heading>
        <Flex direction="column" justify="space-between" align="space-between" h="70vh">
          <Box className={styles.chat} sx={{height: "50vh", overflowY: "scroll"}}
          >
            {chats.map((chat, id) => {
              return <Text key={id}>{chat.username}: {chat.message}</Text>;
            })}
            <div ref={messagesEndRef}/>
          </Box>
          <Box sx={{height: "20vh", display: "flex", alignItems: "flex-end"}}>
            <Input variant="flushed"
                   placeholder="Type your message here..."
                   value={message}
                   onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => {
              if (e.charCode === 13) {
                axios.post("/api/pusher", {message, username, channel: `presence-${router.query.room}`});
                setMessage('')
              }
              ;
              
            }}
            ></Input>
          </Box>
        </Flex>
      </Box>
      </GridItem>
    </Grid>
  
  
  </Box>)
}

export default VideoRoom

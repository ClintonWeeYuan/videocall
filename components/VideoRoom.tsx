import {NextPage} from "next";
import {
  Box, Text, Button, useToast, Grid, GridItem, SimpleGrid, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import Pusher from "pusher-js";
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Peer from "peerjs";
import * as PusherTypes from 'pusher-js';


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
      height="300px"
      width="400px"
    ></video>
  );
};

const VideoRoom: NextPage<Props> = ({username}) => {
  const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY ? process.env.NEXT_PUBLIC_KEY : '', {
    cluster: "ap1",
    authEndpoint: "api/pusher/auth",
    auth: {params: {username}},
  });
  
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
  
  //Toast Message upon joining
  const toast = useToast()
  
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const channel: any = pusher.subscribe("presence-channel");
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
          setOnlineUsers((prevState) => [...prevState, member.info.username]);
        });
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
    }
    
    
    return () => {
      pusher.unsubscribe("presence-channel");
      mounted = false;
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
    // var getUserMedia =
    //   navigator.mediaDevices.getUserMedia ||
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
  
  //Modal Control
  
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const callEveryone = () => {
    peers.forEach((peer) => {
        //       console.log(peer.peerId)
        //       callPeer(peer.peerId);
      }
    );
    setIsOpen(false);
  }
  
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
  </Modal><SimpleGrid columns={{sm: 2, md: 3}} spacing='10px' p={50}>
    <Box bg='white' height='200px'></Box>
    <Box bg='white' height='200px'></Box>
    <Box bg='white' height='200px'></Box>
    <Box bg='white' height='200px'></Box>
    <Box bg='white' height='200px'></Box>
    <Box bg='white' height='200px'></Box>
  </SimpleGrid>
  
  </Box>)
  // <Box>
  //   <video ref={userVideo}
  //          autoPlay={true}
  //          height="250px"
  //          width="300px"
  //          muted={true}></video>
  // </Box>
  //
  // {onlineUsers.map((user, id) => {
  //   return (<Box key={id}>{user}</Box>)
  // })}
  // {Object.values(peerMedia).map((stream, index) => {
  //   return (
  //     <div key={index}>
  //       <Video stream={stream}/>
  //     </div>
  //   );
  // })}
  //
  //
  // <Button
  //   onClick={() =>
  //     peers.forEach((peer) => {
  //       console.log(peer.peerId)
  //       callPeer(peer.peerId);
  //     })
  //   }
  // >
  //   Call Everyone
  // </Button>)
}

export default VideoRoom

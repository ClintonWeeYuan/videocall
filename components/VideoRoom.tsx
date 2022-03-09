import {NextPage} from "next";
import {Box, Text} from '@chakra-ui/react'
import Pusher from "pusher-js";
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'


type Props = {
  username: string;
}
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
  const [remotePeerId, setRemotePeerId] = useState<string>([]);
  const [userId, setUserId] = useState<string>("");
  const [peerMedia, setPeerMedia] = useState([]);
  const userVideo = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  
  const peerInstance = useRef(null);
  const remotePeerInstance = useRef(null);
  
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const channel = pusher.subscribe("presence-channel");
      //When user subscribes to channel
      
      channel.bind("pusher:subscription_succeeded", (members) => {
        console.log("Subscribed to channel")
        setOnlineUsersCount(members.count);
        members.each((member) => {
          setOnlineUsers((prevState) => [...prevState, member.info.username]);
        });
        setUserId(members.me.id);
      });
      
      //When new member joins the chat
      channel.bind("pusher:member_added", async (member) => {
        setOnlineUsersCount(channel.members.count);
        setOnlineUsers((prevState) => [...prevState, member.info.username]);
        console.log("New User Entered the Chat");
      });
      
      //When member leaves the chat
      channel.bind("pusher:member_removed", (member) => {
        console.log("User has left the Chat");
        setOnlineUsers([]);
        channel.members.each((member) => {
          setOnlineUsers((prevState) => [...prevState, member.info.username]);
        });
      });
    }
    
    
    return () => {
      pusher.unsubscribe("presence-channel");
      mounted = false;
    };
  }, []);
  
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
  
  return (<Box><Text>Hello {username}</Text>
    <Box>
      <video ref={userVideo}
             autoPlay={true}
             height="250px"
             width="300px"
             muted={true}></video>
    </Box>
    
    {onlineUsers.map((user, id) => {
      return (<Box key={id}>{user}</Box>)
    })}</Box>)
}

export default VideoRoom

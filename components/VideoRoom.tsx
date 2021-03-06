import {NextPage} from "next";
import {Box, useToast, Grid, GridItem, Flex, Heading} from '@chakra-ui/react';
import Pusher from "pusher-js";
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Peer from "peerjs";
import * as PusherTypes from 'pusher-js';
import OnlineStatus from './OnlineStatus'
import ChatBox from './ChatBox'
import ChatSender from './ChatSender'
import VideoContainer from './VideoContainer'
import {getMedia} from '../lib/utils'
import EnterRoomModal from "./EnterRoomModal";
import {createPeer} from "../lib/utils"

type Props = {
    username: string;
}

export interface PeerMediaStreams {
    [id: string]: MediaStream;
}

export interface PeerObject {
    peerId: string;
    username: string;
}

export interface ChatObject {
    message: string;
    username: string;
}

const VideoRoom: NextPage<Props> = ({username}) => {

    //Online Users State
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    //Peer and Video States
    const [userId, setUserId] = useState<string>("");

    // const [peerMedia, setPeerMedia] = useState<MediaStream[]>([]);
    const [peerMedia, setPeerMedia] = useState<PeerMediaStreams>({});

    // const [userVideo, setUserVideo] = useState<MediaStream>();
    const router = useRouter();
    const [peers, setPeers] = useState<PeerObject[]>([]);
    const peerInstance = useRef<any>();

    //Chat Messages
    const [chats, setChats] = useState<ChatObject[]>([]);

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
                duration: 2000,
                isClosable: true,
            })
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
                duration: 2000,
                isClosable: true,
            })
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
                if (member.id != channel.members.me.id) {
                    setOnlineUsers((prevState) => [...prevState, member.info.username]);
                }
            });
            setPeers(peers.filter((e) => {
                    return e.peerId != member.id;
                })
            );
            setPeerMedia((prevState) => {
                const newData = {...prevState};
                delete newData[member.id];
                return newData;
            })

        });
        //When receive new message
        channel.bind("chat-update", (data: ChatObject) => {
            const {message, username} = data;
            setChats((prevState) => [...prevState, {username, message}]);
            console.log("Message Received");
        });

        return () => {
            pusher.unsubscribe(`presence-${router.query.room}`);
        };
    }, []);

    //Creates own Peer Id from Member Id
    useEffect(() => {
        createPeer(userId, peerInstance, setPeerMedia);
    }, [userId]);

    //Call People Function
    const callPeer = (remotePeerId: string) => {
        console.log("Calling " + remotePeerId);

        async function call() {
            const stream = await getMedia();
            if (peerInstance.current) {
                const mediaConnection = peerInstance.current.call(remotePeerId, stream);
                mediaConnection.on("stream", function (remoteStream: MediaStream) {
                    setPeerMedia(prevState => ({...prevState, [remotePeerId]: remoteStream}))
                });
            }
        }
        call();
    };

    const callEveryone = () => {
        peers.forEach((peer) => {
                console.log("Calling" + peer.username)
                callPeer(peer.peerId);
            }
        );
    }

    return (
        <Box>
            <EnterRoomModal callEveryone={callEveryone}/>
            <Grid h='90vh'
                  templateRows='repeat(3, 1fr)'
                  templateColumns={{base: 'repeat(6, 1fr)', md: 'repeat(8, 1fr)'}}
                  gap={4}>
                <GridItem display={{base: 'none', md: 'block'}} rowSpan={3} colSpan={1}>
                    <OnlineStatus onlineUsers={onlineUsers}/>
                </GridItem>
                <GridItem rowSpan={3} colSpan={5}>
                    <VideoContainer onlineUsers={onlineUsers} peerMedia={peerMedia}/>
                </GridItem>
                <GridItem display={{base: 'none', md: 'block'}} rowSpan={3}
                          colSpan={2}>
                    <Box p={3}>
                        <Heading sx={{textAlign: "center"}}
                                                                   size="medium">
                        Chat Box
                    </Heading>
                        <Flex direction="column" justify="center" align="space-between">
                            <ChatBox chats={chats} username={username}/>
                            <ChatSender username={username}/>
                        </Flex>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    )
}
export default VideoRoom
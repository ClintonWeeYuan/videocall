import {NextPage} from "next";
import {Box, SimpleGrid} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {getMedia} from '../lib/utils'
import {PeerMediaStreams} from './VideoRoom'

type Props = {
    onlineUsers: string[];
    peerMedia: PeerMediaStreams;
}

type VideoProps = {
    stream: MediaStream;
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
        />
    );
};

const VideoContainer: NextPage<Props> = ({onlineUsers, peerMedia}) => {

    //Calculate grid columns
    const [numColumns, setNumColumns] = useState<number>(1)
    const [mobileNumColumns, setMobileNumColumns] = useState<number>(1)

    //User Video Ref
    const userVideo = useRef<HTMLVideoElement>(null);

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


    useEffect(() => {
        if (onlineUsers.length == 0) {
            setNumColumns(1);
            setMobileNumColumns(1);
        } else if (onlineUsers.length == 1) {
            setNumColumns(2);
            setMobileNumColumns(2);
        } else {
            setNumColumns(3);
            setMobileNumColumns(2);
        }
    }, [onlineUsers])

    return (
        <SimpleGrid columns={{base: mobileNumColumns, md: numColumns}} spacing='10px' p={50}>
            <Box bg='white' height='100%' maxH="400px" maxW="300px">
                <video ref={userVideo}
                       autoPlay={true}
                       height="100%"
                       width="100%"
                       muted={true} playsInline/>
            </Box>
            {Object.values(peerMedia).map((stream, index) => {
                return <Box bg="white" key={index} height='100%' maxH="400px" maxW="300px">
                    <Video stream={stream}/>
                </Box>;
            })}
        </SimpleGrid>
    )
}

export default VideoContainer;
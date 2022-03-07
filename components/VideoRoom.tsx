import {NextPage} from "next";
import {Box} from '@chakra-ui/react'


const VideoRoom: NextPage<Props> = ({username}) => {
    return (<Box>Hello {username}</Box>)
}

export default VideoRoom
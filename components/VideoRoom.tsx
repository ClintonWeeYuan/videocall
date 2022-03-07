import {NextPage} from "next";
import {Box} from '@chakra-ui/react'

type Props = {
    username: string;
}
const VideoRoom: NextPage<Props> = ({username}) => {
    return (<Box>Hello {username}</Box>)
}

export default VideoRoom
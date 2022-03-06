import { useRouter } from "next/router";
import {NextPage} from "next";
import {Box} from "@chakra-ui/react"
import Nav from '../components/Nav'

const Room : NextPage = () => {
    const router = useRouter();
    return(<div><Nav/>
        <Box><h1>{router.query.room}</h1></Box></div>)
}

export default Room;
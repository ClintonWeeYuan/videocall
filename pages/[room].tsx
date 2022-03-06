import { useRouter } from "next/router";
import {NextPage} from "next";
import {Box} from "@chakra-ui/react"
import Nav from '../components/Nav'
import {User} from '../components/UserContext'


const Room : NextPage = () => {
    const username = User();
    const router = useRouter();
    return(<div><Nav/>
        <Box><h1>{router.query.room}</h1><h2>{username}</h2></Box></div>)
}

export default Room;
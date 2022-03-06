import { useRouter } from "next/router";
import {NextPage} from "next";
import {Container, Box, Button} from "@chakra-ui/react"
import Nav from '../components/Nav'
import {User} from '../components/UserContext'



const Room : NextPage = () => {
    const username = User();
    const router = useRouter();
    return(<div><Nav/>
        <Container><h1>Room Id: {router.query.room}</h1><h2>Username: {username}</h2><Button onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/${router.query.room}`)}}>Copy Link</Button></Container></div>)
}

export default Room;
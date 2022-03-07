import {useRouter} from "next/router";
import {NextPage} from "next";
import {
    Container,
    Flex,
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement
} from "@chakra-ui/react"
import Nav from '../components/Nav'
import {UpdateUser, User} from '../components/UserContext'
import {useState} from "react";
import dynamic from "next/dynamic";

const VideoRoom = dynamic(() => import("../components/VideoRoom"), {
    ssr: false,
});


const Room: NextPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const updateUsername = UpdateUser();
    const name = User()
    return (<div>
        <Nav/>
        <Container p={100}>
            <FormControl isRequired>
                <FormLabel htmlFor='first-name'>Username</FormLabel>
                
                <Input pr="0" onChange={(e) => setUsername(e.target.value)} id='user-name'
                       placeholder='Username'/>
            
            
            </FormControl>
            <Flex mt={3} w={400}>
                <Button onClick={() => updateUsername(username)}>Enter Room</Button>
                <Button ml={20} onClick={() => {
                    navigator.clipboard.writeText(`http://localhost:3000/${router.query.room}`)
                }}>Copy Link</Button>
            </Flex>
            <VideoRoom username={name}/>
        </Container></div>)
}

export default Room;
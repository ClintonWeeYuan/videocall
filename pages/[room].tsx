import {useRouter} from "next/router";
import {NextPage} from "next";
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import {CheckCircleIcon} from '@chakra-ui/icons';
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
  const [enterRoom, setEnterRoom] = useState<boolean>(false);
  const updateUsername = UpdateUser();
  const name = User()
  return (<div>
    <Nav/>
    
    {enterRoom ? (
      <VideoRoom username={name}/>) : (
      <Container p={100}>
        <FormControl isRequired>
          <FormLabel htmlFor='first-name'>Username</FormLabel>
          <Input pr="0" onChange={(e) => setUsername(e.target.value)} id='user-name'
                 placeholder='Username'/>
        </FormControl>
        <Flex mt={3} w={400}>
          <Button onClick={() => {
            updateUsername(username);
            setEnterRoom(true)
          }}>Enter Room</Button>
          <Button ml={20} onClick={() => {
            navigator.clipboard.writeText(`http://localhost:3000/${router.query.room}`)
          }}>Copy Link</Button>
        
        </Flex></Container>)}
  
  
  </div>)
}

export default Room;
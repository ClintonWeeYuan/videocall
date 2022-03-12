import {useRouter} from "next/router";
import {NextPage} from "next";
import {
  Button, Container, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Input, Text, List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
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
    
    <Grid
      h='90vh'
      templateRows='repeat(3, 1fr)'
      templateColumns={{base: 'repeat(5, 1fr)', md: 'repeat(7, 1fr)'}}
      gap={4}
    >
      <GridItem display={{base: 'none', md: 'block'}} rowSpan={3} colSpan={1}><Flex direction="column" justify="center"
                                                                                    align="center"><Heading
        size="medium"
        p={5}>Online
        Users</Heading><List spacing={3} p={3}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color='green.500'/>
          Someone
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color='green.500'/>
          Someone
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color='green.500'/>
          Someone
        </ListItem>
        {/* You can also use custom icons from react-icons */}
      
      </List></Flex></GridItem>
      <GridItem rowSpan={3} colSpan={5}>{enterRoom ? (<VideoRoom username={name}/>) : (<Container p={100}>
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
      </GridItem>
      <GridItem display={{base: 'none', md: 'block'}} rowSpan={3} colSpan={1}/>
    
    </Grid>
  
  
  </div>)
}

export default Room;
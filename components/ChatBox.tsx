import {NextPage} from "next";
import {Box, Flex, Heading, Input, List, ListIcon, ListItem} from "@chakra-ui/react";
import {CheckCircleIcon} from "@chakra-ui/icons";
import styles from "../styles/chat.module.css";
import Message from "./Message";
import axios from "axios";
import {useRef} from "react";

interface ChatObject {
    message: string;
    username: string;
}

type Props = {
    chats: ChatObject[];
    username: string;
}

const ChatBox: NextPage<Props> = ({chats, username}) => {

    //Scroll to Bottom of ChatBox
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    return (
            <Box className={styles.chat} sx={{height: "50vh", overflowY: "scroll"}}>
                {chats.map((chat, id) => {
                    return <Message key={id} username={username} sender={chat.username}
                                    message={chat.message}/>
                })}
                <div ref={messagesEndRef}/>
            </Box>
    )
}

export default ChatBox;
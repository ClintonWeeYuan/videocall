import {NextPage} from "next";
import {Box} from "@chakra-ui/react";
import styles from "../styles/chat.module.css";
import Message from "./Message";
import {useEffect, useRef} from "react";

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

    useEffect(() => {
        scrollToBottom()
    }, [chats]);

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
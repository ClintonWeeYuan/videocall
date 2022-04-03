import {NextPage} from "next";
import {Box, Flex, Heading, Input, List, ListIcon, ListItem} from "@chakra-ui/react";
import {CheckCircleIcon} from "@chakra-ui/icons";
import styles from "../styles/chat.module.css";
import Message from "./Message";
import axios from "axios";
import {useRef, useState} from "react";
import {useRouter} from 'next/router'

type Props = {
    username: string;
}

const ChatSender: NextPage<Props> = ({username}) => {
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    return (
        <Box sx={{height: "20vh", display: "flex"}}>
            <Input variant="flushed"
                   placeholder="Type your message here..."
                   value={message}
                   onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => {
                if (e.charCode === 13) {
                    axios.post("/api/pusher", {
                        message,
                        username,
                        channel: `presence-${router.query.room}`
                    });
                    setMessage('')
                }
                ;
            }}
            ></Input>
        </Box>
    )
}

export default ChatSender;
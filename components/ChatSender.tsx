import {NextPage} from "next";
import {Box, Input} from "@chakra-ui/react";
import axios from "axios";
import {useState} from "react";
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
            }}
            />
        </Box>
    )
}

export default ChatSender;
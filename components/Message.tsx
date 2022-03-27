import React, {forwardRef} from 'react'
import {Box, Text} from '@chakra-ui/react';
import {NextPage} from "next";
import styles from '../styles/message.module.css';

interface Props {
  username: string,
  sender: string,
  message: string
}

const Message: NextPage<Props> = ({username, sender, message}) => {
  
  const isUser = username === sender;
  
  return (
    <Box className={isUser ? styles.messageBoxUser : styles.messageBox}>
      <Box className={isUser ? styles.messageTextUser : styles.messageText}>
        <Text color="black">
          {!isUser && `${sender || 'Unknown User'}:`} {message}
        </Text>
      </Box>
    </Box>
  )
};

export default Message

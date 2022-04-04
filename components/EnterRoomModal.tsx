import {NextPage} from "next";
import {
    Box, Button, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import styles from "../styles/chat.module.css";
import Message from "./Message";
import {useEffect, useRef, useState} from "react";

import {ChatObject} from './VideoRoom'

type Props = {
    callEveryone: () => void;
}

const EnterRoomModal: NextPage<Props> = ({callEveryone}) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const handleClick = () => {
        setIsOpen(false);
        callEveryone();
    }

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text>Would you like to enter the call?</Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleClick}>
                        Join Audio
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EnterRoomModal;
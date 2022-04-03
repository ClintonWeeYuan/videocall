import {NextPage} from "next";
import {Flex, Heading, List, ListIcon, ListItem} from "@chakra-ui/react";
import {CheckCircleIcon} from "@chakra-ui/icons";

type Props = {
    onlineUsers: string[]
}
const OnlineStatus: NextPage<Props> = ({onlineUsers}) => {

    return (
        <Flex direction="column" justify="center"
              align="center">
            <Heading
                size="medium"
                p={5}>
                Online
                Users
            </Heading>
            <List spacing={3} p={3}>
                {onlineUsers.map((onlineUser, index) =>
                    <ListItem key={index}>
                        <ListIcon as={CheckCircleIcon}
                                  color='green.500'/>
                        {onlineUser}
                    </ListItem>)}
            </List>
        </Flex>
    )
}

export default OnlineStatus;
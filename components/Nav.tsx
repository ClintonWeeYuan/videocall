import {ReactNode} from "react"
import {Box, Button, Flex, Link, Stack, useColorMode, useColorModeValue,} from "@chakra-ui/react"
import NextLink from "next/link";
import {MoonIcon, SunIcon} from "@chakra-ui/icons"

const NavLink = ({children}: { children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={"#"}
    >
        {children}
    </Link>
)

export default function Nav() {
    const {colorMode, toggleColorMode} = useColorMode()
    return (
        <>
            <Box  bg={useColorModeValue("gray.100", "gray.900")} px={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <NextLink href="/"><Button>Video Call</Button></NextLink>

                    <Flex alignItems={"center"}>
                        <Stack direction={"row"} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
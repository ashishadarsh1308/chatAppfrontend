import React, { useEffect } from 'react'
import { Box, Container, Text } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'
import { useNavigate } from 'react-router-dom';

function HomePage() {

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        if (!user) {
            navigate('/chat')
        }
    }, [navigate])


    return (
        <Container maxW='xl' centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                // bg={"green.600"}
                bg="rgba(0, 255, 266, 0.1)"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="2xl" textAlign="center">Let's Talk</Text>
            </Box>
            <Box
                bg="rgba(0, 255, 266, 0.1)"
                // bg={"green.600"}
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                color={'white'}
            >
                <Tabs isFitted variant='enclosed' borderBottom="none" colorScheme="">
                    <TabList mb='1em'>
                        <Tab>Login</Tab>
                        <Tab>Signup</Tab>
                    </TabList>
                    <TabPanels >
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage
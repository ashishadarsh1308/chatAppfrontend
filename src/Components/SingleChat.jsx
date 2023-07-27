import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import './Style.css'
import ScrollableChat from './ScrollableChat'

import io from 'socket.io-client'
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const { user, selectedChat, setSelectedChat } = ChatState()
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true)

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`, config
            )
            setMessage(data);
            setLoading(false)
            // console.log(data);
            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                // if (!notification.includes(newMessageRecieved)) {
                //     setNotification([newMessageRecieved, ...notification]);
                //     setFetchAgain(!fetchAgain);
            }
            else {
                setMessage([...message, newMessageRecieved]);
            }
        });
    });


    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("")
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    }, config);

                socket.emit('new message', data)
                setMessage([...message, data])
                // console.log(message);

            } catch (error) {
                Toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {selectedChat ? (
                <div>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily=""
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >

                        {!selectedChat.isGroupChat ? (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <IconButton
                                    d={{ base: "flex", md: "none" }}
                                    icon={<ArrowBackIcon />}
                                    bg={'none'}
                                    fontSize={'2xl'}
                                    _hover={{ bg: 'green.400' }}
                                    onClick={() => setSelectedChat("")}
                                />
                                <div style={{ alignSelf: "center", paddingLeft: '10px' }}>
                                    👨‍💻{getSender(user, selectedChat.users)}
                                </div>
                                <div style={{ marginLeft: "auto" }}>
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <IconButton
                                        d={{ base: "flex", md: "none" }}
                                        icon={<ArrowBackIcon />}
                                        bg={'none'}
                                        fontSize={'2xl'}
                                        _hover={{ bg: 'green.400' }}
                                        onClick={() => setSelectedChat("")}
                                    />
                                    <div style={{ alignSelf: "center", paddingLeft: '10px' }}>
                                        👨‍👨‍👧‍👧{selectedChat.chatName.toUpperCase()}
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>
                                        {/* <ProfileModal user={getSenderFull(user, selectedChat.users)} /> */}
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>
                                        <UpdateGroupChatModal
                                            fetchMessages={fetchMessages}
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </Text>


                    <Box
                        paddingTop={'20px'}
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        p={3}
                        w="100%"
                        h="560px"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size={'xl'}
                                w={20}
                                h={20}
                                alignSelf={'center'}
                                margin={'auto'}
                                color="black"
                            />
                        ) : (
                            <div className='message'>
                                <ScrollableChat message={message} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                            {isTyping ? (
                                <div
                                    style={{ padding: '0 0 10px 40px' }}
                                >
                                    👨‍💻  Typing...
                                </div>
                            ) : <></>}
                            <Input
                                variant='filled'
                                bg={'#E0E0E0'}
                                placeholder='Enter a message...'
                                onChange={typingHandler}
                                value={newMessage}
                                color={'white'}
                            />

                        </FormControl>
                    </Box>
                </div >

            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} m={"250px"} fontFamily="">
                        Click on a USER to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
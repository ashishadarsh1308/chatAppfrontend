import React from 'react'
import { useState } from 'react'
import {
    Box, Tooltip, Button, Text, Menu, MenuButton,
    MenuList, Avatar, MenuItem, Drawer, useDisclosure, DrawerOverlay,
    DrawerHeader, DrawerContent, DrawerBody, Input, useToast, Spinner
} from '@chakra-ui/react';
import { BellIcon, SearchIcon, ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ProfileModal from './ProfileModal';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const navigate = useNavigate()
    //context provider
    const { user, setSelectedChat, chats, setChats, } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/");
    }

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const accessChat = async (userId) => {
        console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                // bg="#B8ECD2"
                bg="rgba(110, 231, 183, 0.5)"
                w="100%"
                p="5px 10px"
                borderWidth="2px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                    <Button colorScheme='green' variant='solid' onClick={onOpen} border={'solid 1px'}>
                        <SearchIcon />
                        <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
                    </Button>

                </Tooltip>
                <Text fontSize="2xl" alignItems='center' style={{ color: "white" }} fontFamily="sans-serif">Let's Talk</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" color="white" m={2} />
                            {/* <MenuList/> */}
                        </MenuButton>
                    </Menu>
                    <Menu >
                        <MenuButton as={Button}
                            rightIcon={<ChevronDownIcon />}
                            color={'black'} bg={'none'}
                            _hover={{ bg: 'green.200' }}
                            border={'2px solid darkgreen'}
                        >
                            <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={''} />
                        </MenuButton>
                        <MenuList color={'black'} style={{}} >
                            <ProfileModal user={user}>
                                <MenuItem _hover={{ backgroundColor: '#62A269', color: 'white' }}>My Profile</MenuItem>
                            </ProfileModal>

                            <MenuItem
                                onClick={logoutHandler}
                                _hover={{ backgroundColor: 'red', color: 'white' }}
                            >
                                <ExternalLinkIcon style={{ color: 'black' }} _hover={{ color: 'white' }} />
                                <span style={{ marginLeft: '0.5rem' }}>Logout</span>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent backgroundColor={'#D3F7D6'}>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box
                            display={'flex'}
                            paddingBottom={'2'}
                        >
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                onClick={handleSearch}
                                backgroundColor={'green.200'}
                                _hover={{ backgroundColor: '#38B2AC', color: 'white' }}
                            >
                                Go
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) :
                            (
                                searchResult?.map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    ></UserListItem>
                                ))
                            )}
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
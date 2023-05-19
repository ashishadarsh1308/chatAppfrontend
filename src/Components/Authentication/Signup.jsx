import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
// import { Image } from 'cloudinary-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [show, setshow] = useState(false)
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        } if (password !== confirmPassword) {
            toast({
                title: "Password don't match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "content-type": "application/json"
                },
            }
            const { data } = await axios.post(
                "/api/user",
                { name, email, password, pic },
                config
            );
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false)
            navigate('/')
        } catch (error) {
            toast({
                title: "Error occoured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
        setLoading(false)
    };


    const postDetails = () => { }

    return (
        <>
            <VStack spacing='5px'>
                <FormControl id='first-name' isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        placeholder='Enter Your Name'
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder='Enter Your Email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                        <Input
                            type={show ? "text" : "password"}
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement >
                            {show ? " " : ""}
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup size="md">
                        <Input
                            type={show ? "text" : "password"}
                            placeholder="Confirm password"
                            onChange={(e) => setConfirmpassword(e.target.value)}
                        />
                        <InputRightElement>
                            {show ? "" : ""}
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl id="pic">
                    <FormLabel>Upload your Picture</FormLabel>
                    <Input
                        type="file"
                        p={1.5}
                        accept="image/*"
                        onChange={(e) => postDetails(e.target.files[0])}
                    />
                </FormControl>
                <Button
                    colorScheme="blue"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={loading}
                //isloading={loading}
                >
                    Sign Up
                </Button>
            </VStack>
        </>
    )
}

export default Signup









// const postDetails = (pics) => {
//     setLoading(true);
//     if (pics === undefined) {
//         toast({
//             title: "Please select an Image",
//             status: "warning",
//             duration: 5000,
//             isClosable: true,
//             position: "bottom"
//         })
//         return;
//     }
//     if (pics.type === "image/jpeg" || pics.type === "image/png") {
//         const data = new FormData();
//         data.append("file", pics);
//         data.append("upload_present", "chat-app");
//         data.append("cloud_name", "ds3t0xxe9")
//         fetch("https://api.cloudinary.com/v1_1/ds3t0xxe9/image/upload", {
//             method: 'post',
//             body: data,
//         }).then((res) => res.json())
//             .then(data => {
//                 setPic(data.url.toString());
//                 setLoading(false)
//             })
//             .catch((err) => {
//                 console.log(err);
//                 setLoading(false);
//             });
//     } else {
//         toast({
//             title: "Please select an Image",
//             status: "warning",
//             duration: 5000,
//             isClosable: true,
//             position: "bottom"
//         })
//         return;
//     }
// }
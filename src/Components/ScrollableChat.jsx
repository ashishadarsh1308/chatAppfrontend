import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from "../Context/ChatProvider";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ message }) => {
    const { user } = ChatState();
    return (
        <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
            <ScrollableFeed style={{ color: 'black' }}>
                {message &&
                    message.map((m, i) => (
                        <div style={{ display: "flex" }} key={m._id}>
                            {(isSameSender(message, m, i, user._id) ||
                                isLastMessage(message, i, user._id)) &&
                                (
                                    <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                        <Avatar
                                            mt="7px"
                                            mr={1}
                                            size="sm"
                                            cursor="pointer"
                                            name={m.sender.name}
                                            src={m.sender.pic}
                                        />
                                    </Tooltip>
                                )}
                            <span
                                style={{
                                    backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                                    // margin: `${m.sender._id === user._id ? "33px" : "500px"}`,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    color: "black",
                                    marginLeft: isSameSenderMargin(message, m, i, user._id),
                                    marginTop: isSameUser(message, m, i, user._id) ? 3 : 10,
                                }}
                            >
                                {m.content}
                            </span>
                        </div>
                    ))
                }
            </ScrollableFeed >
        </div >
    );
};

export default ScrollableChat;


// import React from 'react';
// import ScrollableFeed from 'react-scrollable-feed';
// import { ChatState } from "../Context/ChatProvider";
// import {
//     isLastMessage,
//     isSameUser,
// } from "../config/ChatLogics";
// import { Avatar, Tooltip } from '@chakra-ui/react';

// const ScrollableChat = ({ message }) => {
//     const { user } = ChatState();
//     const chattingUser = message.length > 0 ? message[0].sender : null;

//     return (
//         <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
//             <ScrollableFeed style={{ color: 'black' }}>
//                 {message &&
//                     message.map((m, i) => {
//                         const isSender = m.sender._id === user._id;
//                         const messageStyle = {
//                             backgroundColor: isSender ? "#BEE3F8" : "#B9F5D0",
//                             borderRadius: "20px",
//                             padding: "5px 15px",
//                             maxWidth: "75%",
//                             color: "black",
//                             marginLeft: isSender ? "0" : "auto",
//                             marginRight: isSender ? "auto" : "0",
//                         };
//                         const profileUser = isSender ? chattingUser : user;
//                         return (
//                             <div style={{ display: "flex", flexDirection: isSender ? "row-reverse" : "row" }} key={m._id}>
//                                 {(isSender || isLastMessage(message, i, user._id)) && (
//                                     <Tooltip label={profileUser.name} placement="bottom-start" hasArrow>
//                                         <Avatar
//                                             mt="7px"
//                                             mr={isSender ? 1 : 0}
//                                             ml={isSender ? 0 : 1}
//                                             size="sm"
//                                             cursor="pointer"
//                                             name={profileUser.name}
//                                             src={profileUser.pic}
//                                         />
//                                     </Tooltip>
//                                 )}
//                                 <span style={messageStyle}>
//                                     {m.content}
//                                 </span>
//                             </div>
//                         );
//                     })
//                 }
//             </ScrollableFeed>
//         </div>
//     );
// };

// export default ScrollableChat;


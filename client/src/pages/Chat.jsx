// src/pages/Chat.jsx
import React, { useState, useEffect } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import axios from '../api/axios'; // Assuming you use this for API calls
import { MessageSquareText } from 'lucide-react'; // Icon for chat header

// Custom MessageBox component (re-included for self-containment, but should be a common utility)
const MessageBox = ({ message, type, onClose }) => {
    return (
        <div className={`message-box ${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>&times;</button>
        </div>
    );
};

const Chat = () => {
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentChatName, setCurrentChatName] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [messageBox, setMessageBox] = useState(null); // State for custom message box

    // Dummy chat data for demonstration.
    // In a real app, you'd fetch this from your backend (e.g., user's conversations).
    // For now, let's ensure these IDs are distinct from dummy user IDs.
    const dummyChats = [
        { id: 'chat_conv_1', name: 'John Doe', lastMessage: 'Hey, how are you?' },
        { id: 'chat_conv_2', name: 'Jane Smith', lastMessage: 'Can you pick up the food?' },
        { id: 'chat_conv_3', name: 'Food Bank Admin', lastMessage: 'Donation confirmed!' },
        { id: 'chat_conv_4', name: 'Local Volunteer', lastMessage: 'I am on my way.' },
    ];

    // Dummy messages for a selected chat (to be replaced by fetching from backend)
    // This function simulates fetching messages for a given chatId and populates senderId correctly
    const getDummyMessagesForChat = (chatId, currentUserId) => {
        // Simulate fetching messages for a specific chat
        const msg1 = { _id: 'm1', chat: chatId, sender: 'user_a', content: 'Hello!', messageType: 'text', createdAt: new Date(Date.now() - 120000).toISOString() };
        const msg2 = { _id: 'm2', chat: chatId, sender: 'user_b', content: 'Hi there!', messageType: 'text', createdAt: new Date(Date.now() - 110000).toISOString() };
        const msg3 = { _id: 'm3', chat: chatId, sender: 'user_a', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1600000000/sample.jpg', messageType: 'image', createdAt: new Date(Date.now() - 100000).toISOString() };
        const msg4 = { _id: 'm4', chat: chatId, sender: 'user_a', content: 'Check out this image!', messageType: 'text', createdAt: new Date(Date.now() - 99000).toISOString() };
        const msg5 = { _id: 'm5', chat: chatId, sender: 'user_b', content: 'Great! Looks delicious.', messageType: 'text', createdAt: new Date(Date.now() - 80000).toISOString() };
        const msg6 = { _id: 'm6', chat: chatId, sender: 'user_a', content: 'I need help with a food donation.', messageType: 'text', createdAt: new Date(Date.now() - 70000).toISOString() };
        const msg7 = { _id: 'm7', chat: chatId, sender: 'user_b', content: 'Sure, what do you need?', messageType: 'text', createdAt: new Date(Date.now() - 60000).toISOString() };

        // Map dummy sender IDs to actual currentUserId and a generic 'other' user ID
        const simulatedMessages = [msg1, msg2, msg3, msg4, msg5, msg6, msg7].map(msg => ({
            ...msg,
            // Assign senderId for display logic (current user vs. other user)
            senderId: msg.sender === 'user_a' ? currentUserId : 'dummy_other_user_id',
            // Populate sender object for potential display of sender name/avatar in ChatWindow
            sender: {
                _id: msg.sender === 'user_a' ? currentUserId : 'dummy_other_user_id',
                name: msg.sender === 'user_a' ? (currentUser ? currentUser.name : 'You') : 'Other User'
            }
        }));
        return simulatedMessages;
    };


    useEffect(() => {
        // Load current user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        } else {
            setMessageBox({ message: 'Please log in to use chat features.', type: 'error' });
            setTimeout(() => setMessageBox(null), 3000);
        }
    }, []);

    useEffect(() => {
        // Fetch messages when activeChatId or currentUser changes
        if (activeChatId && currentUser) {
            const fetchedMessages = getDummyMessagesForChat(activeChatId, currentUser._id);
            setMessages(fetchedMessages);

            const chat = dummyChats.find(c => c.id === activeChatId);
            setCurrentChatName(chat ? chat.name : 'Unknown Chat');
        } else {
            setMessages([]); // Clear messages if no chat is active or no user
            setCurrentChatName('');
        }
    }, [activeChatId, currentUser]);

    const handleSelectChat = (chatId) => {
        setActiveChatId(chatId);
    };

    const handleMessageSent = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return (
        <div className="page-container flex h-[calc(100vh-4rem)] p-4 bg-gray-100">
            {messageBox && <MessageBox message={messageBox.message} type={messageBox.type} onClose={() => setMessageBox(null)} />}
            <div className="chat-container flex w-full max-w-7xl mx-auto rounded-xl shadow-2xl overflow-hidden bg-white">
                {/* Chat List (left pane) */}
                <ChatList onSelectChat={handleSelectChat} activeChatId={activeChatId} />

                {/* Chat Window and Input (right pane) */}
                <div className="flex-grow flex flex-col">
                    <div className="chat-header bg-blue-600 text-white p-4 text-xl font-semibold flex items-center justify-between rounded-tr-xl">
                        <MessageSquareText className="w-6 h-6 mr-2" />
                        {currentChatName || 'Select a Chat'}
                    </div>
                    <ChatWindow
                        messages={messages}
                        currentUserId={currentUser ? currentUser._id : 'dummyCurrentUser'}
                        chatName={currentChatName}
                    />
                    {activeChatId && currentUser ? (
                        <ChatInput
                            currentChatId={activeChatId}
                            currentUserId={currentUser._id}
                            onMessageSent={handleMessageSent}
                        />
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-500 text-xl p-4">
                            Select a chat to start messaging.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;

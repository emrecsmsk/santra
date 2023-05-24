import React, { useState, useEffect, FC } from 'react';
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, onSnapshot, addDoc, doc} from 'firebase/firestore';
import { db } from '../../firebase';
import { getBottomSpace } from 'react-native-iphone-x-helper';


const MessagingPage = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const chatsRef = collection(db, "chats");
    const usersRef = collection(db, "users");

    const reversedMessages = [...messages].reverse();

    useEffect(() => {
        const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
            const messageData: IMessage[] = [];
            snapshot.docs.map((doc) => {
                const message = doc.data();
                if (message.createdAt) {
                    messageData.push({
                        _id: doc.id,
                        text: message.text,
                        createdAt: message.createdAt.toDate(),
                        user: {
                            _id: message.user._id,
                            name: message.user.name,
                        },
                    })
                }

            });
            setMessages(messageData);
        });

        return () => unsubscribe();
    }, []);

    const onSend = async (newMessages: IMessage[]) => {
        const message = newMessages[0];
        const { _id, text, createdAt, user } = message;

        await addDoc(chatsRef, {
            text,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date(createdAt)),
            user,
        })
    };

    const user: User = {
        _id: 'your_user_id',
        name: 'Your Name',
    };

    return (
        <GiftedChat
            bottomOffset={getBottomSpace()}
            messages={reversedMessages}
            onSend={(newMessages) => onSend(newMessages)}
            user={user}
        />
    );
};

export default MessagingPage;

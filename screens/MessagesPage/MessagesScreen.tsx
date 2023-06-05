import { View, StyleSheet } from 'react-native'
import React, { useState, useEffect, FC } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../redux/ReduxStore';
import ChatListLine from '../../components/ChatListLine';

const MessagesScreen: FC = () => {

    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const [chats, setChats] = useState<any[]>([])

    useEffect(() => {
        const q = query(
            collection(db, "chats"),
            where("users", "array-contains", profileModel?.id)
        )
        return onSnapshot(q, (querySnapshot) => {
            setChats(querySnapshot.docs);
        });
    }, []);

    return (
        <View style={styles.view}>
            {chats.map((chat, index) => (
                <ChatListLine
                    key={index}
                    userId={chat.data().users.find((x: any) => x !== profileModel?.id)}
                    lastMessage={chat.data() && chat.data().messages && chat.data().messages.length > 0 ? chat.data().messages[0].text : undefined}
                    chatId={chat.id} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        marginHorizontal:10
    }
})

export default MessagesScreen;
import React, { useState, useEffect, FC } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';


const MessagingScreen: FC = () => {
    
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const [messages, setMessages] = useState([])
    const [uid, setUid] = useState("")
    const name = route.params && route.params.name
    
    useEffect(() => {
        navigation.setOptions({
            title: name
        })

        const subscriber = auth.onAuthStateChanged((user: any) => {
            setUid(user?.uid);
        });
        return subscriber;
    }, [])

    useEffect(() => {
        const refDoc = doc(db, 'chats/' + (route.params as any)?.chatId)
        return onSnapshot(refDoc, (snapshot) => {
            setMessages(snapshot.data()?.messages ?? []);
        })
    }, [(route.params as any)?.chatId])

    const onSend = (m = []) => {
        const docRef = doc(db, 'chats/' + (route.params as any)?.chatId)
        setDoc(docRef, {
            messages: GiftedChat.append(messages, m),
        }, { merge: true })
    }

    return (
        <GiftedChat
            messages={messages.map((x: any) => ({
                ...x,
                createdAt: x.createdAt?.toDate(),
            }))}
            onSend={(messages: any) => onSend(messages)}
            user={{
                _id: uid,
            }}
            renderAvatar={() => null}
            showAvatarForEveryMessage={true}
            placeholder='Mesaj yaz..'
        />
    )
}

export default MessagingScreen;
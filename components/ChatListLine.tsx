import React, { FC, useEffect, useState } from 'react'
import { Avatar, List } from 'react-native-paper'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { ProfileModel } from '../models/ProfileModel'
import NavigationConstants from '../navigation/NavigationConstants'
import { useNavigation } from '@react-navigation/native'

interface ChatListLineProps {
    userId: string,
    lastMessage: string,
    chatId: string
}

const ChatListLine: FC<ChatListLineProps> = ({ userId, lastMessage, chatId }) => {

    const navigation = useNavigation<any>()
    const [profileModelState, setProfileModelState] = useState<ProfileModel>()

    useEffect(() => {
        const fetchUserDetail = async () => {
            const q = query(collection(db, "users"), where('id', "==", userId))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setProfileModelState(doc.data() as ProfileModel)
            })
        }
        fetchUserDetail()
    }, [])

    return (
        <List.Item
            title={profileModelState?.name}
            description={lastMessage}
            descriptionNumberOfLines={1}
            left={() =>
                <Avatar.Image source={{ uri: profileModelState?.profilePhoto }} size={50} />}
            onPress={() => navigation.navigate(NavigationConstants.messaging, { chatId: chatId, name: profileModelState?.name })}
        />
    )
}

export default ChatListLine

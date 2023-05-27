import { StyleSheet, Text, View, Image, Dimensions, Keyboard, Touchable } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Avatar } from 'react-native-paper'
import colors from '../utilies/colors'
import NavigationConstants from '../navigation/NavigationConstants'
import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { ProfileModel } from '../models/ProfileModel'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface CommentLineProps {
    userId: string,
    description: string
}

const CommentLine: FC<CommentLineProps> = ({ userId, description }) => {

    const navigation = useNavigation<any>()
    const [profileModelState, setProfileModelState] = useState<ProfileModel>()

    useEffect(() => {
        fetchUserDetail()
    }, [])


    const fetchUserDetail = async () => {
        const q = query(collection(db, "users"), where('id', "==", userId))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setProfileModelState(doc.data() as ProfileModel)
        })
    }

    return (
        <View style={styles.card}>
            <View style={styles.viewRow}>
                {
                    profileModelState &&
                    <>
                        <TouchableOpacity onPress={()=> navigation.push(NavigationConstants.profile, {id: userId})}>
                            <Avatar.Image size={35} source={{ uri: profileModelState.profilePhoto }} style={styles.avatar} />
                        </TouchableOpacity>
                        <View style={styles.viewColumn}>
                            <Text style={styles.userNameText}>{profileModelState.userName}</Text>
                            <Text style={styles.description}>{description}</Text>
                        </View>
                    </>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        marginHorizontal: 5,
        marginTop: 10,
        padding: 5,
    },
    viewRow: {
        flexDirection: 'row',
    },
    avatar: {
        backgroundColor: colors.white
    },
    viewColumn: {
        marginLeft: 10
    },
    userNameText: {
        fontSize: 13,
        fontWeight: '500',
    },
    description: {
        width: Dimensions.get('window').width - 65

    }
})

export default CommentLine


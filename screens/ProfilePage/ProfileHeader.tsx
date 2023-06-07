import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Avatar } from 'react-native-paper'
import colors from '../../utilies/colors'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationState } from '../../redux/ReduxStore'
import { FieldValue, addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import ProfileReducer from '../../redux/reducers/ProfileReducer'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import NavigationConstants from '../../navigation/NavigationConstants'
import LoginReducer from '../../redux/reducers/LoginReducer'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileHeaderProps {
    id: string,
    name: string,
    userName: string,
    profilePhoto: string,
    headerPhoto: string,
    following: string[],
    followers: string[],
    otherProfile: boolean
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ id, name, userName, profilePhoto, headerPhoto, following, followers, otherProfile }) => {

    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const [isFollowing, setIsFollowing] = useState(false)
    const dispatch = useDispatch<any>()
    const navigation = useNavigation<any>()
    const [isExist1, setIsExist1] = useState<boolean>()
    const [isExist2, setIsExist2] = useState<boolean>()


    useEffect(() => {
        const isFollowing = () => {
            const isExists = followers.includes(profileModel!.id)
            setIsFollowing(isExists)
        }

        isFollowing()

    }, [])

    useEffect(() => {
        if (isExist1 === false && isExist2 === false) {
            createChat()
        }

    }, [isExist1, isExist2])

    const onPressFollow = async () => {

        if (isFollowing) {

            const newFollowers: FieldValue = arrayRemove(profileModel!.id)
            const docData = {
                followers: newFollowers,
            }
            await updateDoc(doc(db, "users", id), docData).then(
                async () => {
                    const newFollowing: FieldValue = arrayRemove(id)
                    const docData = {
                        following: newFollowing,
                    }
                    await updateDoc(doc(db, "users", profileModel!.id), docData)
                    dispatch(ProfileReducer.getProfile())
                }
            )
        } else {
            const newFollowers: FieldValue = arrayUnion(profileModel!.id)
            const docData = {
                followers: newFollowers
            }
            await updateDoc(doc(db, "users", id), docData).then(
                async () => {
                    const newFollowing: FieldValue = arrayUnion(id)
                    const docData = {
                        following: newFollowing,
                    }
                    await updateDoc(doc(db, "users", profileModel!.id), docData)
                    dispatch(ProfileReducer.getProfile())
                }
            )
        }
        setIsFollowing(!isFollowing)
    }

    const goBack = () => {
        navigation.pop();
    }

    const onPressMessage = async () => {
        const q1 = query(
            collection(db, "chats"),
            where("users", "==", [profileModel?.id, id]
            ))

        const querySnapshot1 = await getDocs(q1)

        if (querySnapshot1.empty) {
            setIsExist1(false)
        } else {
            querySnapshot1.docs.map(
                (item) =>
                    navigation.navigate(NavigationConstants.messaging, { chatId: item.id, name })
            )
        }

        const q2 = query(
            collection(db, "chats"),
            where("users", "==", [id, profileModel?.id]
            ))

        const querySnapshot2 = await getDocs(q2)

        if (querySnapshot2.empty) {
            setIsExist2(false)
        } else {
            querySnapshot2.docs.map(
                (item) =>
                    navigation.navigate(NavigationConstants.messaging, { chatId: item.id, name })
            )
        }
    }

    const createChat = async () => {
        const chatListRef = collection(db, "chats")
        const response = await addDoc(chatListRef, {
            users: [id, profileModel?.id]
        });
        navigation.navigate(NavigationConstants.messaging, { chatId: response.id, name });
    }

    const onPressLogout = async () => {
        await AsyncStorage.setItem('email', "")
        await AsyncStorage.setItem('password', "")
        await auth.signOut()
        dispatch(LoginReducer.setIsLoggedIn(false))
    }

    return (
        <View>
            <Image style={styles.headerImage} source={{ uri: headerPhoto }} />
            {
                otherProfile ?
                    <TouchableOpacity style={styles.backButton}
                        onPress={goBack}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    :
                    <></>
            }
            <View style={styles.profileImageView} />
            <Avatar.Image size={70} style={styles.profileImage} source={{ uri: profilePhoto }} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.userName}>@{userName}</Text>
            {
                profileModel!.id === id ?
                    <>
                        <View style={styles.editAndFollowingButtonView}>
                            <TouchableOpacity onPress={() => navigation.navigate(NavigationConstants.profileEdit)}>
                                <Text style={styles.editAndFollowingtButtonText}>Profili Düzenle</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.messageAndLogoutButton}>
                            <TouchableOpacity onPress={() => onPressLogout()}>
                                <Ionicons name="power" size={18} color="red" />
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    <>
                        <View style={styles.messageAndLogoutButton}>
                            <TouchableOpacity onPress={() => onPressMessage()}>
                                <Ionicons name="mail-outline" size={18} color="black" />
                            </TouchableOpacity>
                        </View>
                        {isFollowing
                            ?
                            <View style={styles.editAndFollowingButtonView}>
                                <TouchableOpacity onPress={onPressFollow}>
                                    <Text style={styles.editAndFollowingtButtonText}>Takip ediliyor</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.followButtonView}>
                                <TouchableOpacity onPress={onPressFollow}>
                                    <Text style={styles.followButtonText}>Takip et</Text>
                                </TouchableOpacity>
                            </View>}
                    </>
            }
            <View style={styles.viewRow} >
                <TouchableOpacity style={styles.followAndFollowerButton} onPress={() => navigation.push(NavigationConstants.followingAndFollowersScreen, { userName, followers, following, initialTab: 'following' })} >
                    <Text style={styles.followAndFollowerCountText}>{following.length}</Text>
                    <Text style={styles.followAndFollowerText}> Takip edilen  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followAndFollowerButton} onPress={() => navigation.push(NavigationConstants.followingAndFollowersScreen, { userName, followers, following, initialTab: 'followers' })} >
                    <Text style={styles.followAndFollowerCountText}>{followers.length}</Text>
                    <Text style={styles.followAndFollowerText}> Takipçi</Text>
                </TouchableOpacity>
            </View>
        </View >)
}

const styles = StyleSheet.create({
    headerImage: {
        height: 150,
        backgroundColor: colors.white
    },
    profileImageView: {
        height: 76,
        width: 76,
        marginTop: 115,
        marginLeft: 20,
        position: 'absolute',
        backgroundColor: colors.white,
        borderRadius: 38,
    },
    profileImage: {
        marginTop: 118,
        marginLeft: 23,
        position: 'absolute',
        backgroundColor: colors.white
    },
    name: {
        marginTop: 40,
        marginLeft: 20,
        fontSize: 18,
        fontWeight: '700'
    },
    userName: {
        marginTop: 3,
        marginLeft: 20,
        fontSize: 15,
        color: colors.grey
    },
    editAndFollowingButtonView: {
        position: 'absolute',
        marginTop: 160,
        marginLeft: Dimensions.get('window').width - 140,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colors.lightGrey,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editAndFollowingtButtonText: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        fontSize: 13,
        fontWeight: '600'
    },
    followButtonView: {
        position: 'absolute',
        marginTop: 160,
        marginLeft: Dimensions.get('window').width - 140,
        borderRadius: 20,
        backgroundColor: colors.black,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center'
    },
    followButtonText: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        fontSize: 13,
        fontWeight: '600',
        color: colors.white
    },
    viewRow: {
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center'
    },
    followAndFollowerText: {
        color: colors.grey
    },
    followAndFollowerCountText: {
        fontWeight: '700',
    },
    followAndFollowerButton: {
        flexDirection: 'row',
        marginTop: 10
    }, backButton: {
        position: 'absolute',
        marginTop: 30,
        marginLeft: 20,
        backgroundColor: colors.white,
        borderRadius: 10
    },
    messageAndLogoutButton: {
        position: 'absolute',
        marginTop: 160,
        marginLeft: Dimensions.get('window').width - 176,
        height: 32,
        width: 32,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProfileHeader
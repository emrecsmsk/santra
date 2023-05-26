import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Avatar } from 'react-native-paper'
import colors from '../../utilies/colors'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationState } from '../../redux/ReduxStore'
import { FieldValue, arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import ProfileReducer from '../../redux/reducers/ProfileReducer'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import NavigationConstants from '../../navigation/NavigationConstants'

interface ProfileHeaderProps {
    id: string,
    name: string,
    userName: string,
    profilePhoto: string,
    headerPhoto: string,
    following: string[],
    followers: string[],
    isSearched: boolean,
    otherProfile: boolean
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ id, name, userName, profilePhoto, headerPhoto, following, followers, isSearched, otherProfile }) => {

    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const [isFollowing, setIsFollowing] = useState(false)
    const dispatch = useDispatch<any>()
    const navigation = useNavigation<any>()


    useEffect(() => {
        const isFollowing = () => {
            const isExists = followers.includes(profileModel!.id)
            setIsFollowing(isExists)
        }

        isFollowing()

    }, [])

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

    return (
        <View>
            <Image style={styles.headerImage} source={{ uri: headerPhoto }} />
            {
                isSearched || otherProfile ?
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
                    <View style={styles.editAndFollowingButtonView}>
                        <TouchableOpacity onPress={() => navigation.navigate(NavigationConstants.profileEdit)}>
                            <Text style={styles.editAndFollowingtButtonText}>Profili Düzenle</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    isFollowing
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
                        </View>
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
    }

})

export default ProfileHeader
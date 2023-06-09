import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Avatar, Card } from 'react-native-paper'
import colors from '../utilies/colors'
import { Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ApplicationState } from '../redux/ReduxStore'
import { FieldValue, arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { ProfileModel } from '../models/ProfileModel'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import NavigationConstants from '../navigation/NavigationConstants'


interface PostProps {
    postId: string,
    userId: string,
    postPhoto: string,
    description: string,
    likes: string[]
    comments: CommentModel[]
}

const Post: FC<PostProps> = ({ postId, userId, postPhoto, description, likes, comments }) => {

    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const [stateIsLiked, setStateIsLiked] = useState(false)
    const [stateLikeCount, setStateLikeCount] = useState(likes.length)
    const [stateCommentCount, setStateCommentCount] = useState(comments.length)
    const [profileModelState, setProfileModelState] = useState<ProfileModel>()
    const navigation = useNavigation<any>()


    useEffect(() => {
        fetchUserDetail()

        const isLiked = () => {
            const isExists = likes.includes(profileModel!.id)
            setStateIsLiked(isExists)
        }

        isLiked()

    }, [])

    const fetchUserDetail = async () => {
        const q = query(collection(db, "users"), where('id', "==", userId))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setProfileModelState(doc.data() as ProfileModel)
        })
    }

    const onPressLike = async () => {
        if (stateIsLiked) {

            const newLikes: FieldValue = arrayRemove(profileModel!.id)
            const docData = {
                likes: newLikes,
            }
            await updateDoc(doc(db, "posts", postId), docData)
        } else {
            const newLikes: FieldValue = arrayUnion(profileModel!.id)
            const docData = {
                likes: newLikes
            }
            await updateDoc(doc(db, "posts", postId), docData)
        }
        setStateIsLiked(!stateIsLiked)
        stateIsLiked ? setStateLikeCount(stateLikeCount - 1) : setStateLikeCount(stateLikeCount + 1)
    }

    return (
        <>
            {profileModelState &&
                <Card onPress={(_) => console.log('posta tıklandı')} elevation={1}>
                    <View style={styles.view}>
                        <View style={styles.viewRow}>
                            <TouchableOpacity onPress={() => navigation.navigate(NavigationConstants.profile, { id: userId })}>
                                <Avatar.Image size={45} source={{ uri: profileModelState?.profilePhoto }} style={styles.avatar} />
                            </TouchableOpacity>
                            <View style={styles.viewColumn}>
                                <View style={styles.viewRow}>
                                    <Text style={styles.name} numberOfLines={1}>{profileModelState.name}</Text>
                                    <Text style={styles.userName} numberOfLines={1}>@{profileModelState.userName}</Text>
                                </View>
                                <Text style={styles.description}>{description}</Text>
                                {
                                    postPhoto && <Image style={styles.postPhoto} source={{ uri: postPhoto }} />
                                }
                                <View style={styles.viewButtons}>
                                    <TouchableOpacity onPress={() => (onPressLike())}>
                                        <Ionicons name={stateIsLiked ? "heart" : "heart-outline"} size={24} color={stateIsLiked ? colors.red : colors.grey} />
                                    </TouchableOpacity>
                                    <Text style={stateIsLiked ? styles.countRed : styles.countGrey}>{stateLikeCount}</Text>
                                    <TouchableOpacity style={styles.commentButton} onPress={() => (navigation.push(NavigationConstants.comments, { postId }))}>
                                        <Ionicons name={"chatbox-outline"} size={24} color={colors.grey} />
                                    </TouchableOpacity>
                                    <Text style={styles.countGrey}>{stateCommentCount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Card>
            }
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white
    },
    view: {
        backgroundColor: colors.white,
        padding: 10,
    },
    viewRow: {
        flexDirection: 'row',
    },
    viewButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        width: Dimensions.get('window').width - 75,

    },
    viewColumn: {
        flexDirection: 'column',
        paddingLeft: 10,
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
        maxWidth: (Dimensions.get('window').width - 65) / 2
    },
    userName: {
        paddingLeft: 5,
        fontSize: 15,
        color: colors.grey,
        maxWidth: ((Dimensions.get('window').width - 65) / 2) - 5
    },
    description: {
        fontSize: 15,
        paddingRight: 45,
        paddingBottom: 5,
    },
    postPhoto: {
        height: 200,
        width: Dimensions.get('window').width - 75,
        borderRadius: 10
    },
    saveButton: {
        flex: 1,
        alignItems: 'flex-end',
    },
    commentButton: {
        paddingLeft: 20,
    },
    countGrey: {
        paddingLeft: 2,
        fontSize: 15,
        color: colors.grey,
    },
    countRed: {
        paddingLeft: 2,
        fontSize: 15,
        color: colors.red
    },
    avatar: {
        backgroundColor: colors.white
    }
})

export default Post


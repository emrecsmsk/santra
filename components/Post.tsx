import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import { Avatar, Card } from 'react-native-paper'
import colors from '../utilies/colors'
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface PostProps {
    name: string,
    userName: string,
    profilePhoto: string,
    postPhoto: string,
    description: string,
    isLiked: boolean,
    isSaved: boolean,
    likeCount: number,
    commentCount: number
}

const Post: FC<PostProps> = ({ name, userName, profilePhoto, postPhoto, description, isLiked, isSaved, likeCount, commentCount }) => {

    const [stateIsLiked, setStateIsLiked] = useState(isLiked)
    const [stateLikeCount, setStateLikeCount] = useState(likeCount)
    const [stateCommentCount, setStateCommentCount] = useState(commentCount)
    const [stateIsSaved, setStateIsSaved] = useState(isSaved)


    const onTapLike = () => {
        setStateIsLiked(!stateIsLiked)
        stateIsLiked ? setStateLikeCount(stateLikeCount - 1) : setStateLikeCount(stateLikeCount + 1)
    }
    const onTapSave = () => {
        setStateIsSaved(!stateIsSaved)
    }

    return (
        <Card onPress={(_) => console.log('posta tıklandı')} elevation={1}>
            <View style={styles.view}>
                <View style={styles.viewRow}>
                    <Avatar.Image size={45} source={{ uri: profilePhoto }} />
                    <View style={styles.viewColumn}>
                        <View style={styles.viewRow}>
                            <Text style={styles.name} numberOfLines={1}>{name}</Text>
                            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
                        </View>
                        <Text style={styles.description}>{description}</Text>
                        <Image style={styles.postPhoto} source={{ uri: postPhoto }} />
                        <View style={styles.viewButtons}>
                            <TouchableOpacity onPress={() => (onTapLike())}>
                                <Ionicons name={stateIsLiked ? "heart" : "heart-outline"} size={24} color={stateIsLiked ? colors.red : colors.grey} />
                            </TouchableOpacity>
                            <Text style={stateIsLiked ? styles.countRed : styles.countGrey}>{stateLikeCount}</Text>
                            <TouchableOpacity style={styles.commentButton} onPress={() => (console.log('comment'))}>
                                <Ionicons name={"chatbox-outline"} size={24} color={colors.grey} />
                            </TouchableOpacity>
                            <Text style={styles.countGrey}>{stateCommentCount}</Text>
                            <TouchableOpacity style={styles.saveButton} onPress={() => (onTapSave())}>
                                <Ionicons name={stateIsSaved ? "bookmark" : "bookmark-outline"} size={24} color={stateIsSaved ? colors.black : colors.grey} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Card>
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
    }
})

export default Post


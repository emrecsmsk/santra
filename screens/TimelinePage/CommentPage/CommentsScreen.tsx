import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View, Text, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useRoute } from '@react-navigation/native'
import { PostModel } from '../../../models/PostModel'
import CommentLine from '../../../components/CommentLine'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../../../redux/ReduxStore'
import colors from '../../../utilies/colors'
import { Avatar } from 'react-native-paper'
import { useHeaderHeight } from '@react-navigation/elements'

const CommentsScreen: FC = () => {

    const route = useRoute<any>()
    const postId: string = route.params && route.params.postId
    const [comments, setComments] = useState<CommentModel[]>([])
    const [comment, setComment] = useState<string>('')
    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const height = useHeaderHeight()

    useEffect(() => {
        fetchComments()
    }, [])

    const fetchComments = async () => {
        const q = query(collection(db, "posts"),
            where('postId', "==", postId))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const post = doc.data() as PostModel
            setComments(post.comments)
        })
    }

    const shareComment = () => {
        if (comment.length > 0) {
            setComment('')
            const newComment = {
                createdAt: new Date(),
                userId: profileModel!.id,
                description: comment!
            }
            setComments([...comments, newComment])
            const docData = {
                comments: [...comments, newComment]
            }
            updateDoc(doc(db, "posts", postId), docData).then(
            )
        }
    }

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={height!}
            behavior="height"
            style={styles.view}
            enabled>
            {
                comments &&
                <ScrollView>
                    {comments.map(
                        (item, index) =>
                            <CommentLine key={index} userId={item.userId} description={item.description} />
                    )}
                </ScrollView>
            }
            <View style={styles.bottomView}>
                <Avatar.Image size={40} source={{ uri: profileModel!.profilePhoto }} style={styles.avatar} />
                <View style={styles.inputView}>
                    <TextInput
                        placeholder='Yanıtla..'
                        style={styles.input}
                        value={comment}
                        onChangeText={setComment}
                    />
                    <TouchableOpacity onPress={() => shareComment()}>
                        <Text style={styles.shareText}>Paylaş</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    view: {
        flex: 1
    },
    bottomView: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        width: Dimensions.get('window').width - 20,
        marginHorizontal: 10,
        alignItems: 'center',
        height: 45
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width - 65,
        height: 35,
        marginLeft: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 15,
    },
    input: {
        width: Dimensions.get('window').width - 130,
        marginLeft: 5

    },
    avatar: {
        backgroundColor: colors.white
    },
    shareText: {
        color: colors.azure,
        fontWeight: 'bold',
    }
})

export default CommentsScreen
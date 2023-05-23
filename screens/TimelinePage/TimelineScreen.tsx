import React, { FC, useCallback, useEffect, useState } from 'react'
import Post from '../../components/Post'
import { FlatList } from 'react-native-gesture-handler'
import { DocumentData, QueryDocumentSnapshot, collection, getDocs, limit, onSnapshot, orderBy, query, startAfter, startAt, where } from 'firebase/firestore'
import { PostModel } from '../../models/PostModel'
import { db } from '../../firebase'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../../redux/ReduxStore'
import { RefreshControl } from 'react-native'

const TimelineScreen: FC = () => {

  var posts: PostModel[]
  const [postModelState, setPostModelState] = useState<PostModel[]>([])
  const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
  const [refreshing, setRefreshing] = useState(false)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData>>()

  useEffect(() => {

    fetchPosts()

  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    posts = []
    setPostModelState(posts)
    fetchPosts()
    setTimeout(() => {
      setRefreshing(false)
    }, 200);
  }, []);



  const fetchPosts = async () => {
    const q = query(collection(db, "posts"),
      where('userId', "in", [...profileModel!.following, profileModel!.id]),
      orderBy("createdAt", "desc"),
      limit(25)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      posts == undefined ?
        posts = [doc.data() as PostModel]
        :
        posts = [...posts, doc.data() as PostModel]
    })
    setPostModelState(posts)
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
  }

  const fetchMorePosts = async () => {
    const q = query(
      collection(db, "posts"),
      where("userId", "in", [...profileModel!.following, profileModel!.id]),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(25)
    )

    const querySnapshot = await getDocs(q)
    var updatedPosts: PostModel[]
    querySnapshot.forEach((doc) => {
      updatedPosts == undefined ?
        updatedPosts = [doc.data() as PostModel]
        :
        updatedPosts = [...updatedPosts, doc.data() as PostModel]
    })

    setPostModelState([...postModelState, ...updatedPosts!])
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
  }



  return (
    <>
      {
        postModelState &&
        <FlatList
          data={postModelState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => <Post postId={item.postId} userId={item.userId} postPhoto={item.postPhoto} description={item.description} likes={item.likes} isSaved={false} likeCount={0} commentCount={0} />}
          onEndReached={fetchMorePosts}
        />
      }
    </>



  )
}

export default TimelineScreen
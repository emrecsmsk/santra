import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import Post from '../../components/Post'
import { DocumentData, QueryDocumentSnapshot, collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import { PostModel } from '../../models/PostModel'
import { db } from '../../firebase'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../../redux/ReduxStore'
import { FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native'
import { FAB } from 'react-native-paper'
import colors from '../../utilies/colors'
import { useNavigation } from '@react-navigation/native'
import NavigationConstants from '../../navigation/NavigationConstants'
import LottieView from 'lottie-react-native'


const TimelineScreen: FC = () => {

  var posts: PostModel[]
  const [postModelState, setPostModelState] = useState<PostModel[]>()
  const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
  const [refreshing, setRefreshing] = useState(false)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData>>()
  const navigation = useNavigation<any>()
  const animation = useRef(null)

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

    setPostModelState([...postModelState!, ...updatedPosts!])
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
  }



  return (
    <>
      {
        postModelState && postModelState == undefined ?
          <View style={styles.loadingView}>
            <LottieView
              autoPlay
              ref={animation}
              style={styles.lottieLoading}
              source={require('../../assets/loading.json')}
            />
          </View>
          :
          <>
            <FlatList
              data={postModelState}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => <Post postId={item.postId} userId={item.userId} postPhoto={item.postPhoto} description={item.description} likes={item.likes} isSaved={false} comments={item.comments} />}
              onEndReached={fetchMorePosts}
            />
            <FAB
              icon="plus"
              color='white'
              style={styles.fab}
              onPress={() => navigation.navigate(NavigationConstants.sharePost)}
            />
          </>
      }
    </>
  )
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lottieLoading: {
    width: 200,
    height: 200
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    rippleColor: colors.white
  },
})


export default TimelineScreen
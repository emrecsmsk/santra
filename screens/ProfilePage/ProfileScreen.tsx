import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import ProfileDetail from './ProfileDetail'
import Post from '../../components/Post'
import ProfileHeader from './ProfileHeader'
import { RefreshControl, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../../redux/ReduxStore'
import { collection, getDocs, query, where, limit, QueryDocumentSnapshot, DocumentData, orderBy, startAfter } from 'firebase/firestore'
import { db } from '../../firebase'
import { ProfileModel } from '../../models/ProfileModel'
import { useRoute } from '@react-navigation/native'
import { PostModel } from '../../models/PostModel'
import LottieView from 'lottie-react-native'

const ProfileScreen: FC = () => {

  const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
  const [profileModelState, setProfileModelState] = useState<ProfileModel>()
  var posts: PostModel[]
  const [postModelState, setPostModelState] = useState<PostModel[]>([])
  const route = useRoute<any>()
  const id: string = route.params && route.params.id
  const isSearched: boolean = route.params && route.params.id
  const animation = useRef(null)
  const [otherProfile, setOtherProfile] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData>>()

  useEffect(() => {
    const fetchProfile = async () => {

      if (id === undefined) {
        setOtherProfile(false)
        setProfileModelState(profileModel)
        fetchPosts(profileModel!.id).then(() => setPostModelState(posts))

      } else {
        setOtherProfile(true)
        const q = query(collection(db, "users"), where('id', "==", id))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setProfileModelState(doc.data() as ProfileModel)
        })
        fetchPosts(id).then(() => setPostModelState(posts))
      }
    }
    fetchProfile()
  }, [profileModel])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    posts = []
    setPostModelState(posts)
    if (id === undefined) {
      fetchPosts(profileModel!.id).then(() => setPostModelState(posts))
    }
    else {
      fetchPosts(id).then(() => setPostModelState(posts))
    }

    setTimeout(() => {
      setRefreshing(false)
    }, 200);
  }, []);

  const fetchPosts = async (id: string) => {
    const q = query(collection(db, "posts"),
      where('userId', "==", id),
      orderBy("createdAt", "desc"),
      limit(25))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      posts == undefined ?
        posts = [doc.data() as PostModel]
        :
        posts = [...posts, doc.data() as PostModel]
    })
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
  }

  const fetchMorePosts = async (id: string) => {
    const q = query(collection(db, "posts"),
      where('userId', "==", id),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(25))
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
    <View style={{ flex: 1 }}>
      {profileModelState == undefined ?
        <View style={styles.loadingView}>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.lottieLoading}
            source={require('../../assets/loading.json')}
          />
        </View>
        :
        <Tabs.Container
          renderHeader={() => (
            <ProfileHeader id={profileModelState.id} name={profileModelState.name} userName={profileModelState.userName} profilePhoto={profileModelState.profilePhoto} headerPhoto={profileModelState.headerPhoto} following={profileModelState.following} followers={profileModelState.followers} otherProfile={otherProfile} />
          )}
          minHeaderHeight={30}
        >
          <Tabs.Tab name="information" label={"Oyuncu Bilgileri"}>
            <Tabs.ScrollView >
              <ProfileDetail teams={profileModelState.teams} birth={profileModelState.birth} height={profileModelState.height} preferredFoot={profileModelState.preferredFoot} position={profileModelState.position} shirtNumber={profileModelState.shirtNumber} />
            </Tabs.ScrollView>
          </Tabs.Tab>
          <Tabs.Tab name="posts" label={"Gönderiler"}>
            {postModelState &&
              <Tabs.FlatList
                data={postModelState}
                keyExtractor={item => item.postId}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={({ item }) => <Post postId={item.postId} userId={item.userId} postPhoto={item.postPhoto} description={item.description} likes={item.likes} comments={item.comments} />}
                onEndReached={() => fetchMorePosts(profileModel!.id)}
              />
            }
          </Tabs.Tab>
        </Tabs.Container >
      }
    </View >
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
})

export default ProfileScreen
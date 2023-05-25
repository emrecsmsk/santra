import React, { FC, useEffect, useRef, useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import LottieView from 'lottie-react-native'
import { View, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { DocumentData, QueryDocumentSnapshot, collection, getDocs, limit, query, startAfter, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { ProfileModel } from '../../../models/ProfileModel'
import SearchLine from '../../../components/SearchLine'



const FollowingAndFollowersScreen: FC = () => {

    const animation = useRef(null)
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const userName: string = route.params && route.params.userName
    const followers: string[] = route.params && route.params.followers
    const following: string[] = route.params && route.params.following
    const initialTab: string = route.params && route.params.initialTab
    const [loading, setLoading] = useState(true)
    const [lastVisibleFollowing, setLastVisibleFollowing] = useState<QueryDocumentSnapshot<DocumentData>>()
    const [lastVisibleFollowers, setLastVisibleFollowers] = useState<QueryDocumentSnapshot<DocumentData>>()
    const [followingUsersState, setFollowingUsersState] = useState<ProfileModel[]>()
    const [followerUsersState, setFollowerUsersState] = useState<ProfileModel[]>()
    var followingUsers: ProfileModel[]
    var followerUsers: ProfileModel[]

    useEffect(() => {
        setShareButton()
        fetchUsers()
    }, [])

    const setShareButton = () => {
        navigation.setOptions({
            title: userName
        })
    }

    const fetchUsers = async () => {
        const q = query(collection(db, "users"),
            where('id', "in", following),
            limit(25)
        )
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            followingUsers == undefined ?
                followingUsers = [doc.data() as ProfileModel]
                :
                followingUsers = [...followingUsers, doc.data() as ProfileModel]
        })
        setFollowingUsersState(followingUsers)
        setLastVisibleFollowing(querySnapshot.docs[querySnapshot.docs.length - 1])

        const q1 = query(collection(db, "users"),
            where('id', "in", followers),
            limit(25)
        )
        const querySnapshot1 = await getDocs(q1)
        querySnapshot1.forEach((doc) => {
            followerUsers == undefined ?
                followerUsers = [doc.data() as ProfileModel]
                :
                followerUsers = [...followerUsers, doc.data() as ProfileModel]
        })
        setFollowerUsersState(followerUsers)
        setLastVisibleFollowers(querySnapshot1.docs[querySnapshot1.docs.length - 1])
        setLoading(false)
    }

    const fetchMoreUsers = async () => {
        const q = query(
            collection(db, "users"),
            where("id", "in", following),
            startAfter(lastVisibleFollowing),
            limit(25)
        )

        const querySnapshot = await getDocs(q)
        var updatedFollowing: ProfileModel[]
        querySnapshot.forEach((doc) => {
            updatedFollowing == undefined ?
                updatedFollowing = [doc.data() as ProfileModel]
                :
                updatedFollowing = [...updatedFollowing, doc.data() as ProfileModel]
        })

        setFollowingUsersState([...followerUsersState!, ...updatedFollowing!])
        setLastVisibleFollowing(querySnapshot.docs[querySnapshot.docs.length - 1])

        const q1 = query(
            collection(db, "users"),
            where("id", "in", followers),
            startAfter(lastVisibleFollowers),
            limit(25)
        )

        const querySnapshot1 = await getDocs(q1)
        var updatedFollowers: ProfileModel[]
        querySnapshot1.forEach((doc) => {
            updatedFollowers == undefined ?
                updatedFollowers = [doc.data() as ProfileModel]
                :
                updatedFollowers = [...updatedFollowers, doc.data() as ProfileModel]
        })

        setFollowerUsersState([...followerUsersState!, ...updatedFollowers!])
        setLastVisibleFollowers(querySnapshot1.docs[querySnapshot1.docs.length - 1])
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ?
                <View style={styles.loadingView}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={styles.lottieLoading}
                        source={require('../../../assets/loading.json')}
                    />
                </View>
                :
                <Tabs.Container
                initialTabName={initialTab}
                >
                    <Tabs.Tab name="followers" label={"Takipçileri"}>
                        {followerUsersState &&
                            <Tabs.FlatList
                                data={followerUsersState}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <SearchLine id={item.id} photo={item.profilePhoto} userName={item.userName} name={item.name} position={item.position} shirtNumber={item.shirtNumber} type={'user'} />
                                }
                            />
                        }
                    </Tabs.Tab>
                    <Tabs.Tab name="following" label={"Takip ettikleri"}>
                        {followingUsersState &&
                            <Tabs.FlatList
                                data={followerUsersState}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <SearchLine id={item.id} photo={item.profilePhoto} userName={item.userName} name={item.name} position={item.position} shirtNumber={item.shirtNumber} type={'user'} />}
                                onEndReached={fetchMoreUsers}
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


export default FollowingAndFollowersScreen

import React, { FC, useEffect } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import ProfileDetail from './ProfileDetail'
import Post from '../../components/Post'
import ProfileHeader from './ProfileHeader'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationState } from '../../redux/ReduxStore'
import ProfileReducer from '../../redux/reducers/ProfileReducer'

const data = [
  {
    name: 'Emre Can Şimşek',
    userName: '@emrecansimsek',
    profilePhoto: 'https://picsum.photos/id/338/200',
    postPhoto: 'https://i.hizliresim.com/tnltjna.png',
    description: 'Sözüm ağır gelir.Neden diye sorma! Neden! Her bi hecede çığlık var hepsi bedduaya bedel. Ağır kalır geceler geçmez açsan eğer hemen. Faiz yiyen rahat uyusun boşver bu günlerde geçer! Karalanır defterler mum erirken gece.',
    isLiked: true,
    isSaved: false,
    likeCount: 1231,
    commentCount: 134
  },
  {
    name: 'Emre Can Şimşek',
    userName: '@emrecansimsek',
    profilePhoto: 'https://picsum.photos/id/338/200',
    postPhoto: 'https://i.hizliresim.com/tnltjna.png',
    description: 'Sözüm ağır gelir.Neden diye sorma! Neden! Her bi hecede çığlık var hepsi bedduaya bedel. Ağır kalır geceler geçmez açsan eğer hemen. Faiz yiyen rahat uyusun boşver bu günlerde geçer! Karalanır defterler mum erirken gece.',
    isLiked: false,
    isSaved: true,
    likeCount: 3234,
    commentCount: 256
  },
  {
    name: 'Emre Can Şimşek',
    userName: '@emrecansimsek',
    profilePhoto: 'https://picsum.photos/id/338/200',
    postPhoto: 'https://i.hizliresim.com/tnltjna.png',
    description: 'Sözüm ağır gelir.Neden diye sorma! Neden! Her bi hecede çığlık var hepsi bedduaya bedel. Ağır kalır geceler geçmez açsan eğer hemen. Faiz yiyen rahat uyusun boşver bu günlerde geçer! Karalanır defterler mum erirken gece.',
    isLiked: false,
    isSaved: true,
    likeCount: 3234,
    commentCount: 256
  },
  {
    name: 'Emre Can Şimşek',
    userName: '@emrecansimsek',
    profilePhoto: 'https://picsum.photos/id/338/200',
    postPhoto: 'https://i.hizliresim.com/tnltjna.png',
    description: 'Sözüm ağır gelir.Neden diye sorma! Neden! Her bi hecede çığlık var hepsi bedduaya bedel. Ağır kalır geceler geçmez açsan eğer hemen. Faiz yiyen rahat uyusun boşver bu günlerde geçer! Karalanır defterler mum erirken gece.',
    isLiked: false,
    isSaved: true,
    likeCount: 3234,
    commentCount: 256
  }
]

const ProfileScreen: FC = () => {

  const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
  const dispatch = useDispatch<any>()

  useEffect(() => {
    const fetchProfile = async () => {
      await dispatch(ProfileReducer.getProfile());
    }
    fetchProfile()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {profileModel &&
        <Tabs.Container
          renderHeader={() => (
            <ProfileHeader name={profileModel.name} userName={profileModel.userName} profilePhoto={''} />
          )}
          minHeaderHeight={30}
        >
          <Tabs.Tab name="information" label={"Oyuncu Bilgileri"}>
            <Tabs.ScrollView >
              <ProfileDetail />
            </Tabs.ScrollView>
          </Tabs.Tab>
          <Tabs.Tab name="posts" label={"Gönderiler"}>
            <Tabs.FlatList
              data={data}
              renderItem={({ item }) => <Post name={item.name} userName={item.userName} profilePhoto={item.profilePhoto} postPhoto={item.postPhoto} description={item.description} isLiked={item.isLiked} isSaved={item.isSaved} likeCount={item.likeCount} commentCount={item.commentCount} />}>
            </Tabs.FlatList>
          </Tabs.Tab>
        </Tabs.Container >
      }
    </View >
  )
}

export default ProfileScreen
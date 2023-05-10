import { View, Text } from 'react-native'
import React, { FC } from 'react'
import Post from '../../components/Post'
import { FlatList } from 'react-native-gesture-handler'

const TimelineScreen: FC = () => {

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
    }
  ]

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Post name={item.name} userName={item.userName} profilePhoto={item.profilePhoto} postPhoto={item.postPhoto} description={item.description} isLiked={item.isLiked} isSaved={item.isSaved} likeCount={item.likeCount} commentCount={item.commentCount} />}
    />


  )
}

export default TimelineScreen
import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { FootballCourtModel } from '../../../models/FootballCourtModel'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import SearchLine from '../../../components/SearchLine'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../../../redux/ReduxStore'

const FavoriteFootballCourts: FC = () => {

    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const [favoriteFootballCourts, setFavoriteFootballCourts] = useState<FootballCourtModel[]>()
    

    useEffect(() => {
        const fetchFavoriteFootballCourts = async () => {
            var favoriteFootballCourts: FootballCourtModel[]
            const q = query(collection(db, "footballCourts"),
                where('id', "in", profileModel?.favoriteFootballCourts)
            )
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (favoriteFootballCourts === undefined) {
                    favoriteFootballCourts = [doc.data() as FootballCourtModel]
                } else {
                    favoriteFootballCourts = [...favoriteFootballCourts, doc.data() as FootballCourtModel]
                }
            })
            setFavoriteFootballCourts(favoriteFootballCourts!)
        }
        fetchFavoriteFootballCourts()
    }, [])


    return (
        <View style={styles.view}>
            {
                favoriteFootballCourts &&
                <FlatList
                    data={favoriteFootballCourts}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <SearchLine id={item.id} photo={item.photos[0]} userName={item.name} type={'footballCourt'} />
                    }
                />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1
    }
})

export default FavoriteFootballCourts


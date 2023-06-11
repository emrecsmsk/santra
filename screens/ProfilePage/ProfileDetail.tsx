import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Card, Divider } from 'react-native-paper'
import colors from '../../utilies/colors'
import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { TeamModel } from '../../models/TeamModel'

interface ProfileDetailProps {
    teams: string[],
    birth: string,
    height: string,
    preferredFoot: string,
    position: string,
    shirtNumber: string,
}

const ProfileDetail: FC<ProfileDetailProps> = ({ teams, birth, height, preferredFoot, position, shirtNumber }) => {

    const [age, setAge] = useState('')
    var teamsTemp: TeamModel[]
    const [teamsState, setTeamsState] = useState<TeamModel[]>()

    useEffect(() => {
        fetchTeams()
        const calculateYearDifference = (birth: string) => {
            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()

            const dateParts = birth.split('/')
            const year = parseInt(dateParts[2], 10)
            const age = currentYear - year
            setAge(age.toString())
        }
        calculateYearDifference(birth);
    }, [])


    const fetchTeams = async () => {
        const q = query(collection(db, "teams"),
            where('teamId', "in", teams))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            teamsTemp == undefined ?
                teamsTemp = [doc.data() as TeamModel]
                :
                teamsTemp = [...teamsTemp, doc.data() as TeamModel]
        })
        setTeamsState(teamsTemp)
    }


    return (
        <View>
            <Card style={styles.cardView}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>Takımlar</Text>
                    <Divider style={{ width: 30, height: 1 }} />
                </View>
                {
                    teamsState?.map((item, index) =>
                        <View key={index} style={styles.viewRow}>
                            <Image style={styles.teamImage} resizeMode='contain' source={{ uri: item.teamPhoto }} />
                            <Text style={styles.teamText}>{item.name}</Text>
                        </View>)
                }
            </Card>
            <Card style={styles.cardView}>
                <View style={styles.titleView}>
                    <Text style={styles.titleView}>Oyuncu bilgileri</Text>
                    <Divider style={{ width: 30, height: 1 }} />
                </View>
                <View style={styles.descriptionViewTop} >
                    <View style={styles.descriptionDetailView} >
                        <Text style={styles.descriptionDetailText}>{age} YAŞ</Text>
                        <Text style={styles.descriptionText}>{birth}</Text>
                    </View>
                    <View style={styles.descriptionDetailView}>
                        <Text style={styles.descriptionDetailText}>{height} cm</Text>
                        <Text style={styles.descriptionText}>Boy</Text>
                    </View>
                </View>
                <View style={styles.descriptionViewBottom} >
                    <View style={styles.descriptionDetailView}>
                        <Text style={styles.descriptionDetailText}>{preferredFoot}</Text>
                        <Text style={styles.descriptionText}>Tercih Edilen Ayak</Text>
                    </View>
                    <View style={styles.descriptionDetailView}>
                        <Text style={styles.descriptionDetailText}>{position}</Text>
                        <Text style={styles.descriptionText}>Pozisyon</Text>
                    </View>
                    <View style={styles.descriptionDetailView} >
                        <Text style={styles.descriptionDetailText}>{shirtNumber}</Text>
                        <Text style={styles.descriptionText}>Forma Numarası</Text>
                    </View>
                </View>
            </Card>
            <Card style={styles.positionCardView}>

                <Image
                    style={{
                        width: Dimensions.get('window').width - 20,
                        height: (Dimensions.get('window').width - 20) * 421 / 612,
                    }}
                    source={
                        position === "GK" ?
                            require('../../assets/GK.png')
                            : position === "DF" ?
                                require('../../assets/DF.png')
                                : position === "OS" ?
                                    require('../../assets/OS.png')
                                    : require('../../assets/FW.png')
                    }
                />
            </Card>
        </View >

    )
}

const styles = StyleSheet.create({
    viewRow: {
        marginTop: 5,
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center'
    },
    cardView: {
        backgroundColor: colors.white,
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 10,
        padding: 10
    },
    positionCardView: {
        backgroundColor: colors.white,
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 10,
    },
    divider: {
        margin: 10,
        backgroundColor: colors.grey
    },
    descriptionViewTop: {
        flexDirection: 'row',
    },
    descriptionViewBottom: {
        flexDirection: 'row',
        marginTop: 10,
    },
    descriptionDetailView: {
        flex: 1,
        alignItems: 'center'
    },
    descriptionText: {
        color: colors.grey,
        fontSize: 12,
    },
    descriptionDetailText: {
        fontWeight: '700',
    },
    teamImage: {
        height: 50,
        width: 50,
    },
    teamText: {
        fontSize: 18,
        paddingLeft: 5,
        fontWeight: '400'
    },
    titleView: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    titleText: {
        fontWeight: '600',
        paddingBottom: 5
    }
})

export default ProfileDetail
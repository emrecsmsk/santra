import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React, { FC } from 'react'

interface MatchLineProps {
    firstTeam: string,
    secondTeam: string,
    firstTeamPhoto: string,
    secondTeamPhoto: string,
    time: string,
    date: string,
    isMatchFinished: boolean,
    score: string,
}

const MatchLine: FC<MatchLineProps> = ({ firstTeam, secondTeam, firstTeamPhoto, secondTeamPhoto, time, date, isMatchFinished, score }) => {
    return (
        <View style={styles.viewRow}>
            <Image style={styles.teamImage} resizeMode='contain' source={{ uri: firstTeamPhoto }} />
            <Text style={styles.firstTeamText} numberOfLines={1}>{firstTeam}</Text>
            {isMatchFinished ?
                <View style={styles.dateAndScoreView}>
                    <Text>{time}</Text>
                    <Text>{date}</Text>
                </View>
                :
                <View style={styles.dateAndScoreView}>
                    <Text>{score}</Text>
                </View>
            }
            <Text style={styles.secondTeamText} numberOfLines={1}>{secondTeam}</Text>
            <Image style={styles.teamImage} resizeMode='contain' source={{ uri: secondTeamPhoto }} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        marginBottom: 10,
    },
    teamImage: {
        height: 35,
        width: 35,
    },
    dateAndScoreView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 76
    },
    timeText: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstTeamText: {
        paddingLeft: 3,
        paddingRight: 10,
        width: ((Dimensions.get('window').width) / 2) - 86
    },
    secondTeamText: {
        paddingRight: 3,
        paddingLeft: 10,
        width: ((Dimensions.get('window').width) / 2) - 86,
    }
})

export default MatchLine


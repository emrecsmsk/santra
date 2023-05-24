import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React, { FC } from 'react'
import { Avatar, Card } from 'react-native-paper'
import colors from '../utilies/colors'
import NavigationConstants from '../navigation/NavigationConstants'
import { useNavigation } from '@react-navigation/native'

interface SearchLine {
    id: string,
    photo: string,
    userName: string,
    name?: string,
    position?: string,
    shirtNumber?: string,
    type: string
}

const SearchLine: FC<SearchLine> = ({ id, photo, userName, name, position, shirtNumber, type }) => {

    const navigation = useNavigation<any>()

    const onPress = () => {
        if (type === 'user') {
            const isSearched = true
            navigation.navigate(NavigationConstants.profile, { id, isSearched })
        }
    }

    return (
        <Card style={styles.card} onPress={onPress}>
            <View style={styles.viewRow}>
                <Avatar.Image size={45} source={{ uri: photo }} style={styles.avatar} />
                <View style={styles.viewColumn}>
                    <Text style={styles.userNameText}>{userName}</Text>
                    {name && <Text style={styles.nameText}>{name}</Text>}
                </View>
                {position && <Text style={styles.positionText}>{position}</Text>}
                {shirtNumber && <Text style={styles.shirtNumberText}>#{shirtNumber}</Text>}
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        marginHorizontal: 5,
        marginTop: 10,
        padding: 5
    },
    viewRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: colors.white
    },
    viewColumn: {
        marginLeft: 10
    },
    userNameText: {
        fontWeight: '500',
    },
    nameText: {
        fontSize: 12,
        color: colors.grey
    },
    positionText: {
        fontSize: 16,
        color: colors.black,
        fontWeight: '500',
        position: 'absolute',
        marginLeft: Dimensions.get('window').width - 90
    },
    shirtNumberText: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 'bold',
        position: 'absolute',
        marginLeft: Dimensions.get('window').width - 50
    }
})

export default SearchLine


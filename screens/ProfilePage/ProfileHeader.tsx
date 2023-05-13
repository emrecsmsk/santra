import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { Avatar } from 'react-native-paper'
import colors from '../../utilies/colors'

interface ProfileHeaderProps {
    name: string,
    userName: string,
    profilePhoto: string,
}

const ProfileHeader: FC<ProfileHeaderProps> = ({name, userName }) => {
    return (
        <View>
            <Image style={styles.headerImage} source={{ uri: 'https://picsum.photos/id/1/200' }} />
            <View style={styles.profileImageView} />
            <Avatar.Image size={70} style={styles.profileImage} source={{ uri: 'https://picsum.photos/id/338/200' }} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.userName}>@{userName}</Text>
            <View style={styles.editButtonView}>
                <TouchableOpacity >
                    <Text style={styles.editButtonText}>Profili Düzenle</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.viewRow} >
                <TouchableOpacity style={styles.followAndFollowerButton}  >
                    <Text style={styles.followAndFollowerCountText}>125</Text>
                    <Text style={styles.followAndFollowerText}> Takip edilen  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followAndFollowerButton}  >
                    <Text style={styles.followAndFollowerCountText}>67</Text>
                    <Text style={styles.followAndFollowerText}> Takipçi</Text>
                </TouchableOpacity>
            </View>
        </View>)
}

const styles = StyleSheet.create({
    headerImage: {
        height: 150,
    },
    profileImageView: {
        height: 76,
        width: 76,
        marginTop: 115,
        marginLeft: 20,
        position: 'absolute',
        backgroundColor: colors.white,
        borderRadius: 38
    },
    profileImage: {
        marginTop: 118,
        marginLeft: 23,
        position: 'absolute'
    },
    name: {
        marginTop: 40,
        marginLeft: 20,
        fontSize: 18,
        fontWeight: '700'
    },
    userName: {
        marginTop: 3,
        marginLeft: 20,
        fontSize: 15,
        color: colors.grey
    },
    editButtonView: {
        position: 'absolute',
        marginTop: 160,
        marginLeft: Dimensions.get('window').width - 140,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colors.lightGrey
    },
    editButtonText: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        fontSize: 13,
        fontWeight: '600'
    },
    viewRow: {
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center'
    },
    followAndFollowerText: {
        color: colors.grey
    },
    followAndFollowerCountText: {
        fontWeight: '700',
    },
    followAndFollowerButton: {
        flexDirection: 'row',
        marginTop: 10
    }
})

export default ProfileHeader
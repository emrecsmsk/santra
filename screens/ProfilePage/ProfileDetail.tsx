import { View, Text, StyleSheet, Image } from 'react-native'
import React, { FC } from 'react'
import { Divider } from 'react-native-paper'
import colors from '../../utilies/colors'
import MatchLine from '../../components/MatchLine'

const ProfileDetail: FC = () => {
    return (
        <View>
            <View style={styles.viewRow}>
                <Image style={styles.teamImage} resizeMode='contain' source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png' }} />
                <Text style={styles.teamText}>Galatasaray</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.descriptionViewTop} >
                <View style={styles.descriptionDetailView} >
                    <Text style={styles.descriptionDetailText}>22 YAŞ</Text>
                    <Text style={styles.descriptionText}>11.11.2000</Text>
                </View>
                <View style={styles.descriptionDetailView}>
                    <Text style={styles.descriptionDetailText}>180 cm</Text>
                    <Text style={styles.descriptionText}>Boy</Text>
                </View>
            </View>
            <View style={styles.descriptionViewBottom} >
                <View style={styles.descriptionDetailView}>
                    <Text style={styles.descriptionDetailText}>Sağ</Text>
                    <Text style={styles.descriptionText}>Tercih Edilen Ayak</Text>
                </View>
                <View style={styles.descriptionDetailView}>
                    <Text style={styles.descriptionDetailText}>DF</Text>
                    <Text style={styles.descriptionText}>Pozisyon</Text>
                </View>
                <View style={styles.descriptionDetailView} >
                    <Text style={styles.descriptionDetailText}>99</Text>
                    <Text style={styles.descriptionText}>Forma Numarası</Text>
                </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.matchHistoryTextView}>
                <Text style={styles.historyText}>Maç geçmişi</Text>
                <Divider style={{ width: 30, height: 1 }} />
            </View>
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={true} score={''} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
            <MatchLine firstTeam={'Galatasaray'} secondTeam={'Fenerbahçe'} firstTeamPhoto={'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galatasaray_Sports_Club_Logo.png/961px-Galatasaray_Sports_Club_Logo.png'} secondTeamPhoto={'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png'} time={'19.00'} date={'04.06.2023'} isMatchFinished={false} score={'2-1'} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewRow: {
        marginTop: 10,
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center'
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
    matchHistoryTextView: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    historyText: {
        fontWeight: '600',
        paddingBottom: 5
    }
})

export default ProfileDetail
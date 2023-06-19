import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../redux/ReduxStore';
import { TeamModel } from '../../../models/TeamModel';
import { useNavigation, useRoute } from '@react-navigation/native';
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../firebase';
import { ProfileModel } from '../../../models/ProfileModel';

const TeamDetailScreen: FC = () => {
  const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [team, setTeam] = useState<TeamModel>();
  const id = route.params.id;
  var teamPlayers: ProfileModel[]
  const [teamPlayersState, setteamPlayersState] = useState<ProfileModel[]>()

  useEffect(() => {
    navigation.setOptions({
      title: "Takım Ayrıntıları",
    });
    getTeamData()

  }, []);


  const getTeamData = async () => {
    const q = query(collection(db, "teams"),
      where('id', "==", id))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const team = doc.data() as TeamModel
      setTeam(team)
      getUserData(team)
    })
  };

  const getUserData = async (team: TeamModel) => {
    const q = query(collection(db, "users"),
      where("id", "in", team.players))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      teamPlayers == undefined ?
        teamPlayers = [doc.data() as ProfileModel]
        :
        teamPlayers = [...teamPlayers, doc.data() as ProfileModel]
    })
    setteamPlayersState(teamPlayers)

  };

  const handleJoinTeam = async () => {
    if (profileModel?.teams && profileModel.teams.length > 0) {
      Alert.alert("Zaten bir takımın mevcut")
      return;
    }
    const playerId = profileModel?.id;
    await updateDoc(doc(db, 'users', playerId), {
      teams: arrayUnion(id),
    }).then(
      async () => {
        await updateDoc(doc(db, 'teams', id), {
          players: arrayUnion(playerId),
        });
      }
    ).then(
      async () => {
        await getTeamData();
      }
    )
  };

  const handleLeaveTeam = async () => {
    const teamId = id;
    await updateDoc(doc(db, 'teams', teamId), {
      players: arrayRemove(profileModel?.id),
    });
    await updateDoc(doc(db, 'users', profileModel?.id), {
      teams: arrayRemove(teamId),
    });
    navigation.pop();
  };

  const isUserInTeam = team && team.players.includes(profileModel?.id || '');


  return (
    <View style={styles.container}>
      {team && teamPlayersState && (
        <>
          <ScrollView>
            <View style={styles.headerContainer}>
              <Text style={styles.teamNameTitle}>{team.name}</Text>
              {team.teamPhoto && (
                <Image source={{ uri: team.teamPhoto }} style={styles.teamPhoto} />
              )}
            </View>
            <View style={styles.playerContainer}>
              {teamPlayersState.map((player: ProfileModel) => (
                <View key={player.id} style={styles.playerItem}>
                  {player.profilePhoto && (
                    <Image source={{ uri: player.profilePhoto }} style={styles.profilePhoto} />
                  )}
                  <View style={styles.detail}>
                    <Text style={styles.playerName}>{player.userName}</Text>
                    <Text style={styles.playerInfo}>Tercih Edilen Ayak: {player.preferredFoot}</Text>
                    <Text style={styles.playerInfo}>Forma Numarası: #{player.shirtNumber}</Text>
                    <Text style={styles.playerInfo}>Pozisyon: {player.position}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            {!isUserInTeam ? (
              <TouchableOpacity style={styles.button} onPress={handleJoinTeam}>
                <Ionicons name="person-add" size={17} color="white" style={styles.iconStyle} />
                <Text style={styles.buttonText}>Takıma Katıl</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button2} onPress={handleLeaveTeam}>
                <Ionicons name="person-remove" size={17} color="white" style={styles.iconStyle} />
                <Text style={styles.buttonText}>Takımdan Ayrıl</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  teamNameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamPhoto: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  playerContainer: {
    alignItems: 'flex-start',
  },
  playerItem: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 40,
  },
  detail: {
    marginLeft: 10,
  },
  playerName: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  playerInfo: {
    fontSize: 14,
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    bottom: 0,

  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#2cb753",
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  button2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#Eb0938',
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  iconStyle: {
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TeamDetailScreen;

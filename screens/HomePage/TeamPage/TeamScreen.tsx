import { View, Text, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, Alert } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp, doc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../firebase';
import { TeamModel } from '../../../models/TeamModel';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../redux/ReduxStore';
import SearchLine from '../../../components/SearchLine';

const TeamScreen: FC = () => {
  const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [myTeam, setMyTeam] = useState<TeamModel[]>([]);

  useEffect(() => {
    const fetchMyTeam = async () => {
      var myTeam: TeamModel[] = [];
      const q = query(
        collection(db, "teams"),
        where('id', 'in', profileModel?.teams)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        myTeam.push(doc.data() as TeamModel);
      });
      setMyTeam(myTeam);
    };
    fetchMyTeam();
  }, [profileModel?.teams]);

  const createTeam = async () => {
    if (profileModel?.teams && profileModel.teams.length > 0) {
      Alert.alert("Zaten bir takımın mevcut")
      return;
    }

    const teamData = {
      id: '',
      name: newTeamName,
      players: [],
      teamPhoto: 'https://firebasestorage.googleapis.com/v0/b/santra-d7297.appspot.com/o/defaultTeamPP.png?alt=media&token=bd21573e-7982-405f-a606-33f1c450b677',
    };
      const docRef = await addDoc(collection(db, 'teams'), {
        ...teamData,
        createdAt: serverTimestamp(),
      });

      const updatedTeamData = {
        ...teamData,
        id: docRef.id,
        teamId: docRef.id,
      };

      await setDoc(doc(db, 'teams', docRef.id), updatedTeamData);

      const profileId = profileModel?.id;
      if (profileId) {
        await updateDoc(doc(db, 'users', profileId), {
          teams: arrayUnion(updatedTeamData.id),
        });
        await updateDoc(doc(db, 'teams', updatedTeamData.id), {
          players: arrayUnion(profileId),
        });
      }

      setMyTeam((prevTeam) => [...prevTeam, updatedTeamData]);
      setNewTeamName('');
      setIsCreatingTeam(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          style={styles.image}
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/santra-d7297.appspot.com/o/animation_640_lipt4xny.gif?alt=media&token=881bd19b-cbf0-4a88-ab97-8e55c2db987a&_gl=1*u9mz21*_ga*MjA4MzY4MjIzNS4xNjg1MDQ2MTk4*_ga_CW55HF8NVT*MTY4NjM4OTc5NS4xMy4xLjE2ODYzOTAxODAuMC4wLjA.' }}
          resizeMode="contain"
        />
        <View style={styles.teamListContainer}>
          <FlatList
            data={myTeam}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SearchLine id={item.id} photo={item.teamPhoto} userName={item.name} type={'teams'} />
            )}
          />
        </View>
        {!isCreatingTeam && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setIsCreatingTeam(true)}
          >
            <Text style={styles.createButtonText}>Takım Oluştur</Text>
          </TouchableOpacity>
        )}
        {isCreatingTeam && (
          <View style={styles.createTeamContainer}>
            <TextInput
              style={styles.teamNameInput}
              placeholder="Takım Adı"
              value={newTeamName}
              onChangeText={setNewTeamName}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={createTeam}
            >
              <Text style={styles.confirmButtonText}>Oluştur</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  teamListContainer: {
    flex: 1,
    width: '100%',
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createTeamContainer: {
    marginTop: 16,
  },
  teamNameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    width: 200,
  },
  confirmButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TeamScreen;

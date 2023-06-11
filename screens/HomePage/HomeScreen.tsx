import React, { FC, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FootballCourtModel } from '../../models/FootballCourtModel';
import { collection, getDocs, query } from 'firebase/firestore'
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import NavigationConstants from '../../navigation/NavigationConstants';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../redux/ReduxStore';
import LottieView from 'lottie-react-native'
import { ScrollView } from 'react-native-gesture-handler';

const HomeScreen: FC = () => {

  const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
  const animation = useRef(null)
  const navigation = useNavigation<any>()
  const [footballCourts, setFootballCourts] = useState<FootballCourtModel[]>([]);

  useEffect(() => {
    fetchFootballCourts();
  }, []);

  const fetchFootballCourts = async () => {
    try {
      const q = query(collection(db, "footballCourts"));
      const querySnapshot = await getDocs(q);
      const courts: FootballCourtModel[] = [];
      querySnapshot.forEach((doc) => {
        const court = { id: doc.id, ...doc.data() } as FootballCourtModel;
        courts.push(court);
      });
      setFootballCourts(courts);
    } catch (error) {
      console.log("Hata:", error);
    }
  }

  return (
    <ScrollView style={styles.view}>
      <View style={styles.firstView}>
        {
          profileModel?.nextMatches[0] === undefined ?
            <View style={{ alignItems: 'center', }}>
              <LottieView
                autoPlay
                ref={animation}
                source={require('../../assets/noNextMatch.json')}
                style={{ height: 200, position: 'absolute', marginTop: -10 }}
              />
              <View style={{ position: 'absolute', marginTop: 130, alignItems: 'center' }}>
                <Text style={{ fontWeight: '500' }}>Gelecek tarihte herhangi </Text>
                <Text style={{ fontWeight: '500' }}>bir maçınız bulunmamakta!</Text>
              </View>
            </View>
            :
            <FlatList
              data={profileModel?.nextMatches}
              keyExtractor={(item) => item.date}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <LinearGradient
                  colors={["#fd3854", "#f842a3"]}
                  style={styles.card}>
                  <View style={styles.view}>
                    <Text style={styles.cardText}>Sonraki Maç</Text>
                    <Text style={styles.cardText2}>
                      <Text style={styles.largeText}>{item.date.split(' ')[0]} </Text>
                      {item.date.split(' ')[1]} {item.date.split(' ')[2]}
                    </Text>
                    <Text style={styles.cardText}>Halısaha</Text>
                    <Text style={styles.cardText2}>{item.footballCourt}</Text>
                  </View>
                </LinearGradient>
              )}
            />
        }
      </View>
      <View style={styles.secondView}>
        <Text style={styles.title}>Sponsorlu Halısahalar</Text>
        {
          footballCourts &&
          <FlatList
            data={footballCourts}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={
                () =>
                  navigation.push(NavigationConstants.footballCourt, { id: item.id })}>
                <Image
                  style={styles.card2}
                  source={{ uri: item.photos[0] }}
                />
                <Text style={styles.footballCourtName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        }
      </View>
      <View style={styles.thirdView}>
        <TouchableOpacity onPress={() => console.log('Takım')}>
          <View >
            <LinearGradient
              colors={["#5d4fed", "#46cceb"]}
              style={styles.lineGradient}>
              <Ionicons name="people" size={32} color="white" />
              <Text style={styles.bottomText}>Takım</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.push(NavigationConstants.favoriteFootballCourts)}>
          <View >
            <LinearGradient
              colors={["#5bc62a", "#b8d626"]}
              style={styles.lineGradient}>
              <Ionicons name="star" size={32} color="white" />
              <Text style={styles.bottomText}>Favori Halısahalar</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  firstView: {
    height: 170,
    marginBottom: 30
  },
  secondView: {
    height: 220
  },
  thirdView: {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30
  },
  largeText: {
    fontSize: 32,
  },
  lineGradient: {
    width: 125,
    height: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomText: {
    color: "white",
    fontSize: 16,
    textAlign: "center"
  },
  footballCourtName: {
    fontSize: 16,
    fontWeight: '200',
    marginLeft: 25,
    marginTop: 4
  },
  card: {
    width: Dimensions.get('window').width - 130,
    height: 150,
    flexDirection: "row",
    backgroundColor: 'grey',
    borderRadius: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    marginLeft: 25,
    marginTop: 20
  },
  card2: {
    width: Dimensions.get('window').width - 130,
    height: 150,
    backgroundColor: 'pink',
    borderRadius: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    marginLeft: 25,
    marginTop: 10
  },
  cardText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
  },
  cardText2: {
    fontSize: 23,
    fontWeight: '700',
    color: 'white',
    marginLeft: 15,
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    marginLeft: 25,
  },
  firstText: {
    color: "white",
    fontSize: 13
  },

});

export default HomeScreen;


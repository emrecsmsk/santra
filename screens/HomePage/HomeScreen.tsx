import React, { FC } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NavigationConstants from '../../navigation/NavigationConstants';
import { useNavigation } from '@react-navigation/native';


const HomeScreen: FC = () => {
  const DATA = [
    { id: '1', team: 'Galatasaray', dateTime: "28 Ocak" , imageUrl:"https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.png"},
    { id: '2', team: 'Fenerbahçe',  dateTime: "29 Ocak" , imageUrl:"https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbahçe_SK.png"},
    { id: '3', team: 'Beşiktaş', dateTime: "30 Ocak" , imageUrl:"https://upload.wikimedia.org/wikipedia/commons/0/08/Beşiktaş_Logo_Beşiktaş_Amblem_Beşiktaş_Arma.png"},
  ];

  const navigation = useNavigation<any>()



  return (
    <View style={styles.motherView}>

      <View style={styles.firstView}>
      <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <LinearGradient
              colors={["#fd3854", "#f842a3"]}
              style={styles.card}
            >
              <View style={styles.view1}>
                <Text style={styles.cardText}>Sonraki Maç</Text>
                <Text style={styles.cardText2}>
                  <Text style={styles.largeText}>{item.dateTime.split(' ')[0]}</Text> {item.dateTime.split(' ')[1]}
                </Text>
                <Text style={styles.cardText}>Takım</Text>
                <Text style={styles.cardText2}>{item.team}</Text>
              </View>
              <View style={styles.view2}>
                <Image
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  source={{uri: item.imageUrl}}
                />
              </View>
            </LinearGradient>
          )}
        />
      </View>

      <View style={styles.secondView}>
        <Text style={styles.title}>Sponsorlu Halısahalar</Text>
        <Image style={styles.card2}
          source={{
            uri: "http://kuzeysports.com/wp-content/uploads/257316_o49091.jpg"
          }}
        />
      </View>

      <View style={styles.thirdView}>

        <TouchableOpacity  onPress={() => console.log('Takım')}>
          <View >
            <LinearGradient
              colors={["#5d4fed", "#46cceb"]}
              style={styles.lineGradient}>
              <Ionicons name="people" size={32} color="white" />
              <Text style={styles.bottomText}>Takım</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => navigation.push(NavigationConstants.favoriteFootballCourts)}>
          <View >
            <LinearGradient
              colors={["#5bc62a", "#b8d626"]}
              style={styles.lineGradient}>
              <Ionicons name="star" size={32} color="white" />
              <Text style={styles.bottomText}>Favori Halısahalar</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => console.log('Maçlar')}>
          <View >
            <LinearGradient
              colors={["#f78039", "#ffbe2c"]}
              style={styles.lineGradient}>
              <Ionicons name="football" size={32} color="white" />
              <Text style={styles.bottomText}>Maçlar</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  motherView: {
    flex: 1,
  },
  firstView: {
    flex: 1,
  },
  secondView: {
    flex: 1,
  },
  largeText: {
    fontSize: 32, 
  },
  thirdView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 30,
    marginTop:30
  },
  view1:{
    flex:2
  },
  view2:{
    flex:1,
    marginBottom:35
  },
  lineGradient: {
    width: 100,
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
  card: {
    width: Dimensions.get('window').width - 130,
    height: 150,
    flexDirection:"row",
    backgroundColor: 'pink',
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
    marginTop: 20
  },
  cardText: {
    fontSize: 18,
    color: 'white',
    marginLeft:15,
  },
  cardText2: {
    fontSize: 23,
    fontWeight: '700',
    color: 'white',
    marginLeft:15,
    marginBottom:10
  },
  title: {
    fontSize: 16,
    marginLeft: 25
  },
  firstText: {
    color: "white",
    fontSize: 13
  },

});

export default HomeScreen;

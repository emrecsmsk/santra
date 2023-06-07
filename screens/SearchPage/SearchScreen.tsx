import { View, TextInput, StyleSheet, Text } from 'react-native'
import React, { FC, useEffect, useState, } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import { collection, getDocs, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { ProfileModel } from '../../models/ProfileModel'
import SearchLine from '../../components/SearchLine'
import { FootballCourtModel } from '../../models/FootballCourtModel'
import { TeamModel } from '../../models/TeamModel'
import colors from '../../utilies/colors'
import { Ionicons } from '@expo/vector-icons'


const SearchScreen: FC = () => {
  const [search, setSearch] = useState('')

  const [searchedAll, setSearchedAll] = useState<any[]>()
  const [all, setAll] = useState<any[]>()
  const [searchedUsers, setSearchedUsers] = useState<ProfileModel[]>()
  const [allUsers, setAllUsers] = useState<ProfileModel[]>()
  const [searchedFootballCourts, setSearchedFootballCourts] = useState<FootballCourtModel[]>()
  const [allFootballCourts, setAllFootballCourts] = useState<FootballCourtModel[]>()
  const [searchedTeams, setSearchedTeams] = useState<TeamModel[]>()
  const [allTeams, setAllTeams] = useState<TeamModel[]>()



  useEffect(() => {
    fetchSearchResponse()
  }, [])

  useEffect(() => {
    if (search.trim() !== '' && allUsers !== undefined) {
      const filteredAll: any[] = all!.filter((all) => {
        if (all.userName !== undefined) {
          return all.userName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
            || all.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        } else {
          return all.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        }
      })
      setSearchedAll(filteredAll)

      const filteredUsers: ProfileModel[] = allUsers!.filter((user) => {
        return user.userName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
          || user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      })
      setSearchedUsers(filteredUsers)

      const filteredFootballCourts: FootballCourtModel[] = allFootballCourts!.filter((footballCourt) => {
        return footballCourt.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      })
      setSearchedFootballCourts(filteredFootballCourts)

      const filteredTeams: TeamModel[] = allTeams!.filter((team) => {
        return team.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      })
      setSearchedTeams(filteredTeams)
    }
  }, [search])

  const fetchSearchResponse = async () => {
    var allUsers: ProfileModel[]
    const q = query(collection(db, "users"))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (allUsers === undefined) {
        allUsers = [doc.data() as ProfileModel]
      } else {
        allUsers = [...allUsers, doc.data() as ProfileModel]
      }
    })
    setAllUsers(allUsers!)


    var allFootballCourts: FootballCourtModel[]
    const q2 = query(collection(db, "footballCourts"))
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      if (allFootballCourts === undefined) {
        allFootballCourts = [doc.data() as FootballCourtModel]
      } else {
        allFootballCourts = [...allFootballCourts, doc.data() as FootballCourtModel]
      }
    })
    setAllFootballCourts(allFootballCourts!)

    var allTeams: TeamModel[]
    const q3 = query(collection(db, "teams"))
    const querySnapshot3 = await getDocs(q3);
    querySnapshot3.forEach((doc) => {
      if (allTeams === undefined) {
        allTeams = [doc.data() as TeamModel]
      } else {
        allTeams = [...allTeams, doc.data() as TeamModel]
      }
    })
    setAllTeams(allTeams!)

    var all: any[] = []
    const maxLength = Math.max(allUsers!.length, allFootballCourts!.length, allTeams!.length)
    setAll(allTeams!)
    for (let i = 0; i < maxLength; i++) {
      if (i < allUsers!.length) {
        all.push(allUsers![i]);
      }
      if (i < allFootballCourts!.length) {
        all.push(allFootballCourts![i]);
      }
      if (i < allTeams!.length) {
        all.push(allTeams![i]);
      }
    }
    setAll(all)
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Ara"
        value={search}
        style={styles.input}
        onChangeText={text => setSearch(text)}
        autoFocus
      />
      <Ionicons style={{ marginTop: 5, marginLeft: 15, position: 'absolute' }} name={"search-sharp"} size={24} color={colors.grey} />
      <Tabs.Container minHeaderHeight={5}>
        <Tabs.Tab name="Tümü" label={"Tümü"}>
          {searchedAll &&
            <Tabs.FlatList
              data={searchedAll}
              keyExtractor={item => item.id}
              renderItem={
                ({ item }) => {
                  if (item.userName !== undefined) {
                    return (
                      <SearchLine id={item.id} photo={item.profilePhoto} userName={item.userName} name={item.name} position={item.position} shirtNumber={item.shirtNumber} type={'user'} />
                    )
                  } else if (item.players !== undefined) {
                    return (
                      <SearchLine id={item.id} photo={item.photo} userName={item.userName} name={item.name} position={item.position} shirtNumber={item.shirtNumber} type={'team'} />
                    )
                  } else if (item.address !== undefined) {
                    return (
                      <SearchLine id={item.id} photo={item.photos[0]} userName={item.name} type={'footballCourt'} />
                    )
                  } else {
                    return (
                      <></>
                    )
                  }
                }
              }
            />
          }
        </Tabs.Tab>

        <Tabs.Tab name="Kişiler" label={"Kişi"} >
          {searchedUsers &&
            <Tabs.FlatList
              data={searchedUsers}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <SearchLine id={item.id} photo={item.profilePhoto} userName={item.userName} name={item.name} position={item.position} shirtNumber={item.shirtNumber} type={'user'} />
              }
            />
          }
        </Tabs.Tab>

        <Tabs.Tab name="Halısahalar" label={"Halısaha"}>
          <Tabs.FlatList
            data={searchedFootballCourts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <SearchLine id={item.id} photo={item.photos[0]} userName={item.name} type={'footballCourt'} />
            }
          />
        </Tabs.Tab>

        <Tabs.Tab name="Takımlar" label={"Takım"}>
          <Tabs.FlatList
            data={searchedTeams}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <SearchLine id={item.id} photo={item.teamPhoto} userName={item.name} type={'team'} />
            }
          />
        </Tabs.Tab>

      </Tabs.Container>
    </View>
  )
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.brightGrey,
    paddingLeft: 35,
    paddingRight: 10,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 10
  },
})

export default SearchScreen

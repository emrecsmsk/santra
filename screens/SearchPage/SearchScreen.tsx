import { View, TextInput, StyleSheet, Text } from 'react-native'
import React, { FC, useState, } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'


const SearchScreen: FC = () => {
  const [search, setSearch] = useState('')
  return (
    <View>
      <TextInput
        placeholder="Ara"
        value={search}
        style={styles.input}
        onChangeText={text => setSearch(text)}
      />
      <Tabs.Container minHeaderHeight={5}>
        <Tabs.Tab name="Tümü" label={"Tümü"}>
          <Tabs.ScrollView >
            <Text>asfda</Text>
            <Text>asfda</Text>
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Kişiler" label={"Kişi"} >
          <Tabs.ScrollView >
            <Text >asfda</Text>
            <Text style={{ flex: 1 }}>asfda</Text>
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Halısahalar" label={"Halısaha"}>
          <Tabs.ScrollView >
            <Text>asfda</Text>
            <Text>asfda</Text>
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Takımlar" label={"Takım"}>
          <Tabs.ScrollView >
            <Text>asfda</Text>
            <Text>asfda</Text>
          </Tabs.ScrollView>
        </Tabs.Tab>

      </Tabs.Container>
    </View>
  )
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#e9e9e9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10
  },
})

export default SearchScreen
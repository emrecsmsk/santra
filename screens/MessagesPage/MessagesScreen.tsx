import { View, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Avatar, List, Provider, Divider, FAB, Portal, Dialog, Button, TextInput } from 'react-native-paper'
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import { createStackNavigator } from '@react-navigation/stack';

const MessagesScreen: React.FC = () => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [email, setEmail] = useState<string>('');





    const navigation = useNavigation();



    // useEffect(() => {
    //     firebase.firestore().collection("MessagingPage").add({
    //         users: ["first@gmail.com", "second@mail.com"],
    //     });
    // }, []);
    // type RootStackParamList = {
    //     MessagingPage: { messagingPageId: string };
    //     // Diğer rotalar buraya eklenir
    // };

    // const Stack = createStackNavigator<RootStackParamList>();






    return (<Provider>
        <View style={{ flex: 1 }}>
            <List.Item title="User Name"
                description="Hi Iam Elfo"
                left={() => <Avatar.Text label="UN" size={50} />}
            //onPress={() => navigation.navigate("MessagingPage" )}
            />
            <Divider />
            <Portal>
                <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
                    <Dialog.Title>New Chat</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Enter user email"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsDialogVisible(false)}>CANCEL</Button>
                        <Button>SAVE</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FAB icon="plus"
                style={styles.fabStyle}
                //onPress={() => setIsDialogVisible(true)}
                //onPress={() => navigation.navigate("MessagingPage")}
            />
        </View>
    </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingBottom: getBottomSpace(),
        backgroundColor: '#F5FCFF',
    },
    fabStyle: {
        position: "absolute",
        bottom: 15,
        right: 15
    }
});



export default MessagesScreen;

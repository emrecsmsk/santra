import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const MessagingPage: React.FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const onSend = (newMessages: IMessage[]) => {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    };
    return (
        <View style={styles.container}>
            <GiftedChat
                bottomOffset={getBottomSpace()}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingBottom: getBottomSpace(),
        backgroundColor: '#F5FCFF',
    },
});

export default MessagingPage
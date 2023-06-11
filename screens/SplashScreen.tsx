import { StyleSheet, Image, View, Dimensions, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../utilies/colors'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useDispatch } from 'react-redux'
import LoginReducer from '../redux/reducers/LoginReducer'
import ProfileReducer from '../redux/reducers/ProfileReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SplashScreen = () => {

    const dispatch = useDispatch<any>()
    const [splash, setSplash] = useState(true)
    var email = ""
    var password = ""

    useEffect(() => {
        login()
    }, [])

    const login = async () => {
        await getLoginItem()
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                // Signed in 
                setSplash(false)
                dispatch(LoginReducer.setIsLoggedIn(true))
                dispatch(ProfileReducer.getProfile())
                // ...
            })
            .catch((error) => {
                setSplash(false)
            });
    }
    const getLoginItem = async () => {
        email = await AsyncStorage.getItem('email') ?? ""
        password = await AsyncStorage.getItem('password') ?? ""
    }

    return (
        <>
            {
                splash ?
                    <View
                        style={{
                            backgroundColor: colors.white,
                            height: Dimensions.get('window').height,
                            width: Dimensions.get('window').width,
                            position: 'absolute'
                        }}>
                        <Image
                            style={{
                                height: Dimensions.get('window').height,
                                width: Dimensions.get('window').width,
                            }}
                            source={require('../assets/splashScreen.png')}
                            resizeMode='contain'
                        />
                    </View>
                    :
                    <></>
            }
        </>
    )
}

export default SplashScreen

const styles = StyleSheet.create({})
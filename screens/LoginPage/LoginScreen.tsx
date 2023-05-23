import React, { FC, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import LoginReducer from '../../redux/reducers/LoginReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../utilies/colors';
import { useNavigation } from '@react-navigation/native';
import NavigationConstants from '../../navigation/NavigationConstants';
import ProfileReducer from '../../redux/reducers/ProfileReducer';


const LoginScreen: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [mailError, setMailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [toManyRequestError, setToManyRequestError] = useState(false)

    const dispatch = useDispatch<any>()
    const navigation = useNavigation<any>()

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async () => {
                // Signed in 
                await saveUser()
                dispatch(LoginReducer.setIsLoggedIn(true))
                dispatch(ProfileReducer.getProfile())
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode)
                if (errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found') {
                    setMailError(true)
                    setPasswordError(false)
                    setToManyRequestError(false)
                } else if (errorCode === 'auth/too-many-requests') {
                    setMailError(false)
                    setPasswordError(false)
                    setToManyRequestError(true)
                } else {
                    setMailError(false)
                    setPasswordError(true)
                    setToManyRequestError(false)
                }
            })
    }

    const saveUser = async () => {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Image style={styles.logo} source={require('../../assets/logo.png')} />
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={text => setEmail(text.toLowerCase())}
                    style={styles.input}
                    inputMode='email'
                />
                {mailError && <Text style={styles.errorText}>Kayıtlı bir e-mail adresi bulunamadı!</Text>}
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                {passwordError && <Text style={styles.errorText}>Şifre yanlış!</Text>}
                {toManyRequestError &&
                    <>
                        <Text style={styles.errorText}>Çok fazla yanlış giriş yaptınız!</Text>
                        <Text style={styles.errorText}>Lütfen daha sonra tekrar deneyiniz!</Text>
                    </>}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Giriş yap</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.replace(NavigationConstants.signUp)}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Kayıt ol</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView >
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 25
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: colors.brightGrey,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: colors.azure,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: colors.white,
        marginTop: 5,
        borderColor: colors.azure,
        borderWidth: 2,
    },
    buttonText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: colors.azure,
        fontWeight: '700',
        fontSize: 16,
    },
    errorText: {
        color: colors.red,
        marginLeft: 14,
    }
})
import React, { FC, useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Keyboard } from 'react-native'
import { db } from '../../firebase'
import colors from '../../utilies/colors';
import { useNavigation } from '@react-navigation/native';
import NavigationConstants from '../../navigation/NavigationConstants';
import { collection, getDocs, query, where } from 'firebase/firestore';


const SignUpScreen: FC = () => {

    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const [confirmPassword, setConfirmPassword] = useState('')
    const [mailEmptyError, setMailEmptyError] = useState(false)
    const [mailExistError, setMailExistError] = useState(false)
    const [mailValidError, setMailValidError] = useState(false)
    const [userNameEmptyError, setUserNameEmptyError] = useState(false)
    const [userNameExistError, setUserNameExistError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordMatchError, setPasswordMatchError] = useState(false)

    const [save, setSave] = useState(0)

    const navigation = useNavigation<any>()

    const handleSignUp = async () => {
        await checkEmail()
        await checkUsername()
        await checkPassword()
        setSave(save + 1)
    }
    useEffect(() => {
        if (save > 0) {
            const contiune = () => {
                if (!mailEmptyError
                    && !mailExistError
                    && !mailValidError
                    && !userNameEmptyError
                    && !userNameExistError
                    && !passwordError
                    && !passwordMatchError) {
                    navigation.navigate(NavigationConstants.signUpNext, { email, userName, password })
                }
            }
            contiune()
        }
    }, [save])

    const checkEmail = async () => {
        if (email == '') {
            setMailEmptyError(true)
        } else {
            setMailEmptyError(false)
            validateEmail()

            const q = query(collection(db, "users"), where('email', "==", email))
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMailExistError(false)
            } else {
                setMailExistError(true)
            }
        }
    }

    const formattedUserName = (text: string) => {
        const cleanedText = text.replace(/[^a-zA-Z0-9_]/g, '');
        setUserName(cleanedText);
    };

    const validateEmail = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(email) === false) {
            setMailValidError(true)
        }
        else {
            setMailValidError(false)
        }
    }

    const checkUsername = async () => {
        if (userName == '') {
            setUserNameEmptyError(true)
        } else {
            setUserNameEmptyError(false)
            const q = query(collection(db, "users"), where('userName', "==", userName))
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setUserNameExistError(false)
            } else {
                setUserNameExistError(true)
            }
        }
    }

    const checkPassword = async () => {
        if (password.length < 6) {
            setPasswordError(true)
            setPasswordMatchError(false)
        } else {
            setPasswordError(false)
            if (password === confirmPassword) {
                setPasswordMatchError(false)
            } else {
                setPasswordMatchError(true)
            }
        }
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
                {mailExistError && <Text style={styles.errorText}>Bu mail zaten kayıt olmuş!</Text>}
                {mailEmptyError && <Text style={styles.errorText}>E-mail kısmı boş olamaz!</Text>}
                {mailValidError && <Text style={styles.errorText}>Lütfen geçerli bir e-mail adresi giriniz!</Text>}
                <TextInput
                    placeholder="Kullanıcı adı"
                    value={userName}
                    onChangeText={text => formattedUserName(text.toLocaleLowerCase())}
                    style={styles.input}
                    maxLength={20}
                    inputMode='text'

                />
                {userNameExistError && <Text style={styles.errorText}>Bu kullanıcı zaten kullanılmış!</Text>}
                {userNameEmptyError && <Text style={styles.errorText}>Kullanıcı adı kısmı boş olamaz!</Text>}
                <TextInput
                    placeholder="Şifre"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                {passwordError && <Text style={styles.errorText}>Şifre 6 karakterden uzun olmalıdır!</Text>}
                <TextInput
                    placeholder="Şifre tekrar"
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                {passwordMatchError && <Text style={styles.errorText}>Şifre eşleşmiyor!</Text>}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => handleSignUp()}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Devam et</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.replace(NavigationConstants.login)}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Giriş yap</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

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

export default SignUpScreen


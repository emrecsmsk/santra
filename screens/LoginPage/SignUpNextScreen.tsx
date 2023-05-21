import React, { FC, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux'
import LoginReducer from '../../redux/reducers/LoginReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import colors from '../../utilies/colors'
import { useNavigation, useRoute } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SignUpModel } from '../../models/SignUpModel';
import { doc, setDoc } from 'firebase/firestore';




const SignUpNextScreen: FC = () => {
    const [name, setName] = useState('')
    const [shirtNumber, setShirtNumber] = useState('')
    const [birthDay, setBirthDay] = useState('')
    const [height, setHeight] = useState('')
    const [position, setPosition] = useState('GK')
    const [preferredFoot, setPreferredFoot] = useState('Her ikisi de')

    const [nameEmptyError, setNameEmptyError] = useState(false)
    const [shirtNumberEmptyError, setShirtNumberEmptyError] = useState(false)
    const [heightError, setHeightError] = useState(false)
    const [birthDayError, setbirthDayError] = useState(false)

    const [save, setSave] = useState(0)

    const dispatch = useDispatch<any>()
    const navigation = useNavigation<any>()
    const route = useRoute<any>()

    const email: string = route.params.email
    const userName: string = route.params.userName
    const password: string = route.params.password

    const saveButton = async () => {
        await checkName()
        await checkShirtNumber()
        await checkHeight()
        await checkBirtyDay()
        setSave(save + 1)
    }

    useEffect(() => {
        if (save > 0) {
            const contiune = () => {
                if (!nameEmptyError
                    && !shirtNumberEmptyError
                    && !shirtNumberEmptyError
                    && !heightError
                    && !birthDayError) {
                    handleSignUp()
                }
            }
            contiune()
        }
    }, [save])

    const formattedShirtNumber = (number: string) => {
        let formattedShirtNumber = number.replace(/[^0-9]/g, '')
        setShirtNumber(formattedShirtNumber)
    }

    const formattedHeight = (number: string) => {
        let formattedHeight = number.replace(/[^0-9]/g, '')
        setHeight(formattedHeight)
    }


    const formattedDate = (date: string) => {

        let formattedDate = date.replace(/[^0-9]/g, ''); // Sayı olmayan karakterleri kaldırın

        if (formattedDate.length > 2) {
            formattedDate = formattedDate.substring(0, 2) + '/' + formattedDate.substring(2)
        }

        if (formattedDate.length > 5) {
            formattedDate = formattedDate.substring(0, 5) + '/' + formattedDate.substring(5)
        }

        if (formattedDate.length > 10) {
            formattedDate = formattedDate.substring(0, 10)
        }

        setBirthDay(formattedDate);

    }

    const checkName = () => {
        if (name == '') {
            setNameEmptyError(true)
        } else {
            setNameEmptyError(false)
        }
    }

    const checkShirtNumber = () => {
        if (shirtNumber == '') {
            setShirtNumberEmptyError(true)
        } else {
            setShirtNumberEmptyError(false)
        }
    }

    const checkHeight = () => {
        if (height == '') {
            setHeightError(true)
        } else {
            if (parseInt(height) > 250 || parseInt(height) < 120) {
                setHeightError(true)
            } else {
                setHeightError(false)
            }
        }
    }

    const isValidDate = (day: number, month: number, year: number) => {
        const monthDays: any = {
            1: 31,
            2: isLeapYear(year) ? 29 : 28,
            3: 31,
            4: 30,
            5: 31,
            6: 30,
            7: 31,
            8: 31,
            9: 30,
            10: 31,
            11: 30,
            12: 31,
        };

        if (month < 1 || month > 12) {
            setbirthDayError(true)
            return false
        }

        if (day < 1 || day > monthDays[month]) {
            setbirthDayError(true)
            return false
        }

        return true
    }

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
                // Signed in 
                const docData: SignUpModel = {
                    birth: birthDay,
                    height: height,
                    email: email,
                    name: name,
                    shirtNumber: shirtNumber,
                    position: position,
                    preferredFoot: preferredFoot,
                    userName: userName,
                    followers: [],
                    following: [],
                    teams: []
                }

                await setDoc(doc(db, "users", email), docData)

                await saveUser()
                dispatch(LoginReducer.setIsLoggedIn(true))

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("error code:" + errorCode)
                console.log("error message:" + errorMessage)
                // ..
            })
    }

    const saveUser = async () => {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)
    }

    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

    const checkBirtyDay = () => {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = birthDay.match(dateRegex);

        if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);

            if (year < 1930 || year > 2012) {
                setbirthDayError(true)
                return;
            }

            if (!isValidDate(day, month, year)) {
                return;
            }

            setbirthDayError(false)
        } else {
            setbirthDayError(true)
        }
    }

    return (
        <KeyboardAwareScrollView
            style={styles.container}
        >
            <View style={styles.view}>
                <Image style={styles.logo} source={require('../../assets/logo.png')} />
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="İsim"
                        value={name}
                        onChangeText={text => setName(text)}
                        style={styles.input}
                        maxLength={30}
                        inputMode='text'
                    />
                    {nameEmptyError && <Text style={styles.errorText}>İsim boş olamaz!</Text>}
                    <TextInput
                        placeholder="Forma numarası"
                        value={shirtNumber}
                        onChangeText={text => formattedShirtNumber(text)}
                        style={styles.input}
                        maxLength={2}
                        inputMode='numeric'
                    />
                    {shirtNumberEmptyError && <Text style={styles.errorText}>Forma numarası boş olamaz!</Text>}
                    <TextInput
                        placeholder="Boy"
                        value={height}
                        onChangeText={text => formattedHeight(text)}
                        style={styles.input}
                        maxLength={3}
                        inputMode='numeric'
                    />
                    {heightError && <Text style={styles.errorText}>Lütfen geçerli bir boy giriniz!</Text>}
                    <TextInput
                        placeholder="Doğum tarihi"
                        value={birthDay}
                        onChangeText={text => formattedDate(text)}
                        style={styles.input}
                        maxLength={30}
                        inputMode='numeric'
                    />
                    {birthDayError && <Text style={styles.errorText}>Lütfen geçerli bir tarih giriniz!</Text>}

                    <View style={styles.selectView}>
                        <Text>Mevkinizi seçiniz.</Text>
                    </View>
                    <View style={styles.viewRow}>
                        <TouchableOpacity onPress={() => setPosition('GK')}
                            style={position == 'GK' ? styles.unSelectedButton : styles.selectedButton}>
                            <Text style={position == 'GK' ? styles.buttonText : styles.buttonOutlineText}>GK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPosition('DF')}
                            style={position == 'DF' ? styles.unSelectedButton : styles.selectedButton}>
                            <Text style={position == 'DF' ? styles.buttonText : styles.buttonOutlineText}>DF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPosition('OS')}
                            style={position == 'OS' ? styles.unSelectedButton : styles.selectedButton}>
                            <Text style={position == 'OS' ? styles.buttonText : styles.buttonOutlineText}>OS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPosition('FW')}
                            style={position == 'FW' ? styles.unSelectedButton : styles.selectedButton}>
                            <Text style={position == 'FW' ? styles.buttonText : styles.buttonOutlineText}>FW</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.selectView}>
                        <Text>Tercih ettiğiniz ayağınızı seçiniz.</Text>
                    </View>
                    <View style={styles.viewRow}>
                        <TouchableOpacity onPress={() => setPreferredFoot('Sol')}
                            style={preferredFoot == 'Sol' ? styles.unSelectedButton : styles.selectedButton}>
                            <Text style={preferredFoot == 'Sol' ? styles.buttonText : styles.buttonOutlineText}>Sol</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPreferredFoot('Her ikisi de')}
                            style={preferredFoot == 'Her ikisi de' ? styles.unSelectedButton : styles.selectedButton}>
                            <Text style={preferredFoot == 'Her ikisi de' ? styles.buttonText : styles.buttonOutlineText}>Her ikisi de</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPreferredFoot('Sağ')}
                            style={preferredFoot == 'Sağ' ? styles.unSelectedButton : styles.selectedButton}>
                            <Text style={preferredFoot == 'Sağ' ? styles.buttonText : styles.buttonOutlineText}>Sağ</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => saveButton()}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Kayıt ol</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.pop()}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Geri dön</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        paddingTop: 50,
        alignItems: 'center'
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
    },
    viewRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    selectedButton: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 3,
        borderColor: colors.azure,
        borderRadius: 10
    },
    unSelectedButton: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 3,
        borderColor: colors.azure,
        backgroundColor: colors.azure,
        borderRadius: 10
    },
    selectView: {
        paddingTop: 10,
        alignItems: 'center'
    }
})

export default SignUpNextScreen

function setDate(value: any) {
    throw new Error('Function not implemented.');
}

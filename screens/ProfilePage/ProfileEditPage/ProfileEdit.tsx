import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Avatar, Divider } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ApplicationState } from '../../../redux/ReduxStore'
import colors from '../../../utilies/colors'
import { db, storage } from '../../../firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import ProfileReducer from '../../../redux/reducers/ProfileReducer'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import LottieView from 'lottie-react-native'
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator'


const ProfileEdit: FC = () => {

    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)

    const [headerPhoto, setHeaderPhoto] = useState(profileModel!.headerPhoto)
    const [profilePhoto, setProfilePhoto] = useState(profileModel!.profilePhoto)
    const [name, setName] = useState(profileModel!.name)
    const [userName, setUserName] = useState(profileModel!.userName)
    const [shirtNumber, setShirtNumber] = useState(profileModel!.shirtNumber)
    const [birthDay, setBirthDay] = useState(profileModel!.birth)
    const [height, setHeight] = useState(profileModel!.height)
    const [position, setPosition] = useState(profileModel!.position)
    const [preferredFoot, setPreferredFoot] = useState(profileModel!.preferredFoot)

    const [nameEmptyError, setNameEmptyError] = useState(false)
    const [shirtNumberEmptyError, setShirtNumberEmptyError] = useState(false)
    const [heightError, setHeightError] = useState(false)
    const [birthDayError, setBirthDayError] = useState(false)
    const [userNameEmptyError, setUserNameEmptyError] = useState(false)
    const [userNameExistError, setUserNameExistError] = useState(false)


    const [check, setCheck] = useState(0)
    const [save, setSave] = useState(0)
    const [loading, setLoading] = useState(false)
    const animation = useRef(null)

    const dispatch = useDispatch<any>()
    const navigation = useNavigation<any>()

    useEffect(() => {
        setSaveButton()
        if (save > 0) {
            const contiune = () => {
                if (!nameEmptyError
                    && !userNameEmptyError
                    && !userNameExistError
                    && !shirtNumberEmptyError
                    && !shirtNumberEmptyError
                    && !heightError
                    && !birthDayError) {
                    setLoading(true)
                    handleSave()
                }
            }
            contiune()
        }
    }, [save])

    useEffect(() => {
        if (check > 0) {
            onPressSave().then(
                () => setSave(save + 1)
            )
        }
    }, [check])

    const setSaveButton = () => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.shareButton}>
                    <TouchableOpacity onPress={() => setCheck(check + 1)}>
                        <Text style={styles.shareText}>Kaydet</Text>
                    </TouchableOpacity>
                </View>
            )
        });
    };


    const pickHeaderPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 2],
            quality: 1,
        })

        if (!result.canceled) {
            const manipResult = await manipulateAsync(
                result.assets[0].uri,
                [],
                { compress: 0.01, format: SaveFormat.JPEG }
            )
            setHeaderPhoto(manipResult.uri)
        }
    }

    const pickProfilePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 2],
            quality: 1,
        })

        if (!result.canceled) {
            const manipResult = await manipulateAsync(
                result.assets[0].uri,
                [],
                { compress: 0.01, format: SaveFormat.JPEG }
            )
            setProfilePhoto(manipResult.uri)
        }
    }

    const uploadImage = async (imageUri: any, name: string) => {
        try {
            const response = await fetch(imageUri)
            const blobFile = await response.blob()

            const reference = ref(storage, name)
            const result = await uploadBytes(reference, blobFile)
            const url = await getDownloadURL(result.ref)

            return url
        } catch (err) {
            return Promise.reject(err)
        }
    }

    const checkUsername = async () => {
        if (userName == '') {
            setUserNameEmptyError(true)
        } else {
            setUserNameEmptyError(false)
            if (userName !== profileModel!.userName) {
                const q = query(collection(db, "users"), where('userName', "==", userName))
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setUserNameExistError(false)
                } else {
                    setUserNameExistError(true)
                }
            }
        }
    }

    const checkName = () => {
        if (name == '') {
            setNameEmptyError(true)
        } else {
            setNameEmptyError(false)
        }
    }

    const checkShirtNumber = async () => {
        if (shirtNumber == '') {
            setShirtNumberEmptyError(true)
        } else {
            setShirtNumberEmptyError(false)
        }
    }

    const checkHeight = async () => {
        if (height == '') {
            setHeightError(true)
        } else {
            if (parseInt(height!) > 250 || parseInt(height!) < 120) {
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
            setBirthDayError(true)
            return false
        }

        if (day < 1 || day > monthDays[month]) {
            setBirthDayError(true)
            return false
        }

        return true
    }

    const checkBirthDay = async () => {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = birthDay!.match(dateRegex);

        if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);

            if (year < 1930 || year > 2012) {
                setBirthDayError(true)
                return;
            }

            if (!isValidDate(day, month, year)) {
                return;
            }

            setBirthDayError(false)
        } else {
            setBirthDayError(true)
        }
    }

    const onPressSave = async () => {
        checkName()
        checkShirtNumber()
        checkHeight()
        checkBirthDay()
        checkUsername()
    }

    const handleSave = async () => {
        if (headerPhoto !== profileModel!.headerPhoto) {
            await uploadImage(headerPhoto, profileModel!.id + 'header').then(
                async (image) => {
                    const docData = {
                        headerPhoto: image
                    }
                    await updateDoc(doc(db, "users", profileModel!.id), docData)
                }
            )
        }

        if (profilePhoto !== profileModel!.headerPhoto) {
            await uploadImage(profilePhoto, profileModel!.id + 'profile').then(
                async (image) => {
                    const docData = {
                        profilePhoto: image
                    }
                    await updateDoc(doc(db, "users", profileModel!.id), docData)
                }
            )
        }

        const docData = {
            birth: birthDay,
            height: height,
            name: name,
            shirtNumber: shirtNumber,
            position: position,
            preferredFoot: preferredFoot,
            userName: userName,
        }

        updateDoc(doc(db, "users", profileModel!.id), docData).then(
            await dispatch(ProfileReducer.getProfile())
        ).finally(() => navigation.pop())
    }

    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    const formattedUserName = (text: string) => {
        const cleanedText = text.replace(/[^a-zA-Z0-9_]/g, '')
        setUserName(cleanedText)
    }

    const formattedShirtNumber = (number: string) => {
        let formattedShirtNumber = number.replace(/[^0-9]/g, '')
        setShirtNumber(formattedShirtNumber)
    }

    const formattedHeight = (number: string) => {
        let formattedHeight = number.replace(/[^0-9]/g, '')
        setHeight(formattedHeight)
    }

    const formattedDate = (date: string) => {

        let formattedDate = date.replace(/[^0-9]/g, '')
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

    return (
        <>
            {
                loading ?
                    <View style={styles.loadingView}>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={styles.lottieLoading}
                            source={require('../../../assets/loading.json')}
                        />
                    </View>
                    :
                    <KeyboardAwareScrollView
                        style={styles.container}>
                        <View>
                            <TouchableOpacity onPress={pickHeaderPhoto}>
                                <Image style={styles.headerImage} source={{ uri: headerPhoto }} />
                            </TouchableOpacity>
                            <View style={styles.profileImageView} />
                            <TouchableOpacity style={styles.profileImage} onPress={pickProfilePhoto}>
                                <Avatar.Image size={70} style={styles.avatar} source={{ uri: profilePhoto }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.view}>
                            <View style={styles.viewInputLine}>
                                <Text style={styles.inputText}>İsim</Text>
                                <TextInput
                                    placeholder="İsim"
                                    value={name}
                                    onChangeText={text => setName(text)}
                                    style={styles.input}
                                    maxLength={30}
                                    inputMode='text'
                                />
                            </View>
                            {nameEmptyError && <Text style={styles.errorText}>İsim boş olamaz!</Text>}
                            <Divider style={styles.divider} />
                            <View style={styles.viewInputLine}>
                                <Text style={styles.inputText}>Kullanıcı adı</Text>
                                <TextInput
                                    placeholder="Kullanıcı adı"
                                    value={userName}
                                    onChangeText={text => formattedUserName(text.toLocaleLowerCase())}
                                    style={styles.input}
                                    maxLength={20}
                                    inputMode='text'
                                />
                            </View>
                            {userNameExistError && <Text style={styles.errorText}>Bu kullanıcı zaten kullanılmış!</Text>}
                            {userNameEmptyError && <Text style={styles.errorText}>Kullanıcı adı kısmı boş olamaz!</Text>}
                            <Divider style={styles.divider} />
                            <View style={styles.viewInputLine}>
                                <Text style={styles.inputText}>Forma numarası</Text>
                                <TextInput
                                    placeholder="Forma numarası"
                                    value={shirtNumber}
                                    onChangeText={text => formattedShirtNumber(text)}
                                    style={styles.input}
                                    maxLength={2}
                                    inputMode='numeric'
                                />
                            </View>
                            {shirtNumberEmptyError && <Text style={styles.errorText}>Forma numarası boş olamaz!</Text>}
                            <Divider style={styles.divider} />
                            <View style={styles.viewInputLine}>
                                <Text style={styles.inputText}>Boy</Text>
                                <TextInput
                                    placeholder="Boy"
                                    value={height}
                                    onChangeText={text => formattedHeight(text)}
                                    style={styles.input}
                                    maxLength={3}
                                    inputMode='numeric'
                                />
                            </View>
                            {heightError && <Text style={styles.errorText}>Lütfen geçerli bir boy giriniz!</Text>}
                            <Divider style={styles.divider} />
                            <View style={styles.viewInputLine}>
                                <Text style={styles.inputText}>Doğum tarihi</Text>
                                <TextInput
                                    placeholder="Doğum tarihi"
                                    value={birthDay}
                                    onChangeText={text => formattedDate(text)}
                                    style={styles.input}
                                    maxLength={30}
                                    inputMode='numeric'
                                />
                            </View>
                            {birthDayError && <Text style={styles.errorText}>Lütfen geçerli bir tarih giriniz!</Text>}
                            <Divider style={styles.divider} />
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
                    </KeyboardAwareScrollView>
            }
        </>
    )

}

const styles = StyleSheet.create({
    shareButton: {
        width: 70,
        borderRadius: 20,
        padding: 10,
        backgroundColor: colors.azure,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    shareText: {
        color: colors.white
    },
    headerImage: {
        height: 150,
        backgroundColor: colors.white
    },
    profileImageView: {
        height: 76,
        width: 76,
        marginTop: 115,
        marginLeft: 20,
        position: 'absolute',
        backgroundColor: colors.white,
        borderRadius: 38,
    },
    profileImage: {
        marginTop: 118,
        marginLeft: 23,
        position: 'absolute',
        backgroundColor: colors.white,
        borderRadius: 38,
    },
    avatar: {
        backgroundColor: colors.white
    },
    container: {
        flex: 1,
    },
    view: {
        paddingTop: 50,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 25
    },
    input: {
        width: Dimensions.get('window').width - 100,
    },
    divider: {
        width: Dimensions.get('window').width,
        marginVertical: 10,
        backgroundColor: colors.grey
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
        marginLeft: 110,
    },
    viewInputLine: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputText: {
        width: 100,
        fontWeight: 'bold'
    },
    viewRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lottieLoading: {
        width: 200,
        height: 200
    },
})

export default ProfileEdit
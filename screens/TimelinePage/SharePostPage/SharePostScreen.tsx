import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import colors from '../../../utilies/colors'
import { Avatar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../../../redux/ReduxStore'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../../../firebase'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import LottieView from 'lottie-react-native'

const SharePostScreen = () => {

    const [text, setText] = useState<string>('')
    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const navigation = useNavigation<any>()
    const [image, setImage] = useState<any>(null)
    const animation = useRef(null)
    const [saved, setSaved] = useState(0)

    useEffect(() => {
        setShareButton()
    }, [])

    useEffect(() => {
        if (saved === 1) {
            onPressShare()
        }
    }, [saved])

    const setShareButton = () => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.shareButton}>
                    <TouchableOpacity onPress={() => setSaved(saved + 1)} >
                        <Text style={styles.shareText}>Paylaş</Text>
                    </TouchableOpacity>
                </View>
            )
        })
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 2],
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }



    const onPressShare = async () => {
        //setSaved(true)
        const docData = {
            createdAt: new Date(),
            userId: profileModel?.id,
            description: text,
            likes: [],
        }
        const postsCollectionRef = collection(db, "posts")

        await addDoc(postsCollectionRef, docData).then(
            async (value) => {
                if (image == null) {
                    console.log('buraya girdi')
                    const docData = {
                        postId: value.id
                    }
                    await updateDoc(doc(db, "posts", value.id), docData)
                } else {
                    await uploadImage(image, value.id).then(
                        async (image) => {
                            const docData = {
                                postId: value.id,
                                postPhoto: image
                            }
                            await updateDoc(doc(db, "posts", value.id), docData)
                        }
                    )
                }
            }
        ).then(() => navigation.pop())
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

    return (

        <>
            {saved ?
                <View style={styles.loadingView}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={styles.lottieLoading}
                        source={require('../../../assets/loading.json')}
                    />
                </View>
                :
                <View style={styles.view}>
                    <View style={styles.viewRow}>
                        <Avatar.Image size={45} source={{ uri: profileModel?.profilePhoto }} style={{ backgroundColor: colors.white }} />
                        <TextInput
                            placeholder="Rakip mi arıyorsun?"
                            value={text}
                            onChangeText={text => setText(text)}
                            style={styles.input}
                            inputMode='text'
                            multiline
                            maxLength={280}
                            autoFocus
                        />
                    </View>
                    <View style={styles.photoView}>
                        {image == null ?
                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Ionicons name="image-outline" size={50} color="black" />
                                <Text>Fotoğraf yüklemek için tıkla!</Text>
                            </TouchableOpacity>
                            :
                            <>
                                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                    <Image source={{ uri: image }} style={styles.postPhoto} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deletePhotoButton} onPress={() => setImage(null)}>
                                    <Ionicons name="close-outline" size={20} color="white" />
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lottieLoading: {
        width: 200,
        height: 200
    },
    view: {
        alignItems: 'center',
        padding: 10,
    },
    viewRow: {
        flexDirection: 'row'
    },
    postModal: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: colors.white,
        padding: 20,
        justifyContent: 'flex-start',
    },
    input: {
        marginLeft: 10,
        width: Dimensions.get('window').width - 75,
        height: 140
    },
    photoButton: {
        alignItems: 'center'
    },
    photoView: {
        marginTop: 10,
        width: Dimensions.get('window').width - 75,
        height: 200,
    },
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
    postPhoto: {
        height: 200,
        width: Dimensions.get('window').width - 75,
        borderRadius: 10
    },
    deletePhotoButton: {
        margin: 5,
        position: 'absolute',
        backgroundColor: colors.red,
        borderRadius: 12,
        width: 24, height: 24,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default SharePostScreen

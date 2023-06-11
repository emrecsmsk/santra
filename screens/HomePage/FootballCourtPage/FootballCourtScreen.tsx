import { Dimensions, StyleSheet, View, Text, Image, Linking, Modal, TouchableOpacity } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import Swiper from 'react-native-swiper'
import { FieldValue, arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FootballCourtModel } from '../../../models/FootballCourtModel'
import { Button, Card, Dialog, Divider } from 'react-native-paper'
import colors from '../../../utilies/colors'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationState } from '../../../redux/ReduxStore'
import ProfileReducer from '../../../redux/reducers/ProfileReducer'

const FootballCourtScreen: FC = () => {

    const { profileModel } = useSelector((state: ApplicationState) => state.profileReducer)
    const route = useRoute<any>()
    const id: string = route.params && route.params.id
    const [footballCourt, setFootballCourt] = useState<FootballCourtModel>()
    const [isFavorite, setIsFavorite] = useState(profileModel?.favoriteFootballCourts.includes(id))
    const [date, setDate] = useState<string[]>()
    const [selectedDate, setSelectedDate] = useState<string>()
    const [selectedHour, setSelectedHour] = useState<string>()
    const navigation = useNavigation<any>()
    const dispatch = useDispatch<any>()

    useEffect(() => {
        getDate()
        const fetchFootballCourt = async () => {
            const q = query(collection(db, "footballCourts"),
                where('id', "==", id))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setFootballCourt(doc.data() as FootballCourtModel)
            })
        }
        fetchFootballCourt()
    }, [])

    const [visible, setVisible] = useState(false);
    const showDialog = (date: string, hour: string) => {
        setSelectedDate(date)
        setSelectedHour(hour)
        setVisible(true)
    }
    const hideDialog = () => setVisible(false);

    const handlePress = () => {
        const address = footballCourt!.address;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`
        Linking.openURL(url);
    }

    const getDate = () => {
        const today = new Date();
        const endDate = new Date();

        endDate.setDate(today.getDate() + 6);

        const data = [];
        const dateOptions: any = { day: '2-digit', month: '2-digit', year: 'numeric' };

        while (today <= endDate) {
            const formattedDate = today.toLocaleDateString('tr-TR', dateOptions)
            data.push(formattedDate);
            today.setDate(today.getDate() + 1);
        }
        setDate(data)
    }

    const formatDate = (tarih: string): string => {
        const pieces = tarih.split('.');
        const day = pieces[0];
        const month = pieces[1];

        const months = [
            'Ocak',
            'Şubat',
            'Mart',
            'Nisan',
            'Mayıs',
            'Haziran',
            'Temmuz',
            'Ağustos',
            'Eylül',
            'Ekim',
            'Kasım',
            'Aralık'
        ];

        const formattedDate = `${day} ${months[Number(month) - 1]}`;

        return formattedDate;
    }

    const makeReservation = async (selectedDate: string, selectedHour: string) => {
        footballCourt!.reservation[selectedDate][selectedHour] = profileModel!.id

        const formattedDate: string = formatDate(selectedDate)

        const newNextMatches: FieldValue = arrayUnion({
            footballCourt: footballCourt?.name,
            date: formattedDate + ' ' + selectedHour
        })
        const docData = {
            nextMatches: newNextMatches
        }
        await updateDoc(doc(db, "users", profileModel!.id), docData)
        dispatch(ProfileReducer.getProfile())

        const docRef = doc(db, 'footballCourts', id)
        await updateDoc(docRef, {
            reservation: footballCourt!.reservation
        })
        hideDialog()
    }

    const onPressFavorite = async () => {
        if (isFavorite) {
            const newFavorite: FieldValue = arrayRemove(id)
            const docData = {
                favoriteFootballCourts: newFavorite,
            }
            await updateDoc(doc(db, "users", profileModel!.id), docData)
        } else {
            const newFavorite: FieldValue = arrayUnion(id)
            const docData = {
                favoriteFootballCourts: newFavorite
            }
            await updateDoc(doc(db, "users", profileModel!.id), docData)
        }
        setIsFavorite(!isFavorite)
        dispatch(ProfileReducer.getProfile())
    }

    const goBack = () => {
        navigation.pop();
    }

    return (
        <>
            {
                footballCourt &&
                <ScrollView>
                    <View style={styles.swiperView}>
                        <Swiper>
                            {
                                footballCourt.photos.map((photo, index) =>
                                    <Image key={index} style={styles.photos} source={{ uri: photo }} />)
                            }
                        </Swiper>
                    </View>
                    <TouchableOpacity style={styles.backButton}
                        onPress={goBack}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favoriteButton}
                        onPress={onPressFavorite}>
                        <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={25} color='black' />
                    </TouchableOpacity>
                    <View style={styles.viewHeader}>
                        <View>
                            <Text style={styles.title}>{footballCourt.name}</Text>
                            <View style={styles.locationView}>
                                <Ionicons name={"location-sharp"} size={20} color='black' />
                                <Text>{footballCourt.location}</Text>
                            </View>
                        </View>
                        <Button style={styles.getDirectionsButton} icon="directions" mode="contained" onPress={handlePress}>
                            Yol tarifi al
                        </Button>
                    </View>
                    <Card style={styles.facilitiesCard}>
                        <View style={styles.facilitiesText}>
                            <Text style={styles.facilitiesText}>Saha bilgileri</Text>
                            <Divider style={{ width: 30, height: 1 }} />
                        </View>
                        <View style={styles.facilities}>
                            <View style={styles.facilitiesFlex}>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.indoorField ? styles.existFacilities : styles.notExistFacilities}>Kapalı saha</Text>
                                    {
                                        footballCourt.facilities.indoorField &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.cafeteria ? styles.existFacilities : styles.notExistFacilities}>Kafeterya</Text>
                                    {
                                        footballCourt.facilities.cafeteria &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.parkingLot ? styles.existFacilities : styles.notExistFacilities}>Otopark</Text>
                                    {
                                        footballCourt.facilities.parkingLot &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.shower ? styles.existFacilities : styles.notExistFacilities}>Duş</Text>
                                    {
                                        footballCourt.facilities.shower &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.wifi ? styles.existFacilities : styles.notExistFacilities}>WIFI</Text>
                                    {
                                        footballCourt.facilities.wifi &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                            </View>
                            <View style={styles.facilitiesFlex}>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.outdoorField ? styles.existFacilities : styles.notExistFacilities}>Açık saha</Text>
                                    {
                                        footballCourt.facilities.outdoorField &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.creditCardPayment ? styles.existFacilities : styles.notExistFacilities}>Kredi Kartı İle Ödeme</Text>
                                    {
                                        footballCourt.facilities.creditCardPayment &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.shuttleService ? styles.existFacilities : styles.notExistFacilities}>Servis</Text>
                                    {
                                        footballCourt.facilities.shuttleService &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                                <View style={styles.viewFacilities}>
                                    <Text style={footballCourt.facilities.shoeRental ? styles.existFacilities : styles.notExistFacilities}>Ayakkabı Kiralama</Text>
                                    {
                                        footballCourt.facilities.shoeRental &&
                                        <Ionicons name={"checkmark-sharp"} size={20} color='darkgreen' />
                                    }
                                </View>
                            </View>
                        </View>
                    </Card>
                    <Card style={styles.reservationCard}>
                        <View style={styles.reservationView}>
                            <Swiper showsButtons showsPagination={false}>
                                {
                                    date?.map(
                                        (date, index) =>
                                            <View key={index} style={styles.reservationDayView}>
                                                <Text style={styles.dateText}>{date}</Text>
                                                <View style={styles.viewHours}>
                                                    <Button
                                                        style={footballCourt.reservation[date]?.['16:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['16:00'] === undefined ? showDialog(date, '16:00') : null}>
                                                        16:00
                                                    </Button>
                                                    <Button style={footballCourt.reservation[date]?.['17:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['17:00'] === undefined ? showDialog(date, '17:00') : null}>
                                                        17:00
                                                    </Button>
                                                    <Button style={footballCourt.reservation[date]?.['18:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['18:00'] === undefined ? showDialog(date, '18:00') : null}>
                                                        18:00
                                                    </Button>
                                                </View>
                                                <View style={styles.viewHours}>
                                                    <Button style={footballCourt.reservation[date]?.['19:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['19:00'] === undefined ? showDialog(date, '19:00') : null}>
                                                        19:00
                                                    </Button>
                                                    <Button style={footballCourt.reservation[date]?.['20:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['20:00'] === undefined ? showDialog(date, '20:00') : null}>
                                                        20:00
                                                    </Button>
                                                    <Button style={footballCourt.reservation[date]?.['21:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['21:00'] === undefined ? showDialog(date, '21:00') : null}>
                                                        21:00
                                                    </Button>
                                                </View>
                                                <View style={styles.viewHours}>
                                                    <Button style={footballCourt.reservation[date]?.['22:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['22:00'] === undefined ? showDialog(date, '22:00') : null}>
                                                        22:00
                                                    </Button>
                                                    <Button style={footballCourt.reservation[date]?.['23:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['23:00'] === undefined ? showDialog(date, '23:00') : null}>
                                                        23:00
                                                    </Button>
                                                    <Button style={footballCourt.reservation[date]?.['24:00'] === undefined ? styles.availableHour : styles.notAvailableHour} mode="contained" onPress={() => footballCourt.reservation[date]?.['24:00'] === undefined ? showDialog(date, '24:00') : null}>
                                                        24:00
                                                    </Button>
                                                </View>
                                            </View>
                                    )
                                }
                            </Swiper>
                        </View>
                    </Card>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Text style={styles.dialogTitle}>Satın almayı onaylıyor musun?</Text>
                        <Dialog.Actions style={styles.dialogActions}>
                            <Button onPress={hideDialog}>Vazgeç</Button>
                            <Button onPress={() => makeReservation(selectedDate!, selectedHour!)}>Onayla</Button>
                        </Dialog.Actions>
                    </Dialog>
                </ScrollView>
            }
        </>
    )
}

const styles = StyleSheet.create({
    swiperView: {
        height: Dimensions.get('window').width / 3 * 2,
        width: Dimensions.get('window').width,
    },
    photos: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width / 3 * 2
    },
    viewHeader: {
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: 'row'
    },
    title: {
        width: Dimensions.get('window').width - 150,
        fontWeight: 'bold',
        fontSize: 25
    },
    facilitiesText: {
        fontSize: 15,
        alignItems: 'center',
        paddingBottom: 10,
    },
    locationView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    getDirectionsButton: {
        width: 130,
        height: 40,
        backgroundColor: colors.black
    },
    facilitiesCard: {
        margin: 10,
        padding: 10,
        backgroundColor: colors.white,
        justifyContent: 'center'
    },
    facilities: {
        flexDirection: 'row'
    },
    facilitiesFlex: {
        flex: 1
    },
    existFacilities: {
        fontWeight: 'bold',
        fontSize: 15
    },
    notExistFacilities: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.grey
    },
    viewFacilities: {
        height: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    reservationCard: {
        backgroundColor: colors.white,
        marginHorizontal: 10

    },
    reservationView: {
        height: 190
    },
    reservationDayView: {
        paddingTop: 10,
        paddingHorizontal: 35,
    },
    dateText: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    viewHours: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-around'
    },
    availableHour: {
        backgroundColor: 'green'
    },
    notAvailableHour: {
        backgroundColor: colors.red
    },
    dialog: {
        backgroundColor: 'white',
        padding: 20,
        height: 50,
        width: 50
    },
    dialogTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25
    },
    dialogActions: {
        justifyContent: 'center'
    },
    backButton: {
        position: 'absolute',
        marginTop: 30,
        marginLeft: 20,
        backgroundColor: colors.white,
        borderRadius: 10
    },
    favoriteButton: {
        width: 35,
        height: 35,
        position: 'absolute',
        marginTop: Dimensions.get('window').width / 3 * 2 - 25,
        marginLeft: 20,
        backgroundColor: colors.white,
        alignItems: 'center',
        borderRadius: 5
    },
})

export default FootballCourtScreen
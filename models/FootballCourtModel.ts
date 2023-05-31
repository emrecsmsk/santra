export interface FootballCourtModel {
    id: string,
    name: string,
    location: string,
    photos: string[],
    facilities: FacilitiesModel,
    reservation: ReservationDataModel,
    address: string
}

import bookingsData from '../data/bookings-data.js';
import roomsData from '../data/rooms-data.js';
import usersData from '../data/users-data.js';
import roomServicesData from '../data/roomServices-data.js'

class Hotel {
  constructor() {
    this.users = usersData.users;
    this.bookings = bookingsData.bookings;
    this.roomServices = roomServicesData.roomServices;
    this.rooms = roomsData.rooms;
  }

  returnTotalDayRevenue(date) {
    

    let todayRoomServicesRevenue = this.roomServices.filter(roomService => roomService.date === date)
    
  }

 

  returnRoomServicesRevenue(date) {
    
  }

  returnTodaysBookings(date) {
    return this.bookings.filter(booking => booking.date === date)
  }

  returnTodaysBookedRooms(date) {
    let todaysBookedRoomNumbers = this.returnTodaysBookings(date).map(booking => {
      return booking.roomNumber
    })
    return roomsData.rooms.filter(room => {
      return todaysBookedRoomNumbers.includes(room.number)
    })
  }

  returnBookingRevenue(date) {
    let todaysBookedRooms = this.returnTodaysBookedRooms(date);
    return todaysBookedRooms.reduce((roomRevenue, room) => {
      roomRevenue += room.costPerNight;
      return roomRevenue
    }, 0)
  }

}

  

export default Hotel;
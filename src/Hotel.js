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

  returnTodaysTotalRevenue(date) {
    let todaysRoomServicesRevenue = this.returnTodaysRoomServicesRevenue(date)
    let todaysBookingRevenue = this.returnTodaysBookingRevenue(date)
    return todaysRoomServicesRevenue + todaysBookingRevenue;
  }

  returnTodaysRoomServicesCharges(date) {
    return this.roomServices.filter(roomService => roomService.date === date)
  }

  returnTodaysRoomServicesRevenue(date) {
    let todaysRoomServiceCharges = this.returnTodaysRoomServicesCharges(date) 
    let rawRevenue = todaysRoomServiceCharges.reduce((totalRevenue, roomServiceCharge) => {
      totalRevenue += roomServiceCharge.totalCost
      return totalRevenue
    }, 0)
    return parseFloat(rawRevenue.toFixed(2))
  }

  returnTodaysBookings(date) {
    return this.bookings.filter(booking => booking.date === date)
  }

  returnTodaysBookedRooms(date) {
    let todaysBookedRoomNumbers = this.returnTodaysBookedRoomNumbers(date)
    return roomsData.rooms.filter(room => {
      return todaysBookedRoomNumbers.includes(room.number)
    })
  }

  returnTodaysBookedRoomNumbers(date) {
    return this.returnTodaysBookings(date).map(booking => {
      return booking.roomNumber
    })
  }

  returnTodaysBookingRevenue(date) {
    let todaysBookedRooms = this.returnTodaysBookedRooms(date);
    return todaysBookedRooms.reduce((roomRevenue, room) => {
      roomRevenue += room.costPerNight;
      return roomRevenue
    }, 0)
  }

  returnTodaysUnbookedRooms(date) {
    return this.rooms.filter(room => {
      return !this.returnTodaysBookedRoomNumbers(date).includes(room.number)
    })
  }

  returnTodaysOccupancyPercentage(date) {
    return parseInt((this.returnTodaysBookedRooms(date).length / 
      this.rooms.length * 100))
  }

  filterAvailableRooms(date, roomType) {
    let availableRooms = this.returnTodaysUnbookedRooms(date);
    return availableRooms.filter(room => room.roomType === roomType)
  }

}

  

export default Hotel;
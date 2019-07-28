// import bookingsData from '../data/bookings-data.js';
// import roomsData from '../data/rooms-data.js';
// import usersData from '../data/users-data.js';
// import roomServicesData from '../data/roomServices-data.js';
import Customer from './Customer.js'

class Hotel {
  constructor(users, bookings, roomServices, rooms, date) {
    this.users = users.map(user => new Customer(user));
    this.bookings = bookings;
    this.roomServices = roomServices;
    this.rooms = rooms;
    this.customerSelected = null;
    this.currentDate = date;
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
    if (todaysRoomServiceCharges.length) {
      let rawRevenue = todaysRoomServiceCharges.reduce((totalRevenue, roomServiceCharge) => {
        totalRevenue += roomServiceCharge.totalCost
        return totalRevenue
      }, 0)
      return parseFloat(rawRevenue.toFixed(2))
    } else {
      return 0
    }
  }

  returnTodaysBookings(date) {
    return this.bookings.filter(booking => booking.date === date)
  }

  returnTodaysBookedRooms(date) {
    let todaysBookedRoomNumbers = this.returnTodaysBookedRoomNumbers(date)
    return this.rooms.filter(room => {
      return todaysBookedRoomNumbers.includes(room.number)
    })
  }

  returnTodaysBookedRoomNumbers(date) {
    return this.returnTodaysBookings(date).map(booking => {
      return booking.roomNumber
    })
  }

  returnMostPopularBookingDate() {
    let dates = [...new Set(this.bookings.map(booking => booking.date))]
    let mostPopularDate = null;
    let highestNumberOfBookings = dates.reduce((acc, date) => {
      if (this.returnTodaysBookedRoomNumbers(date).length > acc) {
        mostPopularDate = date;
        acc = this.returnTodaysBookedRoomNumbers(date).length;
      }
      return acc
    }, 0)
    return {date: `${mostPopularDate}`, bookings: `${highestNumberOfBookings}`};
  }

  returnLeastPopularBookingDate() {
    let dates = [...new Set(this.bookings.map(booking => booking.date))]
    let leastPopularDate = null;
    let leastNumberOfBookings = dates.reduce((acc, date) => {
      if (this.returnTodaysBookedRoomNumbers(date).length < acc) {
        leastPopularDate = date;
        acc = this.returnTodaysBookedRoomNumbers(date).length;
      }
      return acc
    }, 51)
    return {date: `${leastPopularDate}`, bookings: `${leastNumberOfBookings}`};
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
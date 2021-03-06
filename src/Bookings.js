// import bookingsData from '../data/bookings-data.js';
// import Rooms from './Rooms.js'
// import Hotel from './Hotel.js'


class Bookings {
  constructor(bookingObject) {
    this.userID = bookingObject.userID;
    this.date = bookingObject.date;
    this.roomNumber = bookingObject.roomNumber;
  }

  addToBookingsList(hotel) {
    hotel.bookings.push(this);
  }

  unbookBooking(hotel) {
    let index = hotel.bookings.indexOf(this)
    hotel.bookings.splice(index, 1)
  }

}

export default Bookings;
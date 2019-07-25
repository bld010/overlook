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



}

export default Hotel;
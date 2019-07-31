import bookingsData from './mock-data/bookings-data.js';
import roomsData from './mock-data/rooms-data.js';
import usersData from './mock-data/users-data.js';
import roomServicesData from './mock-data/roomServices-data.js'
import Hotel from '../src/Hotel.js'
import Bookings from '../src/Bookings.js'

import chai from 'chai';
import spies from 'chai-spies';
const expect = chai.expect;
chai.use(spies);

let date1 = null;
let hotel1 = null;
let booking = null;
let bookingsTestData = bookingsData.bookings.slice()

describe('Bookings', function() {

  beforeEach(() => {
    date1 = "2019/09/22"
    hotel1 = new Hotel(usersData.users, bookingsTestData, roomServicesData.roomServices, roomsData.rooms, date1)
    booking = new Bookings({userID: 10, date: '2019/09/22', roomNumber: 45})
  })

  it('should be an instance of the Bookings class', () => {
    expect(booking).to.to.an.instanceOf(Bookings)
  })

  it('should book a room for a given customer on a given date', () => {
    let bookingsLength = hotel1.bookings.length;
    booking.addToBookingsList(hotel1)
    expect(hotel1.bookings.length).to.equal(bookingsLength + 1)
  })

  it('should unbook a room for a given customer on a given date', () => {
    let bookingsLength = hotel1.bookings.length;
    booking.unbookBooking(hotel1)
    expect(hotel1.bookings.length).to.equal(bookingsLength -1)
  })

})
import bookingsData from '../data/bookings-data.js';
import roomsData from '../data/rooms-data.js';
import usersData from '../data/users-data.js';
import roomServicesData from '../data/roomServices-data.js'
import Hotel from '../src/Hotel.js'

import chai from 'chai';
import spies from 'chai-spies';
const expect = chai.expect;
chai.use(spies);

let hotel = null;

describe('Hotel', function() {

  beforeEach(() => {
    hotel = new Hotel()
  })

  it('should be an instance of Hotel', () => {
    expect(hotel).to.be.an.instanceOf(Hotel);
  })

  it('should hold on to all customer data', () => {
    expect(hotel.users.length).to.equal(usersData.users.length);
    expect(hotel.users[0]).to.eql(usersData.users[0]);
  })

  it('should hold on to all bookings data', () => {
    expect(hotel.bookings.length).to.equal(bookingsData.bookings.length);
    expect(hotel.bookings[0]).to.eql(bookingsData.bookings[0]);
  })

  it('should hold on to all room service data', () => {
    expect(hotel.roomServices.length).to.equal(roomServicesData.roomServices.length);
    expect(hotel.roomServices[0]).to.eql(roomServicesData.roomServices[0]);
  })

  it('should hold on to all room data', () => {
    expect(hotel.rooms.length).to.equal(roomsData.rooms.length);
    expect(hotel.rooms[0]).to.eql(roomsData.rooms[0]);
  })

  it('should return the bookings for a given date', () => {

  })

  it('should return the rooms booked for a given date', () => {

  })

  

  it.only('should calculate booking revenue for a given day', () => {

    expect(hotel.returnBookingRevenue("2019/09/22")).to.equal(7766.5);

  })

})

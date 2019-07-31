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
let date = "2019/09/22"

describe('Hotel', function() {

  beforeEach(() => {
    hotel = new Hotel(usersData.users, bookingsData.bookings, roomServicesData.roomServices, roomsData.rooms, date)
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
    expect(hotel.returnTodaysBookings("2019/09/22").length).to.equal(24);
    expect(hotel.returnTodaysBookings("2019/09/22")[0].date).to.equal("2019/09/22");
  })

  it('should return the rooms booked for a given date', () => {
    expect(hotel.returnTodaysBookedRooms("2019/09/22").length).to.equal(24);
    expect(hotel.returnTodaysBookedRooms("2019/09/22")[0]).to.equal(roomsData.rooms[0]);
  })

  it('should calculate booking revenue for a given day', () => {
    expect(hotel.returnTodaysBookingRevenue("2019/09/22")).to.equal(7766.5);
  })

  it('should return unbooked rooms for a given date', () => {
    expect(hotel.returnTodaysUnbookedRooms("2019/09/22").length).to.equal(26);
  })

  it('should return the occupancy percentage for a given day', () => {
    expect(hotel.returnTodaysOccupancyPercentage("2019/09/22")).to.equal(48)
  })

  it('should return all room service charges for a given day', () => {
    expect(hotel.returnTodaysRoomServicesCharges("2019/10/28").length).to.equal(2)
  })

  it('should calculate all room service revenue for a given day', () => {
    expect(hotel.returnTodaysRoomServicesRevenue("2019/10/28")).to.equal(30.05)
  })

  it('should calculate total revenue for a given day', () => {
    expect(hotel.returnTodaysTotalRevenue("2019/10/28")).to.equal(8036.92)
  })

  it('should return the most popular booking date', () => {
    expect(hotel.returnMostPopularBookingDate().date).to.equal('2019/10/28')
  })

  it('should return the least popular booking date', () => {
    expect(hotel.returnLeastPopularBookingDate().date).to.equal('2019/07/23')
  })

  it('should filter available rooms by type for a given date', () => {
    expect(hotel.filterAvailableRooms('2019/07/31', 'single room').length).to.equal(10);
    expect(hotel.filterAvailableRooms('2019/07/31', 'residential suite').length).to.equal(4);
    expect(hotel.filterAvailableRooms('2019/07/31', 'junior suite').length).to.equal(6);
    expect(hotel.filterAvailableRooms('2019/07/31', 'suite').length).to.equal(4)
  })

})

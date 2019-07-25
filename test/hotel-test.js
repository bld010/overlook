import bookingsData from '../data/bookings-data.js';
import roomsData from '../data/rooms-data.js';
import usersData from '../data/users-data.js';
import roomServicesData from '../data/roomServices-data.js'

import chai from 'chai';
import spies from 'chai-spies';
const expect = chai.expect;
chai.use(spies);

describe('Hotel', function() {

  it.only('should be an instance of Hotel', () => {
    expect(hotel).to.be.an.instanceOf(Hotel);
  })

  it('should hold on to all customer data', () => {

  })

  it('should hold on to all bookings data', () => {

  })

  it('should hold on to all room service data', () => {

  })

  it('should hold on to all room data', () => {

  })

  it('should calculate total revenue for a given day', () {
    //this should really invoke bookings.returnDayRevenue() and roomServices.returnDayRevenue()
  })

})

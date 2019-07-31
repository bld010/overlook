import usersData from './mock-data/users-data.js';
import bookingsData from './mock-data/bookings-data.js';
import roomServicesData from './mock-data/roomServices-data.js';
import chai from 'chai';
import spies from 'chai-spies';
import Customer from '../src/Customer.js';
const expect = chai.expect;
chai.use(spies);

let bookings = null;
let customer1 = null;

describe('Customer', function() {

  beforeEach(() => {
    bookings = bookingsData.bookings.slice();
    customer1 = new Customer({ id: 2, name: "Chadrick Lowe"})
  })

  it('should be an instance of Customer', () => {
    expect(customer1).to.be.an.instanceOf(Customer)
  })

  it('should return a customer\'s booking data for all time', () => {
    expect(customer1.returnAllBookings(bookings).length).to.equal(26);
  })

  it('should return a customer\'s bookings for a day', () => {
    expect(customer1.returnBookingForDay(bookings, '2019/08/04').roomNumber).to.equal(38)
  })

  it('should return a customer\'s room service history', () => {
    
  })

})
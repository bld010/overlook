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
    let customer2 = new Customer({id: 100, name: 'Riley Mann'})
    let services = roomServicesData.roomServices.slice();
    expect(customer2.returnAllRoomServices(services).length).to.equal(1)
  })

  it('should return charges for a given day', () => {
    let customer2 = new Customer({id: 100, name: 'Riley Mann'})
    let services = roomServicesData.roomServices.slice();
    expect(customer2.returnTotalForDay(services, '2019/10/18')).to.equal('17.33')
  })

  it('should return a customers charges for a given day', () => {
    let customer2 = new Customer({id: 100, name: 'Riley Mann'})
    let services = roomServicesData.roomServices.slice();
    expect(customer2.returnChargesForDay(services, '2019/10/18').length).to.equal(1)
})

  it('should return all time service revenue for a given customer', () => {
    let customer3 = new Customer({id: 13,name: "Cleveland Schimmel"})
    let services = roomServicesData.roomServices.slice();
    expect(customer3.returnAllTimeRoomServiceDollars(services)).to.equal('35.11')
  })


})
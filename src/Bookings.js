import bookingsData from '../data/bookings-data.js';
import Rooms from '../src/Rooms.js'


import chai from 'chai';
import spies from 'chai-spies';
const expect = chai.expect;
chai.use(spies);

//need rooms and booking data to calculate day's revenue
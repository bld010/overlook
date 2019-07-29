import $ from 'jquery';
window.$ = window.jQuery = $;
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/datepicker';
import './css/base.scss';
import Hotel from './Hotel.js';
import Customer from './Customer.js'
import domUpdates from './domUpdates.js';
import './images/loading-spinner.gif'

let usersFetch = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users');
let roomsFetch = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms');
let bookingsFetch = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings');
let roomServicesFetch = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices'); 
let hotel = null;
let date = formatDate();

// Query Selectors

let $todaysDateDisplay = $('.section__main--general h2 span');
let $occupancyPercentage = $('.section__main--general h3 span').eq(0);
let $availableRooms = $('.section__main--general h3 span').eq(1);
let $todaysRevenue = $('.section__main--general h3 span').eq(2);
let $singleRoomsAvailable = $('.section__main--general ul li span').eq(0);
let $residentialSuitesAvailable = $('.section__main--general ul li span').eq(1);
let $juniorSuitesAvailable = $('.section__main--general ul li span').eq(2);
let $suitesAvailable = $('.section__main--general ul li span').eq(3);
let $todaysRoomServicesRevenue = $('.section__main--general ul li span').eq(4);
let $todaysBookingsRevenue = $('.section__main--general ul li span').eq(5);
let $mostPopularBookingDateSpan = $('.section__rooms--general span').eq(0);
let $mostPopularBookingTotalSpan = $('.section__rooms--general span').eq(1);
let $leastPopularBookingDateSpan = $('.section__rooms--general span').eq(2);
let $leastPopularBookingTotalSpan = $('.section__rooms--general span').eq(3);
let $navRoomsTab = $('.nav__rooms');
let $navCustomersTab = $('.nav__customers');
let $navMainTab = $('.nav__main');
let $navOrdersTab = $('.nav__orders');
let $generalOrderTable = $('.section__orders--general--table');
let $datePickerButton = $('#datepicker~button');
let $customerOrderTable = $('.section__orders--customer--table');
let $customerDayOrder = $('.section__orders--customer--daily-charge');
let $roomsSection = $('.section__rooms');
let $mainSection = $('.section__main');
let $ordersSection = $('.section__orders');
let $customersSection = $('.section__customers');
let $customerBookingTodaySpan =  $('.section__rooms--customer-booking-today span')
let $customerBookingsHistoryList = $('.section__rooms--customer-bookings-history ul');
let sections = [$mainSection, $ordersSection, $roomsSection, $customersSection]
let $datepicker = ('#datepicker');

$('.section__main--general--content').addClass('hidden')

Promise.all([usersFetch, bookingsFetch, roomServicesFetch, roomsFetch])
  .then(values => Promise.all(values.map(value => value.json())))
  .then(results => {
    let users = results.find(data => data.hasOwnProperty('users')).users;
    let rooms = results.find(data => data.hasOwnProperty('rooms')).rooms;
    let bookings = results.find(data => data.hasOwnProperty('bookings')).bookings;
    let roomServices = results.find(data => data.hasOwnProperty('roomServices')).roomServices;

    hotel = new Hotel(users, bookings, roomServices, rooms, date);

    console.log(hotel)
  });

function formatDate() {
  var date = new Date(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('/');
}

//pageLoad elements



//show progress bar, then run setTimeout

setTimeout(function () {
  $('.section__main--general--content').removeClass('hidden')
  $('.section__main--general--loading').addClass('hidden');
  populateItemsPageLoad();
},3000)

function populateItemsPageLoad() {
  $mostPopularBookingDateSpan.text(hotel.returnMostPopularBookingDate().date)
  $mostPopularBookingTotalSpan.text(hotel.returnMostPopularBookingDate().bookings)
  $leastPopularBookingDateSpan.text(hotel.returnLeastPopularBookingDate().date)
  $leastPopularBookingTotalSpan.text(50 - hotel.returnLeastPopularBookingDate().bookings)
  populateOrdersTableElements(hotel.returnTodaysRoomServicesCharges(hotel.currentDate),
  hotel.returnTodaysRoomServicesRevenue(hotel.currentDate), $generalOrderTable);
  $todaysDateDisplay.text(hotel.currentDate)
  $occupancyPercentage.text(hotel.returnTodaysOccupancyPercentage(hotel.currentDate) + '%');
  $availableRooms.text(hotel.returnTodaysUnbookedRooms(hotel.currentDate).length);
  $todaysRevenue.text('$ ' + hotel.returnTodaysTotalRevenue(hotel.currentDate).toFixed(2));
  $todaysRoomServicesRevenue.text('$ ' + hotel.returnTodaysRoomServicesRevenue(hotel.currentDate));
  $todaysBookingsRevenue.text(`$${(hotel.returnTodaysBookingRevenue(hotel.currentDate)).toFixed(2)}`);
  $singleRoomsAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'single room').length);
  $residentialSuitesAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'residential suite').length);
  $juniorSuitesAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'junior suite').length);
  $suitesAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'suite').length);
  loadAutocompleteSearch();
}

// search

function loadAutocompleteSearch() {
  $( '#header__search').autocomplete({
    source: hotel.users.map(user => user.name)
  });
}

$('.ui-autocomplete-input').focus(function() {
  $('.ui-autocomplete-input').val('');
  $('.header__search--error').addClass('hidden')
})

$('#header__search~button').click(function(e) {
  e.preventDefault();
  handleCustomerSearch();
})

function populateOrdersTableElements(charges, revenue, $tableElement) {
  let chargesTableElements = `<table>
    <thead>
      <tr>
        <th>Room</th>
        <th>Food</th>
        <th>Cost</th>
      </tr>
    </thead>
    <tbody>`;
  if (!charges.length) {
    chargesTableElements = `<p>No room service orders found.</p>`;
  } else {
    chargesTableElements += charges.reduce((acc, charge) => {
      acc += `
        <td>${hotel.bookings.find(booking => booking.userID === charge.userID).roomNumber} </td>
        <td>${charge.food}</td>
        <td>${charge.totalCost}</td>
      </tr>
      <tr>`
      return acc
    },'')
    chargesTableElements += `
          <td colspan=2>Total:</td>
          <td>${revenue}</td>
        </tr>
      </tbody>
      </table>` 
  }
  $tableElement.html(chargesTableElements)
}



// orders datepicker


$(function () {
  $('#datepicker').datepicker({ dateFormat: 'yy-mm-dd' });
});

$datePickerButton.click(function(e) {
  e.preventDefault();
  hotel.currentDate = $('#datepicker').val().split('-').join('/');
  populateItemsPageLoad();
  populateOrdersTableElements(hotel.returnTodaysRoomServicesCharges(hotel.currentDate),
  hotel.returnTodaysRoomServicesRevenue(hotel.currentDate), $generalOrderTable);
  if (hotel.customerSelected) {
    $('.section__orders--customer').removeClass('hidden');
    populateCustomerInfo(hotel.customerSelected, hotel.currentDate);
  } 
})

$('#datepicker').datepicker({
  dateFormat: 'yy-mm-dd'
});

function handleCustomerSearch() {
  let searchInput = $('.ui-autocomplete-input').val();
  $('.ui-autocomplete-input').val('');
  let foundUser = hotel.users.find(user => user.name === searchInput);
  if (!foundUser) {
    $('.header__search--error').removeClass('hidden')
  } else {
    hotel.customerSelected = foundUser;
    $('.section__orders--customer').removeClass('hidden');
    populateCustomerInfo(hotel.customerSelected, hotel.currentDate);
  }
}

function updateShowingDetailsSpan (user) {
  $('header h3 span:nth-of-type(1)').text(user.name)
}

function populateCustomerInfo(user, date) {
  $('header h3 span:nth-of-type(2)').removeClass('hidden');
  updateShowingDetailsSpan(user);
  populateOrdersCustomerInfo(user, hotel.roomServices, date);
  populateRoomsCustomerInfo(user, hotel.bookings, date)
}


function populateRoomsCustomerInfo(user, bookings, date) {
  let customerBookingHistoryListElements = generateBookingHistoryListElements(user, bookings);
  $customerBookingsHistoryList.html(customerBookingHistoryListElements)
  populateRoomsCustomerDay(user, bookings, date)
  $('.section__rooms--customer-bookings-history, .section__rooms--customer-booking-today').removeClass('hidden')
  
}

function populateRoomsCustomerDay(user, bookings, date) {
  let todaysBooking = user.returnBookingForDay(bookings, date);
  if (todaysBooking) {
    $('.section__rooms--customer-booking-today button').addClass('hidden');
    let room = hotel.returnTodaysBookedRooms(date).find(room => room.number === todaysBooking.roomNumber)
    $customerBookingTodaySpan.html(`
      <ul>
        <li>Room: ${todaysBooking.roomNumber}</li>
        <li>Type: ${room.roomType}</li>
        <li>Bidet: ${room.bidet}</li>
        <li>Bed Size: ${room.bedSize}</li>
        <li>Number of Beds: ${room.numBeds}</li>
        <li>Cost Per Night: $${room.costPerNight}</li>
      </ul>`);
  } else {
    $customerBookingTodaySpan.text('No bookings for today');
    $('.section__rooms--customer-booking-today button').removeClass('hidden');
  }
}

function generateBookingHistoryListElements(user, bookings) {
  let allCustomerBookings = user.returnAllBookings(bookings);
  if (allCustomerBookings.length) {
    return allCustomerBookings.sort((a,b) => a.date.localeCompare(b.date)).reduce((acc, booking) => {
      acc += 
      `<li>Date: ${booking.date}, Room: ${booking.roomNumber}</li>`
      return acc;
    }, ``)
  } else {
    return `<li>No Bookings Found for this User</li>`
  }
}

function populateOrdersCustomerInfo(user, roomServices, date) {
  let userDayCharges = user.returnChargesForDay(roomServices, date);
  let table = populateOrdersTableElements(user.returnChargesForDay(roomServices, date), 
    user.returnAllTimeRoomServiceDollars(roomServices), $customerOrderTable);
  populateCustomerDayOrder(user, roomServices, date);
}

function populateCustomerDayOrder(user, roomServices, date) {
  let dayCharges = user.returnChargesForDay(roomServices, date);
  let totalCharge = user.returnTotalForDay(roomServices, date);
  $customerDayOrder.text(`$${totalCharge}`);
}

function populateGeneralizedInfo() {
  $('header h3 span:nth-of-type(2)').addClass('hidden');
  $('header h3 span:nth-of-type(1)').text('All Customers');
  $('.ui-autocomplete-input').val('');
  hotel.customerSelected = null;
}

$('header h3 span:nth-of-type(2)').click(function() {
  populateGeneralizedInfo();
  $('.section__orders--customer').addClass('hidden');
  $('.section__rooms--customer-bookings-history').addClass('hidden')
  
})

$navRoomsTab.click(function() {
  handleSectionToggling($roomsSection)
})

$navCustomersTab.click(function() {
  handleSectionToggling($customersSection)
})

$navMainTab.click(function () {
  handleSectionToggling($mainSection)
})

$navOrdersTab.click(function () {
  handleSectionToggling($ordersSection)
})

function handleSectionToggling(selectedSection) {
  removeSelectedClass();
  unhideSelectedSection(selectedSection)
}

function removeSelectedClass() {
  sections.forEach(section => {
    section.removeClass('selected');
  })
}

function unhideSelectedSection(selectedSection) {
  selectedSection.addClass('selected').removeClass('hidden')
  hideSections(selectedSection)
}

function hideSections (selectedSection) {
  sections.forEach(section => {
    if (!section.hasClass('selected')) {
      section.addClass('hidden')
    }
  })
}

$('.section__customers--new-customer button').click(function(e) {
  e.preventDefault();
  let newCustomerName = $('#new-customer-name-input').val();
  domUpdates.createNewCustomer(hotel, {id: hotel.users.length + 1, name: `${newCustomerName}`})
  $('#new-customer-name-input').val('');
  populateCustomerInfo(hotel.customerSelected);
  loadAutocompleteSearch()
  $('.header__search--error').addClass('hidden');
})



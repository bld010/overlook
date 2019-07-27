import $ from 'jquery';
window.$ = window.jQuery = $;
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/datepicker';
import './css/base.scss';
import Hotel from './Hotel.js';
import bookingsData from '../data/bookings-data.js';
import roomsData from '../data/rooms-data.js';
import usersData from '../data/users-data.js';
import roomServicesData from '../data/roomServices-data.js'
import domUpdates from './domUpdates.js';


let hotel = new Hotel()

// Query Selectors

let $todaysDateDisplay = $('.section__main--general h2 span')
let $occupancyPercentage = $('.section__main--general h3 span').eq(0);
let $availableRooms = $('.section__main--general h3 span').eq(1);
let $todaysRevenue = $('.section__main--general h3 span').eq(2);
let $singleRoomsAvailable = $('.section__main--general ul li span').eq(0);
let $residentialSuitesAvailable = $('.section__main--general ul li span').eq(1)
let $juniorSuitesAvailable = $('.section__main--general ul li span').eq(2);
let $suitesAvailable = $('.section__main--general ul li span').eq(3);
let $todaysRoomServicesRevenue = $('.section__main--general ul li span').eq(4);
let $todaysBookingsRevenue = $('.section__main--general ul li span').eq(5);

let $mostPopularBookingDateSpan = $('.section__rooms--general h3 span').eq(0);
let $mostPopularBookingTotalSpan = $('.section__rooms--general h3 span').eq(1);
let $leastPopularBookingDateSpan = $('.section__rooms--general h3:nth-child(2) span').eq(0);
let $leastPopularBookingTotalSpan = $('.section__rooms--general h3:nth-child(2) span').eq(1);

let $navRoomsTab = $('.nav__rooms');
let $navCustomersTab = $('.nav__customers');
let $navMainTab = $('.nav__main');
let $navOrdersTab = $('.nav__orders');

let $datepicker = ('#datepicker')

//pageLoad elements

$mostPopularBookingDateSpan.text(hotel.returnMostPopularBookingDate().date)
$mostPopularBookingTotalSpan.text(hotel.returnMostPopularBookingDate().bookings)
$leastPopularBookingDateSpan.text(hotel.returnLeastPopularBookingDate().date)
$leastPopularBookingTotalSpan.text(hotel.returnLeastPopularBookingDate().bookings)
populateOrdersTableElements();

// search

$( '#section__customers--search').autocomplete({
  source: hotel.users.map(user => user.name)
});

$('.ui-autocomplete-input').focus(function() {
  $('.ui-autocomplete-input').val('');
  $('.section__customers--search--error').addClass('hidden')
})

$('.ui-autocomplete-input~button').click(function(e) {
  e.preventDefault();
  handleCustomerSearch();
})

// orders datepicker

let $datePickerButton = $('#datepicker~button')

$(function () {
  $('#datepicker').datepicker({ dateFormat: 'yy-mm-dd' });
});

$datePickerButton.click(function(e) {
  e.preventDefault();
  hotel.currentDate = $('#datepicker').val().split('-').join('/');
  populateOrdersTableElements();
})

function populateOrdersTableElements() {
  let charges = (hotel.returnTodaysRoomServicesCharges(hotel.currentDate));
  let revenue = hotel.returnTodaysRoomServicesRevenue(hotel.currentDate);
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
    chargesTableElements = `<p>No room service orders found for this date.</p>`;
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
  $('.section__orders--general--table').html(chargesTableElements)
}

$('#datepicker').datepicker({
  dateFormat: 'yy-mm-dd'
});




function handleCustomerSearch() {
  let searchInput = $('.ui-autocomplete-input').val();
  $('.ui-autocomplete-input').val('');
  let foundUser = hotel.users.find(user => user.name === searchInput);
  if (!foundUser) {
    $('.section__customers--search--error').removeClass('hidden')
  } else {
    hotel.customerSelected = foundUser;
    populateAllCustomerInfo(foundUser)
  }
}

function updateShowingDetailsSpan (user) {
  $('header h3 span:nth-of-type(1)').text(user.name)
}

function populateAllCustomerInfo(user) {
  $('header h3 span:nth-of-type(2)').removeClass('hidden')
  updateShowingDetailsSpan(user)
}

function populateGeneralizedInfo() {
  $('header h3 span:nth-of-type(2)').addClass('hidden');
  $('header h3 span:nth-of-type(1)').text('All Customers');
  $('.ui-autocomplete-input').val('');
  hotel.customerSelected = null;
}

$('header h3 span:nth-of-type(2)').click(function() {
  populateGeneralizedInfo();
})

let $roomsSection = $('.section__rooms');
let $mainSection = $('.section__main');
let $ordersSection = $('.section__orders');
let $customersSection = $('.section__customers')

let sections = [$mainSection, $ordersSection, $roomsSection, $customersSection]

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


$todaysDateDisplay.text(hotel.currentDate)
$occupancyPercentage.text(hotel.returnTodaysOccupancyPercentage(hotel.currentDate) + '%');
$availableRooms.text(hotel.returnTodaysUnbookedRooms(hotel.currentDate).length);
$todaysRevenue.text('$ ' + hotel.returnTodaysTotalRevenue(hotel.currentDate).toFixed(2));
$todaysRoomServicesRevenue.text('$ ' + hotel.returnTodaysRoomServicesRevenue(hotel.currentDate));
$todaysBookingsRevenue.text('$ ' + hotel.returnTodaysBookingRevenue(hotel.currentDate));
$singleRoomsAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'single room').length);
$residentialSuitesAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'residential suite').length);
$juniorSuitesAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'junior suite').length);
$suitesAvailable.text(hotel.filterAvailableRooms(hotel.currentDate, 'suite').length);


$('.section__customers--new-customer button').click(function(e) {
  e.preventDefault();
  let newCustomerName = $('#new-customer-name-input').val();
  domUpdates.createNewCustomer(hotel, {id: hotel.users.length + 1, name: `${newCustomerName}`})
  $('#new-customer-name-input').val('');
  populateAllCustomerInfo(hotel.customerSelected);
  $('.section__customers--search--error').addClass('hidden')
})

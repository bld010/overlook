import $ from 'jquery';
window.$ = window.jQuery = $;
import 'jquery-ui/ui/widgets/autocomplete';
import './css/base.scss';
import Hotel from './Hotel.js';
import bookingsData from '../data/bookings-data.js';
import roomsData from '../data/rooms-data.js';
import usersData from '../data/users-data.js';
import roomServicesData from '../data/roomServices-data.js'
import domUpdates from './domUpdates.js';
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'

let hotel = new Hotel()
let todaysDate = "2019/09/22";

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

let $navRoomsTab = $('.nav__rooms');
let $navCustomersTab = $('.nav__customers');
let $navMainTab = $('.nav__main');
let $navOrdersTab = $('.nav__orders');

$( "#section__customers--search" ).autocomplete({
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


$todaysDateDisplay.text(todaysDate)
$occupancyPercentage.text(hotel.returnTodaysOccupancyPercentage(todaysDate) + '%');
$availableRooms.text(hotel.returnTodaysUnbookedRooms(todaysDate).length);
$todaysRevenue.text('$ ' + hotel.returnTodaysTotalRevenue(todaysDate).toFixed(2));
$todaysRoomServicesRevenue.text('$ ' + hotel.returnTodaysRoomServicesRevenue(todaysDate));
$todaysBookingsRevenue.text('$ ' + hotel.returnTodaysBookingRevenue(todaysDate));
$singleRoomsAvailable.text(hotel.filterAvailableRooms(todaysDate, 'single room').length);
$residentialSuitesAvailable.text(hotel.filterAvailableRooms(todaysDate, 'residential suite').length);
$juniorSuitesAvailable.text(hotel.filterAvailableRooms(todaysDate, 'junior suite').length);
$suitesAvailable.text(hotel.filterAvailableRooms(todaysDate, 'suite').length);


$('.section__customers--new-customer button').click(function(e) {
  e.preventDefault();
  let newCustomerName = $('#new-customer-name-input').val();
  domUpdates.createNewCustomer(hotel, {id: hotel.users.length + 1, name: `${newCustomerName}`})
  $('#new-customer-name-input').val('');
  populateAllCustomerInfo(hotel.customerSelected);
})

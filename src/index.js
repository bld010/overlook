import $ from 'jquery';
window.$ = window.jQuery = $;
import 'jquery-ui/ui/widgets/autocomplete';
import datepicker from 'js-datepicker'
import './css/base.scss';
import Hotel from './Hotel.js';
// import Customer from './Customer.js'
import Bookings from './Bookings.js'
import RoomServices from './RoomServices.js'
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
let $customerBookingTodaySpan =  $('.section__rooms--customer-booking-today span');
let $customerBookingsHistoryList = $('.section__rooms--customer-bookings-history ul');
let sections = [$mainSection, $ordersSection, $roomsSection, $customersSection]
let $availableRoomsDiv = $('.section__rooms--new-booking--available-rooms');
let $filterSuitesButton = $('.section__rooms--filter-suites');
let $filterResidentialSuitesButton = $('.section__rooms--filter-residential-suites');
let $filterJuniorSuitesButton = $('.section__rooms--filter-junior-suites');
let $filterSingleRoomsButton = $('.section__rooms--filter-single-rooms');
let $filterAllRoomsButton = $('.section__rooms--filter-all-rooms');
let $newRoomServiceOrderButton = $('.new-room-service-order');
let $roomServiceMenuSection = $('.section__rooms--new-room-service-order');
let $roomServiceMenuDiv = $('.section__rooms--new-room-service-order div');
let $submitRoomServiceOrderButton = $('.section__rooms--new-room-service-order button');
let $makeBookingButton = $('.section__rooms--customer-booking-today button').eq(0);
let $newCustomerButton = $('.section__customers--new-customer button');
let $clearUserButton = $('header h3 span:nth-of-type(2)');


$('.section__main--general--content').addClass('hidden')



Promise.all([usersFetch, bookingsFetch, roomServicesFetch, roomsFetch])
  .then(values => Promise.all(values.map(value => value.json())))
  .then(results => {
    let users = results.find(data => data.hasOwnProperty('users')).users;
    let rooms = results.find(data => data.hasOwnProperty('rooms')).rooms;
    let bookings = results.find(data => data.hasOwnProperty('bookings')).bookings;
    let roomServices = results.find(data => data.hasOwnProperty('roomServices')).roomServices;
    hotel = new Hotel(users, bookings, roomServices, rooms, date);
  });

function formatDate() {
  var date = new Date(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();
  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }
  return [year, month, day].join('/');
}

//pageLoad elements

setTimeout(function () {
  $('.section__main--general--content').removeClass('hidden')
  $('.section__main--general--loading').addClass('hidden');
  populateItemsPageLoad();
}, 3000)

function populateMenu() {
  let menu = hotel.roomServices.map(service => {
    let menuItem = {food: service.food, totalCost: service.totalCost};
    return menuItem;
  })
  menu = [...new Set(menu)].slice(0, 9)
  let menuElements = menu.reduce((acc, item) => {
    acc += `<li data-food="${item.food}" data-price=${item.totalCost}>${item.food}: $${item.totalCost}</li>`
    return acc;
  }, `<ul>`)
  menuElements += `</ul>`
  $roomServiceMenuDiv.html(menuElements)
}

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
  populateMenu();
  $availableRoomsDiv.html(populateAvailableRooms(hotel.returnTodaysUnbookedRooms(hotel.currentDate))); 
}

function populateAvailableRooms(availableRooms) {
  let bookingsElements = availableRooms.reduce((acc, room) => {
    acc += `<div class="room" tabindex=0 data-roomNumber="${room.number}"><h5>Room ${room.number}</h5>`
    acc += `<p>Type: ${room.roomType}</p>`
    acc += `<p>Number of Beds: ${room.numBeds}</p>`
    acc += `<p>Bed Size: ${room.bedSize}</p>`
    acc += `<p>Bidet: ${room.bidet}</p>`
    acc += '<button class="book-room-button">Book</button></div>'
    return acc
  }, '')
  return bookingsElements;
}

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
    }, '')
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

// eslint-disable-next-line no-unused-vars
const picker = datepicker('#datepicker')

// function fixDateFormat(dateString)



function fixDateFormat(dateString) {
  var months = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
  }

  let dateParts = dateString.split(' ').slice(1, 4)
  dateParts[0] = months[dateParts[0]]
  let date = [dateParts[2], dateParts[0], dateParts[1]]
  return date.join('/');
}

$datePickerButton.click(function(e) {
  e.preventDefault();
  hotel.currentDate = fixDateFormat($('#datepicker').val())
  populateItemsPageLoad();
  populateOrdersTableElements(hotel.returnTodaysRoomServicesCharges(hotel.currentDate), hotel.returnTodaysRoomServicesRevenue(hotel.currentDate), $generalOrderTable);
  if (hotel.customerSelected) {
    populateCustomerInfo(hotel.customerSelected, hotel.currentDate);
  } 
})

$('#datepicker').on('focus', function() {
  $roomServiceMenuSection.addClass('hidden');
})

// search

function loadAutocompleteSearch() {
  $( '#header__search').autocomplete({
    source: hotel.users.map(user => user.name)
  });
}

$('#header__search').on('click', function() {
  $('input #header__search').val('');
  $('.header__search--error').addClass('hidden');
  $roomServiceMenuSection.addClass('hidden');
})

$('#header__search~button').click(function(e) {
  e.preventDefault();
  handleCustomerSearch();
})


function handleCustomerSearch() {
  let searchInput = $('.ui-autocomplete-input').val();
  $('.ui-autocomplete-input').val('');
  let foundUser = hotel.users.find(user => user.name === searchInput);
  if (!foundUser) {
    $('.header__search--error').removeClass('hidden')
  } else {
    hotel.customerSelected = foundUser;
    populateCustomerInfo(hotel.customerSelected, hotel.currentDate);
  }
}

// other functions

function updateShowingDetailsSpan (user) {
  $('header h3 span:nth-of-type(1)').text(user.name)
}

function populateCustomerInfo(user, date) {
  unhideCustomerSections();
  updateShowingDetailsSpan(user);
  populateOrdersCustomerInfo(user, hotel.roomServices, date);
  populateRoomsCustomerInfo(user, hotel.bookings, date);
  populateItemsPageLoad();
}


function populateRoomsCustomerInfo(user, bookings, date) {
  let customerBookingHistoryListElements = generateBookingHistoryListElements(user, bookings);
  $customerBookingsHistoryList.html(customerBookingHistoryListElements);
  populateRoomsCustomerDay(user, bookings, date);
  unhideCustomerSections();
}

function unhideCustomerSections() {
  $('header h3 span:nth-of-type(2)').removeClass('hidden');
  $('.section__orders--customer').removeClass('hidden')
  $('.section__rooms--customer-bookings-history').removeClass('hidden');
  $('.section__rooms--customer-booking-today').removeClass('hidden');
  $('.section__customers--select-customer-prompt').addClass('hidden')

}

function populateRoomsCustomerDay(user, bookings, date) {
  let todaysBooking = user.returnBookingForDay(bookings, date);
  if (todaysBooking) {
    $('.section__rooms--customer-booking-today button').eq(0).addClass('hidden');
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
    $newRoomServiceOrderButton.removeClass('hidden');
  } else {
    $customerBookingTodaySpan.text('No bookings for today');
    $newRoomServiceOrderButton.addClass('hidden');
    $('.section__rooms--customer-booking-today button').eq(0).removeClass('hidden');
  }
}

function generateBookingHistoryListElements(user, bookings) {
  let allCustomerBookings = user.returnAllBookings(bookings);
  if (allCustomerBookings.length) {
    return allCustomerBookings.sort((a, b) => a.date.localeCompare(b.date)).reduce((acc, booking) => {
      acc += 
      `<li>Date: ${booking.date}, Room: ${booking.roomNumber}</li>`
      return acc;
    }, ``)
  } else {
    return `<li>No Bookings Found for this User</li>`
  }
}

function populateOrdersCustomerInfo(user, roomServices, date) {
  populateOrdersTableElements(user.returnAllRoomServices(roomServices), user.returnAllTimeRoomServiceDollars(roomServices), $customerOrderTable);
  populateCustomerDayOrder(user, roomServices, date);

}

function populateCustomerDayOrder(user, roomServices, date) {
  let totalCharge = user.returnTotalForDay(roomServices, date);
  $customerDayOrder.text(`$${totalCharge}`);
}

function populateGeneralizedInfo() {
  $('header h3 span:nth-of-type(2)').addClass('hidden');
  $('header h3 span:nth-of-type(1)').text('All Customers');
  $('.ui-autocomplete-input').val('');
  $('.section__customers--select-customer-prompt').removeClass('hidden')
  hotel.customerSelected = null;
  populateItemsPageLoad();
}

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
  hideSections();
}

function hideSections () {
  sections.forEach(section => {
    if (!section.hasClass('selected')) {
      section.addClass('hidden')
    }
  })
}

// event listeners

$clearUserButton.click(function(e) {
  e.preventDefault();
  populateGeneralizedInfo();
  $('.section__orders--customer').addClass('hidden');
  $('.section__rooms--customer-bookings-history').addClass('hidden');
  $('.section__rooms--customer-booking-today').addClass('hidden');
  $('.section__rooms--new-booking').addClass('hidden');
})

$navRoomsTab.click(function() {
  handleSectionToggling($roomsSection)
})

$navRoomsTab.on('keydown', function(e) {
  if (e.which === 13 || e.which === 32) {
    $(this).click()
  }
});

$navCustomersTab.click(function() {
  handleSectionToggling($customersSection)
})

$navCustomersTab.on('keydown', function(e) {
  if (e.which === 13 || e.which === 32) {
    $(this).click()
  }
});

$navMainTab.click(function () {
  handleSectionToggling($mainSection)
})

$navMainTab.on('keydown', function(e) {
  if (e.which === 13 || e.which === 32) {
    $(this).click()
  }
});

$navOrdersTab.click(function () {
  handleSectionToggling($ordersSection)
})

$navOrdersTab.on('keydown', function(e) {
  if (e.which === 13 || e.which === 32) {
    $(this).click()
  }
});

$newRoomServiceOrderButton.click(function(e) {
  e.preventDefault();
  $roomServiceMenuSection.toggleClass('hidden');
})

$makeBookingButton.click(function(e) {
  e.preventDefault();
  $('.section__rooms--new-booking, .section__rooms--new-booking--available-rooms').removeClass('hidden');
})

$newCustomerButton.click(function(e) {
  e.preventDefault();
  let newCustomerName = $('#new-customer-name-input').val();
  hotel.createNewCustomer({id: hotel.users.length + 1, name: `${newCustomerName}`})
  $('#new-customer-name-input').val('');
  populateCustomerInfo(hotel.customerSelected, hotel.currentDate);
  loadAutocompleteSearch()
  $('.header__search--error').addClass('hidden');
})

$submitRoomServiceOrderButton.on('click', function() {
  let items = [...$('.section__rooms--new-room-service-order div li.clicked')]
  items.forEach(item => {
    let food = item.dataset.food;
    let price = parseFloat(item.dataset.price);
    hotel.roomServices.push(new RoomServices(hotel.customerSelected.id, hotel.currentDate, food, price))
  });
  $roomServiceMenuSection.addClass('hidden');
  populateCustomerInfo(hotel.customerSelected, hotel.currentDate);
})

$roomServiceMenuDiv.on('click', function(e) {
  let menuItem = e.target.closest('li');
  menuItem.classList.toggle('clicked');
})

$availableRoomsDiv.on('click', function(e) {
  if (e.target.classList.contains('book-room-button')) {
    let roomNumber = parseInt(e.target.closest('div').dataset.roomnumber);
    let bookingObject = {'userID': hotel.customerSelected.id, 'date': hotel.currentDate, roomNumber}
    let newBooking = new Bookings(bookingObject)
    hotel.bookings.unshift(newBooking)
    $('.section__rooms--new-booking, .section__rooms--new-booking--available-rooms').addClass('hidden');
    populateCustomerInfo(hotel.customerSelected, hotel.currentDate);
  }
})

$filterSuitesButton.on('click', function(e) {
  e.preventDefault();
  $availableRoomsDiv.html(populateAvailableRooms(hotel.filterAvailableRooms(hotel.currentDate, "suite")))
})

$filterResidentialSuitesButton.on('click', function(e) {
  e.preventDefault();
  $availableRoomsDiv.html(populateAvailableRooms(hotel.filterAvailableRooms(hotel.currentDate, "residential suite")))
})

$filterJuniorSuitesButton.on('click', function(e) {
  e.preventDefault();
  $availableRoomsDiv.html(populateAvailableRooms(hotel.filterAvailableRooms(hotel.currentDate, "junior suite")))
})

$filterSingleRoomsButton.on('click', function(e) {
  e.preventDefault();
  $availableRoomsDiv.html(populateAvailableRooms(hotel.filterAvailableRooms(hotel.currentDate, "single room")))
})

$filterAllRoomsButton.on('click', function(e) {
  e.preventDefault();
  $availableRoomsDiv.html(populateAvailableRooms(hotel.returnTodaysUnbookedRooms(hotel.currentDate)))
})



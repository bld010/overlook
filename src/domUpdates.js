import userData from "../data/users-data";
import $ from 'jquery';
import Customer from "./Customer.js"

let domUpdates = {

  createNewCustomer(hotel, newCustomerObject) {
    hotel.users.push(new Customer(newCustomerObject));
    hotel.customerSelected = true
  },

}

export default domUpdates;
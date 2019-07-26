import userData from "../data/users-data";
import $ from 'jquery';
import Customer from "./Customer.js"

let domUpdates = {

  createNewCustomer(hotel, newCustomerObject) {
    let newCustomer = new Customer(newCustomerObject)
    hotel.users.push(newCustomer);
    hotel.customerSelected = newCustomer;
  },

}

export default domUpdates;
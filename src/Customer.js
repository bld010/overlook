class Customer {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
  }

  returnAllRoomServices(roomServices) {
    return roomServices.filter(charge => charge.userID === this.id);
  }

  returnChargesForDay(roomServices, date) {
    if (this.returnAllRoomServices(roomServices).length) {
      return this.returnAllRoomServices(roomServices).filter(charge => charge.date === date)
    } else {
      return []
    }
  }

  returnTotalForDay(roomServices, date) {
    let charges = this.returnChargesForDay(roomServices, date);
    console.log(charges, date)
    return (charges.reduce((acc, charge) => {
      acc += charge.totalCost;
      return acc
    }, 0)).toFixed(2)
  }

  returnAllTimeRoomServiceDollars(roomServices) {
    let allServices = this.returnAllRoomServices(roomServices)
    if (allServices.length) {
      return (allServices.reduce((acc, charge) => {
        acc += charge.totalCost
        return acc
      }, 0)).toFixed(2)
    }
    else {
      return 0
    }
  }
}

export default Customer;

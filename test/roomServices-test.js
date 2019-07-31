import RoomServices from '../src/RoomServices'
import chai from 'chai';
const expect = chai.expect;

let roomService = null;

describe('RoomServices', function() {

  beforeEach(() => {
    roomService = new RoomServices(1, '2019/09/22', "Delicious Concrete Sandwich", 12.44)
  })

  it('should hold on to userIDs for each instance', () => {
    expect(roomService.userID).to.equal(1)
  })

  it('should hold on to the date for each instance', () => {
    expect(roomService.date).to.equal('2019/09/22')
  })

  it('should hold on to the item for each instance', () => {
    expect(roomService.food).to.equal("Delicious Concrete Sandwich")
  })

  it('should hold on to the item for each instance', () => {
    expect(roomService.totalCost).to.equal(12.44)
  })
})
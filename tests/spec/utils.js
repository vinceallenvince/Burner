describe("A Utils", function() {

  var utils = exports.Utils,
      getDataType = utils.getDataType;

  it("getRandomNumber() should return a random number within a range.", function() {
    expect(getDataType(utils.getRandomNumber(1, 100))).toEqual('number');
    expect(utils.getRandomNumber(1, 100)).toBeGreaterThan(0);
    expect(utils.getRandomNumber(1, 100)).toBeLessThan(101);
  });
  it("getRandomNumber() should return a float when passing 'true' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, true) % 1).toNotEqual(0);
  });
  it("getRandomNumber() should return an integer when passing 'false' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, false) % 1).toEqual(0);
  });

/*
addEvent
getRandomNumber
getWindowSize
clone
extend
getDataType
*/

});

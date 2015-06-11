var Game = require('../API/Game');
var ENUMS = require('../API/ComputeEngine/Manufacturing/src/ENUMS');
var GMCGame = new Game({
    index100Value: 1000,
    stage: {
        nb: 5,
        duration: ENUMS.PERIODS.QUARTER
    }
});
module.exports = GMCGame;
//# sourceMappingURL=Game.js.map
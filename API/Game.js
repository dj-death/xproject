/**
* Paramètres Générales
*
*
* Copyright 2015 DIDI Mohamed, Inc.
*/
var Game = (function () {
    function Game() {
        this.initialised = false;
    }
    Game.prototype.init = function (configs) {
        this.configs = configs;
        // let's begin
        this.initialised = true;
    };
    Object.defineProperty(Game.prototype, "weeksNb", {
        get: function () {
            var monthWeeksNb = 4;
            return this.configs.stage.duration * monthWeeksNb;
        },
        enumerable: true,
        configurable: true
    });
    return Game;
})();
module.exports = Game;
//# sourceMappingURL=Game.js.map
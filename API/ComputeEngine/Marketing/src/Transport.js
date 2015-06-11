var Transport = (function () {
    function Transport(params) {
        this.totalContainersNb = 0;
        this.params = params;
    }
    Transport.prototype.init = function (market) {
        this.market = market;
        this.initialised = true;
    };
    Object.defineProperty(Transport.prototype, "containerDaysNb", {
        get: function () {
            return Math.ceil(this.journeyLength / this.params.distanceLimit) * this.loadsNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "loadsNb", {
        // results
        get: function () {
            return Math.ceil(this.totalContainersNb);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "journeyLength", {
        get: function () {
            return this.params.shipmentDistance * 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "hiredTransportCost", {
        // cost
        get: function () {
            var cost = 0;
            cost += this.containerDaysNb * this.params.costs.containerDailyHireCost;
            cost += this.loadsNb * this.params.costs.containerShipmentCost;
            return cost;
        },
        enumerable: true,
        configurable: true
    });
    Transport.prototype.load = function (containersNb) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        this.totalContainersNb += containersNb;
    };
    return Transport;
})();
module.exports = Transport;
//# sourceMappingURL=Transport.js.map
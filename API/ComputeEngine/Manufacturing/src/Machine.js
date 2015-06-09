var ENUMS = require('./ENUMS');
var Utils = require('../../../../utils/Utils');
var Machine = (function () {
    function Machine(machineParams) {
        this.params = machineParams;
    }
    Object.defineProperty(Machine.prototype, "runningCost", {
        // costs
        get: function () {
            return this.params.costs.runningHour * this.workedHoursNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Machine.prototype, "overheadsCost", {
        get: function () {
            return this.params.costs.overheads * this.usedNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Machine.prototype, "decommissioningCost", {
        get: function () {
            return this.params.costs.decommissioning * this.soldNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Machine.prototype, "maintenanceCost", {
        get: function () {
            var cost;
            cost = this.maintenancePlannedHoursNb * this.params.costs.maintenanceHourlyCost;
            cost += this.maintenanceOverContractedHoursNb * this.params.costs.overContractedMaintenanceHourlyCost;
            return cost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Machine.prototype, "CO2FootprintResult", {
        get: function () {
            var result;
            result.kwh = this.workedHoursNb * this.params.CO2Footprint.kwh;
            result.weight = this.workedHoursNb * this.params.CO2Footprint.weight;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Machine.prototype, "depreciation", {
        // TODO: fix it
        get: function () {
            return this.params.depreciationRate * this.params.acquisitionPrice * this.usedNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Machine.prototype, "theoreticalAvailableHoursNb", {
        get: function () {
            return (this.usedNb * this.machineCapacity);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Machine.prototype, "effectiveAvailableHoursNb", {
        get: function () {
            var value;
            value = this.theoreticalAvailableHoursNb - this.maintenancePlannedHoursNb - this.maintenanceOverContractedHoursNb;
            // check negative value and correct to 0
            value = value > 0 ? value : 0;
            return value;
        },
        enumerable: true,
        configurable: true
    });
    // helper
    Machine.prototype._getBreakdownHoursNb = function () {
        var landa = (this.params.breakdownProba / 100) * this.machineCapacity, value = 0, i = 0;
        for (; i < this.usedNb; i++) {
            value += Utils.getPoisson(landa);
        }
        return value;
    };
    // TODO: implement a mechanism
    Machine.prototype._calcMachineEfficiencyAvg = function () {
        return 0.9474;
    };
    Machine.prototype.init = function (availablesMachinesNb) {
        this.usedNb = availablesMachinesNb;
        this.availablesNextPeriodNb = this.usedNb;
        this.machineEfficiencyAvg = this._calcMachineEfficiencyAvg();
        // now you can power machines
        this.initialised = true;
        this.workedHoursNb = 0;
    };
    // Actions
    Machine.prototype.setShiftLevel = function (shiftLevel) {
        this.shiftLevel = shiftLevel;
        this.machineCapacity = this.params.machineCapacityByShift[shiftLevel];
        this.operatorsNb = this.params.machineOperatorsNeededNb[shiftLevel] * this.usedNb;
        this.breakdownHoursNb = this._getBreakdownHoursNb();
        this.repair(this.breakdownHoursNb);
    };
    Machine.prototype.power = function (hoursNb) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        var succes = true, effectiveTime;
        effectiveTime = hoursNb / this.machineEfficiencyAvg;
        this.workedHoursNb += effectiveTime;
        // sorry we have limited capacity
        if (this.workedHoursNb > this.effectiveAvailableHoursNb) {
            this.workedHoursNb -= effectiveTime;
            succes = false;
        }
        return succes;
    };
    Machine.prototype.buy = function (units) {
        var operationValue;
        operationValue = units * this.params.acquisitionPrice;
        this.boughtNb = units;
        if (this.params.deliveryTime = ENUMS.DELIVERY.IMMEDIATE) {
            this.usedNb += this.boughtNb;
        }
        this.availablesNextPeriodNb += this.boughtNb;
        return operationValue;
    };
    Machine.prototype.sell = function (units) {
        var operationValue;
        operationValue = units * this.params.disposalPrice;
        this.soldNb = units;
        if (this.params.decommissioningTime = ENUMS.DELIVERY.IMMEDIATE) {
            this.usedNb -= this.soldNb;
        }
        this.availablesNextPeriodNb -= this.soldNb;
        return operationValue;
    };
    Machine.prototype.repair = function (breakdownHoursNb) {
        this.maintenanceOverContractedHoursNb = breakdownHoursNb - this.maintenancePlannedHoursNb;
        if (this.maintenanceOverContractedHoursNb < 0) {
            this.maintenanceOverContractedHoursNb = 0;
        }
        return true;
    };
    Machine.prototype.doMaintenance = function (hoursByMachineNb) {
        var operationValue;
        this.maintenancePlannedHoursNb = hoursByMachineNb * this.usedNb;
        return true;
    };
    return Machine;
})();
module.exports = Machine;
//# sourceMappingURL=Machine.js.map
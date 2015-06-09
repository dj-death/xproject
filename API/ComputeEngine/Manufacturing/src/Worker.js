var Utils = require('../../../../utils/Utils');
var Worker = (function () {
    function Worker(params) {
        this.initialised = false;
        this.params = params;
    }
    // helpers
    Worker.prototype._calcAbsenteeismHoursNb = function () {
        var probability, landa, value = 0, i = 0;
        // based on ??,,
        probability = this.params.absenteeismProba;
        landa = probability * this.shift.maxHoursPerPeriod + this.params.absenteeismNormalHoursNb;
        for (; i < this.workersNb; i++) {
            value += Utils.getPoisson(landa);
        }
        return Math.round(value); // we need an integer value
    };
    Worker.prototype._calcStrikeNextPeriodWeeksNb = function () {
        var probability, weeksMax = this.game.weeksNb, value = 0;
        // random value from 0 to max 
        probability = Math.random() * weeksMax;
        value = probability * this.params.tradeUnionSensibility;
        return Math.round(value); // we need an integer value
    };
    Worker.prototype.init = function (game, availablesWorkersNb, strikeNotifiedWeeksNb, decisions) {
        this.game = game;
        // mix decisions to this as members
        Utils.ObjectApply(this, decisions);
        this.shift = this.params.availablesShifts[decisions.shiftLevel - 1];
        this.workersNb = availablesWorkersNb;
        this.availablesNextPeriodNb = this.workersNb;
        this.strikeNotifiedWeeksNb = strikeNotifiedWeeksNb;
        this.dismiss(decisions.dismissedNb);
        this.recruit(decisions.recruitedNb);
        this.train(decisions.trainedNb);
        this.absenteeismHoursNb = this._calcAbsenteeismHoursNb();
        this.strikeNextPeriodWeeksNb = this._calcStrikeNextPeriodWeeksNb();
        // let's work
        this.initialised = true;
        this.workedTotaHoursNb = 0;
    };
    Object.defineProperty(Worker.prototype, "workedHoursNbByWorker", {
        get: function () {
            var averageHoursNb;
            averageHoursNb = this.workedTotaHoursNb / this.workersNb;
            if (averageHoursNb < this.params.minHoursWork) {
                averageHoursNb = this.params.minHoursWork;
            }
            return averageHoursNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "strikeNotifiedHoursNb", {
        get: function () {
            return this.strikeNotifiedWeeksNb * this.params.strikeHoursPerWeek * this.workersNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "theoreticalavailableTotalHoursNb", {
        get: function () {
            return (this.workersNb / this.shift.workersNeededNb) * this.shift.maxHoursPerPeriod * this.shiftLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "effectiveavailableTotalHoursNb", {
        get: function () {
            var value;
            value = this.theoreticalavailableTotalHoursNb - this.absenteeismHoursNb - this.strikeNotifiedHoursNb;
            // check negative value and correct to 0
            value = value > 0 ? value : 0;
            return value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "weekDaysWorkedHoursNb", {
        get: function () {
            var hoursNb;
            hoursNb = this.workedHoursNbByWorker < this.shift.maxHoursWeekDays ? this.workedHoursNbByWorker : this.shift.maxHoursWeekDays;
            if (hoursNb < 0) {
                hoursNb = 0;
            }
            return hoursNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "overtimeWorkedHoursNb", {
        get: function () {
            var overtimeWorkedHoursNb;
            // how much hours exceed the max hours worked in weeks days
            overtimeWorkedHoursNb = this.workedHoursNbByWorker - this.shift.maxHoursWeekDays;
            if (overtimeWorkedHoursNb < 0) {
                overtimeWorkedHoursNb = 0;
            }
            return overtimeWorkedHoursNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "overtimeSaturdayWorkedHoursNb", {
        get: function () {
            var hoursNb;
            hoursNb = this.overtimeWorkedHoursNb < this.shift.maxHoursOvertimeSaturday ? this.overtimeWorkedHoursNb : this.shift.maxHoursOvertimeSaturday;
            if (hoursNb < 0) {
                hoursNb = 0;
            }
            return hoursNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "overtimeSundayWorkedHoursNb", {
        get: function () {
            var hoursNb;
            hoursNb = this.overtimeWorkedHoursNb - this.overtimeSaturdayWorkedHoursNb;
            if (hoursNb < 0) {
                hoursNb = 0;
            }
            // we can't exceed the max
            hoursNb = hoursNb < this.shift.maxHoursOvertimeSunday ? hoursNb : this.shift.maxHoursOvertimeSunday;
            return hoursNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "overtimeIntensity", {
        get: function () {
            var intensity;
            // TODO: calc separate intensity for saturday and sunday with coefficient of rough
            intensity = this.overtimeWorkedHoursNb / (this.shift.maxHoursOvertimeSaturday + this.shift.maxHoursOvertimeSunday);
            return intensity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "recruitCost", {
        // costs
        get: function () {
            return this.recruitedNb * this.params.costs.recruitment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "dismissalCost", {
        get: function () {
            return this.dismissedNb * this.params.costs.dismissal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "trainingCost", {
        get: function () {
            return this.trainedNb * this.params.costs.training;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "personnelCost", {
        get: function () {
            var sums = 0;
            sums += this.recruitCost;
            sums += this.dismissalCost;
            sums += this.trainingCost;
            return sums;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "wages", {
        get: function () {
            var salary, weekDaysWorkedHoursNb, basicRate, weekDaysWage, saturdayWage, sundayWage;
            basicRate = this.hourlyWageRate;
            if (this.params.isUnskilled && this.params.skilledRateOfPay != 0) {
                basicRate *= this.params.skilledRateOfPay;
            }
            if (basicRate < this.params.minHourlyWageRate) {
                basicRate = this.params.minHourlyWageRate;
            }
            weekDaysWorkedHoursNb = this.weekDaysWorkedHoursNb;
            if (weekDaysWorkedHoursNb < this.params.minPaidHours) {
                weekDaysWorkedHoursNb = this.params.minPaidHours;
            }
            weekDaysWage = weekDaysWorkedHoursNb * basicRate;
            saturdayWage = this.overtimeSaturdayWorkedHoursNb * basicRate * (1 + this.params.overtimeSatPremium);
            sundayWage = this.overtimeSundayWorkedHoursNb * basicRate * (1 + this.params.overtimeSunPremium);
            salary = (weekDaysWage + saturdayWage + sundayWage) * (1 + this.shift.shiftPremium);
            return salary * this.workersNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "CO2FootprintResult", {
        get: function () {
            var result;
            result.kwh = this.workedTotaHoursNb * this.params.CO2Footprint.kwh;
            result.weight = this.workedTotaHoursNb * this.params.CO2Footprint.weight;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    // Actions
    Worker.prototype.work = function (hoursNb) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        var success = true;
        this.workedTotaHoursNb += hoursNb;
        // sorry we have limited capacity
        if (this.workedTotaHoursNb > this.effectiveavailableTotalHoursNb) {
            console.log('Il ne reste pas de Heures de MOD');
            this.workedTotaHoursNb -= hoursNb;
            success = false;
        }
        return success;
    };
    // actions
    Worker.prototype.recruit = function (units) {
        /*var operationValue: number;

        operationValue = units * this.params.acquisitionPrice;

        this.boughtNb = units;

        if (this.params.deliveryTime = ENUMS.DELIVERY.IMMEDIATE) {
            this.usedNb += this.boughtNb;
        }

        this.availablesNextPeriodNb += this.boughtNb;

        return operationValue;*/
    };
    Worker.prototype.train = function (units) {
    };
    Worker.prototype.dismiss = function (units) {
        /*var operationValue: number;

        operationValue = units * this.params.disposalPrice;

        this.soldNb = units;

        if (this.params.decommissioningTime = ENUMS.DELIVERY.IMMEDIATE) {
            this.usedNb -= this.soldNb;
        }

        this.availablesNextPeriodNb -= this.soldNb;

        return operationValue;*/
    };
    Worker.prototype.pay = function (hourlyWageRate) {
        this.hourlyWageRate = hourlyWageRate;
    };
    return Worker;
})();
module.exports = Worker;
//# sourceMappingURL=Worker.js.map
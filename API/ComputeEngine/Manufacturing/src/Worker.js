var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Employee = require('../../Personnel/src/Employee');
var Utils = require('../../../../utils/Utils');
var Worker = (function (_super) {
    __extends(Worker, _super);
    function Worker(params) {
        _super.call(this, params);
    }
    // helpers
    Worker.prototype._calcAbsenteeismHoursNb = function () {
        var probability, landa, value = 0, i = 0;
        // based on ??,,
        probability = this.params.absenteeismProba;
        landa = probability * this.shift.maxHoursPerPeriod + this.params.absenteeismNormalHoursNb;
        for (; i < this.employeesNb; i++) {
            value += Utils.getPoisson(landa);
        }
        return Math.round(value); // we need an integer value
    };
    Worker.prototype._calcStrikeNextPeriodWeeksNb = function () {
        var probability, weeksMax = this.shift.weeksWorkedByPeriod, value = 0;
        // random value from 0 to max 
        probability = Math.random() * weeksMax;
        value = probability * this.params.tradeUnionSensibility;
        return Math.round(value); // we need an integer value
    };
    Worker.prototype.init = function (availablesWorkersNb, strikeNotifiedWeeksNb, decisions) {
        _super.prototype.init.call(this, availablesWorkersNb);
        // mix decisions to this as members
        Utils.ObjectApply(this, decisions);
        this.shift = this.params.availablesShifts[decisions.shiftLevel - 1];
        this.employeesNb = availablesWorkersNb;
        this.availablesNextPeriodNb = this.employeesNb;
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
            averageHoursNb = this.workedTotaHoursNb / this.employeesNb;
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
            return this.strikeNotifiedWeeksNb * this.params.strikeHoursPerWeek * this.employeesNb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "theoreticalavailableTotalHoursNb", {
        get: function () {
            return (this.employeesNb / this.shift.workersNeededNb) * this.shift.maxHoursPerPeriod * this.shiftLevel;
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
    Object.defineProperty(Worker.prototype, "wages", {
        // costs
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
            return salary * this.employeesNb;
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
    Worker.prototype.pay = function (hourlyWageRate) {
        this.hourlyWageRate = hourlyWageRate;
    };
    return Worker;
})(Employee.Employee);
module.exports = Worker;
//# sourceMappingURL=Worker.js.map
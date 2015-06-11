import Employee = require('../../Personnel/src/Employee');

import ENUMS = require('./ENUMS');
import Utils = require('../../../../utils/Utils');

interface WorkerParams extends Employee.EmployeeParams {
    label: string;
    spaceNeeded: number;
    CO2Footprint: ENUMS.CO2Footprint;

    minHoursWork: number;
    overtimeSatPremium: number;
    overtimeSunPremium: number;
    minHourlyWageRate: number;
    minPaidHours: number;
    strikeHoursPerWeek: number;

    absenteeismProba: number;
    absenteeismNormalHoursNb: number;

    tradeUnionSensibility: number;

    availablesShifts: ENUMS.Shift[];

    isUnskilled: boolean;

    // more than 0 means it'snt applied
    skilledRateOfPay: number;

    defaultRecruit: boolean;
}

interface WorkerDecisions {
    shiftLevel: ENUMS.SHIFT_LEVEL;

    hourlyWageRate: number;

    dismissedNb: number;
    recruitedNb: number;
    trainedNb: number;
}

class Worker extends Employee.Employee {
    
    // params
    params: WorkerParams;
    
    // decision
    shiftLevel: ENUMS.SHIFT_LEVEL;
    shift: ENUMS.Shift;

    hourlyWageRate: number;

    constructor(params: WorkerParams) {
        super(params);
    }

    // helpers

    _calcAbsenteeismHoursNb(): number {
        var probability,
            landa,
            value = 0,
            i = 0;

        // based on ??,,
        probability = this.params.absenteeismProba;

        landa = probability * this.shift.maxHoursPerPeriod + this.params.absenteeismNormalHoursNb;

        for (; i < this.employeesNb; i++) {
            value += Utils.getPoisson(landa);
        }

        return Math.round(value); // we need an integer value
    }

    _calcStrikeNextPeriodWeeksNb(): number {
        var probability: number,
            weeksMax = this.shift.weeksWorkedByPeriod,
            value = 0;
        
        // random value from 0 to max 
        probability = Math.random() * weeksMax;

        value = probability * this.params.tradeUnionSensibility;

        return Math.round(value); // we need an integer value
    }

    init(availablesWorkersNb: number, strikeNotifiedWeeksNb?: number, decisions?: WorkerDecisions) {

        super.init(availablesWorkersNb);

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
    }

    //result    
 
    availableTotalHoursNb: number;

    workedTotaHoursNb: number;

    workerProductivityAvg: number;

    get workedHoursNbByWorker(): number {
        var averageHoursNb: number;

        averageHoursNb = this.workedTotaHoursNb / this.employeesNb;

        if (averageHoursNb < this.params.minHoursWork) {
            averageHoursNb = this.params.minHoursWork;
        }

        return averageHoursNb;
    }

    absenteeismHoursNb: number;

    strikeNextPeriodWeeksNb: number;
    strikeNotifiedWeeksNb: number;

    get strikeNotifiedHoursNb(): number {
        return this.strikeNotifiedWeeksNb * this.params.strikeHoursPerWeek * this.employeesNb;
    }

    get theoreticalavailableTotalHoursNb(): number {
        return (this.employeesNb / this.shift.workersNeededNb) * this.shift.maxHoursPerPeriod * this.shiftLevel;
    }

    get effectiveavailableTotalHoursNb(): number {
        var value;

        value = this.theoreticalavailableTotalHoursNb - this.absenteeismHoursNb - this.strikeNotifiedHoursNb;

        // check negative value and correct to 0
        value = value > 0 ? value : 0;

        return value;
    }

    get weekDaysWorkedHoursNb(): number {
        var hoursNb: number;

        hoursNb = this.workedHoursNbByWorker < this.shift.maxHoursWeekDays ? this.workedHoursNbByWorker : this.shift.maxHoursWeekDays;

        if (hoursNb < 0) {
            hoursNb = 0;
        }

        return hoursNb;
    }

    get overtimeWorkedHoursNb(): number {
        var overtimeWorkedHoursNb: number;

        // how much hours exceed the max hours worked in weeks days
        overtimeWorkedHoursNb = this.workedHoursNbByWorker - this.shift.maxHoursWeekDays;

        if (overtimeWorkedHoursNb < 0) {
            overtimeWorkedHoursNb = 0;
        }

        return overtimeWorkedHoursNb;
    }

    get overtimeSaturdayWorkedHoursNb(): number {
        var hoursNb: number;

        hoursNb = this.overtimeWorkedHoursNb < this.shift.maxHoursOvertimeSaturday ? this.overtimeWorkedHoursNb : this.shift.maxHoursOvertimeSaturday;

        if (hoursNb < 0) {
            hoursNb = 0;
        }

        return hoursNb;
    }

    get overtimeSundayWorkedHoursNb(): number {
        var hoursNb: number;

        hoursNb = this.overtimeWorkedHoursNb - this.overtimeSaturdayWorkedHoursNb;

        if (hoursNb < 0) {
            hoursNb = 0;
        }

        // we can't exceed the max
        hoursNb = hoursNb < this.shift.maxHoursOvertimeSunday ? hoursNb : this.shift.maxHoursOvertimeSunday;

        return hoursNb;
    }

    get overtimeIntensity(): number {
        var intensity: number;
        
        // TODO: calc separate intensity for saturday and sunday with coefficient of rough
        intensity = this.overtimeWorkedHoursNb / (this.shift.maxHoursOvertimeSaturday + this.shift.maxHoursOvertimeSunday);

        return intensity;
    }
    
    // costs
    
    get wages(): number {
        var salary: number,

            weekDaysWorkedHoursNb: number,

            basicRate: number,

            weekDaysWage: number,
            saturdayWage: number,
            sundayWage: number;

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
    }

    get CO2FootprintResult(): ENUMS.CO2Footprint {
        var result: ENUMS.CO2Footprint;

        result.kwh = this.workedTotaHoursNb * this.params.CO2Footprint.kwh;
        result.weight = this.workedTotaHoursNb * this.params.CO2Footprint.weight;

        return result;
    }


    // Actions

    work(hoursNb: number): boolean {
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
    }

    pay(hourlyWageRate: number) {
        this.hourlyWageRate = hourlyWageRate;
    }
}

export = Worker;
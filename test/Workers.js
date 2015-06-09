var Worker = require('../API/ComputeEngine/Manufacturing/src/Worker');
var ENUMS = require('../API/ComputeEngine/Manufacturing/src/ENUMS');
var single, double, treble, noShift;
noShift = {
    level: ENUMS.SHIFT_LEVEL.SINGLE,
    workersNeededNb: 1,
    maxHoursWeekDays: 420,
    maxHoursOvertimeSaturday: 84,
    maxHoursOvertimeSunday: 72,
    maxHoursPerPeriod: 420 + 84 + 72,
    shiftPremium: 0
};
single = {
    level: ENUMS.SHIFT_LEVEL.SINGLE,
    workersNeededNb: 4,
    maxHoursWeekDays: 420,
    maxHoursOvertimeSaturday: 84,
    maxHoursOvertimeSunday: 72,
    maxHoursPerPeriod: 420 + 84 + 72,
    shiftPremium: 0
};
double = {
    level: ENUMS.SHIFT_LEVEL.DOUBLE,
    workersNeededNb: 8,
    maxHoursWeekDays: 420,
    maxHoursOvertimeSaturday: 42,
    maxHoursOvertimeSunday: 72,
    maxHoursPerPeriod: 420 + 42 + 72,
    shiftPremium: 1 / 3
};
treble = {
    level: ENUMS.SHIFT_LEVEL.TREBLE,
    workersNeededNb: 12,
    maxHoursWeekDays: 420,
    maxHoursOvertimeSaturday: 42,
    maxHoursOvertimeSunday: 72,
    maxHoursPerPeriod: 420 + 42 + 72,
    shiftPremium: 2 / 3
};
module.exports = {
    machinist: new Worker({
        isUnskilled: true,
        category: "Non Qualified",
        label: "Opérateur de Machine",
        spaceNeeded: 0,
        CO2Footprint: {
            kwh: 0,
            weight: 0
        },
        strikeHoursPerWeek: 0,
        absenteeismProba: 0,
        absenteeismNormalHoursNb: 0,
        tradeUnionSensibility: 0,
        minHourlyWageRate: 9 * 0.65,
        minHoursWork: 0,
        minPaidHours: 360,
        skilledRateOfPay: 0.65,
        overtimeSatPremium: 0.5,
        overtimeSunPremium: 1,
        costs: {
            recruitment: 1000,
            dismissal: 2000,
            training: 0
        },
        defaultRecruit: true,
        availablesShifts: [single, double, treble]
    }),
    assemblyWorker: new Worker({
        isUnskilled: false,
        category: "Qualifié",
        label: "Assembleur",
        spaceNeeded: 10,
        CO2Footprint: {
            kwh: 1,
            weight: 0.52
        },
        strikeHoursPerWeek: 48,
        tradeUnionSensibility: 0.01,
        absenteeismProba: 0.0005,
        absenteeismNormalHoursNb: 7,
        minHourlyWageRate: 9,
        minHoursWork: 0,
        minPaidHours: 0,
        skilledRateOfPay: 0,
        overtimeSatPremium: 0.5,
        overtimeSunPremium: 1,
        costs: {
            recruitment: 2000,
            dismissal: 5000,
            training: 8500
        },
        defaultRecruit: false,
        availablesShifts: [noShift]
    })
};
//# sourceMappingURL=Workers.js.map
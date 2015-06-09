
export enum CREDIT {
    CASH,
    ONE_MONTH,
    TWO_MONTH,
    THREE_MONTH
}

export enum FUTURES {
    IMMEDIATE,
    THREE_MONTH,
    SIX_MONTH
}

export enum DELIVERY {
    IMMEDIATE,
    NEXT_PERIOD,
    AFTERNEXT_PERIOD,
}

export enum QUALITY {
    LQ,
    MQ,
    HQ
}

export enum SHIFT_LEVEL {
    SINGLE,
    DOUBLE,
    TREBLE
}

export enum PERIODS { // in months
    QUARTER = 3,
    HALF_YEAR = 6,
    YEAR = 12
}

export interface CO2Footprint {
    kwh: number;
    weight: number;
}

export interface Shift {
    level: SHIFT_LEVEL;
    workersNeededNb: number;
    maxHoursPerPeriod: number;
    maxHoursWeekDays: number;
    maxHoursOvertimeSaturday: number;
    maxHoursOvertimeSunday: number;
    shiftPremium: number;
}



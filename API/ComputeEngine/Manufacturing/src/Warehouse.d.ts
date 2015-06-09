import AbstractObject = require('./AbstractObject');
export declare class Warehouse implements AbstractObject {
    spaceNeeded: number;
    label: string;
    CO2Footprint: {
        kwh: number;
        weight: number;
    };
    costs: any;
}
export declare class RMWarehouse extends Warehouse {
}
export declare class PWarehouse extends Warehouse {
}
export declare class SPWarehouse extends Warehouse {
}

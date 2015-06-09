import AbstractObject = require('./AbstractObject');
import Atelier = require('./Atelier');
declare class Factory implements AbstractObject {
    label: string;
    CO2Footprint: {
        kwh: number;
        weight: number;
    };
    costs: any;
    ateliers: Atelier[];
    static maxLandUse: number;
    static maxFactorySpaceUse: number;
    static fixedExpenses: number;
    spaceNeeded: number;
    produce(): void;
    extendSpace(extension: number): void;
}
export = Factory;

import AbstractObject = require('./AbstractObject');
declare class RawMaterial implements AbstractObject {
    spaceNeeded: number;
    label: string;
    CO2Footprint: {
        kwh: number;
        weight: number;
    };
    private suppliers;
    consume(quantity: number): boolean;
    undoConsume(quantity: number): void;
}
export = RawMaterial;

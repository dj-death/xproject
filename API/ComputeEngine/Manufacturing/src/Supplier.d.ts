import ENUMS = require('./ENUMS');
import RawMaterial = require('./RawMaterial');
declare class Supplier {
    name: string;
    availableQualities: ENUMS.QUALITY[];
    availableCredits: ENUMS.CREDIT[];
    spotPriceByQuality: number[];
    interestRate: number;
    rebateRate: number;
    discountRate: number;
    deliveryDelai: number;
    rawMaterial: RawMaterial;
    _getPrice(quality: ENUMS.QUALITY, credit: ENUMS.CREDIT): number;
    order(quantity: number, credit: ENUMS.CREDIT, quality: ENUMS.QUALITY, deliveryTime: ENUMS.DELIVERY): number;
}
export = Supplier;

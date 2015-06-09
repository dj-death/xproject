import Supplier = require('./Supplier');
import SemiProduct = require('./SemiProduct');
import ENUMS = require('./ENUMS');
declare class SubContractor extends Supplier {
    deliveryTime: number;
    SemiProduct: SemiProduct;
    order(quantity: number, credit: ENUMS.CREDIT, quality: ENUMS.QUALITY, deliveryTime: ENUMS.DELIVERY): number;
}
export = SubContractor;

import ENUMS = require('./ENUMS');
import RawMaterial = require('./RawMaterial');

interface Future {
    term: ENUMS.FUTURES;
    // will be fixed by market so we don't need to hard code it
    basePrice?: number;
}

interface FuturesArray {
    [index: string]: Future;
}

interface Quality {
    index: ENUMS.QUALITY;
    // will be fixed by market so we don't need to hard code it
    premium?: number;
}

interface QualitiesArray {
    [index: string]: Quality;
}

interface Payment {
    credit: ENUMS.CREDIT;
    part: number;
}

interface PaymentArray {
    [index: string]: Payment;
}


interface SupplierParams {
    name: string;

    arePricesStable: boolean;

    availableQualities: QualitiesArray;
    availableFutures: FuturesArray;
    payments: PaymentArray;

    interestRate: number;
    rebateRate: number;
    discountRate: number;

    deliveryDelai: ENUMS.DELIVERY;

    unplannedPurchasesPremium: number;
}

interface Material {
    supply: (quantity: number, value: number, term: ENUMS.FUTURES) => boolean;
}

class Supplier<T extends Material> {
    private initialised: boolean;

    params: SupplierParams;

    material: T;

    constructor(supplierParams: SupplierParams) {
        this.params = supplierParams;
    }
    
    init(material: T) {
        this.material = material;

        // now it's ok
        this.initialised = true;
    }

    // result

    purchasesValue: number = 0;

    unplannedPurchasesQ: number = 0;

    syncPrices(marketPrices: Future[], marketQualitiesPremium: Quality[] = []) {
        if (this.params.arePricesStable) {
            return false;
        }

        var i = 0,
            len = marketPrices.length,
            term, future: Future,
            index, quality: Quality;

        for (; i < len; i++) {
            term = marketPrices[i].term;

            future = this.params.availableFutures[ENUMS.FUTURES[term]];

            if (future.term == term) {
                future.basePrice = marketPrices[i].basePrice;
            }
        }

        i = 0;
        len = marketQualitiesPremium.length;

        for (; i < len; i++) {
            index = marketQualitiesPremium[i].index;

            quality = this.params.availableQualities[ENUMS.QUALITY[index]];

            if (index == quality.index) {
                quality.premium = marketQualitiesPremium[i].premium;
            }
        }
    }



    // helpers
    _getPrice(quality: ENUMS.QUALITY, term: ENUMS.FUTURES/*, credit: ENUMS.CREDIT*/): number {
        var price,
            basePrice = this.params.availableFutures[ENUMS.FUTURES[term]].basePrice,
            qualityPremium = this.params.availableQualities[ENUMS.QUALITY[quality]].premium;
        
        price = basePrice * (1 + qualityPremium);

        return price;
    }

    // actions

    order(quantity: number, quality: ENUMS.QUALITY = ENUMS.QUALITY.MQ, term: ENUMS.FUTURES = ENUMS.FUTURES.IMMEDIATE, unplannedPurchases: boolean = false): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            console.info(arguments);
            return false;
        }

        // 9di bli moujoud matmchich blach
        quality = this.params.availableQualities[ENUMS.QUALITY[quality]] !== undefined ? quality : ENUMS.QUALITY[Object.keys(this.params.availableQualities)[0]];
        term = this.params.availableFutures[ENUMS.FUTURES[term]] !== undefined ? term : ENUMS.FUTURES[Object.keys(this.params.availableFutures)[0]];

        var orderValue,
            price;

        price = this._getPrice(quality, term);
        orderValue = price * quantity;

        if (unplannedPurchases) {
            orderValue *= (1 + this.params.unplannedPurchasesPremium);

            this.unplannedPurchasesQ += quantity;
        }

        this.purchasesValue += orderValue;

        this.material.supply(quantity, orderValue, term);

        return true;
    }
}

export = Supplier;
import Economy = require('../../Environnement/src/Economy');

import Product = require('../../Manufacturing/src/Product');
import Warehouse = require('../../Manufacturing/src/Warehouse');

import SalesForce = require('./SalesForce');

import Transport = require('./Transport');

import Utils = require('../../../../utils/Utils');

interface MarketParams {
    name: string;
  
    acceptBacklog: boolean;
    dissatisfiedOrdersCancelledPercent: number;

    costs: {
        creditControlUnitCost: number; // 0 means inactived
        creditCardRatePerUnitSold: number; // 0 means inactived
    }
}

class SubMarket {
    private initialised: boolean;

    private economy: Economy;
    private market: Market;

    private product: Product;
    private warehouse: Warehouse;

    private salesForce: SalesForce;

    params: MarketParams;

    lastPBacklogQ: number;

    constructor(market: Market, params: MarketParams) {
        this.market = market;
        this.economy = this.market.economy;

        this.params = params;
    }

    init(product: Product, salesForce: SalesForce, stockOpeningQ: number, lastPBacklogQ: number = 0) {
        this.product = product;
        this.salesForce = salesForce;

        this.lastPBacklogQ = lastPBacklogQ;

        // create warehouse
        this.warehouse = new Warehouse({
            lostProbability: 0,
            costs: {
                fixedAdministrativeCost: 0,
                storageUnit: 0
            }
        });

        this.warehouse.init(stockOpeningQ);

        // now work
        this.initialised = true;
    }

    // decision
    advertisingBudget: number;

    price: number;

    deliveredQ: number = 0;

    // results
    orderedQ: number = 0;

    get soldQ(): number {
        return this.warehouse.outQ;
    }

    get backlogQ(): number {
        if (! this.params.acceptBacklog) {
            return 0;
        }

        return Math.round(this.warehouse.shortfallQ * (1 - this.params.dissatisfiedOrdersCancelledPercent));
    }

    get stockQ(): number {
        return this.warehouse.availableQ;
    }

    returnedQ: number;

    get salesRevenue(): number {
        return this.soldQ * this.price;
    }

    get ordersValue(): number {
        return this.orderedQ * this.price;
    }


    marketVolumeShareOfSales: number;
    marketValueShareOfSales: number;


    // helpers


    // actions
    receiveFrom(quantity: number, product: Product, price: number, adsBudget: number): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        var value = quantity * price;

        this.deliveredQ = quantity;
        this.price = price;
        this.advertisingBudget = adsBudget;

        this.warehouse.moveIn(quantity, value);

        if (this.lastPBacklogQ > 0) {
            this.lastPBacklogQ -= this.getOrdersOf(this.lastPBacklogQ, false); // false not a new order
        }

        return true;
    }

    getOrdersOf(quantity: number, isNewOrder: boolean = true): number {
        if (!this.initialised) {
            console.log('not initialised');
            return 0;
        }

        if (isNewOrder) {
            this.orderedQ += quantity;
        }

        var deliveredQ: number;

        // normal material from stock
        deliveredQ = this.warehouse.moveOut(quantity, true); // true to accept even if there is a shortfall

        if (deliveredQ < quantity) {

        }

        return deliveredQ;
    }

    returnForRepair(quantity: number) {
        this.product.returnForRepair(quantity);
    }


}



class Market {
    
    private initialised: boolean;

    private subMarkets: SubMarket[];

    private salesForce: SalesForce;

    private transport: Transport;

    economy: Economy;

    params: MarketParams;

    constructor(params: MarketParams) {
        this.params = params;
    }

    init(economy: Economy, products: Product[], salesForce: SalesForce, transport: Transport, stocksOpeningQs: number[], lastPBacklogQs: number[] = []) {

        this.economy = economy;
        this.salesForce = salesForce;
        this.transport = transport;

        this.transport.init(this);

        this.salesForce.market = this;

        var i = 0,
            len = products.length,
            productCode: number,

            subMarket: SubMarket;

        this.subMarkets = [];

        for (; i < len; i++) {
            productCode = products[i].params.code;

            subMarket = new SubMarket(this, this.params);
            subMarket.init(products[i], salesForce, stocksOpeningQs[i], lastPBacklogQs[i]);

            this.subMarkets[productCode] = subMarket;
        }

        // now work
        this.initialised = true;
    }

    // decision
    corporateComBudget: number;

    // results

    get salesRevenue(): number {
        // aggregate sales revenue of all subMarkets
        return Utils.sums(this.subMarkets, "salesRevenue");
    }

    get soldUnitsNb(): number {
        return Utils.sums(this.subMarkets, "soldQ");
    }

    get ordersValue(): number {
        return Utils.sums(this.subMarkets, "ordersValue");
    }

    get advertisingCost(): number {
        var total = 0,
            i = 0,
            len = this.subMarkets.length;

        total += this.corporateComBudget;

        for (; i < len; i++) {
            total += this.subMarkets[i].advertisingBudget;
        }

        return total;
    }

    // costs 
    get creditControlCost(): number {
        return this.soldUnitsNb * (this.params.costs.creditControlUnitCost + this.params.costs.creditCardRatePerUnitSold);
    }


    // actions
    receiveFrom(quantity: number, product: Product, price: number, adsBudget: number): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        this.transport.load(quantity / product.params.containerCapacityUnitsNb);

        var subMarket = this.subMarkets[product.params.code];

        return subMarket && subMarket.receiveFrom.apply(subMarket, arguments);

        product.params.containerCapacityUnitsNb
    }

    setCorporateCom(corporateComBudget: number): boolean {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }

        this.corporateComBudget = corporateComBudget;

        return true;
    }

    

    // for test purpose
    __simulate(orders: number[]) {
        var i = 0,
            len = orders.length;

        for (; i < len; i++) {
            this.subMarkets[i].getOrdersOf(orders[i]);
        }
    }



}

export = Market;
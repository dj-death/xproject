import Market = require('./Market');

import Utils = require('../../../../utils/Utils');

interface SalesOfficeParams {
    costs: {
        administrationCostRate: number;
    }
}

/*
interface SalesOfficeCost {
    administrationCost: number;
    totalCost: number;
}*/

class SalesOffice {
    private initialised: boolean;

    params: SalesOfficeParams;

    markets: Market[];

    constructor(params: SalesOfficeParams) {
        this.params = params;
    }

    init(markets: Market[]) {
        this.markets = markets;
    }

    // result
    get salesRevenue(): number {
        return Utils.sums(this.markets, "salesRevenue");
    }

    get ordersValue(): number {
        return Utils.sums(this.markets, "ordersValue");
    }

    // costs 
    get creditControlCost(): number {
        return Utils.sums(this.markets, "creditControlCost");
    }

    get administrationCost(): number {
        return this.params.costs.administrationCostRate * Math.max(this.salesRevenue, this.ordersValue);
    }

}

export = SalesOffice;
/*

export interface PaymentsTimeParam {
    salesOffice: PERIOD;
    employees: PERIOD;
    commissions: PERIOD;
    advertising: PERIOD;
    ISP: PERIOD;
    webDev: PERIOD;
    transport: PERIOD;
    researchs: PERIOD;
    tax: PERIOD;
}

export interface MarketingParam {
    salesOffice: SalesOfficeParam;
    markets: MarketParam[];
    eCommerce: ECommerceParam;
    salesForce: SalesForceParam;
    researchs: ResearchsParam;
    transport: TransportParam;
    paymentsTime: PaymentsTimeParam;
    soldPrices: number[];
}

export interface MarketingCosts {
    salesOfficeCost: SalesOfficeCost;
    advertisingCost: AdvertisingCost;
    salesForceCost: SalesForceCost;
    customServiceCost: CustomServiceCost;
    eCommerceCost: ECommerceCost;
    productDevCost: ProductDevCost;
    researchsCost: ResearchsCost;
    transportCost: TransportCost;
}


export interface MarketingRevenue {
    salesRevenue: {
        total: number;
    };

    ordersRevenue: {
        total: number;
    }
}

export class MarketingCashFlow {
    public operatingActivities = {
        receipts: {
            sales: [0, 0, 0]
        },

        payments: {
            salesOffice: 0,
            employees: 0,
            commissions: 0,
            advertising: 0,
            ISP: 0,
            webDev: 0,
            transport: 0,
            researchs: 0,
            tax: 0
        }
    };

    public investingActivities = null;

    public financingActivities = null;
}


export interface MarketingRes {
    markets: MarketRes[];
    eCommerceStats: ECommerceStats;
    costs: MarketingCosts;
    revenues: MarketingRevenue;
    researchs: ResearchsRes;
    productsImprovements: ProductImprovementsRes[];
    cashFlows: MarketingCashFlow[]; // by period
}

*/
var Marketing = (function () {
    function Marketing() {
    }
    Marketing.prototype.init = function (markets, salesOffice) {
        this.markets = markets;
        this.salesOffice = salesOffice;
        // init
        this.salesOffice.init(markets);
        this.initialised = true;
    };
    return Marketing;
})();
module.exports = Marketing;
//# sourceMappingURL=Marketing.js.map
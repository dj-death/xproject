import Employee = require('../../Personnel/src/Employee');

import Market = require('./Market');

interface SalesForceCost extends Employee.EmployeeCosts {
    minSupportPerAgent: number;
}



interface SalesForceParam extends Employee.EmployeeParams {
    isCommissionsBasedOnOrders: boolean;

    costs: SalesForceCost;
}


class SalesForce extends Employee.Employee {
    // params
    params: SalesForceParam;

    market: Market;
    
    // decision
    appointedNb: number;
    commissionRate: number;

    supportPerAgent: number;

    constructor(params: SalesForceParam) {
        super(params);
    }

    // helpers

    init(availablesWorkersNb: number, market?: Market) {
        super.init(availablesWorkersNb);

        this.market = market;
    }

    // result

    // costs
    get supportCost(): number {
        return this.supportPerAgent * this.employeesNb;
    }

    get commissionsCost(): number {
        var commissionsBase: number,
            salesRevenue: number,
            ordersValue: number,
            commissions: number;

        salesRevenue = this.market.salesRevenue;
        ordersValue = this.market.ordersValue;

        commissionsBase = this.params.isCommissionsBasedOnOrders ? ordersValue : salesRevenue;

        commissions = commissionsBase * this.commissionRate;

        return commissions;
    }

    // actions
    appoint(appointedNb: number, supportPerAgent: number, commissionRate: number): boolean {
        this.appointedNb = appointedNb;
        this.commissionRate = commissionRate;
        this.supportPerAgent = supportPerAgent < this.params.costs.minSupportPerAgent ? this.params.costs.minSupportPerAgent : supportPerAgent;

        return true;
    }

}

export = SalesForce;
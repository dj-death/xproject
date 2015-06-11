var SalesForce = require('../../API/ComputeEngine/Marketing/src/SalesForce');
var salesForceDefaultCostsParams = {
    minSupportPerAgent: 5000,
    dismissal: 5000,
    recruitment: 7500,
    training: 0
};
module.exports = {
    euroAgents: new SalesForce({
        category: "Agents Commerciaux",
        isCommissionsBasedOnOrders: true,
        costs: salesForceDefaultCostsParams
    }),
    naftaDistributors: new SalesForce({
        category: "Distributeurs Nafta",
        isCommissionsBasedOnOrders: false,
        costs: salesForceDefaultCostsParams
    }),
    internetDistributor: new SalesForce({
        category: "Distributeur Internet",
        isCommissionsBasedOnOrders: false,
        costs: salesForceDefaultCostsParams
    })
};
//# sourceMappingURL=SalesForce.js.map
import SalesOffice = require('../../API/ComputeEngine/Marketing/src/SalesOffice'); 

var salesOffice = new SalesOffice({
    costs: {
        administrationCostRate: 0.01
    }
});

export = salesOffice;
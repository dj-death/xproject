import Atelier = require('../../API/ComputeEngine/Manufacturing/src/Atelier');

var atelierMoulage = new Atelier({
    label: "Atelier de Moulage",
    spaceNeeded: 0,
    unity: 0,
    CO2Footprint: null,
    costs: {
        fixedExpenses: 0,
        maintenance: 0,
        power: 0
    }

});

var atelierFinition = new Atelier({
    label: "Atelier de Finition",
    spaceNeeded: 0,
    unity: 0,
    CO2Footprint: null,
    costs: {
        fixedExpenses: 0,
        maintenance: 0,
        power: 0
    }
});

export = [atelierMoulage, atelierFinition];
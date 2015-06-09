/**
* Paramètres Générales
*
*
* Copyright 2015 DIDI Mohamed, Inc.
*/

import ENUMS = require('ComputeEngine/Manufacturing/src/ENUMS');


interface Stage {
    nb: number;
    duration: ENUMS.PERIODS; // month
}

interface Configs {
    stage: Stage;
    index100Value: number;
}

class Game {
    private initialised: boolean = false;

    configs: Configs;

    constructor() {

    }

    init(configs: Configs) {
        this.configs = configs;

        // let's begin
        this.initialised = true;
    }

    get weeksNb(): number {
        var monthWeeksNb = 4;

        return this.configs.stage.duration * monthWeeksNb;
    }
}

export = Game;
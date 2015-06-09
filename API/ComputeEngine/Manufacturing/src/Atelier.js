var Atelier = (function () {
    function Atelier(atelierParams) {
        // results
        this.workedHoursNb = 0;
        this.params = atelierParams;
    }
    // helper
    Atelier.prototype.init = function (worker, machine) {
        this.worker = worker;
        this.machine = machine;
        // now let's work
        this.initialised = true;
    };
    // actions
    Atelier.prototype.work = function (hoursNb) {
        if (!this.initialised) {
            console.log('not initialised');
            return false;
        }
        var success;
        // power machines
        success = this.machine && this.machine.power(hoursNb);
        if (!success && this.machine) {
            console.log("Votre demande dépasse la capacité périodique des machines");
            return false;
        }
        // everything is ok now order workers to do their job
        // let's see if the machine do some trouble and need some extra time due to its depreciation
        if (this.machine) {
            hoursNb /= this.machine.machineEfficiencyAvg;
        }
        success = this.worker && this.worker.work(hoursNb);
        if (!success && this.worker) {
            console.log("Votre demande dépasse la capacité périodique des ouvriers");
            return false;
        }
        // now increment
        this.workedHoursNb += hoursNb;
        return success;
    };
    return Atelier;
})();
module.exports = Atelier;
//# sourceMappingURL=Atelier.js.map
var Employee = (function () {
    function Employee(params) {
        this.params = params;
    }
    // helpers
    Employee.prototype.init = function (availablesEmployeesNb) {
        this.employeesNb = availablesEmployeesNb;
        // till now before any recruit or dismissal
        this.availablesNextPeriodNb = this.employeesNb;
        // let's work
        this.initialised = true;
    };
    Object.defineProperty(Employee.prototype, "recruitCost", {
        // costs
        get: function () {
            return this.recruitedNb * this.params.costs.recruitment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Employee.prototype, "dismissalCost", {
        get: function () {
            return this.dismissedNb * this.params.costs.dismissal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Employee.prototype, "trainingCost", {
        get: function () {
            return this.trainedNb * this.params.costs.training;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Employee.prototype, "personnelCost", {
        get: function () {
            var sums = 0;
            sums += this.recruitCost;
            sums += this.dismissalCost;
            sums += this.trainingCost;
            return sums;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Employee.prototype, "wages", {
        get: function () {
            return this.salary * this.employeesNb;
        },
        enumerable: true,
        configurable: true
    });
    // actions
    Employee.prototype.recruit = function (recruitedNb) {
        this.recruitedNb = recruitedNb;
    };
    Employee.prototype.train = function (trainedNb) {
        this.trainedNb = trainedNb;
    };
    Employee.prototype.dismiss = function (dismissedNb) {
        this.dismissedNb = dismissedNb;
    };
    Employee.prototype.pay = function (salary) {
        this.salary = salary;
    };
    return Employee;
})();
exports.Employee = Employee;
//# sourceMappingURL=Employee.js.map

export interface EmployeeCosts {
    recruitment: number;
    dismissal: number;
    training: number;
}

export interface EmployeeParams {
    category: string;

    costs: EmployeeCosts;
}


export class Employee {
    protected initialised: boolean;

    // params
    params: EmployeeParams;

    // decision
    dismissedNb: number;
    recruitedNb: number;
    trainedNb: number;
    resignedNb: number;

    constructor(params: EmployeeParams) {
        this.params = params;
    }

    // helpers

    init(availablesEmployeesNb: number): void {

        this.employeesNb = availablesEmployeesNb;

        // till now before any recruit or dismissal
        this.availablesNextPeriodNb = this.employeesNb;

        // let's work
        this.initialised = true;
    }

    //result
    employeesNb: number;

    recruitedEffectiveNb: number;
    trainedEffectiveNb: number;

    availablesNextPeriodNb: number;

    salary: number;


    
    // costs
    get recruitCost(): number {
        return this.recruitedNb * this.params.costs.recruitment;
    }

    get dismissalCost(): number {
        return this.dismissedNb * this.params.costs.dismissal;
    }

    get trainingCost(): number {
        return this.trainedNb * this.params.costs.training;
    }

    get personnelCost(): number {
        var sums = 0;

        sums += this.recruitCost;
        sums += this.dismissalCost;
        sums += this.trainingCost;

        return sums;
    }

    get wages(): number {
        return this.salary * this.employeesNb;
    }

    

    // actions

    recruit(recruitedNb: number) {
        this.recruitedNb = recruitedNb;
    }

    train(trainedNb: number) {
        this.trainedNb = trainedNb;
    }

    dismiss(dismissedNb: number) {
        this.dismissedNb = dismissedNb;
    }

    pay(salary: number) {
        this.salary = salary;
    }
}

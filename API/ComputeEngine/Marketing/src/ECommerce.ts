
export interface ECommerceParam {
    serviceCostRate: number;
    initialJoiningFees: number;
    webPortCost: number;
    closingDownFees: number;
}

export interface ECommerceCost {
    webDevCost: number;
    webPortsCost: number;
    serviceCost: number;
    totalCost: number;
}

export interface ECommerceStats {
    isInitialJoining: boolean;
    isClosingDown: boolean;
    activeWebPortsNb: number;
    totalWebPortsNb: number;
    websiteVisitsNb: number;
    failedVisitsRate: number;
    serviceComplaintsNb: number;
}
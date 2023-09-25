class Statistics {
    constructor(
        // Electricity
        HighestPriceOfElectricity,
        LowestPriceOfElectricity,
        AveragePriceOfElectricity,
        AverageDaytimePriceOfElectricity,
        AverageNighttimePriceOfElectricity,
        WeightedAveragePriceOfElectricity,
        DaytimeWeightedAveragePriceOfElectricity,
        NighttimeWeightedAveragePriceOfElectricity,
        // Consumption
        HighestConsumption,
        HighestDayConsumption,
        LowestConsumption,
        AverageConsmption,
        // Cost
        HighestCostOfConsumption,
        WhenHighestCostOfConsumption,
        AverageCostOfConsumption,
        TotalCostOfConsumption,
        // Grid fees
        TotalDaytimeGridFee,
        TotalNighttimeGridFee,
        TotalExcise,
        TotalRenewableEnergyFee,
        TotalGridFee,
        // Total fees
        TotalFees
    ) {
        // Electricity
        this._HighestPriceOfElectricity = HighestPriceOfElectricity;
        this._LowestPriceOfElectricity = LowestPriceOfElectricity;
        this._AveragePriceOfElectricity = AveragePriceOfElectricity;
        this._AverageDaytimePriceOfElectricity = AverageDaytimePriceOfElectricity;
        this._AverageNighttimePriceOfElectricity = AverageNighttimePriceOfElectricity;
        this._WeightedAveragePriceOfElectricity = WeightedAveragePriceOfElectricity;
        this._DaytimeWeightedAveragePriceOfElectricity = DaytimeWeightedAveragePriceOfElectricity;
        this._NighttimeWeightedAveragePriceOfElectricity = NighttimeWeightedAveragePriceOfElectricity;
        // Consumption
        this._HighestConsumption = HighestConsumption;
        this._HighestDayConsumption = HighestDayConsumption;
        this._LowestConsumption = LowestConsumption;
        this._AverageConsmption = AverageConsmption;
        // Cost
        this._HighestCostOfConsumption = HighestCostOfConsumption;
        this._WhenHighestCostOfConsumption = WhenHighestCostOfConsumption;
        this._AverageCostOfConsumption = AverageCostOfConsumption;
        this._TotalCostOfConsumption = TotalCostOfConsumption;
        // Grid fees
        this._TotalDaytimeGridFee = TotalDaytimeGridFee;
        this._TotalNighttimeGridFee = TotalNighttimeGridFee;
        this._TotalExcise = TotalExcise;
        this._TotalRenewableEnergyFee = TotalRenewableEnergyFee;
        this._TotalGridFee = TotalGridFee;
        // Total fees
        this._TotalFees = TotalFees;
    }
}
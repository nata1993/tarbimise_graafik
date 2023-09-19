class Statistics {
    constructor(
        // Electricity
        HighestPriceOfElectricity,
        LowestPriceOfElectricity,
        AveragePriceOfElectricity,
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
        TotalCostOfConsumption
    ) {
        // Electricity
        this._HighestPriceOfElectricity = HighestPriceOfElectricity;
        this._LowestPriceOfElectricity = LowestPriceOfElectricity;
        this._AveragePriceOfElectricity = AveragePriceOfElectricity;
        this._WeightedAveragePriceOfElectricity = WeightedAveragePriceOfElectricity;
        this._DaytimeWeightedAveragePriceOfElectricity = DaytimeWeightedAveragePriceOfElectricity,
        this._NighttimeWeightedAveragePriceOfElectricity = NighttimeWeightedAveragePriceOfElectricity,
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
    }
}
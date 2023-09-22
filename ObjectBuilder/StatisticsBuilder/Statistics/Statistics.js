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
        TotalCostOfConsumption,
        // Grid fees
        TotalGridFee,
        TotalDaytimeGridFee,
        TotalNighttimeGridFee,
        TotalExcise,
        // Total fees
        TotalFees
    ) {
        // Electricity
        this._HighestPriceOfElectricity = HighestPriceOfElectricity;
        this._LowestPriceOfElectricity = LowestPriceOfElectricity;
        this._AveragePriceOfElectricity = AveragePriceOfElectricity;
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
        this._TotalGridFee = TotalGridFee;
        this._TotalDaytimeGridFee = TotalDaytimeGridFee;
        this._TotalNighttimeGridFee = TotalNighttimeGridFee;
        this._TotalExcise = TotalExcise;
        // Total fees
        this._TotalFees = TotalFees;
    }
}
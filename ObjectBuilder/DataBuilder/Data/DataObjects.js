class EleringData {
    constructor(
        normalizedData, 
        eleringDataLength
        ) {
        this.EleringData = normalizedData;
        this.EleringDataLength = eleringDataLength;
    }
}

class ConsumptionData {
    constructor(
        normalizedData, 
        consumptionDataLength, 
        consumptionDataPeriod,
        consumptionDataTotalConsumption
        ) {
        this.ConsumptionData = normalizedData;
        this.ConsumptionDataLength = consumptionDataLength;
        this.ConsumptionDataPeriod = consumptionDataPeriod;
        this.ConsumptionDataTotalConsumption = consumptionDataTotalConsumption;
    }
}
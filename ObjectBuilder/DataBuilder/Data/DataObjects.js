class ConsumptionData {
    constructor(
        NormalizedData, 
        ConsumptionDataLength, 
        ConsumptionDataPeriod,
        DayTimeConsumption,
        NightTimeConsumption,
        ConsumptionDataTotalConsumption
        ) {
        this._ConsumptionData = NormalizedData;
        this._ConsumptionDataLength = ConsumptionDataLength;
        this._ConsumptionDataPeriod = ConsumptionDataPeriod;
        this._DayTimeConsumption = DayTimeConsumption;
        this._NightTimeConsumption = NightTimeConsumption;
        this._ConsumptionDataTotalConsumption = ConsumptionDataTotalConsumption;
    }
}

class EleringData {
    constructor(
        NormalizedData, 
        NormalizedEleringDataLength
        ) {
        this._EleringData = NormalizedData;
        this._EleringDataLength = NormalizedEleringDataLength;
    }
}

class MergedData {
    constructor(
        MergedData,
        MergedDataLength,
        MergedDataLengthWithoutNull
    ) {
        this._MergedData = MergedData,
        this._MergedDataLength = MergedDataLength,
        this._MergedDataWithoutNull = MergedDataLengthWithoutNull
    }
}
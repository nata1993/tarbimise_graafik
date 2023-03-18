class EleringData {
    constructor(
        NormalizedData, 
        EleringDataLength
        ) {
        this._EleringData = NormalizedData;
        this._EleringDataLength = EleringDataLength;
    }
}

class ConsumptionData {
    constructor(
        NormalizedData, 
        ConsumptionDataLength, 
        ConsumptionDataPeriod,
        ConsumptionDataTotalConsumption
        ) {
        this._ConsumptionData = NormalizedData;
        this._ConsumptionDataLength = ConsumptionDataLength;
        this._ConsumptionDataPeriod = ConsumptionDataPeriod;
        this._ConsumptionDataTotalConsumption = ConsumptionDataTotalConsumption;
    }
}

class MergedData {
    constructor(
        MergedData,
        MergedDataLength
    ) {
        this._MergedData = MergedData,
        this._MergedDataLength = MergedDataLength
    }
}
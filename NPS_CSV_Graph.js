
// Draw Nord Pool Spot prices based on user selected date range
function drawGraphs() {
    // Retrieve file from input
    const file = document.getElementById("csvFileInput").files[0];
    Papa.parse(file, {
        // Default configuration for parsing CSV files
        delimiter: "",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: true,
        comments: false,
        step: undefined,
        // Upon parsing fully the data, graph is drawn
        complete: function(results) {
            const before = Date.now()/1000; 
            NPS_CSV_Graph_Generator(results);
            const after = Date.now()/1000;
            console.log("Time elapsed: ", after - before, "seconds");
        },
        error: undefined,
        download: false,
        downloadRequestHeaders: undefined,
        downloadRequestBody: undefined,
        skipEmptyLines: true,
        chunk: undefined,
        chunkSize: undefined,
        fastMode: false,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    });
    
}

// Use user set date range for retrieving Nord Pool Spot electricity prices
// from Elering API and generate prices graph with consumption graph
function NPS_CSV_Graph_Generator(CSV_File_Results) {
    // Take date span from CSV file, rearange it for API and fetch with it for needed data
    const date_span = CSV_File_Results.data[2][1];

    // Manipulate date from CSV file to include the day before CSV file start day because timezones matter
    let date = date_span.substring(0, 10);
    let year = Number(date.substring(6, 10));
    let month = Number(date.substring(3, 5))-1;
    let day = Number(date.substring(0, 2));    
    let dd = new Date(year, month, day);    // 01.02.2023 -> Wed Feb 01 2023 00:00:00 GMT+0200 (Eastern European Standard Time)

    // Start date minus one day and take later 22th element from array
    const date_start = dd.toISOString();    // 01.02.2023 -> 2023-01-31T22:00:00.000Z
    const date_end = date_span[19] + date_span[20] + date_span[21] + date_span[22]  + "-" + date_span[16] + date_span[17] + "-" + date_span[13] + date_span[14];

    const url = `https://dashboard.elering.ee/api/nps/price?start=${date_start}&end=${date_end}T23%3A59%3A59.999Z`;
    const foo = fetch(url)
        .then((response) => response.json())
        .then((res) => {
            // Build CSV consumption data
            const CSV_File_Data = CSV_File_Results.data;
            const ConsumptionData = new DataBuilder()
            .GetConsumptionDataPeriod(CSV_File_Data)
            .GetDaytimeConsumptionFromData(CSV_File_Data)
            .GetNightTimeConsumptionFromData(CSV_File_Data)
            .GetTotalConsumptionFromData(CSV_File_Data)
            .NormalizeCSVdata(CSV_File_Data)
            .BuildConsumptionData();

            // Build Elering dataset
            const EleringData = new DataBuilder()
            .NormalizeEleringData(res.data.ee)
            .BuildEleringData();

            // Merging two datasets into one
            const Merged_Data = new DataBuilder()
            .MergeData(EleringData._EleringData, ConsumptionData._ConsumptionData)
            .BuildMergedData();

            // Save data to session cookie for later use if data will be downloaded
            sessionStorage.setItem("Merged_data", JSON.stringify(Merged_Data._MergedData));

            // Build statistics dataset
            const Statistics = new StatisticsBuilder()
            .calculateHighestPriceOfElectricity(Merged_Data._MergedData)
            .calculateDayHighestConsumption(Merged_Data._MergedData)
            .calculateLowestPriceOfElectricity(Merged_Data._MergedData)
            .calculateAveragePriceOfElectricity(Merged_Data._MergedData)
            .calculateHighestConsumption(Merged_Data._MergedData)
            .calculateLowestConsumption(Merged_Data._MergedData)
            .calculateAverageConsmption(Merged_Data._MergedData)
            .calculateWeightedAveragePriceOfElectricity(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .calculateWeightedDaytimeAveragePriceOfElectricity(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .calculateWeightedNighttimeAveragePriceOfElectricity(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .calculateHighestCostOfConsumption(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .calculateAverageCostOfConsumption(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .calculateTotalCostOfConsumption(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .buildStatistics();

            // Create container where graphs will be placed
            const GraphsContainer = new GraphBuilder()
            .GetGraphsContainerWidthAndheightByID("graph_main_container")
            .SetGraphsContainerPadding(60, 20, 60, 20)
            .CalculateGraphsContainerPosition()
            .BuildGraphsContainer("graphs_container");

            // Create container for the graph
            const graphs_count = 3;
            const GraphContainers = new GraphBuilder()
            .CalculateGraphContainerPosition(
                GraphsContainer._Container_internal_position_coordinates.xy,
                GraphsContainer._Container_internal_position_coordinates.xy1,
                GraphsContainer._Container_internal_position_coordinates.x1y,
                GraphsContainer._Container_internal_position_coordinates.x1y1,
                graphs_count
            )
            .BuildGraphContainers();

            // Basic variables for the graph
            const graph_height = GraphContainers._Graph_containers[0][0].xy1[1] - GraphContainers._Graph_containers[0][0].xy[1];
            const ratio_for_usable_graph_height = 0.9;

            // Create Elering graph
            const EleringGraph = new GraphBuilder()
            .PrepareGraphsForDrawing(graph_height, ratio_for_usable_graph_height)
            .BuildBaseGraph(
                GraphContainers._Graph_containers[0][0], 
                true, 
                "elering_graph", 
                EleringData._EleringDataLength,
                [true, true],
                15
            );

            const ConsumptionGraph = new GraphBuilder()
            .PrepareGraphsForDrawing(graph_height, ratio_for_usable_graph_height)
            .BuildBaseGraph(
                GraphContainers._Graph_containers[1][0], 
                true, 
                "consumption_graph", 
                EleringData._EleringDataLength,
                [true, true],
                15
            );

            const CostGraph = new GraphBuilder()
            .PrepareGraphsForDrawing(graph_height, ratio_for_usable_graph_height)
            .BuildBaseGraph(
                GraphContainers._Graph_containers[2][0], 
                true, 
                "cost_graph", 
                EleringData._EleringDataLength,
                [true, true],
                15
            );

            EleringGraph.BuildEleringGraph(
                [
                    EleringGraph.graph_y1,
                    EleringGraph.graph_y2,
                    EleringGraph.graph_x1,
                    EleringGraph.graph_x2
                ],
                Merged_Data,
                Statistics._HighestPriceOfElectricity,
                EleringGraph.graph_usable_height,
                [
                    6, 12, 500
                ],
                "elering_graph"
            );

            ConsumptionGraph.BuildConsumptionGraph(
                [
                    ConsumptionGraph.graph_y1,
                    ConsumptionGraph.graph_y2,
                    ConsumptionGraph.graph_x1,
                    ConsumptionGraph.graph_x2
                ],
                Merged_Data,
                Statistics._HighestConsumption,
                EleringGraph.graph_usable_height,
                "consumption_graph"
            );

            CostGraph.BuildCostGraph(
                [
                    CostGraph.graph_y1,
                    CostGraph.graph_y2,
                    CostGraph.graph_x1,
                    CostGraph.graph_x2
                ],
                Merged_Data,
                Statistics._HighestCostOfConsumption,
                EleringGraph.graph_usable_height,
                "cost_graph"
            );

            // Fill data statistics to HTML
            document.getElementById("period").innerHTML = `Period: ${ConsumptionData._ConsumptionDataPeriod}`;

            document.getElementById("highestPrice").innerHTML = `${Statistics._HighestPriceOfElectricity} \u00A2/KWh`;
            document.getElementById("lowestPrice").innerHTML = `${Statistics._LowestPriceOfElectricity} \u00A2/KWh`;
            document.getElementById("averagePrice").innerHTML = `${Statistics._AveragePriceOfElectricity} \u00A2/KWh`;
            document.getElementById("weightedPrice").innerHTML = `${Statistics._WeightedAveragePriceOfElectricity} \u00A2/KWh`;
            document.getElementById("weightedDaytimePrice").innerHTML = `${Statistics._DaytimeWeightedAveragePriceOfElectricity} \u00A2/KWh`;
            document.getElementById("weightedNighttimePrice").innerHTML = `${Statistics._NighttimeWeightedAveragePriceOfElectricity} \u00A2/KWh`;

            document.getElementById("highestConsumption").innerHTML = `${Statistics._HighestConsumption} KWh`;
            document.getElementById("highestDailyConsumption").innerHTML = `${Statistics._HighestDayConsumption} KWh`;
            document.getElementById("lowestConsumption").innerHTML = `${Statistics._LowestConsumption} KWh`;
            document.getElementById("averageConsumption").innerHTML = `${Statistics._AverageConsmption} KWh`;
            document.getElementById("dayTimeConsumption").innerHTML = `${ConsumptionData._DayTimeConsumption} KWh`;
            document.getElementById("nightTimeConsumption").innerHTML = `${ConsumptionData._NightTimeConsumption} KWh`;
            document.getElementById("totalConsumption").innerHTML = `${ConsumptionData._ConsumptionDataTotalConsumption} KWh`;

            document.getElementById("totalCost").innerHTML = `${Statistics._TotalCostOfConsumption} €`;
            document.getElementById("highestCost").innerHTML = `${Statistics._HighestCostOfConsumption} \u00A2`;
            document.getElementById("whenHighestCost").innerHTML = `Which happened on ${Statistics._WhenHighestCostOfConsumption}`;
            document.getElementById("averageCost").innerHTML = `${Statistics._AverageCostOfConsumption} \u00A2`;

        })
        .catch(err => { throw err });
}
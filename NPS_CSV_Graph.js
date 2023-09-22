// Apply cookies when page has loaded
document.addEventListener("DOMContentLoaded", (event) => {
    const elem1 = document.getElementById("network_fee_day");
    const elem2 = document.getElementById("network_fee_night");
    const elem3 = document.getElementById("excise_tariff");
    const elem4 = document.getElementById("renew_tariff");

    elem1.addEventListener("change", (event) => {
        CookieHandler.SetLocalCookie("network_fee_day", elem1.value);
    });
    elem2.addEventListener("change", (event) => {
        CookieHandler.SetLocalCookie("network_fee_night", elem2.value);
    });
    elem3.addEventListener("change", (event) => {
        CookieHandler.SetLocalCookie("excise", elem3.value);
    });
    elem4.addEventListener("change", (event) => {
        CookieHandler.SetLocalCookie("renewable_energy", elem4.value);
    });

    elem1.value = CookieHandler.GetLocalCookie("network_fee_day");
    elem2.value = CookieHandler.GetLocalCookie("network_fee_night");
    elem3.value = CookieHandler.GetLocalCookie("excise");
    elem4.value = CookieHandler.GetLocalCookie("renewable_energy");
});

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
            // Clear contents of the graph area
            ClearSVGWindow ([
                "graphs_container",
                "elering_graph",
                "consumption_graph",
                "cost_graph",
                "text",
                "error"
            ]);
            
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
            CookieHandler.SetSessionCookie("Merged_data", JSON.stringify(Merged_Data._MergedData));

            // Build statistics dataset
            const grid_tarrif_day = Number(CookieHandler.GetLocalCookie("network_fee_day"));
            const grid_tarrif_night = Number(CookieHandler.GetLocalCookie("network_fee_night"));
            const excise = Number(CookieHandler.GetLocalCookie("excise"));
            const grid_tarrifs = [grid_tarrif_day, grid_tarrif_night, excise];
            const Statistics = new StatisticsBuilder()
            // Electricity
            .CalculateHighestPriceOfElectricity(Merged_Data._MergedData)
            .CalculateLowestPriceOfElectricity(Merged_Data._MergedData)
            .CalculateAveragePriceOfElectricity(Merged_Data._MergedData)
            .CalculateWeightedAveragePriceOfElectricity(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .CalculateWeightedDaytimeAveragePriceOfElectricity(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .CalculateWeightedNighttimeAveragePriceOfElectricity(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            // Consumption
            .CalculateHighestConsumption(Merged_Data._MergedData)
            .CalculateDayHighestConsumption(Merged_Data._MergedData)
            .CalculateLowestConsumption(Merged_Data._MergedData)
            .CalculateAverageConsmption(Merged_Data._MergedData)
            // Cost
            .CalculateHighestCostOfConsumption(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .CalculateAverageCostOfConsumption(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            .CalculateTotalCostOfConsumption(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull)
            // Network fees
            .CalculateTotalNetworkFee(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull, grid_tarrifs)
            .CalculateDaytimeNetworkFee(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull, grid_tarrifs)
            .CalculateNighttimeNetworkFee(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull, grid_tarrifs)
            .CalculateTotalExcise(Merged_Data._MergedData, Merged_Data._MergedDataWithoutNull, grid_tarrifs)
            // Total fees
            .CalculateTotalFees()
            .BuildStatistics();

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

            // Create Elering electricity prices graph
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

            // Create consumption graph
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

            // Create cost graph
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

            // Build the graphs
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

            // Build text for the graphs
            TextBuilder.SetTextVariablesAndBuildText(
                "text",
                [GraphContainers._Graph_containers[0][0],
                GraphContainers._Graph_containers[1][0],
                GraphContainers._Graph_containers[2][0]],
                "Aria",
                "12px",
                0.5,
                [
                    Statistics._HighestPriceOfElectricity,
                    Statistics._HighestConsumption,
                    Statistics._HighestCostOfConsumption
                ]
            );

            // Fill data statistics to HTML
            StatisticsText(Statistics, ConsumptionData);

            // Horizontal line over graph when mouse is moving over the graph
            const element = document.getElementById("graph_main_container");
            element.addEventListener("mousemove", function graphHorizontalLineAnimation(event) {
                GraphHorizontalLineAnimation(event, [GraphContainers._Graph_containers[0][0], GraphContainers._Graph_containers[1][0], GraphContainers._Graph_containers[2][0]]);
            });

        })
        .catch(err => {
            ErrorBuilder
            //.DisplayFeatureNotImplemented("arial", "20px", "error");
            .DisplayError("arial", "20px", "error");
            throw err;
        });
}

function ClearSVGWindow (element_id) {
    const length = element_id.length;
    for(let i = 0; i < length; i++) {
        document.getElementById(element_id[i]).innerHTML = "";
    }
}

function StatisticsText(Statistics, ConsumptionData) {
    document.getElementById("period").innerHTML = `Period: ${ConsumptionData._ConsumptionDataPeriod}`;

    // Electricity
    document.getElementById("highestPrice").innerHTML = `${Statistics._HighestPriceOfElectricity} \u00A2/kWh`;
    document.getElementById("lowestPrice").innerHTML = `${Statistics._LowestPriceOfElectricity} \u00A2/kWh`;
    document.getElementById("averagePrice").innerHTML = `${Statistics._AveragePriceOfElectricity} \u00A2/kWh`;
    document.getElementById("weightedPrice").innerHTML = `${Statistics._WeightedAveragePriceOfElectricity} \u00A2/kWh`;
    document.getElementById("weightedDaytimePrice").innerHTML = `${Statistics._DaytimeWeightedAveragePriceOfElectricity} \u00A2/kWh`;
    document.getElementById("weightedNighttimePrice").innerHTML = `${Statistics._NighttimeWeightedAveragePriceOfElectricity} \u00A2/kWh`;

    // Consumption
    document.getElementById("highestConsumption").innerHTML = `${Statistics._HighestConsumption} kWh`;
    document.getElementById("highestDailyConsumption").innerHTML = `${Statistics._HighestDayConsumption} kWh`;
    document.getElementById("lowestConsumption").innerHTML = `${Statistics._LowestConsumption} kWh`;
    document.getElementById("averageConsumption").innerHTML = `${Statistics._AverageConsmption} kWh`;
    document.getElementById("dayTimeConsumption").innerHTML = `${ConsumptionData._DayTimeConsumption} kWh`;
    document.getElementById("nightTimeConsumption").innerHTML = `${ConsumptionData._NightTimeConsumption} kWh`;
    document.getElementById("totalConsumption").innerHTML = `${ConsumptionData._ConsumptionDataTotalConsumption} kWh`;

    // Cost
    document.getElementById("totalCost").innerHTML = `${Statistics._TotalCostOfConsumption} €`;
    document.getElementById("highestCost").innerHTML = `${Statistics._HighestCostOfConsumption} \u00A2`;
    document.getElementById("whenHighestCost").innerHTML = `Which happened on ${Statistics._WhenHighestCostOfConsumption}`;
    document.getElementById("averageCost").innerHTML = `${Statistics._AverageCostOfConsumption} \u00A2`;

    // Network fees
    if(CookieHandler.GetLocalCookie("network_fee_day") !== null && CookieHandler.GetLocalCookie("network_fee_day") !== "") {
        document.getElementById("daytime_grid_tariff").innerHTML = `${CookieHandler.GetLocalCookie("network_fee_day")} \u00A2/kWh`;
    }
    if(CookieHandler.GetLocalCookie("network_fee_night") !== null && CookieHandler.GetLocalCookie("network_fee_night") !== "") {
        document.getElementById("nighttime_grid_tariff").innerHTML = `${CookieHandler.GetLocalCookie("network_fee_night")} \u00A2/kWh`;
    }
    if(CookieHandler.GetLocalCookie("excise") !== null && CookieHandler.GetLocalCookie("excise") !== "") {
        document.getElementById("excise").innerHTML = `${CookieHandler.GetLocalCookie("excise")} \u00A2/kWh`;
    }
    if(CookieHandler.GetLocalCookie("renewable_energy") !== null && CookieHandler.GetLocalCookie("renewable_energy") !== "") {
        document.getElementById("renewable_energy").innerHTML = `${CookieHandler.GetLocalCookie("renewable_energy")} \u00A2/kWh`;
    }

    document.getElementById("total_grid_fee").innerHTML = `${Statistics._TotalGridFee} €`;
    document.getElementById("total_daytime_grid_fee").innerHTML = `${Statistics._TotalDaytimeGridFee} €`;
    document.getElementById("total_nighttime_grid_fee").innerHTML = `${Statistics._TotalNighttimeGridFee} €`;
    document.getElementById("total_excise").innerHTML = `${Statistics._TotalExcise} €`;

    // Total fees
    document.getElementById("total_fees").innerHTML = `${Statistics._TotalFees} €`;
}   

function GraphHorizontalLineAnimation (evt, graph_coordinates) {
    // Electricity price graph boundaries
    const x1 = graph_coordinates[0].xy[0];
    const y1 = graph_coordinates[0].xy[1];
    const x2 = graph_coordinates[0].x1y1[0];
    const y2 = graph_coordinates[0].x1y1[1];
    let el = document.getElementById("nav_line");
    el.innerHTML = "";
    el.innerHTML += `<line x1="${x1}" y1="${evt.offsetY}" x2="${evt.offsetX}" y2="${evt.offsetY}" stroke="#555" stroke-width="1" />`;
    el.innerHTML += `<line x1="${evt.offsetX}" y1="${evt.offsetY}" x2="${x2}" y2="${evt.offsetY}" stroke="#555" stroke-width="1" />`;
    el.innerHTML += `<line x1="${evt.offsetX}" y1="${y1}" x2="${evt.offsetX}" y2="${evt.offsetY}" stroke="#555" stroke-width="1" />`;
    el.innerHTML += `<line x1="${evt.offsetX}" y1="${evt.offsetY}" x2="${evt.offsetX}" y2="${y2}" stroke="#555" stroke-width="1" />`;
    // Delete horizontal line if outside of graph bounds.
    if( evt.offsetX > x2 || evt.offsetX < x1 ||
        evt.offsetY > y2 || evt.offsetY < y1 ) {
            el.innerHTML = "";
    }
}
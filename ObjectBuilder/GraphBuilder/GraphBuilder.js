class GraphBuilder {
    // Graphs container
    GetGraphsContainerWidthAndheightByID(element_id) {
        const width = document.getElementById(element_id).getBoundingClientRect().width;
        const height = document.getElementById(element_id).getBoundingClientRect().height;
        this._SVG_container_dimensions = {
            SVG_container_parent_width: width, 
            SVG_container_parent_height: height
        };
        return this;
    }
    SetGraphsContainerPadding(padding_left, padding_top, padding_right, padding_bottom) {  
        this._padding = {
           _padding_left : padding_left,
           _padding_top : padding_top,
           _padding_right : padding_right,
           _padding_bottom : padding_bottom,
        }
        return this;
    }
    CalculateGraphsContainerPosition() {
        let padded_x = this._padding._padding_left;
        let padded_y = this._padding._padding_top;
        let padded_x1 = this._SVG_container_dimensions.SVG_container_parent_width - this._padding._padding_right;
        let padded_y1 = this._SVG_container_dimensions.SVG_container_parent_height - this._padding._padding_bottom;
        this._containerPositionCoordinates = {
            xy: [ padded_x, padded_y ], 
            xy1: [ padded_x, padded_y1 ], 
            x1y: [ padded_x1, padded_y ], 
            x1y1: [ padded_x1, padded_y1 ]
        };
        return this;
    }

    BuildGraphsContainer() {
        return new GraphsContainer(
            this._containerPositionCoordinates
        );
    }

    // Container for the graph
    CalculateGraphContainerPosition(_xy, _xy1, _x1y, _x1y1, graph_count) {
        let graph_containers = [];
        let container_height = ( _xy1[1] - _xy[1] ) / graph_count;
    
        // Find first graph coordinates
        let initial_xy = _xy;
        let initial_xy1 = [ _xy1[0], _xy1[1] = container_height];
        let initial_x1y = _x1y;
        let initial_x1y1 = [ _x1y1[0], _x1y1[1] = container_height];

        for(let i = 0; i < graph_count; i++){
            graph_containers.push([{
                    xy: initial_xy,
                    xy1: initial_xy1,
                    x1y: initial_x1y,
                    x1y1: initial_x1y1
                }
            ]);

            // Calculate next graph coordinates
            let next_xy = [ initial_xy[0], initial_xy[1] + container_height];
            let next_xy1 = [ initial_xy1[0], initial_xy1[1] + container_height];
            let next_x1y = [ initial_x1y[0], initial_x1y[1] + container_height];
            let next_x1y1 = [ initial_x1y1[0], initial_x1y1[1] + container_height];
            initial_xy = next_xy;
            initial_xy1 = next_xy1;
            initial_x1y = next_x1y;
            initial_x1y1 = next_x1y1;
        }

        this.graph_containers = graph_containers;
        return this;
    }

    BuildGraphContainers() {
        return new GraphContainers(this.graph_containers);
    }

    // Base graph
    PrepareGraphsForDrawing(height, ratioOfHeight) {
        this.graph_usable_height = height * ratioOfHeight;

        return this;
    }
    BuildBaseGraph(graph_coordinates, double_side_graph, element_id, hours_count, week_and_or_hours, segment_count) {
        const Base_Graph = document.getElementById(element_id);
        
        this._BaseGraph(graph_coordinates, double_side_graph, Base_Graph);
        this._BottomStrokes(graph_coordinates, hours_count, week_and_or_hours, Base_Graph);
        this._SideStrokes(graph_coordinates, double_side_graph, segment_count, Base_Graph);

        this.graph_y1 = graph_coordinates.xy[1];
        this.graph_y2 = graph_coordinates.xy1[1];
        this.graph_x1 = graph_coordinates.xy1[0];
        this.graph_x2 = graph_coordinates.x1y1[0];

        return this;
    }

    _BaseGraph(graph_coordinates, double_side_graph, element) {
        let svg_str = "";
        // arrows
        svg_str += `<line x1="${graph_coordinates.xy[0]}" y1="${graph_coordinates.xy[1]}" x2="${graph_coordinates.xy[0]-2}" y2="${graph_coordinates.xy[1]+5}" />`;
        svg_str += `<line x1="${graph_coordinates.xy[0]}" y1="${graph_coordinates.xy[1]}" x2="${graph_coordinates.xy[0]+2}" y2="${graph_coordinates.xy[1]+5}" />`;

        if(double_side_graph) {
            svg_str += `<line x1="${graph_coordinates.x1y[0]}" y1="${graph_coordinates.x1y[1]}" x2="${graph_coordinates.x1y[0]-2}" y2="${graph_coordinates.x1y[1]+5}" />`;
            svg_str += `<line x1="${graph_coordinates.x1y[0]}" y1="${graph_coordinates.x1y[1]}" x2="${graph_coordinates.x1y[0]+2}" y2="${graph_coordinates.x1y[1]+5}" />`;
        }
        
        // lines
        svg_str += `<line x1="${graph_coordinates.xy[0]}" y1="${graph_coordinates.xy[1]}" x2="${graph_coordinates.xy1[0]}" y2="${graph_coordinates.xy1[1]+10}" />`;
        svg_str += `<line x1="${graph_coordinates.xy1[0]}" y1="${graph_coordinates.xy1[1]}" x2="${graph_coordinates.x1y1[0]}" y2="${graph_coordinates.x1y1[1]}" />`;
        svg_str += `<line x1="${graph_coordinates.x1y1[0]}" y1="${graph_coordinates.x1y1[1]+10}" x2="${graph_coordinates.x1y[0]}" y2="${graph_coordinates.x1y[1]}" />`;
        
        element.innerHTML += svg_str;
    }
    _BottomStrokes(graph_coordinates, hours_count, week_and_or_hours, element) {
        let bottom_str = "";

        const stroke_width = (graph_coordinates.x1y[0] - graph_coordinates.xy[0]) / hours_count;
        let stroke_position = graph_coordinates.xy1[0];
        const stroke_start_y = graph_coordinates.xy1[1];
        const stroke_end_y_hours = graph_coordinates.xy1[1] + 5;
        const stroke_end_y_week = graph_coordinates.xy1[1] + 10;
        const hours = 24; 
        const week = 24 * 7;

        if(week_and_or_hours[0] == true) {
            // draw line each 24 hours
            const length1 = hours_count;
            for(let i = 0; i < length1; i += hours) {
                bottom_str += `<line x1="${stroke_position}" y1="${stroke_start_y}" x2="${stroke_position}" y2="${stroke_end_y_hours}" />`;
                stroke_position += stroke_width * hours;
            }

            if(week_and_or_hours[1] == true) {
                // draw line each week
                stroke_position = graph_coordinates.xy1[0];
                const length2 = hours_count;
                for(let i = 0; i < length2; i += week) {
                    bottom_str += `<line x1="${stroke_position}" y1="${stroke_start_y}" x2="${stroke_position}" y2="${stroke_end_y_week}" />`;
                    stroke_position += stroke_width * week;
                }
            }
        }
        
        element.innerHTML += bottom_str;
    }
    _SideStrokes(graph_coordinates, double_side_graph, segment_count, element) {
        let sides_str = "";
        const height_of_segment = this.graph_usable_height / segment_count;
        // left side
        for(let i = 0; i < segment_count + 1; i++) {
            let stroke_y_position = graph_coordinates.xy1[1] - (height_of_segment * i);
            sides_str += `<line x1="${graph_coordinates.xy[0]}"     y1="${stroke_y_position}"
                                x2="${graph_coordinates.xy[0]-7}"   y2="${stroke_y_position}" />`;
        }

        // right side
        if(double_side_graph) {
            for(let i = 0; i < segment_count + 1; i++) {
                let stroke_y_position = graph_coordinates.x1y1[1] - (height_of_segment * i);
                sides_str += `<line x1="${graph_coordinates.x1y[0]}"    y1="${stroke_y_position}"
                                    x2="${graph_coordinates.x1y[0]+7}"  y2="${stroke_y_position}" />`;
            }
        }
        
        element.innerHTML += sides_str;
    }

    // Graphs themselves
    BuildEleringGraph(graph_mapping_coordinates, data, highest_price, lowest_price, price_levels, element_id) {
        // electricity price levels
        const pricelevel1 = price_levels[0];
        const pricelevel2 = price_levels[1];
        const extremepricelevel = price_levels[2];

        // element preparation
        const element = document.getElementById(element_id);
        let element_str = "";

        // graph width sizing
        let x1 = graph_mapping_coordinates[2] + 1;
        let x2 = x1 + (((graph_mapping_coordinates[3] - 1) - (graph_mapping_coordinates[2] + 1)) / data._MergedDataLength);
        const width = x2 - x1;

        // generate continuos graph of lines
        for(let i = 0; i < data._MergedDataLength; i++) {
            const hourPrice = data._MergedData[i].price;
            // scaling formula from https://writingjavascript.com/scaling-values-between-two-ranges
            const y = (hourPrice - lowest_price) * ((graph_mapping_coordinates[0] + (this.graph_usable_height*0.1)) - graph_mapping_coordinates[1]) / (highest_price - lowest_price) + graph_mapping_coordinates[1];
            if (hourPrice <= pricelevel1) {
                element_str += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0A0" stroke-width="2"/>`;
            }
            else if (hourPrice > pricelevel1 && hourPrice <= pricelevel2) {
                element_str += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#FE0" stroke-width="2"/>`;
            }
            else if (hourPrice >= extremepricelevel) {
                element_str += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#F0F" stroke-width="2" />`;
            }
            else {
                element_str += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#F00" stroke-width="2"/>`;
            }
            
            x1 += width;
            x2 += width;
        }

        element.innerHTML += element_str;
    }

    BuildConsumptionGraph(graph_mapping_coordinates, data, highest_consumption, usable_heigth, element_id) {
        // element preparation
        const element = document.getElementById(element_id);
        let element_str = "";

        // graph width sizing
        let x1 = graph_mapping_coordinates[2] + 1;
        let x2 = x1 + (((graph_mapping_coordinates[3] - 1) - (graph_mapping_coordinates[2] + 1)) / data._MergedDataLength);
        const width = x2 - x1;

        // ratio for y coordinate
        const price_ratio = usable_heigth / highest_consumption;
        
        // generate continuos graph of lines
        for(let i = 0; i < data._MergedDataWithoutNull; i++) {
            const hourConsumption = data._MergedData[i].consumption;
            let y = graph_mapping_coordinates[1] - hourConsumption * price_ratio;
            
            element_str += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="2"/>`;
            
            x1 += width;
            x2 += width;
        }

        element.innerHTML += element_str;

        // Add text to the graph
        // TextBuilder.AddConsumptionGraphText("text");
    }

    BuildCostGraph(graph_mapping_coordinates, data, highest_cost, usable_heigth, element_id) {
        // element preparation
        const element = document.getElementById(element_id);
        let element_str = "";

        // graph width sizing
        let x1 = graph_mapping_coordinates[2] + 1;
        let x2 = x1 + (((graph_mapping_coordinates[3] - 1) - (graph_mapping_coordinates[2] + 1)) / data._MergedDataLength);
        const width = x2 - x1;

        // ratio for y coordinate
        const price_ratio = usable_heigth / highest_cost;
        
        // generate continuos graph of lines
        for(let i = 0; i < data._MergedDataWithoutNull; i++) {
            const hourCost = data._MergedData[i].cost;
            let y = graph_mapping_coordinates[1] - hourCost * price_ratio;
            
            element_str += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#f77d40" stroke-width="2"/>`;
            
            x1 += width;
            x2 += width;
        }

        element.innerHTML += element_str;

        // Add text to the graph
        // TextBuilder.AddCostGraphText("text");
    }

    _SpecifieDataGroups(price_levels) {
        

        // consumption

        // cost

    }
    _AddDataToGraph(data) {
        // calculate vertical position of the stroke
        // calculate horizontal position of the stroke
        // map stroke according to position
        // add price/cost/consumption data to the graph sides

    }

    // Add text to graph
    /*
    
    let textOffsetBelowGraph = base_y + 25;
    textStr += `<text x="${(SVG_Width/2) - 15}" y="${textOffsetBelowGraph}">Hours</text>`;
    textStr += `<circle cx="${endPosition - 100}" cy="${textOffsetBelowGraph - 2}" r="2" stroke="#F0F" fill="#F0F"/>`;
    textStr += `<text x="${endPosition - 90}" y="${textOffsetBelowGraph}">Extreme price(s)</text>`;
    textStr += `<line x1="75" y1="${textOffsetBelowGraph}" x2="90" y2="${textOffsetBelowGraph}" stroke="#F00" stroke-width="2" />`;
    textStr += `<text x="100" y="${textOffsetBelowGraph + 3}">Over ${pricelevel2} \u00A2/KWh</text>`;
    textStr += `<line x1="190" y1="${textOffsetBelowGraph}" x2="205" y2="${textOffsetBelowGraph}" stroke="#FF0" stroke-width="2" />`;
    textStr += `<text x="215" y="${textOffsetBelowGraph + 3}">Between ${pricelevel1} and ${pricelevel2} \u00A2/KWh</text>`;
    textStr += `<line x1="350" y1="${textOffsetBelowGraph}" x2="365" y2="${textOffsetBelowGraph}" stroke="#0A0" stroke-width="2" />`;
    textStr += `<text x="375" y="${textOffsetBelowGraph + 3}">Below ${pricelevel1} \u00A2/KWh</text>`;
    textStr += `<line x1="${(SVG_Width / 2) + 235}" y1="${textOffsetBelowGraph}" x2="${(SVG_Width / 2) + 250}" y2="${textOffsetBelowGraph}" stroke="#000" stroke-width="2" />`;
    textStr += `<text x="${(SVG_Width / 2) + 260}" y="${textOffsetBelowGraph + 3}">Consumption</text>`;

    // Add price segments next to vertical graph on the left
    let textY = base_y + 2; // +2 is for centering text
    let count = graphheight / verticalWidthBetweenPoints;
    for (let i = 0; i < count+1; i += 2) {
        textStr += `<text x="30" y="${textY}">${nRatio * i}</text>`;
        textY -= verticalWidthBetweenPoints * 2;
    }
    */
}
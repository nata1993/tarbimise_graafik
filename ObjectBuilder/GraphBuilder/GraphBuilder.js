class GraphBuilder {

    // Graphs container for the graphs
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

    BuildGraphsContainer(graphs_container_ID) {
        const Graphs_container = document.getElementById(graphs_container_ID);
        Graphs_container.innerHTML = "";

        return new GraphsContainer(
            this._containerPositionCoordinates
        );
    }

    // Graph container for the graph
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

    // The graphs themselves
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
        for(let i = 0; i < segment_count; i++) {
            let stroke_y_position = graph_coordinates.xy1[1] - (height_of_segment * i);
            sides_str += `<line x1="${graph_coordinates.xy[0]}" y1="${stroke_y_position}" x2="${graph_coordinates.xy[0]-7}" y2="${stroke_y_position}" />`;
        }

        // right side
        if(double_side_graph) {
            for(let i = 0; i < segment_count; i++) {
                let stroke_y_position = graph_coordinates.x1y1[1] - (height_of_segment * i);
                sides_str += `<line x1="${graph_coordinates.x1y[0]}" y1="${stroke_y_position}" x2="${graph_coordinates.x1y[0]+7}" y2="${stroke_y_position}" />`;
            }
        }
        
        element.innerHTML += sides_str;
    }






    
    BuildEleringGraph(graph_mapping_coordinates) {
        this._SpeficieDataGroups();
        this._AddDataToGraph();
        console.log(graph_mapping_coordinates);

    }

    BuildConsumptionGraph(graph_mapping_coordinates) {
        this._AddDataToGraph();
        this._SpeficieDataGroups();
        console.log(graph_mapping_coordinates);
    }

    BuildCostGraph(graph_mapping_coordinates) {
        this._AddDataToGraph();
        this._SpeficieDataGroups();
        console.log(graph_mapping_coordinates);
    }

    _SpeficieDataGroups() {

    }
    _AddDataToGraph() {
        // calculate vertical position of the stroke
        // calculate horizontal position of the stroke
        // map stroke according to position
        // add price/cost/consumption data to the graph sides

    }
}
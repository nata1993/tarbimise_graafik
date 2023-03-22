class GraphBuilder {

    // Graphs container for the graphs
    GetGraphsContainerWidthAndHeigthByID(element_id) {
        const width = document.getElementById(element_id).getBoundingClientRect().width;
        const heigth = document.getElementById(element_id).getBoundingClientRect().height;
        this._SVG_container_dimensions = {
            SVG_container_parent_width: width, 
            SVG_container_parent_heigth: heigth
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
        let padded_y1 = this._SVG_container_dimensions.SVG_container_parent_heigth - this._padding._padding_bottom;
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

    // Graph container for the graph
    CalculateGraphContainerPosition(_xy, _xy1, _x1y, _x1y1, graph_count) {
        let graph_containers = [];
        let container_heigth = ( _xy1[1] - _xy[1] ) / graph_count;
    
        // Find first graph coordinates
        let initial_xy = _xy;
        let initial_xy1 = [ _xy1[0], _xy1[1] = container_heigth];
        let initial_x1y = _x1y;
        let initial_x1y1 = [ _x1y1[0], _x1y1[1] = container_heigth];

        for(let i = 0; i < graph_count; i++){
            // push array of objects to the stack of graphs
            graph_containers.push([{
                    xy: initial_xy,
                    xy1: initial_xy1,
                    x1y: initial_x1y,
                    x1y1: initial_x1y1
                }
            ]);

            // Calculate next graph coordinates
            let next_xy = [ initial_xy[0], initial_xy[1] + container_heigth];
            let next_xy1 = [ initial_xy1[0], initial_xy1[1] + container_heigth];
            let next_x1y = [ initial_x1y[0], initial_x1y[1] + container_heigth];
            let next_x1y1 = [ initial_x1y1[0], initial_x1y1[1] + container_heigth];
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
    CalculateGraphStartAndEndPosition() {
        let x = 0;  // graph null point
        let x1 = 0; // graph end point
        let y = 0; // graph null point
        let y1 = 0; // graph end point

        this.startAndEnd = {x: x, y: y, x1: x1, y1: y1};
        return this;
    }

    BuildEleringGraph() {
        return new Graph(

        );
    }

    BuildConsumptionGraph() {

    }

    BuildCostGraph() {

    }
}
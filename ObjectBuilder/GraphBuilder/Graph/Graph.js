class Graph {
    // Graph container
    #coordinates = null;
    #width = null;
    #heigth = null;

    // Graph container left and right vertical line decoration
    #strokingWidth = null;
    #strokeLength = null;

    // Graph verticle itselt
    #graphWidth = null;



    constructor(coordinates, width, heigth, strokingWidth, strokeLength, graphWidth) {
        this.#coordinates = coordinates;
        this.#width = width;
        this.#heigth = heigth;
        this.#strokingWidth = strokingWidth;
        this.#strokeLength = strokeLength;
        this.#graphWidth = graphWidth;
    }

    createBaseGraph() {
        console.log("creating base graph");
    }
}
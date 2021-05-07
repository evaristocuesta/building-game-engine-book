export default class VertexBuffer {

    // reference to the vertex positions for the square in the gl context
    #squareVertexBuffer;

    // First: define the vertices for a square
    #verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    constructor() {
    }

    initializeWebGL(gl) {
        // Step A: Create a buffer on the gGL context for our vertex positions
        this.#squareVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#squareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#verticesOfSquare), gl.STATIC_DRAW);
    }

    getGLVertexRef () {
        return this.#squareVertexBuffer;
    }
}
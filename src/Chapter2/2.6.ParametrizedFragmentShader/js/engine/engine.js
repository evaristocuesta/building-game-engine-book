import SimpleShader from './simpleShader.js';
import VertexBuffer from './vertexBuffer.js';

export default class Engine {

    // The graphical context to draw to
    #gl;
    #vertexBuffer;
    #shader;

    constructor() {
        this.#vertexBuffer = new VertexBuffer();
    }

    // initialize the WebGL, the vertex buffer and compile the shaders
    initializeWebGL(canvasID) {
        var canvas = document.getElementById(canvasID);
        
        // Get the standard or experimental webgl and binds to the Canvas area
        // store the results to the instance variable mGL
        this.#gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (this.#gl === null) {
            document.write('<br><b>Your browser does not support WebGL');
            return;
        }

        // now initialize the VertexBuffer
        this.#vertexBuffer.initializeWebGL(this.#gl);

        // Create
        this.#shader = new SimpleShader();

        // load and compile shaders
        this.#shader.initialize(this, './js/glslShaders/simpleVS.glsl', './js/glslShaders/simpleFS.glsl');

        // Activate the proper shader
        this.#shader.activateShader([0.8, 0.4, 0.3, 1]);

        this.#gl.drawArrays(this.#gl.TRIANGLE_STRIP, 0, 4);
    }

    // Clears the draw area and draws one square
    clearCanvas(color) {
        this.#gl.clearColor(color[0], color[1], color[2], color[3]);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
    }

    // Accessor of the webgl context
    getGL() {
        return this.#gl;
    }

    getVertexBuffer() {
        return this.#vertexBuffer;
    }
}
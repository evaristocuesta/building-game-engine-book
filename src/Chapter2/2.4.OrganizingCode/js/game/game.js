import Engine from '../engine/engine.js';

export default class Game {

    #engine;
    #shader;

    constructor (canvasID) {

        this.#engine = new Engine();

        // Step A: Initialize the webGL Context and the VertexBuffer
        this.#engine.initializeWebGL(canvasID);

        // Step C: Draw!
        // Step C1: Clear the canvas
        this.#engine.clearCanvas([0, 0.8, 0, 1]);

        // Step C3: Draw with the currently activated geometry and the activated shader
        var gl = this.#engine.getGL();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

document.body.onload = function() {
    var game = new Game('GLCanvas');
}
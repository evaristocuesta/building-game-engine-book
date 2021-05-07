export default class SimpleShader {

    #compiledShader;
    #shaderVertexPositionAttribute;
    #engine;
    #gl;

    initialize (engine, vertexShaderID, fragmentShaderID) {
        this.#engine = engine;
        this.#gl = this.#engine.getGL();

        // Step A: load and compile vertex and fragment shaders
        var vertexShader = this.#loadAndCompileShader(vertexShaderID, this.#gl.VERTEX_SHADER);
        var fragmentShader = this.#loadAndCompileShader(fragmentShaderID, this.#gl.FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.#compiledShader = this.#gl.createProgram();
        this.#gl.attachShader(this.#compiledShader, vertexShader);
        this.#gl.attachShader(this.#compiledShader, fragmentShader);
        this.#gl.linkProgram(this.#compiledShader);

        // Step C: check for error
        if (!this.#gl.getProgramParameter(this.#compiledShader, this.#gl.LINK_STATUS)) {
            alert("Error linking shader");
            return null;
        }

        // Step D: Gets a reference to the aSquareVertexPosition attribute within the shaders.
        this.#shaderVertexPositionAttribute = this.#gl.getAttribLocation(
            this.#compiledShader, "aSquareVertexPosition");

        // Step E: Activates the vertex buffer loaded in EngineCore_VertexBuffer.js
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#engine.getVertexBuffer().getGLVertexRef());

        // Step F: Describe the characteristic of the vertex position attribute
        this.#gl.vertexAttribPointer(this.#shaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            this.#gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
    }

    getShader () {
        return this.#compiledShader;
    }

    activateShader () {
        this.#gl.useProgram(this.#compiledShader);
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#engine.getVertexBuffer().getGLVertexRef());
        this.#gl.vertexAttribPointer(this.#shaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            this.#gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        this.#gl.enableVertexAttribArray(this.#shaderVertexPositionAttribute);
    }

    #loadAndCompileShader (id, shaderType) {
        var shaderText, shaderSource, compiledShader;

        // Step A: Get the shader source from index.html
        shaderText = document.getElementById(id);
        shaderSource = shaderText.firstChild.textContent;

        // Step B: Create the shader based on the shader type: vertex or fragment
        compiledShader = this.#gl.createShader(shaderType);

        // Step C: Compile the created shader
        this.#gl.shaderSource(compiledShader, shaderSource);
        this.#gl.compileShader(compiledShader);

        // Step D: check for errors and return results (null if error)
        // The log info is how shader compilation errors are typically displayed.
        // This is useful for debugging the shaders.
        if (!this.#gl.getShaderParameter(compiledShader, this.#gl.COMPILE_STATUS)) {
            alert("A shader compiling error occurred: " + this.#gl.getShaderInfoLog(compiledShader));
        }

        return compiledShader;
    }
}
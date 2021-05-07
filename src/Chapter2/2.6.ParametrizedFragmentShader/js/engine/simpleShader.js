export default class SimpleShader {

    #compiledShader;
    #shaderVertexPositionAttribute;
    #engine;
    #gl;
    #pixelColor;

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
        
        // Step G: Gets a reference to the uniform variable uPixelColor in the
        // fragment shader
        this.#pixelColor = this.#gl.getUniformLocation(this.#compiledShader, "uPixelColor");
    }

    getShader () {
        return this.#compiledShader;
    }

    activateShader (pixelColor) {
        this.#gl.useProgram(this.#compiledShader);
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#engine.getVertexBuffer().getGLVertexRef());
        this.#gl.vertexAttribPointer(this.#shaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            this.#gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        this.#gl.enableVertexAttribArray(this.#shaderVertexPositionAttribute);
        this.#gl.uniform4fv(this.#pixelColor, pixelColor);
    }

    #loadAndCompileShader (filePath, shaderType) {
        var shaderText, shaderSource, compiledShader;

        const xmlReq = new XMLHttpRequest();
        xmlReq.open('GET', filePath, false);
        try {
            xmlReq.send();
        } 
        catch (error) {
            alert("Failed to load shader: " + filePath);
            return null;
        }
        shaderSource = xmlReq.responseText;
        if (shaderSource === null) {
            alert("WARNING: Loading of:" + filePath + " Failed!");
            return null;
        }

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
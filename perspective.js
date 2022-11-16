"use strict";

var perspectiveExample = function(){
var canvas;
var gl;

var numPositions  = 36;

var positionsArray = [];
var colorsArray = [];

var vertices = [
    vec4(-0.5, -0.5,  1.5, 1.0),
    vec4(-0.5,  0.5,  1.5, 1.0),
    vec4(0.5,  0.5,  1.5, 1.0),
    vec4(0.5, -0.5,  1.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0)
];

var vertexColors = [
    vec4(1.0, 0.0, 0.0, 1.0), 
    vec4(1.0, 1.0, 0.0, 1.0),  
    vec4(0.0, 1.0, 0.0, 1.0),  
    vec4(0.0, 1.0, 1.0, 1.0),  
    vec4(1.0, 0.0, 0.0, 1.0),  
    vec4(1.0, 0.0, 1.0, 1.0),  
    vec4(1.0, 0.5, 1.0, 1.0),  
    vec4(1.0, 1.0, 1.0, 1.0),  
];


var near = 1.0;
var far = 2.0;
var radius = 2.0;
var theta = 0.0;
var phi = 0.0;
var dr = 2 * Math.PI/180.0;

var  fovy = 50.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function quad(a, b, c, d) {
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}


function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect =  canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

// buttons for viewing parameters

    document.getElementById("Radio1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Radio2").onclick = function(){near *= 0.9; far *= 1.1;};
    document.getElementById("Radio3").onclick = function(){radius += 3.0;};
    document.getElementById("Radio4").onclick = function(){radius -= 2.0;};
    document.getElementById("Radio5").onclick = function(){theta += dr;};
    document.getElementById("Radio6").onclick = function(){theta -= dr;};
    document.getElementById("Radio7").onclick = function(){phi += dr;};
    document.getElementById("Radio8").onclick = function(){phi -= dr;};

    document.getElementById("customRange1").onchange = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("customRange2").onchange = function(){near *= 0.9; far *= 1.1;};
  


    render();
}


var render = function(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}

}
perspectiveExample();
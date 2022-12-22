import define1 from "./9d0fa713ea129540@422.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./1b675294aba5f9ea@583.js";

function _1(md){return(
md`# Assignment 3: David Labiakh-True`
)}

function _2(md){return(
md`### External Libraries and Functions`
)}

function _twgl(require){return(
require("twgl.js")
)}

function _7(md){return(
md`### OpenGL/WebGL Rendering Context Initialization`
)}

function _gl(DOM,width,hex2rgb,color)
{
  const myCanvas = DOM.canvas(width, 480);
  const gl = myCanvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(...hex2rgb(color), 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  return gl;
}


function _9(md){return(
md`### Student Functions`
)}

function _generateVertexAttributesArray(){return(
(modelObjData) =>
{
  var vertexAttributesArray = Array();
  for (let index = 0; index < modelObjData.length; ++index) 
  {
    vertexAttributesArray.push(
            Object({
              position:{numComponents:3, data: modelObjData[index].sc.positions},
              normal:{numComponents:3, data: modelObjData[index].sc.normals}
            }))
  }
  return vertexAttributesArray;
}
)}

function _11(md){return(
md`### 1. Read the 3D model`
)}

async function _modelURL(FileAttachment){return(
await FileAttachment("raymanModel.obj").url()
)}

function _modelObj(loadModelFromURL,modelURL){return(
loadModelFromURL(modelURL, "obj")
)}

function _extents(computeModelExtent,modelObj){return(
computeModelExtent(modelObj)
)}

function _vertexAttributes(generateVertexAttributesArray,modelObj){return(
generateVertexAttributesArray(modelObj)
)}

function _16(md){return(
md`### 2. TWGL code to create an array of buffer information from the array of Vertex Attributes`
)}

function _bufferInfoArray(vertexAttributes,twgl,gl){return(
vertexAttributes .map((d) =>
  twgl.createBufferInfoFromArrays(gl, d)
)
)}

function _18(md){return(
md`### 3. Write Vertex and Fragment shaders`
)}

function _shaders(){return(
{
    vs: `#version 300 es
    precision highp float;

    uniform float scale;
    uniform vec3 offset;
    uniform float aspectRatio;

    in vec3 position;
    in vec3 normal;

    out vec3 fragColor;

    void main () 
    {
      vec3 worldPosition = (position-offset)*scale;
      vec3 projectionPosition = vec3( worldPosition.x / aspectRatio, worldPosition.yz );
      gl_Position = vec4( projectionPosition, 1.0f);
      fragColor = normal;

    }`,

    fs: `#version 300 es
    precision highp float;

    in vec3 fragColor;

    out vec4 outColor;

    void main () 
    {

      outColor = vec4(normalize(abs(fragColor)), 1.0f );
    }`
  }
)}

function _20(md){return(
md`### 4. TWGL code to compile the shaders and create a WebGL program`
)}

function _errorBlock(html,width){return(
html`<textarea style="height : 20px; width : ${width}px; font-size: 0.8em; display: block"></textarea>`
)}

function _programInfo(errorBlock,twgl,gl,shaders)
{
  errorBlock.style.height = "20px";
  errorBlock.innerHTML = "Program Shader compilation successful";
  return twgl.createProgramInfo(gl, [shaders.vs, shaders.fs], (message) => {
    errorBlock.style.height = "400px";
    errorBlock.innerHTML = "Program Shader compilation error\n" + message;
  });
}


function _23(md){return(
md`### 5. Create a uniform object and set the values of the uniforms that you wish to supply to the shader program at run time(if any) `
)}

function _uniforms(gl,extents){return(
{
    aspectRatio : gl.canvas.width / gl.canvas.height,
    scale : 1/extents.dia,
    offset : extents.center
  }
)}

function _25(md){return(
md`### 6. Do final rendering `
)}

function _color(colorInput){return(
colorInput()
)}

function _27(gl,hex2rgb,color,programInfo,bufferInfoArray,twgl,uniforms)
{
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear bits
  gl.clearColor(...hex2rgb(color), 1); // set background
  gl.useProgram(programInfo.program); // tell opengl to use shader

  // render each object in array/stack
  bufferInfoArray.forEach((bufferInfo) => 
  {
    twgl.setUniforms(programInfo, uniforms); // set uniforms for each object(this could be dynamic later)
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);  // set attributes
    twgl.drawBufferInfo(gl, bufferInfo); // draw information based on buffer
  });
  return gl.canvas;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["raymanModel.obj", {url: new URL("./files/c1fc0d2fbf2bed5669afae79d4c0e896701b9e7257924c92a873b376bb2e65d7c217aeb899c11088d648cf89535a89089cdabff9da336ba7e6a739dd5e20a5cf.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  const child1 = runtime.module(define1);
  main.import("loadModelFromURL", child1);
  main.import("computeModelExtent", child1);
  const child2 = runtime.module(define2);
  main.import("color", "colorInput", child2);
  const child3 = runtime.module(define3);
  main.import("hex2rgb", child3);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("gl")).define("gl", ["DOM","width","hex2rgb","color"], _gl);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("generateVertexAttributesArray")).define("generateVertexAttributesArray", _generateVertexAttributesArray);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("modelURL")).define("modelURL", ["FileAttachment"], _modelURL);
  main.variable(observer("modelObj")).define("modelObj", ["loadModelFromURL","modelURL"], _modelObj);
  main.variable(observer("extents")).define("extents", ["computeModelExtent","modelObj"], _extents);
  main.variable(observer("vertexAttributes")).define("vertexAttributes", ["generateVertexAttributesArray","modelObj"], _vertexAttributes);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("bufferInfoArray")).define("bufferInfoArray", ["vertexAttributes","twgl","gl"], _bufferInfoArray);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("shaders")).define("shaders", _shaders);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("errorBlock")).define("errorBlock", ["html","width"], _errorBlock);
  main.variable(observer("programInfo")).define("programInfo", ["errorBlock","twgl","gl","shaders"], _programInfo);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("uniforms")).define("uniforms", ["gl","extents"], _uniforms);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("viewof color")).define("viewof color", ["colorInput"], _color);
  main.variable(observer("color")).define("color", ["Generators", "viewof color"], (G, _) => G.input(_));
  main.variable(observer()).define(["gl","hex2rgb","color","programInfo","bufferInfoArray","twgl","uniforms"], _27);
  return main;
}

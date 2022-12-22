import define1 from "./9d0fa713ea129540@422.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./1b675294aba5f9ea@583.js";
import define4 from "./a2e58f97fd5e8d7c@736.js";
import define5 from "./10023e7d8ddc32bc@90.js";

function _1(md){return(
md`# Assignment 4: David Labiakh-True`
)}

function _2(md){return(
md`### External Libraries and Functions`
)}

function _deg2Rad(){return(
function(angleInDegrees)
{
  return angleInDegrees * (Math.PI / 180);
}
)}

function _twgl(require){return(
require("twgl.js")
)}

function _m4(twgl){return(
twgl.m4
)}

function _11(md){return(
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


function _13(md){return(
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

function _15(md){return(
md`### Load the 3D model`
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

function _20(md){return(
md`### TWGL Vertex Attributes To Buffer`
)}

function _bufferInfoArray(vertexAttributes,twgl,gl){return(
vertexAttributes .map((d) =>
  twgl.createBufferInfoFromArrays(gl, d)
)
)}

function _22(md){return(
md`### Vertex and Fragment Shaders - Model Matrix based`
)}

function _shaders(){return(
{
    vs: `#version 300 es
    precision highp float;

    uniform mat4 modelMatrix;
    uniform float aspect;

    in vec3 position;
    in vec3 normal;

    out vec3 fragColor;

    void main () 
    {
      vec4 newPosition = modelMatrix * vec4(position, 1);

      gl_Position = vec4(newPosition.x / aspect, newPosition.yzw);
      mat4 normalMatrix = transpose(inverse(modelMatrix));

      vec3 newNormal = (normalMatrix*vec4(normal, 0)).xyz;
      fragColor = normalize(newNormal);
    }`,

    fs: `#version 300 es
    precision highp float;

    in vec3 fragColor;

    out vec4 outColor;

    void main () 
    {
      outColor = vec4(abs(fragColor), 1.0f );
    }`
  }
)}

function _24(md){return(
md`### TWGL Shader Compiler WebGL program`
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


function _27(md){return(
md`### Matrix Operator`
)}

function _modelScale(Inputs){return(
Inputs.range([.1, 5], {
  value: 1,
  label: "Scale",
  step: .1
})
)}

function _modelTranslation(columns,Inputs){return(
columns({
  X_translation: Inputs.range([-5, 5], {
    value: 0,
    label: "X Translation",
    step: .1
  }),
  Y_translation: Inputs.range([-5, 5], {
    value: 0,
    label: "Y Translation",
    step: .1
  }),
  Z_translation: Inputs.range([-5, 5], {
    value: 0,
    label: "Z Translation",
    step: .1
  })
  
})
)}

function _modelRotation(columns,Inputs){return(
columns({
  X_rotate: Inputs.range([-180, 180], {
    value: 0,
    label: "X Rotation",
    step: 1
  }),
  Y_rotate: Inputs.range([-180, 180], {
    value: 0,
    label: "Y Rotation",
    step: 1
  }),
  Z_rotate: Inputs.range([-180, 180], {
    value: 0,
    label: "Z Rotation",
    step: 1
  })
  
})
)}

function _modelMatrixCalculated(m4,extents,modelScale,modelTranslation,deg2Rad,modelRotation)
{
  let mul = m4.multiply;
  
  const scaleConst = 2.0 / extents.dia;
 
  
  let scalingMatrix =  m4.scaling([modelScale * scaleConst, modelScale * scaleConst, modelScale * scaleConst]);

  let centerTranslation = extents.center.map(a => -a);

  let translationMatrix = 
    m4.translation
    ([
      modelTranslation.X_translation + centerTranslation[0],
      modelTranslation.Y_translation + centerTranslation[1], 
      modelTranslation.Z_translation + centerTranslation[2]
    ]);

  let rotationMatrixX = m4.rotationX(deg2Rad(modelRotation.X_rotate));
  let rotationMatrixY = m4.rotationY(deg2Rad(modelRotation.Y_rotate));
  let rotationMatrixZ = m4.rotationZ(deg2Rad(modelRotation.Z_rotate));
  let temp = m4.identity();

  temp = m4.multiply(scalingMatrix, m4.multiply(rotationMatrixX, m4.multiply(rotationMatrixY, m4.multiply(rotationMatrixZ, translationMatrix))));

 
  
  return temp;
}


function _32(md){return(
md`### Uniform Object `
)}

function _uniforms(gl,modelMatrixCalculated){return(
{
    aspect : gl.canvas.width / gl.canvas.height,
    modelMatrix: modelMatrixCalculated
  }
)}

function _34(md){return(
md`### Final rendering `
)}

function _color(colorInput){return(
colorInput()
)}

function _36(gl,hex2rgb,color,programInfo,bufferInfoArray,twgl,uniforms)
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


function _37(bufferInfoArray){return(
bufferInfoArray
)}

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
  main.variable(observer("deg2Rad")).define("deg2Rad", _deg2Rad);
  const child4 = runtime.module(define4);
  main.import("Checkbox", child4);
  const child5 = runtime.module(define5);
  main.import("columns", child5);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer("m4")).define("m4", ["twgl"], _m4);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("gl")).define("gl", ["DOM","width","hex2rgb","color"], _gl);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("generateVertexAttributesArray")).define("generateVertexAttributesArray", _generateVertexAttributesArray);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("modelURL")).define("modelURL", ["FileAttachment"], _modelURL);
  main.variable(observer("modelObj")).define("modelObj", ["loadModelFromURL","modelURL"], _modelObj);
  main.variable(observer("extents")).define("extents", ["computeModelExtent","modelObj"], _extents);
  main.variable(observer("vertexAttributes")).define("vertexAttributes", ["generateVertexAttributesArray","modelObj"], _vertexAttributes);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("bufferInfoArray")).define("bufferInfoArray", ["vertexAttributes","twgl","gl"], _bufferInfoArray);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("shaders")).define("shaders", _shaders);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("errorBlock")).define("errorBlock", ["html","width"], _errorBlock);
  main.variable(observer("programInfo")).define("programInfo", ["errorBlock","twgl","gl","shaders"], _programInfo);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("viewof modelScale")).define("viewof modelScale", ["Inputs"], _modelScale);
  main.variable(observer("modelScale")).define("modelScale", ["Generators", "viewof modelScale"], (G, _) => G.input(_));
  main.variable(observer("viewof modelTranslation")).define("viewof modelTranslation", ["columns","Inputs"], _modelTranslation);
  main.variable(observer("modelTranslation")).define("modelTranslation", ["Generators", "viewof modelTranslation"], (G, _) => G.input(_));
  main.variable(observer("viewof modelRotation")).define("viewof modelRotation", ["columns","Inputs"], _modelRotation);
  main.variable(observer("modelRotation")).define("modelRotation", ["Generators", "viewof modelRotation"], (G, _) => G.input(_));
  main.variable(observer("modelMatrixCalculated")).define("modelMatrixCalculated", ["m4","extents","modelScale","modelTranslation","deg2Rad","modelRotation"], _modelMatrixCalculated);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("uniforms")).define("uniforms", ["gl","modelMatrixCalculated"], _uniforms);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("viewof color")).define("viewof color", ["colorInput"], _color);
  main.variable(observer("color")).define("color", ["Generators", "viewof color"], (G, _) => G.input(_));
  main.variable(observer()).define(["gl","hex2rgb","color","programInfo","bufferInfoArray","twgl","uniforms"], _36);
  main.variable(observer()).define(["bufferInfoArray"], _37);
  return main;
}

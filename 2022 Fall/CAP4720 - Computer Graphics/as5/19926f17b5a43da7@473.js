import define1 from "./5e4f241650075641@535.js";

function _1(md){return(
md`# Assignment 5: Camera`
)}

function _2(md){return(
md`### Camera Matrix Transform`
)}

function _VerticalFOV(InputSystem){return(
InputSystem.singleValueSliderSystem([0, 180], 45, "Vertical Field Of View", 5)
)}

function _plane(InputSystem){return(
InputSystem.doubleValueSliderSystem([.1, 3], [.1, 2.5], ["Near", "Far"], .1)
)}

function _CameraAngles(InputSystem)
{
  let offset = 1
  return InputSystem.doubleValueSliderSystem([-90 + offset, 90 - offset], [0,0], ["Camera Angle X", "Camera Angle Y"], 1);
}


function _6(md){return(
md`### Model Matrix Transform`
)}

function _modelScale(InputSystem){return(
InputSystem.NonUniformScaleSystem([.1, 5], [1,1,1], ["Scale X", "Scale Y", "Scale Z"], .1)
)}

function _modelRotation(InputSystem){return(
InputSystem.TranslationSystem([-180, 180], [0, 0, 0], ["Rotate X", "Rotate Y", "Rotate Z"], 1)
)}

function _modelTranslation(InputSystem){return(
InputSystem.TranslationSystem([-20, 20], [0,0,0], ["Translate X", "Translate Y", "Translate Z"], 1)
)}

function _colorInputSystem(InputSystem){return(
InputSystem.ColorPickerSystem("#000000", "Background Color")
)}

function _11(md){return(
md`### Rendering Space`
)}

function _12(gl,hex2rgb,colorInputSystem,programInfo,twgl,uniforms,bufferInfoArray)
{
  gl.viewport(0, 0,  gl.canvas.width, gl.canvas.height);

  gl.clearColor(...hex2rgb(colorInputSystem), 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);
  twgl.setUniforms(programInfo, uniforms);
  bufferInfoArray.forEach((bufferInfo) => {
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  });

  return gl.canvas;
}


function _13(md){return(
md`### Model Data`
)}

function _ObjectInfo(InputSystem){return(
InputSystem.ModelSelector(InputSystem.ModelInputArray)
)}

function _vertexAttributes(GLO,ObjectInfo){return(
GLO.generateVertexAttributesArray(ObjectInfo)
)}

function _extents(GLO,ObjectInfo){return(
GLO.computeModelExtent(ObjectInfo)
)}

function _bufferInfoArray(GLO,twgl,gl,vertexAttributes){return(
GLO.makeBufferInfo(twgl, gl, vertexAttributes)
)}

function _18(md){return(
md`### Shader`
)}

function _shaders(){return(
{
  vs: `#version 300 es
    precision mediump float;
    in vec3 position;
    in vec3 normal;
    uniform float aspect;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    out vec3 fragNormal;
    void main () {
      vec4 temp = viewMatrix * modelMatrix * vec4(position,1);
      gl_Position = projectionMatrix * temp;
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);

    }`,

  fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec3 fragNormal;

    void main () {
      vec3 N = normalize(fragNormal);

      outColor = vec4(abs((N + 1.0)/2.0), 1);
    }`
}
)}

function _20(GLO){return(
GLO.errorBlock
)}

function _programInfo(GLO,twgl,shaders,gl){return(
GLO.shaderCompiler(twgl, GLO.errorBlock, shaders, gl)
)}

function _22(md){return(
md`### Uniform Data`
)}

function _aspectValue(gl){return(
gl.canvas.width/ gl.canvas.height
)}

function _view(M4D,extents){return(
M4D.getViewMatrix(0, 0, extents)
)}

function _proj(M4D,VerticalFOV,plane,extents,aspectValue){return(
M4D.getProjectionMatrix(VerticalFOV, plane.X, plane.Y, extents.dia, aspectValue)
)}

function _uniforms(gl,M4D,modelScale,modelRotation,modelTranslation,extents,CameraAngles,VerticalFOV,plane,aspectValue){return(
{
    aspect : gl.canvas.width / gl.canvas.height,
    modelMatrix: M4D.makeModelMatrix
    (
      [modelScale.X, modelScale.Y, modelScale.Z],
      [modelRotation.X, modelRotation.Y, modelRotation.Z],
      [modelTranslation.X, modelTranslation.Y, modelTranslation.Z],
      extents
    ),
    viewMatrix: M4D.getViewMatrix(CameraAngles.X, CameraAngles.Y, extents),
    projectionMatrix: M4D.getProjectionMatrix(VerticalFOV, plane.X, plane.Y, extents.dia, aspectValue)
  }
)}

function _27(md){return(
md`### Library, Functions, Library Import
- Wish To Reduce Confusing Unorganized Bloat Code.
- "@davidraschidlabiakhtrue/david_r_labiakh_unlisted_observable_library"
- **Camera Matrices are computed in Backend**.`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof VerticalFOV")).define("viewof VerticalFOV", ["InputSystem"], _VerticalFOV);
  main.variable(observer("VerticalFOV")).define("VerticalFOV", ["Generators", "viewof VerticalFOV"], (G, _) => G.input(_));
  main.variable(observer("viewof plane")).define("viewof plane", ["InputSystem"], _plane);
  main.variable(observer("plane")).define("plane", ["Generators", "viewof plane"], (G, _) => G.input(_));
  main.variable(observer("viewof CameraAngles")).define("viewof CameraAngles", ["InputSystem"], _CameraAngles);
  main.variable(observer("CameraAngles")).define("CameraAngles", ["Generators", "viewof CameraAngles"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("viewof modelScale")).define("viewof modelScale", ["InputSystem"], _modelScale);
  main.variable(observer("modelScale")).define("modelScale", ["Generators", "viewof modelScale"], (G, _) => G.input(_));
  main.variable(observer("viewof modelRotation")).define("viewof modelRotation", ["InputSystem"], _modelRotation);
  main.variable(observer("modelRotation")).define("modelRotation", ["Generators", "viewof modelRotation"], (G, _) => G.input(_));
  main.variable(observer("viewof modelTranslation")).define("viewof modelTranslation", ["InputSystem"], _modelTranslation);
  main.variable(observer("modelTranslation")).define("modelTranslation", ["Generators", "viewof modelTranslation"], (G, _) => G.input(_));
  main.variable(observer("viewof colorInputSystem")).define("viewof colorInputSystem", ["InputSystem"], _colorInputSystem);
  main.variable(observer("colorInputSystem")).define("colorInputSystem", ["Generators", "viewof colorInputSystem"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["gl","hex2rgb","colorInputSystem","programInfo","twgl","uniforms","bufferInfoArray"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("viewof ObjectInfo")).define("viewof ObjectInfo", ["InputSystem"], _ObjectInfo);
  main.variable(observer("ObjectInfo")).define("ObjectInfo", ["Generators", "viewof ObjectInfo"], (G, _) => G.input(_));
  main.variable(observer("vertexAttributes")).define("vertexAttributes", ["GLO","ObjectInfo"], _vertexAttributes);
  main.variable(observer("extents")).define("extents", ["GLO","ObjectInfo"], _extents);
  main.variable(observer("bufferInfoArray")).define("bufferInfoArray", ["GLO","twgl","gl","vertexAttributes"], _bufferInfoArray);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("shaders")).define("shaders", _shaders);
  main.variable(observer()).define(["GLO"], _20);
  main.variable(observer("programInfo")).define("programInfo", ["GLO","twgl","shaders","gl"], _programInfo);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("aspectValue")).define("aspectValue", ["gl"], _aspectValue);
  main.variable(observer("view")).define("view", ["M4D","extents"], _view);
  main.variable(observer("proj")).define("proj", ["M4D","VerticalFOV","plane","extents","aspectValue"], _proj);
  main.variable(observer("uniforms")).define("uniforms", ["gl","M4D","modelScale","modelRotation","modelTranslation","extents","CameraAngles","VerticalFOV","plane","aspectValue"], _uniforms);
  main.variable(observer()).define(["md"], _27);
  const child1 = runtime.module(define1);
  main.import("twgl", child1);
  main.import("gl", child1);
  main.import("M4D", child1);
  main.import("V3D", child1);
  main.import("GLO", child1);
  main.import("InputSystem", child1);
  main.import("hex2rgb", child1);
  return main;
}

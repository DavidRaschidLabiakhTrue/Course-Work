import define1 from "./9d0fa713ea129540@422.js";
import define2 from "./1b675294aba5f9ea@583.js";
import define3 from "./a2e58f97fd5e8d7c@736.js";
import define4 from "./10023e7d8ddc32bc@90.js";
import define5 from "./a7481270343815fd@706.js";
import define6 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# David_R_Labiakh_Unlisted_Observable_Library

## Contains Code for use with CAP-4720 Computer Graphics for David R. Labiakh-True

`
)}

function _2(md){return(
md`### Goal - Reduce Crappy Bloated Code Base and Localize Imports`
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

function _gl(DOM,width)
{
  const myCanvas = DOM.canvas(width, 400);

  const gl = myCanvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0,0,0,1);
  gl.enable(gl.SCISSOR_TEST);
  gl.lineWidth(2);
  return gl;
}


function _errorBlock(html,width){return(
html`<textarea style="height : 20px; width : ${width}px; font-size: 0.8em; display: block"></textarea>`
)}

function _shaderCompiler(){return(
(twgl, errorBlockData, shaders, gl) =>
{
    errorBlockData.style.height = "20px";
  errorBlockData.innerHTML = "Program Shader compilation successful";
  return twgl.createProgramInfo(gl, [shaders.vs, shaders.fs], (message) => {
    errorBlockData.style.height = "400px";
    errorBlockData.innerHTML = "Program Shader compilation error\n" + message;
  });
}
)}

function _generateVertexAttributesArray(){return(
(modelObjData) =>
{
  // maps one system to another to fit our desired data format.
  return modelObjData.map((d) => ({position: { numComponents: 3, data: d.sc.positions }, normal: { numComponents: 3, data: d.sc.normals }}));
}
)}

function _makeBufferInfo(){return(
(twgl, gl, vertexAttributes) =>
{
  return vertexAttributes.map((d) =>
  twgl.createBufferInfoFromArrays(gl, d)
); 
}
)}

function _GLO(loadModelFromURL,computeModelExtent,makeBufferInfo,errorBlock,shaderCompiler,generateVertexAttributesArray){return(
Object // export API
(
  {
    "loadModelFromURL":loadModelFromURL,
    "computeModelExtent":computeModelExtent,
    "makeBufferInfo":makeBufferInfo,
    "errorBlock":errorBlock,
    "shaderCompiler":shaderCompiler,
    "generateVertexAttributesArray":generateVertexAttributesArray
  }
)
)}

function _15(md){return(
md`### Input System`
)}

function _dragonURL(FileAttachment){return(
FileAttachment("Mesh008.obj").url()
)}

function _dragonObj(loadModelFromURL,dragonURL){return(
loadModelFromURL(dragonURL, "obj")
)}

function _nier2b(FileAttachment){return(
FileAttachment("Nier2b.obj").url()
)}

function _nier_2b(loadModelFromURL,nier2b){return(
loadModelFromURL(nier2b, "obj")
)}

function _ModelInputArray(boyObj,raymanObj,teapotObj,windmillObj,houseObj,dragonObj,nier_2b){return(
[["boy", boyObj],
    ["rayman", raymanObj],
    ["teapot", teapotObj],
    ["windmill", windmillObj],
    ["house", houseObj],
    ["dragon", dragonObj],
    ["2b", nier_2b]]
)}

function _ModelSelector(Inputs,houseObj){return(
(ArrayOfObjects) =>
{
  return Inputs.select(
  new Map(ArrayOfObjects),
  { value: houseObj, label: "Choose Model" }
);
}
)}

function _ColorPickerSystem(colorInputLoader){return(
(startValueStr,titleString) =>
{
  return colorInputLoader({
  value: startValueStr,
  title: titleString
})
}
)}

function _Col(colorInputLoader){return(
colorInputLoader()
)}

function _singleValueSliderSystem(Inputs){return(
(rangeOfSystem, startingValue, labelOfRange, stepValue) =>
{
  return Inputs.range(rangeOfSystem, {
  value: startingValue,
  label: labelOfRange,
  step: stepValue
}) 
}
)}

function _doubleValueSliderSystem(columns,Inputs){return(
(rangeOfSystem, startingValue, labels, stepValue) =>
{
   return   columns({
  X: Inputs.range(rangeOfSystem, {
    value: startingValue[0],
    label: labels[0],
    step: stepValue
  }),
  Y: Inputs.range(rangeOfSystem, {
    value: startingValue[1],
    label: labels[1],
    step: stepValue
  })
})
}
)}

function _tripleValueSliderSystem(columns,Inputs){return(
(rangeOfSystem, startingValue, labels, stepValue) =>
{
   return   columns({
  X: Inputs.range(rangeOfSystem, {
    value: startingValue[0],
    label: labels[0],
    step: stepValue
  }),
  Y: Inputs.range(rangeOfSystem, {
    value: startingValue[1],
    label: labels[1],
    step: stepValue
  }),
  Z: Inputs.range(rangeOfSystem, {
    value: startingValue[2],
    label: labels[2],
    step: stepValue
  })
  
})
}
)}

function _UniformScaleSystem(singleValueSliderSystem){return(
(rangeOfSystem, startingValue, labelOfRange, stepValue) =>
{
 return singleValueSliderSystem(rangeOfSystem, startingValue, labelOfRange, stepValue);
}
)}

function _NonUniformScaleSystem(tripleValueSliderSystem){return(
(rangeOfSystem, startingValue, labels, stepValue) =>
{
 return tripleValueSliderSystem(rangeOfSystem, startingValue, labels, stepValue);
}
)}

function _TranslationSystem(tripleValueSliderSystem){return(
(rangeOfSystem, startingValue, labels, stepValue) =>
{
 return tripleValueSliderSystem(rangeOfSystem, startingValue, labels, stepValue);
}
)}

function _RotationSystem(tripleValueSliderSystem){return(
(rangeOfSystem, startingValue, labels, stepValue) =>
{
 return tripleValueSliderSystem(rangeOfSystem, startingValue, labels, stepValue);
}
)}

function _InputSystem(singleValueSliderSystem,doubleValueSliderSystem,tripleValueSliderSystem,RotationSystem,TranslationSystem,NonUniformScaleSystem,UniformScaleSystem,ModelInputArray,ModelSelector,ColorPickerSystem,Checkbox){return(
Object // export API
(
  {
    "singleValueSliderSystem":singleValueSliderSystem,
    "doubleValueSliderSystem":doubleValueSliderSystem,
    "tripleValueSliderSystem":tripleValueSliderSystem,
    "RotationSystem":RotationSystem,
    "TranslationSystem":TranslationSystem,
    "NonUniformScaleSystem":NonUniformScaleSystem,
    "UniformScaleSystem":UniformScaleSystem,
    "ModelInputArray":ModelInputArray,
    "ModelSelector":ModelSelector,
    "ColorPickerSystem":ColorPickerSystem,
    "Checkbox":Checkbox
  }
)
)}

function _34(md){return(
md`### Matrix Functions`
)}

function _m4(twgl){return(
twgl.m4
)}

function _getRotationMatrices(m4,deg2Rad){return(
(degreesArray) =>
{
  return [m4.rotationX(deg2Rad(degreesArray[0])), m4.rotationY(deg2Rad(degreesArray[1])), m4.rotationZ(deg2Rad(degreesArray[2]))];
}
)}

function _getTranslationMatrix(m4){return(
(translationArray, extentCenter) =>
{
  let centerTranslation = extentCenter.map(a => -a); // flip polarity
  return m4.translation
    ([
      translationArray[0],
      translationArray[1], 
      translationArray[2]
    ]);
}
)}

function _getScaleMatrix(m4){return(
(scaleArray, extentDiameter) =>
{
  const scaleConst = 1;
  return m4.scaling([scaleArray[0]*scaleConst, scaleArray[1]*scaleConst, scaleArray[2]*scaleConst]);
}
)}

function _makeModelMatrix(getScaleMatrix,getRotationMatrices,getTranslationMatrix,m4){return(
(scaleArray, degreesArray, translationArray, extent, correction) =>
{
  let scaleMatrix = getScaleMatrix(scaleArray, extent.dia);
  let rotationMatrices = getRotationMatrices(degreesArray);
  let translationMatrix = getTranslationMatrix(translationArray, extent.center);

  let rotx = rotationMatrices[0];
  let roty = rotationMatrices[1];
  let rotz = rotationMatrices[2];
  let temp = m4.identity();

  temp = m4.multiply(temp, scaleMatrix);
  temp = m4.multiply(temp, rotz);
  temp = m4.multiply(temp, roty);
  temp = m4.multiply(temp, rotx);
  temp = m4.multiply(temp, translationMatrix);
  
  return temp;
}
)}

function _getViewMatrix(deg2Rad,m4){return(
(x_angleDeg, y_angleDeg, extents) => 
{
  let xRad = deg2Rad(x_angleDeg);
  let yRad = deg2Rad(y_angleDeg);
  const eye = m4.transformPoint(m4.multiply(m4.translation(extents.center), m4.multiply(m4.rotationY(yRad), m4.rotationX(xRad))), [0,0, extents.dia]);
  const cameraMatrix = m4.lookAt(eye, extents.center, [0,1,0]);
  return m4.inverse(cameraMatrix);
}
)}

function _getProjectionMatrix(deg2Rad,m4){return(
(fov, near, far, dia, aspectRatio) => 
{
  let fovRad = deg2Rad(fov);
  
  return m4.perspective(fovRad, aspectRatio,near * dia, far * dia);
}
)}

function _M4D(m4,makeModelMatrix,getScaleMatrix,getTranslationMatrix,getRotationMatrices,getViewMatrix,getProjectionMatrix){return(
Object // Export API 
(
  {
    "m4":m4,
    "makeModelMatrix":makeModelMatrix,
    "getScaleMatrix":getScaleMatrix,
    "getTranslationMatrix":getTranslationMatrix,
    "getRotationMatrices":getRotationMatrices , // this returns an array of matrices so programmer can choose order
    "getViewMatrix":getViewMatrix,
    "getProjectionMatrix":getProjectionMatrix
  }
)
)}

function _43(md){return(
md`### Vector Functions`
)}

function _v3(twgl){return(
twgl.v3
)}

function _V3D(v3){return(
Object
(
  {
    "v3":v3,
    "up":[0, 1, 0],
  }
)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Mesh008.obj", {url: new URL("./files/52252884443a5d2de9a34e8190cff62a03a83f0dc90771a826f8f68db255343ac005a80b872f46ed17748ddb3cb681e0b238d04d50d962abb6dc866d5ea98c16.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["Nier2b.obj", {url: new URL("./files/b9feefe5255ef61d8d70abfc698acf4f9487825f46cfcda263d83cb1f5454d631039b6917fe69a802abd3ebdfa525111b9a6520198533ffbc25438a7d3f59e9d.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  const child1 = runtime.module(define1);
  main.import("loadModelFromURL", child1);
  main.import("computeModelExtent", child1);
  const child2 = runtime.module(define2);
  main.import("hex2rgb", child2);
  main.variable(observer("deg2Rad")).define("deg2Rad", _deg2Rad);
  const child3 = runtime.module(define3);
  main.import("Checkbox", child3);
  const child4 = runtime.module(define4);
  main.import("columns", child4);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer("gl")).define("gl", ["DOM","width"], _gl);
  main.variable(observer("errorBlock")).define("errorBlock", ["html","width"], _errorBlock);
  main.variable(observer("shaderCompiler")).define("shaderCompiler", _shaderCompiler);
  main.variable(observer("generateVertexAttributesArray")).define("generateVertexAttributesArray", _generateVertexAttributesArray);
  main.variable(observer("makeBufferInfo")).define("makeBufferInfo", _makeBufferInfo);
  main.variable(observer("GLO")).define("GLO", ["loadModelFromURL","computeModelExtent","makeBufferInfo","errorBlock","shaderCompiler","generateVertexAttributesArray"], _GLO);
  main.variable(observer()).define(["md"], _15);
  const child5 = runtime.module(define5);
  main.import("raymanObj", child5);
  main.import("teapotObj", child5);
  main.import("boyObj", child5);
  main.import("windmillObj", child5);
  main.import("houseObj", child5);
  main.variable(observer("dragonURL")).define("dragonURL", ["FileAttachment"], _dragonURL);
  main.variable(observer("dragonObj")).define("dragonObj", ["loadModelFromURL","dragonURL"], _dragonObj);
  main.variable(observer("nier2b")).define("nier2b", ["FileAttachment"], _nier2b);
  main.variable(observer("nier_2b")).define("nier_2b", ["loadModelFromURL","nier2b"], _nier_2b);
  main.variable(observer("ModelInputArray")).define("ModelInputArray", ["boyObj","raymanObj","teapotObj","windmillObj","houseObj","dragonObj","nier_2b"], _ModelInputArray);
  main.variable(observer("ModelSelector")).define("ModelSelector", ["Inputs","houseObj"], _ModelSelector);
  const child6 = runtime.module(define6);
  main.import("color", "colorInputLoader", child6);
  main.variable(observer("ColorPickerSystem")).define("ColorPickerSystem", ["colorInputLoader"], _ColorPickerSystem);
  main.variable(observer("viewof Col")).define("viewof Col", ["colorInputLoader"], _Col);
  main.variable(observer("Col")).define("Col", ["Generators", "viewof Col"], (G, _) => G.input(_));
  main.variable(observer("singleValueSliderSystem")).define("singleValueSliderSystem", ["Inputs"], _singleValueSliderSystem);
  main.variable(observer("doubleValueSliderSystem")).define("doubleValueSliderSystem", ["columns","Inputs"], _doubleValueSliderSystem);
  main.variable(observer("tripleValueSliderSystem")).define("tripleValueSliderSystem", ["columns","Inputs"], _tripleValueSliderSystem);
  main.variable(observer("UniformScaleSystem")).define("UniformScaleSystem", ["singleValueSliderSystem"], _UniformScaleSystem);
  main.variable(observer("NonUniformScaleSystem")).define("NonUniformScaleSystem", ["tripleValueSliderSystem"], _NonUniformScaleSystem);
  main.variable(observer("TranslationSystem")).define("TranslationSystem", ["tripleValueSliderSystem"], _TranslationSystem);
  main.variable(observer("RotationSystem")).define("RotationSystem", ["tripleValueSliderSystem"], _RotationSystem);
  main.variable(observer("InputSystem")).define("InputSystem", ["singleValueSliderSystem","doubleValueSliderSystem","tripleValueSliderSystem","RotationSystem","TranslationSystem","NonUniformScaleSystem","UniformScaleSystem","ModelInputArray","ModelSelector","ColorPickerSystem","Checkbox"], _InputSystem);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("m4")).define("m4", ["twgl"], _m4);
  main.variable(observer("getRotationMatrices")).define("getRotationMatrices", ["m4","deg2Rad"], _getRotationMatrices);
  main.variable(observer("getTranslationMatrix")).define("getTranslationMatrix", ["m4"], _getTranslationMatrix);
  main.variable(observer("getScaleMatrix")).define("getScaleMatrix", ["m4"], _getScaleMatrix);
  main.variable(observer("makeModelMatrix")).define("makeModelMatrix", ["getScaleMatrix","getRotationMatrices","getTranslationMatrix","m4"], _makeModelMatrix);
  main.variable(observer("getViewMatrix")).define("getViewMatrix", ["deg2Rad","m4"], _getViewMatrix);
  main.variable(observer("getProjectionMatrix")).define("getProjectionMatrix", ["deg2Rad","m4"], _getProjectionMatrix);
  main.variable(observer("M4D")).define("M4D", ["m4","makeModelMatrix","getScaleMatrix","getTranslationMatrix","getRotationMatrices","getViewMatrix","getProjectionMatrix"], _M4D);
  main.variable(observer()).define(["md"], _43);
  main.variable(observer("v3")).define("v3", ["twgl"], _v3);
  main.variable(observer("V3D")).define("V3D", ["v3"], _V3D);
  return main;
}

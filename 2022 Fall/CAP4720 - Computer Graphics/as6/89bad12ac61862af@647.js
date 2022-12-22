import define1 from "./9d0fa713ea129540@422.js";
import define2 from "./1b675294aba5f9ea@583.js";
import define3 from "./a2e58f97fd5e8d7c@736.js";
import define4 from "./10023e7d8ddc32bc@90.js";
import define5 from "./a7481270343815fd@706.js";
import define6 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Assignment 6: Mutli-viewport rendering 
`
)}

function _VerticalFOV(InputSystem){return(
InputSystem.singleValueSliderSystem([0, 180], 45, "Vertical Field Of View", 5)
)}

function _aspectSlider(InputSystem){return(
InputSystem.doubleValueSliderSystem([256, 1920], [1080, 400], ["Aspect Width", "Aspect Height"], 1)
)}

function _plane(InputSystem){return(
InputSystem.doubleValueSliderSystem([.1, 3], [.1, 2.5], ["Near", "Far"], .1)
)}

function _CameraAngles(InputSystem)
{
  let offset = 1
  return InputSystem.doubleValueSliderSystem([-90 + offset, 90 - offset], [0,0], ["Camera Angle X", "Camera Angle Y"], 1);
}


function _model1Scale(InputSystem){return(
InputSystem.NonUniformScaleSystem([.1, 5], [1,1,1], ["Scale Model 1 X", "Scale Model 1 Y", "Scale Model 1 Z"], .1)
)}

function _model2Scale(InputSystem){return(
InputSystem.NonUniformScaleSystem([.1, 5], [1,1,1], ["Scale Model 2 X", "Scale Model 2 Y", "Scale Model 2 Z"], .1)
)}

function _model1Rotation(InputSystem){return(
InputSystem.TranslationSystem([-180, 180], [0, 0, 0], ["Rotate Model 1 X", "Rotate Model 1 Y", "Rotate Model 1 Z"], 1)
)}

function _model2Rotation(InputSystem){return(
InputSystem.TranslationSystem([-180, 180], [0, 0, 0], ["Rotate Model 2 X", "Rotate Model 2 Y", "Rotate Model 2 Z"], 1)
)}

function _model1Translation(InputSystem){return(
InputSystem.TranslationSystem([-10, 10], [0,0,0], ["Translate Model 1 X", "Translate Model 1 Y", "Translate Model 1 Z"], 1)
)}

function _model2Translation(InputSystem){return(
InputSystem.TranslationSystem([-10, 10], [0,0,0], ["Translate Model 2 X", "Translate Model 2 Y", "Translate Model 2 Z"], 1)
)}

function _12(md){return(
md`### Rendering`
)}

function _13(gl,RenderWidth,RenderHeight,hex2rgb,colorSystem,M4D,transformDataArray,modelDimensionData,modelColorFormulas,CameraAngles,VerticalFOV,plane,aspectRatio,programInfo,twgl,BufferArrayData)
{
    for (let i = 0; i < 2; i++) 
    {
      gl.viewport(i * RenderWidth, 0, RenderWidth, RenderHeight );
      gl.scissor(i * RenderWidth, 0, RenderWidth, RenderHeight);
      gl.clearColor(...hex2rgb(colorSystem[i]), 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const uniforms = {
        modelMatrix: M4D.makeModelMatrix(transformDataArray[i][0], transformDataArray[i][1], transformDataArray[i][2], modelDimensionData[i]),
        colorModelAbs: (modelColorFormulas[i] === "abs(normal)") ? 1 : 0,
        viewMatrix: M4D.getViewMatrix(CameraAngles.X, CameraAngles.Y, modelDimensionData[i]),
        projectionMatrix: M4D.getProjectionMatrix(VerticalFOV, plane.X, plane.Y, modelDimensionData[i].dia, aspectRatio)
      };

      gl.useProgram(programInfo.program);
      twgl.setUniforms(programInfo, uniforms);
        
      BufferArrayData[i].forEach((bufferInfo) => 
      {
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
      });
    }
  return gl.canvas;
}


function _colorSystem(ColorPicker2System){return(
ColorPicker2System(["#000000", "#000000"], ["Left Background", "Right Background"])
)}

function _ModelSelections(InputSystem,ModelInputArray){return(
InputSystem.Model2Selector(ModelInputArray)
)}

function _modelColorFormulas(InputSystem){return(
InputSystem.Choice2System(["abs(normal)", "(normal + 1) / 2"], ["Left Color System", "Right Color System"])
)}

function _17(md){return(
md`### Data Prep`
)}

function _glLoader(DOM){return(
(aspectSystem) => { 
  const myCanvas = DOM.canvas(aspectSystem.X, aspectSystem.Y);

  const gl = myCanvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0,0,0,1);
  gl.enable(gl.SCISSOR_TEST);
  gl.lineWidth(2);
  return gl;
}
)}

function _gl(glLoader,aspectSlider){return(
glLoader(aspectSlider)
)}

function _transformDataArray(toArray3,model1Scale,model1Rotation,model1Translation,model2Scale,model2Rotation,model2Translation){return(
[[toArray3(model1Scale), toArray3(model1Rotation), toArray3(model1Translation)], 
                     [toArray3(model2Scale), toArray3(model2Rotation), toArray3(model2Translation)]]
)}

function _RenderWidth(gl){return(
gl.canvas.width / 2.0
)}

function _RenderHeight(gl){return(
gl.canvas.height
)}

function _aspectRatio(RenderWidth,RenderHeight){return(
RenderWidth / RenderHeight
)}

function _VertexAttributeArrayData(GLO,ModelSelections){return(
GLO.FormatAndMapMultipleObjectAttributes(ModelSelections)
)}

function _BufferArrayData(GLO,VertexAttributeArrayData){return(
GLO.FormatAndMapMultipleDataBuffers(VertexAttributeArrayData)
)}

function _modelDimensionData(GLO,ModelSelections){return(
GLO.FormatAndMapMultipleModelDimensionalExtents(ModelSelections)
)}

function _lookAts(M4D,modelDimensionData){return(
M4D.getLookAts(modelDimensionData)
)}

function _29(md){return(
md`### Shaders`
)}

function _ShaderCompilerError(errorBlockMaker){return(
errorBlockMaker()
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

    uniform int colorModelAbs;

    void main () 
    {
      vec3 N = normalize(fragNormal);
      vec3 formattedColor = (colorModelAbs == 1) ? abs(N) : (N + 1.0) / 2.0;
      outColor = vec4(formattedColor, 1);
    }`
}
)}

function _programInfo(GLO,twgl,ShaderCompilerError,shaders,gl){return(
GLO.shaderCompiler(twgl, ShaderCompilerError, shaders, gl)
)}

function _33(md){return(
md`## Computing Render Data`
)}

function _34(md){return(
md`# API
This API is an altered copied version of 
@davidraschidlabiakhtrue/david_r_labiakh_unlisted_observable_library 

The code contained within the above library was created by David R.L or approved resources for Dr. Benamira's CAP 4720.

This library will be updated to reflect changes and additions made **here** and for future assignments in hopes of having a complete API made for final project.`
)}

function _35(md){return(
md`### Goal - Reduce Crappy Bloated Code Base and Localize Imports`
)}

function _36(md){return(
md`### Imports`
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

function _WebGl2RenderingContextCreator(DOM,hex2rgb){return(
(widthValue, HeightValue, colorInputSystem) =>
{
  const myCanvas = DOM.canvas(widthValue, HeightValue);
  const gl = myCanvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(...hex2rgb(colorInputSystem), 1);
  gl.enable(gl.SCISSOR_TEST);
  gl.lineWidth(2);
  return gl;
}
)}

function _errorBlockMaker(html,width){return(
() => {
  return html`<textarea style="height : 20px; width : ${width}px; font-size: 0.8em; display: block"></textarea>`;
}
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

function _FormatAndMapMultipleObjectAttributes(){return(
(objs) =>
{
  return objs.map((object) => object.map((d) => 
      ({
        position: { numComponents: 3, data: d.sc.positions }, 
        normal: { numComponents: 3, data: d.sc.normals }})));
}
)}

function _FormatAndMapMultipleDataBuffers(twgl,gl){return(
(attributes) =>
{
  return attributes.map((attributeData) => attributeData.map((attributeData) => twgl.createBufferInfoFromArrays(gl, attributeData)));
}
)}

function _FormatAndMapMultipleModelDimensionalExtents(computeModelExtent){return(
(objs) =>
{
  return objs.map(computeModelExtent);
}
)}

function _GLO(loadModelFromURL,computeModelExtent,makeBufferInfo,shaderCompiler,generateVertexAttributesArray,FormatAndMapMultipleObjectAttributes,FormatAndMapMultipleDataBuffers,FormatAndMapMultipleModelDimensionalExtents){return(
Object // export API
(
  {
    "loadModelFromURL":loadModelFromURL,
    "computeModelExtent":computeModelExtent,
    "makeBufferInfo":makeBufferInfo,
    "shaderCompiler":shaderCompiler,
    "generateVertexAttributesArray":generateVertexAttributesArray,
    "FormatAndMapMultipleObjectAttributes":FormatAndMapMultipleObjectAttributes,
    "FormatAndMapMultipleDataBuffers":FormatAndMapMultipleDataBuffers,
    "FormatAndMapMultipleModelDimensionalExtents":FormatAndMapMultipleModelDimensionalExtents
  }
)
)}

function _52(md){return(
md`### Input System`
)}

function _ModelInputArray(boyObj,raymanObj,teapotObj,windmillObj,houseObj){return(
[["boy", boyObj],
    ["rayman", raymanObj],
    ["teapot", teapotObj],
    ["windmill", windmillObj],
    ["house", houseObj]]
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

function _ModelSelectorMarked(Inputs,houseObj){return(
(ArrayOfObjects, labelOfSelect) =>
{
  return Inputs.select(
  new Map(ArrayOfObjects),
  { value: houseObj, label: labelOfSelect }
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

function _ColorPicker2System(colorInputLoader,columns){return(
(startValueStrings, titleStrings) =>
{
  let array = Array();
  array.push(colorInputLoader({
  value: startValueStrings[0],
  title: titleStrings[0]}));

  array.push(colorInputLoader({
  value: startValueStrings[1],
  title: titleStrings[1]}));

  return columns(array);
  
}
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

function _toArray3(){return(
(System3) =>
{
  return [ System3.X, System3.Y, System3.Z]; // convert system to array quickly
}
)}

function _toArray2(){return(
(System2) =>
{
  return [System2.X, System2.Y]; // quickly convert 2 component system to array
}
)}

function _Choice2System(Inputs,columns){return(
(Choices2Array, labelOfSystem) =>
{
   let arry = Array();
  arry.push(Inputs.radio(Choices2Array, {value: Choices2Array[0], label: labelOfSystem[0]}));
  arry.push(Inputs.radio(Choices2Array, {value: Choices2Array[1], label: labelOfSystem[1]}));
  return columns(arry);
}
)}

function _Model2Selector(Inputs,houseObj,columns){return(
(ArrayOfObjects) =>
{
  let arry = Array();
  arry.push(Inputs.select(
    new Map(ArrayOfObjects),
    { value: houseObj, label: "Left Model"}
  ));
  arry.push(Inputs.select(
    new Map(ArrayOfObjects),
    { value: houseObj, label: "Right Model"}
  ));
  return columns(arry);
}
)}

function _InputSystem(singleValueSliderSystem,doubleValueSliderSystem,tripleValueSliderSystem,RotationSystem,TranslationSystem,NonUniformScaleSystem,UniformScaleSystem,ModelInputArray,ModelSelector,ColorPickerSystem,Checkbox,ModelSelectorMarked,toArray3,toArray2,Choice2System,Model2Selector,ColorPicker2System){return(
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
    "Checkbox":Checkbox,
    "ModelSelectorMarked":ModelSelectorMarked,
    "toArray3":toArray3,
    "toArray2":toArray2,
    "Choice2System":Choice2System,
    "Model2Selector":Model2Selector,
    "ColorPicker2System":ColorPicker2System
  }
)
)}

function _72(md){return(
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
(scaleArray, degreesArray, translationArray, extent) =>
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

function _getLookAts(){return(
(extentArray) =>
{
  return extentArray.map(data => data.center);
}
)}

function _M4D(m4,makeModelMatrix,getScaleMatrix,getTranslationMatrix,getRotationMatrices,getViewMatrix,getProjectionMatrix,getLookAts){return(
Object // Export API 
(
  {
    "m4":m4,
    "makeModelMatrix":makeModelMatrix,
    "getScaleMatrix":getScaleMatrix,
    "getTranslationMatrix":getTranslationMatrix,
    "getRotationMatrices":getRotationMatrices , // this returns an array of matrices so programmer can choose order
    "getViewMatrix":getViewMatrix,
    "getProjectionMatrix":getProjectionMatrix,
    "getLookAts":getLookAts
  }
)
)}

function _82(md){return(
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
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof VerticalFOV")).define("viewof VerticalFOV", ["InputSystem"], _VerticalFOV);
  main.variable(observer("VerticalFOV")).define("VerticalFOV", ["Generators", "viewof VerticalFOV"], (G, _) => G.input(_));
  main.variable(observer("viewof aspectSlider")).define("viewof aspectSlider", ["InputSystem"], _aspectSlider);
  main.variable(observer("aspectSlider")).define("aspectSlider", ["Generators", "viewof aspectSlider"], (G, _) => G.input(_));
  main.variable(observer("viewof plane")).define("viewof plane", ["InputSystem"], _plane);
  main.variable(observer("plane")).define("plane", ["Generators", "viewof plane"], (G, _) => G.input(_));
  main.variable(observer("viewof CameraAngles")).define("viewof CameraAngles", ["InputSystem"], _CameraAngles);
  main.variable(observer("CameraAngles")).define("CameraAngles", ["Generators", "viewof CameraAngles"], (G, _) => G.input(_));
  main.variable(observer("viewof model1Scale")).define("viewof model1Scale", ["InputSystem"], _model1Scale);
  main.variable(observer("model1Scale")).define("model1Scale", ["Generators", "viewof model1Scale"], (G, _) => G.input(_));
  main.variable(observer("viewof model2Scale")).define("viewof model2Scale", ["InputSystem"], _model2Scale);
  main.variable(observer("model2Scale")).define("model2Scale", ["Generators", "viewof model2Scale"], (G, _) => G.input(_));
  main.variable(observer("viewof model1Rotation")).define("viewof model1Rotation", ["InputSystem"], _model1Rotation);
  main.variable(observer("model1Rotation")).define("model1Rotation", ["Generators", "viewof model1Rotation"], (G, _) => G.input(_));
  main.variable(observer("viewof model2Rotation")).define("viewof model2Rotation", ["InputSystem"], _model2Rotation);
  main.variable(observer("model2Rotation")).define("model2Rotation", ["Generators", "viewof model2Rotation"], (G, _) => G.input(_));
  main.variable(observer("viewof model1Translation")).define("viewof model1Translation", ["InputSystem"], _model1Translation);
  main.variable(observer("model1Translation")).define("model1Translation", ["Generators", "viewof model1Translation"], (G, _) => G.input(_));
  main.variable(observer("viewof model2Translation")).define("viewof model2Translation", ["InputSystem"], _model2Translation);
  main.variable(observer("model2Translation")).define("model2Translation", ["Generators", "viewof model2Translation"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["gl","RenderWidth","RenderHeight","hex2rgb","colorSystem","M4D","transformDataArray","modelDimensionData","modelColorFormulas","CameraAngles","VerticalFOV","plane","aspectRatio","programInfo","twgl","BufferArrayData"], _13);
  main.variable(observer("viewof colorSystem")).define("viewof colorSystem", ["ColorPicker2System"], _colorSystem);
  main.variable(observer("colorSystem")).define("colorSystem", ["Generators", "viewof colorSystem"], (G, _) => G.input(_));
  main.variable(observer("viewof ModelSelections")).define("viewof ModelSelections", ["InputSystem","ModelInputArray"], _ModelSelections);
  main.variable(observer("ModelSelections")).define("ModelSelections", ["Generators", "viewof ModelSelections"], (G, _) => G.input(_));
  main.variable(observer("viewof modelColorFormulas")).define("viewof modelColorFormulas", ["InputSystem"], _modelColorFormulas);
  main.variable(observer("modelColorFormulas")).define("modelColorFormulas", ["Generators", "viewof modelColorFormulas"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("glLoader")).define("glLoader", ["DOM"], _glLoader);
  main.variable(observer("gl")).define("gl", ["glLoader","aspectSlider"], _gl);
  main.variable(observer("transformDataArray")).define("transformDataArray", ["toArray3","model1Scale","model1Rotation","model1Translation","model2Scale","model2Rotation","model2Translation"], _transformDataArray);
  main.variable(observer("RenderWidth")).define("RenderWidth", ["gl"], _RenderWidth);
  main.variable(observer("RenderHeight")).define("RenderHeight", ["gl"], _RenderHeight);
  main.variable(observer("aspectRatio")).define("aspectRatio", ["RenderWidth","RenderHeight"], _aspectRatio);
  main.variable(observer("VertexAttributeArrayData")).define("VertexAttributeArrayData", ["GLO","ModelSelections"], _VertexAttributeArrayData);
  main.variable(observer("BufferArrayData")).define("BufferArrayData", ["GLO","VertexAttributeArrayData"], _BufferArrayData);
  main.variable(observer("modelDimensionData")).define("modelDimensionData", ["GLO","ModelSelections"], _modelDimensionData);
  main.variable(observer("lookAts")).define("lookAts", ["M4D","modelDimensionData"], _lookAts);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("ShaderCompilerError")).define("ShaderCompilerError", ["errorBlockMaker"], _ShaderCompilerError);
  main.variable(observer("shaders")).define("shaders", _shaders);
  main.variable(observer("programInfo")).define("programInfo", ["GLO","twgl","ShaderCompilerError","shaders","gl"], _programInfo);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer()).define(["md"], _36);
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
  main.variable(observer("WebGl2RenderingContextCreator")).define("WebGl2RenderingContextCreator", ["DOM","hex2rgb"], _WebGl2RenderingContextCreator);
  main.variable(observer("errorBlockMaker")).define("errorBlockMaker", ["html","width"], _errorBlockMaker);
  main.variable(observer("shaderCompiler")).define("shaderCompiler", _shaderCompiler);
  main.variable(observer("generateVertexAttributesArray")).define("generateVertexAttributesArray", _generateVertexAttributesArray);
  main.variable(observer("makeBufferInfo")).define("makeBufferInfo", _makeBufferInfo);
  main.variable(observer("FormatAndMapMultipleObjectAttributes")).define("FormatAndMapMultipleObjectAttributes", _FormatAndMapMultipleObjectAttributes);
  main.variable(observer("FormatAndMapMultipleDataBuffers")).define("FormatAndMapMultipleDataBuffers", ["twgl","gl"], _FormatAndMapMultipleDataBuffers);
  main.variable(observer("FormatAndMapMultipleModelDimensionalExtents")).define("FormatAndMapMultipleModelDimensionalExtents", ["computeModelExtent"], _FormatAndMapMultipleModelDimensionalExtents);
  main.variable(observer("GLO")).define("GLO", ["loadModelFromURL","computeModelExtent","makeBufferInfo","shaderCompiler","generateVertexAttributesArray","FormatAndMapMultipleObjectAttributes","FormatAndMapMultipleDataBuffers","FormatAndMapMultipleModelDimensionalExtents"], _GLO);
  main.variable(observer()).define(["md"], _52);
  const child5 = runtime.module(define5);
  main.import("raymanObj", child5);
  main.import("teapotObj", child5);
  main.import("boyObj", child5);
  main.import("windmillObj", child5);
  main.import("houseObj", child5);
  main.variable(observer("ModelInputArray")).define("ModelInputArray", ["boyObj","raymanObj","teapotObj","windmillObj","houseObj"], _ModelInputArray);
  main.variable(observer("ModelSelector")).define("ModelSelector", ["Inputs","houseObj"], _ModelSelector);
  main.variable(observer("ModelSelectorMarked")).define("ModelSelectorMarked", ["Inputs","houseObj"], _ModelSelectorMarked);
  const child6 = runtime.module(define6);
  main.import("color", "colorInputLoader", child6);
  main.variable(observer("ColorPickerSystem")).define("ColorPickerSystem", ["colorInputLoader"], _ColorPickerSystem);
  main.variable(observer("ColorPicker2System")).define("ColorPicker2System", ["colorInputLoader","columns"], _ColorPicker2System);
  main.variable(observer("singleValueSliderSystem")).define("singleValueSliderSystem", ["Inputs"], _singleValueSliderSystem);
  main.variable(observer("doubleValueSliderSystem")).define("doubleValueSliderSystem", ["columns","Inputs"], _doubleValueSliderSystem);
  main.variable(observer("tripleValueSliderSystem")).define("tripleValueSliderSystem", ["columns","Inputs"], _tripleValueSliderSystem);
  main.variable(observer("UniformScaleSystem")).define("UniformScaleSystem", ["singleValueSliderSystem"], _UniformScaleSystem);
  main.variable(observer("NonUniformScaleSystem")).define("NonUniformScaleSystem", ["tripleValueSliderSystem"], _NonUniformScaleSystem);
  main.variable(observer("TranslationSystem")).define("TranslationSystem", ["tripleValueSliderSystem"], _TranslationSystem);
  main.variable(observer("RotationSystem")).define("RotationSystem", ["tripleValueSliderSystem"], _RotationSystem);
  main.variable(observer("toArray3")).define("toArray3", _toArray3);
  main.variable(observer("toArray2")).define("toArray2", _toArray2);
  main.variable(observer("Choice2System")).define("Choice2System", ["Inputs","columns"], _Choice2System);
  main.variable(observer("Model2Selector")).define("Model2Selector", ["Inputs","houseObj","columns"], _Model2Selector);
  main.variable(observer("InputSystem")).define("InputSystem", ["singleValueSliderSystem","doubleValueSliderSystem","tripleValueSliderSystem","RotationSystem","TranslationSystem","NonUniformScaleSystem","UniformScaleSystem","ModelInputArray","ModelSelector","ColorPickerSystem","Checkbox","ModelSelectorMarked","toArray3","toArray2","Choice2System","Model2Selector","ColorPicker2System"], _InputSystem);
  main.variable(observer()).define(["md"], _72);
  main.variable(observer("m4")).define("m4", ["twgl"], _m4);
  main.variable(observer("getRotationMatrices")).define("getRotationMatrices", ["m4","deg2Rad"], _getRotationMatrices);
  main.variable(observer("getTranslationMatrix")).define("getTranslationMatrix", ["m4"], _getTranslationMatrix);
  main.variable(observer("getScaleMatrix")).define("getScaleMatrix", ["m4"], _getScaleMatrix);
  main.variable(observer("makeModelMatrix")).define("makeModelMatrix", ["getScaleMatrix","getRotationMatrices","getTranslationMatrix","m4"], _makeModelMatrix);
  main.variable(observer("getViewMatrix")).define("getViewMatrix", ["deg2Rad","m4"], _getViewMatrix);
  main.variable(observer("getProjectionMatrix")).define("getProjectionMatrix", ["deg2Rad","m4"], _getProjectionMatrix);
  main.variable(observer("getLookAts")).define("getLookAts", _getLookAts);
  main.variable(observer("M4D")).define("M4D", ["m4","makeModelMatrix","getScaleMatrix","getTranslationMatrix","getRotationMatrices","getViewMatrix","getProjectionMatrix","getLookAts"], _M4D);
  main.variable(observer()).define(["md"], _82);
  main.variable(observer("v3")).define("v3", ["twgl"], _v3);
  main.variable(observer("V3D")).define("V3D", ["v3"], _V3D);
  return main;
}

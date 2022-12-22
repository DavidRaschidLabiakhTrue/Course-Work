import define1 from "./9d0fa713ea129540@422.js";

function _1(md){return(
md`# Assignment 3`
)}

function _modelObj(Inputs,boyObj,raymanObj,teapotObj,windmillObj){return(
Inputs.select(
  new Map([
    ["boy", boyObj],
    ["rayman", raymanObj],
    ["teapot", teapotObj],
    ["windmill", windmillObj]
  ]),
  { value: teapotObj, label: "Choose Model" }
)
)}

function _preserveAspectRatio(Inputs){return(
Inputs.toggle({ label: "Preserve Aspect Ratio:" })
)}

function _normal2color(Inputs){return(
Inputs.radio(["abs", "Invertible Transform"], {
  value: "abs",
  label: "Normal to Color method"
})
)}

function _5(gl,programInfo,twgl,uniforms,bufferInfoArray,type,invalidation)
{
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(programInfo.program);
  const request = requestAnimationFrame(function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    twgl.setUniforms(programInfo, uniforms);
    bufferInfoArray.forEach((bufferInfo) => {
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      twgl.drawBufferInfo(gl, bufferInfo, gl[type.toUpperCase()]);
    });
    /*
    y_angle = y_angle + Math.PI / 180;
    if (y_angle > 2 * Math.PI) y_angle -= 2 * Math.PI;
    */
    requestAnimationFrame(render);
  });
  invalidation.then(() => cancelAnimationFrame(request));
  return gl.canvas;
}


function _type(Inputs){return(
Inputs.radio(["points", "triangles"], {
  value: "triangles",
  label: "primitive type"
})
)}

function _uniforms(gl,preserveAspectRatio,computeModelExtent,modelObj,normal2color)
{
  const canvas = gl.canvas;
  const aspect = preserveAspectRatio ? canvas.width / canvas.height : 1;
  const modelDim = computeModelExtent(modelObj);
  const n2c = normal2color == "abs" ? 0 : 1;
  /*
  const modelDiag = v3.length(v3.subtract(modelExtent.max, modelExtent.min));
  const modelCenter = v3.mulScalar(
    v3.add(modelExtent.max, modelExtent.min),
    0.5
  );*/
  return {
    aspect,
    scale: 2 / modelDim.dia,
    modelCenter: modelDim.center,
    n2c
  };
}


function _bufferInfoArray(vertexAttributes,twgl,gl){return(
vertexAttributes.map((vertexAttributes) =>
  twgl.createBufferInfoFromArrays(gl, vertexAttributes)
)
)}

function _gl(DOM,width)
{
  const myCanvas = DOM.canvas(width, 480);

  const gl = myCanvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.3, 0.4, 0.5, 1);
  return gl;
}


function _errorBlock(html,width){return(
html`<textarea style="height : 20px; width : ${width}px; font-size: 0.8em; display: block"></textarea>`
)}

function _shaders(){return(
{
  vs: `#version 300 es
    in vec3 position;
    in vec3 normal;

    uniform float aspect;
    uniform float scale;
    uniform vec3 modelCenter;

    out vec3 fragNormal;
    void main () {
      vec3 newPosition = scale*(position-modelCenter);
      gl_Position = vec4(newPosition.x/aspect,newPosition.yz,1);
      fragNormal = normalize(normal);
      gl_PointSize = 2.;
    }`,

  fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec3 fragNormal;
    uniform int n2c;
    void main () {
      vec3 N = normalize(fragNormal);
      vec3 color = (n2c==0)?abs(N):(N+1.)/2.;
      outColor = vec4(color, 1);
    }`
}
)}

function _vertexAttributes(modelObj){return(
modelObj.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals }
}))
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


function _14(md){return(
md`**Teapot**`
)}

function _teapotObj(loadModelFromURL,teapotURL){return(
loadModelFromURL(teapotURL, "obj")
)}

function _teapotURL(FileAttachment){return(
FileAttachment("teapot.obj").url()
)}

function _17(md){return(
md`**Windmill Model**: The model is from https://blendswap.com/blend/9755. Creator: https://blendswap.com/profile/28511`
)}

function _windmillURL(FileAttachment){return(
FileAttachment("windmill.obj").url()
)}

function _windmillObj(loadModelFromURL,windmillURL){return(
loadModelFromURL(windmillURL, "obj")
)}

function _20(md){return(
md`**Boy Model**`
)}

async function _boyObj(loadModelFromURL,FileAttachment){return(
loadModelFromURL(await FileAttachment("BoyOBJ.obj").url(), "obj")
)}

function _22(md){return(
md`**Rayman Model**`
)}

async function _raymanObj(loadModelFromURL,FileAttachment){return(
loadModelFromURL(
  await FileAttachment("raymanModel.obj").url(),
  "obj"
)
)}

function _24(gl){return(
gl.getContextAttributes()
)}

function _25(md){return(
md`### House Model
Source: https://sketchfab.com/3d-models/247-house-15-obj-123829825e164aadaaecab68505a1b44`
)}

async function _houseObj(loadModelFromURL,FileAttachment){return(
loadModelFromURL(
  await FileAttachment("247_House 15_obj.obj").url(),
  "obj"
)
)}

function _27(md){return(
md`### External Libraries and Imports`
)}

function _deg2rad(){return(
(deg) => (Math.PI * deg) / 180
)}

function _twgl(require){return(
require("twgl.js")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["windmill.obj", {url: new URL("./files/92bf1dafb899b233d0e7e4ebfb6dea49334fdd60f65754dc54a6523bb67c2200ed75950b6b4b51bb7fc20e0765df2255407607e8eec44b27edf35e0a3a589385.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["teapot.obj", {url: new URL("./files/d1652511080b6593a3eb5e9ce6dc9aa886a65015ba49b361ea5583e91aa9ffe76b822c494cee5f6f0bfefba9ff76ce8f55e9fbf170f816e02707f9edeccf96e0.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["BoyOBJ.obj", {url: new URL("./files/60f4958fe3739037c4330662b193a0651d3cec40746c44cd3c047e6b359b755b44c5fef73b71ec2be9945fdbcad9cfce0cbe9463c25acbb2aa8f08e608fe914d.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["raymanModel.obj", {url: new URL("./files/c1fc0d2fbf2bed5669afae79d4c0e896701b9e7257924c92a873b376bb2e65d7c217aeb899c11088d648cf89535a89089cdabff9da336ba7e6a739dd5e20a5cf.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["247_House 15_obj.obj", {url: new URL("./files/14dacf4b987e19356033495dfccd39174591cf07a57168946e51ac82c84fc7c6a46c1d86aabb3bbcc5b14fdf4b6f19052bde7af14d77c4639c4fb437b2f0a2a5.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof modelObj")).define("viewof modelObj", ["Inputs","boyObj","raymanObj","teapotObj","windmillObj"], _modelObj);
  main.variable(observer("modelObj")).define("modelObj", ["Generators", "viewof modelObj"], (G, _) => G.input(_));
  main.variable(observer("viewof preserveAspectRatio")).define("viewof preserveAspectRatio", ["Inputs"], _preserveAspectRatio);
  main.variable(observer("preserveAspectRatio")).define("preserveAspectRatio", ["Generators", "viewof preserveAspectRatio"], (G, _) => G.input(_));
  main.variable(observer("viewof normal2color")).define("viewof normal2color", ["Inputs"], _normal2color);
  main.variable(observer("normal2color")).define("normal2color", ["Generators", "viewof normal2color"], (G, _) => G.input(_));
  main.variable(observer()).define(["gl","programInfo","twgl","uniforms","bufferInfoArray","type","invalidation"], _5);
  main.variable(observer("viewof type")).define("viewof type", ["Inputs"], _type);
  main.variable(observer("type")).define("type", ["Generators", "viewof type"], (G, _) => G.input(_));
  main.variable(observer("uniforms")).define("uniforms", ["gl","preserveAspectRatio","computeModelExtent","modelObj","normal2color"], _uniforms);
  main.variable(observer("bufferInfoArray")).define("bufferInfoArray", ["vertexAttributes","twgl","gl"], _bufferInfoArray);
  main.variable(observer("gl")).define("gl", ["DOM","width"], _gl);
  main.variable(observer("errorBlock")).define("errorBlock", ["html","width"], _errorBlock);
  main.variable(observer("shaders")).define("shaders", _shaders);
  main.variable(observer("vertexAttributes")).define("vertexAttributes", ["modelObj"], _vertexAttributes);
  main.variable(observer("programInfo")).define("programInfo", ["errorBlock","twgl","gl","shaders"], _programInfo);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("teapotObj")).define("teapotObj", ["loadModelFromURL","teapotURL"], _teapotObj);
  main.variable(observer("teapotURL")).define("teapotURL", ["FileAttachment"], _teapotURL);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("windmillURL")).define("windmillURL", ["FileAttachment"], _windmillURL);
  main.variable(observer("windmillObj")).define("windmillObj", ["loadModelFromURL","windmillURL"], _windmillObj);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("boyObj")).define("boyObj", ["loadModelFromURL","FileAttachment"], _boyObj);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("raymanObj")).define("raymanObj", ["loadModelFromURL","FileAttachment"], _raymanObj);
  main.variable(observer()).define(["gl"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("houseObj")).define("houseObj", ["loadModelFromURL","FileAttachment"], _houseObj);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("deg2rad")).define("deg2rad", _deg2rad);
  const child1 = runtime.module(define1);
  main.import("loadModelFromURL", child1);
  main.import("computeModelExtent", child1);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  return main;
}

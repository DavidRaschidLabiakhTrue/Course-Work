import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./10023e7d8ddc32bc@90.js";
import define3 from "./a2e58f97fd5e8d7c@736.js";
import define4 from "./1b675294aba5f9ea@583.js";
import define5 from "./9d0fa713ea129540@422.js";
import define6 from "./a7481270343815fd@706.js";

function _1(md){return(
md`# Assignment 8:
# PBR material`
)}

function _2(md){return(
md`# Controls & Rendering`
)}

function _3(md){return(
md`### Controls`
)}

function _4(md){return(
md`### Model`
)}

function _transformModel(columns,slider,extents){return(
columns({
 scale: slider({
    min: 0.1, 
    max: 10, 
    step: 0.1, 
    value: 1, 
    title: "Scale"
  }),
  translateX: slider({
    min: -10, 
    max: 10, 
    step: 1, 
    value: 0, 
    title: "Translate X"
  }),
  translateY : slider({
    min: -10, 
    max: 10, 
    step: 1, 
    value: 0, 
    title: "Translate Y"
  }),
  translationBuffer : slider({
    min: extents.max[0] / 4, 
    max: extents.max[0] * 4, 
    step: extents.max[0] / 4, 
    value: extents.max[0], 
    title: "Space Buffer"
  })
  
})
)}

function _6(md){return(
md`### Camera`
)}

function _viewData(columns,slider){return(
columns({
    Distance: slider({
    min: 1, 
    max: 5, 
    step: .1, 
    value: 2, 
    title: "Distance"
  }),
  xAngle: slider({
    min: -89, 
    max: 89, 
    step: 1, 
    value: 0, 
    title: "Camera Rotation X"
  }),
  yAngle : slider({
    min: -180, 
    max: 180, 
    step: 1, 
    value: 0, 
    title: "Camera Rotation Y"
  }),
  fov: slider({
    min: 15, 
    max: 120, 
    step: 1, 
    value: 45, 
    title: "Vertical FOV",
  })
})
)}

function _8(md){return(
md`### Light`
)}

function _lightData(columns,slider){return(
columns({
 zAngle: slider({
    min: -180, 
    max: 180, 
    step: 1, 
    value: 0, 
    title: "Z Angle"
  }),
  distance: slider({
    min: 1, 
    max: 20, 
    step: 1, 
    value: 1, 
    title: "Light Distance"
  }),
  shininess : slider({
    min: 1, 
    max: 30, 
    step: 1, 
    value: 0, 
    title: "Shininess"
  }),
  
})
)}

function _lightData2(columns,slider){return(
columns(
  {K_s: slider({
    min: 0, 
    max: 1, 
    step: .1, 
    value: .5, 
    title: "K_s",
  }),
  ambient: slider({
    min: 0, 
    max: 5, 
    step: .1, 
    value: 1, 
    title: "ambient",
  })
})
)}

function _MatData(columns,slider){return(
columns(
  {roughness: slider({
    min: 0, 
    max: 1, 
    step: .01, 
    value: .5, 
    title: "Roughness",
  })
})
)}

function _lightingType(ChoiceSystem){return(
ChoiceSystem(["point", "direction"], "Lighting Type")
)}

function _13(md){return(
md`### Color`
)}

function _colorData(columns,color){return(
columns(
  {
    background: color({ value: "#ffffff", title: "Background Color" }),
    material: color({ value: "#FF0000", title: "Material Color" }),
    specular: color({ value: "#7479ad", title: "Specular Color" }),
  }
)
)}

function _physicalMaterial(Inputs){return(
Inputs.select
  (
    new Map
    ([
      ["Iron", [0.56,0.57,0.58]],
      ["Copper", [0.95,0.64,0.54]],
      ["Gold", [1.00,0.71,0.29]],
      ["Aluminum", [0.91,0.92,0.92]],
      ["Silver", [0.95,0.93,0.88]]
    ]), 
    {label:"Material"}
  )
)}

function _16(gl,hex2rgb,colorData,runRender)
{ 
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(...hex2rgb(colorData.background), 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  runRender();
  return gl.canvas;
}


function _runRender(rgb2hex,physicalMaterial,shaders,gl,getPointLightData,getDirectionalLightData,lightingType,getProjectionMatrx,getViewMatrix,m4,transformModel,getModelMatrix,MatData,lightData2,hex2rgb,lightData,twgl,buffer){return(
() =>
{

  
  for (let i = 0; i < 1; ++i) 
  {
    let PhysicalHex = rgb2hex(physicalMaterial);
    let access = 1;
    let shader = shaders[access];
    gl.useProgram(shader.program);

    let lightPositionData = getPointLightData();
    let lightDirectionData = getDirectionalLightData();
    
    let lighting = (lightingType == "point") ? [...lightPositionData, 1.0] : [...lightDirectionData, 0.0];

    let projectionMatrix = getProjectionMatrx();
    let viewMatrix = getViewMatrix([0,0,0]);
    let eye = m4.inverse(viewMatrix).slice(12, 15);
    let translateArray = [transformModel.translateX, transformModel.translateY, 0];
    let scaleArray = [transformModel.scale, transformModel.scale, transformModel.scale];
    let model = getModelMatrix(scaleArray, [0,0,0], translateArray, [0,0,0]);
    
    let uniforms = 
    {
        PI: Math.PI,
        R2: Math.pow(MatData.roughness, 2),
        F0:physicalMaterial,
        eyePosition: eye,
        light: lighting,
        K_s: lightData2.K_s,
        ambientIntensity: lightData2.ambient / 10,
        modelMatrix: model,
        materialColor: hex2rgb(rgb2hex(physicalMaterial)),
        viewMatrix,
        projectionMatrix,
        shininess: lightData.shininess,
    };
    
    twgl.setUniforms(shader, uniforms);

    buffer.forEach((data) => 
    {
      twgl.setBuffersAndAttributes(gl, shader, data);
      twgl.drawBufferInfo(gl, data, gl.TRIANGLES);
    })
    
  }
}
)}

function _getPointLightData(lightData,extents,m4,deg2Rad,v3){return(
() =>
{
  let dist = (lightData.distance * extents.dia) / 2;
  let direction =  m4.transformDirection(m4.rotationZ(deg2Rad(lightData.zAngle)), [0, 1, 0]);
  return v3.add(extents.center, v3.mulScalar(direction, dist));
}
)}

function _getDirectionalLightData(m4,deg2Rad,lightData){return(
() =>
{
  return m4.transformDirection(m4.rotationZ(deg2Rad(lightData.zAngle)), [0, 1, 0]);
}
)}

function _20(md){return(
md`# Resources
##### Dropping personal API, it's only adding extra work on myself to keep it up to date if I can't just import it into assignments which was one of the original points to using it.`
)}

function _21(md){return(
md`## Shaders`
)}

function _ErrorDiffuse(errorBlockMaker){return(
errorBlockMaker()
)}

function _ErrorSpecular(errorBlockMaker){return(
errorBlockMaker()
)}

function _ErrorDiffuseSpecularAmbient(errorBlockMaker){return(
errorBlockMaker()
)}

function _diffuseShader(){return(
{
  vs: `#version 300 es
    precision mediump float;

    in vec3 position;
    in vec3 normal;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    out vec3 fragNormal;
    out vec3 fragPosition;

    void main () 
    {
      vec4 newPosition = modelMatrix*vec4(position,1);
      fragPosition = newPosition.xyz;
      gl_Position = projectionMatrix*viewMatrix*newPosition;
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
    }`,
  fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;

    in vec3 fragNormal;
    in vec3 fragPosition;

    uniform vec4 light;
    uniform vec3 eyePosition;

    uniform vec3 materialColor;
    uniform float ambientIntensity;
    uniform vec3 specularColor;
    uniform float shininess;    
    uniform float K_s;
    vec3 getL()
    {
      if (light.w > 0.0)
      {
        return normalize(light.xyz - fragPosition);
      }
      else
      {
        return normalize(light.xyz);
      }
    }
    vec3 getDiffuse(vec3 L, vec3 N)
    {
      return materialColor * clamp(dot(L,N), 0.,1.);
    }
    void main () 
    {
      vec3 N = normalize(fragNormal);
      vec3 L = getL();
      vec3 diffuse = getDiffuse(L, N);

      outColor = vec4(diffuse, 1.0);
    }`}
)}

function _SpecularShader(){return(
{
  vs: `#version 300 es
    precision mediump float;

    in vec3 position;
    in vec3 normal;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec3 fragNormal;
    out vec3 fragPosition;

    void main () 
    {
      vec4 newPosition = modelMatrix*vec4(position,1);
      fragPosition = newPosition.xyz;
      gl_Position = projectionMatrix*viewMatrix*newPosition;
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
    }`,
  fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;

    in vec3 fragNormal;
    in vec3 fragPosition;

    uniform vec4 light;
    uniform vec3 eyePosition;

    uniform vec3 materialColor;
    uniform float ambientIntensity;
    uniform vec3 specularColor;
    uniform float shininess;    
    uniform float K_s;
    vec3 getL()
    {
      if (light.w == 0.0)
      {
        return normalize(light.xyz);
      }
      else
      {
        return normalize(light.xyz - fragPosition);
      }
    }
    vec3 getDiffuse(vec3 L, vec3 N)
    {
      return materialColor * clamp(dot(L,N), 0.,1.);
    }
    // adjusted vector
    vec3 getV()
    {
        return normalize(eyePosition - fragPosition);
    }
    // half vector
    vec3 getH(vec3 L, vec3 V)
    {
      return normalize(L + V);
    }
    vec3 getSpecular(vec3 H, vec3 N)
    {
        return specularColor * pow(clamp(dot(H,N),0.,1.), shininess);
    }
    void main () 
    {
      vec3 N = normalize(fragNormal);
      vec3 L = getL();
      vec3 V = getV();
      vec3 H = getH(L, V);
      vec3 specular = getSpecular(H, N);
      outColor = vec4(specular, 1.0);
    }`}
)}

function _diffuseSpecularAmbientShader(){return(
{
  vs: `#version 300 es
    precision mediump float;

    in vec3 position;
    in vec3 normal;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec3 fragNormal;
    out vec3 fragPosition;

    void main () 
    {
      vec4 newPosition = modelMatrix*vec4(position,1);
      fragPosition = newPosition.xyz;
      gl_Position = projectionMatrix*viewMatrix*newPosition;
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
    }`,
  fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;

    in vec3 fragNormal;
    in vec3 fragPosition;

    uniform vec4 light;
    uniform vec3 eyePosition;

    uniform vec3 materialColor;
    uniform float ambientIntensity;
    uniform vec3 specularColor;
    uniform float shininess;    
    uniform float K_s;
    vec3 getL()
    {
      if (light.w == 0.0)
      {
        return normalize(light.xyz);
      }
      else
      {
        return normalize(light.xyz - fragPosition);
      }
    }
    vec3 getDiffuse(vec3 L, vec3 N)
    {
      return materialColor * clamp(dot(L,N), 0.,1.);
    }
    // adjusted vector
    vec3 getV()
    {
        return normalize(eyePosition - fragPosition);
    }
    // half vector
    vec3 getH(vec3 L, vec3 V)
    {
        return normalize(L + V);
    }
    vec3 getSpecular(vec3 H, vec3 N)
    {
        return specularColor * pow(clamp(dot(H,N),0.,1.), shininess);
    }
    vec3 getAmbient()
    {
        return ambientIntensity * materialColor;
    }
    vec3 getDiffuseSpecularAmbientColor(vec3 diffuse, vec3 specular, vec3 ambient)
    {

        return (1.0 - K_s) * diffuse + (K_s) * specular + ambient;  
    }
    void main () 
    {
      vec3 N = normalize(fragNormal);
      vec3 L = getL();
      vec3 V = getV();
      vec3 H = getH(L, V);
      vec3 diffuse = getDiffuse(L, N);
      vec3 specular = getSpecular(H, N);
      vec3 ambient = getAmbient();
      vec3 color = getDiffuseSpecularAmbientColor(diffuse, specular, ambient);
      outColor = vec4(color, 1.0);
    }`}
)}

function _PBRShader(){return(
{
  vs: `#version 300 es
    precision mediump float;

    in vec3 position;
    in vec3 normal;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec3 fragNormal;
    out vec3 fragPosition;

    void main () 
    {
      vec4 newPosition = modelMatrix*vec4(position,1);
      fragPosition = newPosition.xyz;
      gl_Position = projectionMatrix*viewMatrix*newPosition;
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
    }`,
  fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;

    in vec3 fragNormal;
    in vec3 fragPosition;

    uniform vec4 light;
    uniform vec3 eyePosition;

    uniform vec3 materialColor;
    uniform float ambientIntensity;
    uniform vec3 specularColor;
    uniform float shininess;    
    uniform float K_s;
    uniform vec3 F0;
    uniform float PI;
    uniform float R2;

    vec3 getL()
    {
      if (light.w == 0.0)
      {
        return normalize(light.xyz);
      }
      else
      {
        return normalize(light.xyz - fragPosition);
      }
    }
    // adjusted vector
    vec3 getV()
    {
        return normalize(eyePosition - fragPosition);
    }
    // half vector
    vec3 getH(vec3 L, vec3 V)
    {
        return normalize(L + V);
    }
    float dotClamp(vec3 v1, vec3 v2)
    {
      return clamp(dot(v1, v2), 0.0, 1.0);
    }
    vec3 getF(vec3 N, vec3 L)
    {
      return F0 + (1.0 - F0) * pow(1.0 - clamp(dot(N, L), 0.0, 1.0), 5.0);
    }
    float getG(vec3 N, vec3 L, vec3 V)
    {
      float Gv = clamp(dot(N, V), 0.0, 1.0) / (clamp(dot(N, V), 0.0, 1.0) * (1.0 - R2 * 0.5) + R2);
      float Gl = clamp(dot(N, V), 0.0, 1.0) / (clamp(dot(N, V), 0.0, 1.0) *(1.0 - R2 * 0.5) + R2);

      return Gv * Gl;
    }
    float getD(vec3 N, vec3 H)
    {
      return R2 / (PI * pow(  pow( clamp(dot(N, H), 0.0, 1.0), 2.0) * (R2 - 1.0) + 1.0, 2.0 ) );
    }

    vec3 getMicrofacet(vec3 F, float G, float D)
    {
      return F * G * D;
    }
    vec3 getPBRColor(vec3 N, vec3 L, vec3 microfacet)
    {
      return ambientIntensity * materialColor + (1.0 - K_s) * materialColor * dotClamp(N,L) + K_s * microfacet;
    }
    void main () 
    {
      vec3 N = normalize(fragNormal);
      vec3 L = getL();
      vec3 V = getV();
      vec3 H = getH(L, V);
      
      vec3 F = getF(N, L);
      float G = getG(N, L, V);
      float D = getD(N, H);
      vec3 microfacet = getMicrofacet(F, G, D);
      vec3 color = getPBRColor(N, L, microfacet);

      outColor = vec4(color, 1.0);
    }`}
)}

function _shaders(compile,ErrorDiffuse,diffuseShader,ErrorSpecular,PBRShader,ErrorDiffuseSpecularAmbient,diffuseSpecularAmbientShader){return(
[compile(ErrorDiffuse, diffuseShader),
          compile(ErrorSpecular, PBRShader),
          compile(ErrorDiffuseSpecularAmbient, diffuseSpecularAmbientShader)]
)}

function _30(md){return(
md`## OpenGL`
)}

function _twgl(require){return(
require("twgl.js")
)}

function _gl(DOM)
{
  const myCanvas = DOM.canvas(1260, 600);

  const gl = myCanvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.3, 0.4, 0.5, 1);
  gl.enable(gl.SCISSOR_TEST);
  return gl;
}


function _compile(twgl,gl){return(
(errorBlockData, shaders) =>
{
    errorBlockData.style.height = "20px";
  errorBlockData.innerHTML = "Program Shader compilation successful";
  return twgl.createProgramInfo(gl, [shaders.vs, shaders.fs], (message) => {
    errorBlockData.style.height = "400px";
    errorBlockData.innerHTML = "Program Shader compilation error\n" + message;
  });
}
)}

function _mapObjToBuffer(twgl,gl){return(
(obj) =>
{
  return obj.map((d) => ({
    position: { numComponents: 3, data: d.sc.positions },
    normal: { numComponents: 3, data: d.sc.normals }
  }))
  .map((vertexAttributes) =>
    twgl.createBufferInfoFromArrays(gl, vertexAttributes)
  )
}
)}

function _35(md){return(
md`## GUI`
)}

function _ChoiceSystem(Inputs){return(
(ChoicesArray, labelOfSystem) =>
{
  return Inputs.radio(ChoicesArray, {value: ChoicesArray[0], label: labelOfSystem});
}
)}

function _errorBlockMaker(html,width){return(
() => {
  return html`<textarea style="height : 20px; width : ${width}px; font-size: 0.8em; display: block"></textarea>`;
}
)}

function _41(md){return(
md`## Math`
)}

function _rgb2hex(){return(
(rgb) => {
  return "#" + Math.floor(rgb[0] * 255).toString(16) + Math.floor(rgb[1] * 255).toString(16) + Math.floor(rgb[2] * 255).toString(16);
}
)}

function _getViewMatrix(v3,extents,deg2Rad,viewData,m4){return(
(offset) => 
{


  
  
  //let offCenter = [offset[0] + extents.center[0], extents.center[1], extents.center[2]];
  let offCenter = v3.add(extents.center, offset);
  let roty = deg2Rad(viewData.yAngle);
  let rotx = deg2Rad(viewData.xAngle);
  let rotationYMatrix = m4.rotationY(roty);
  let rotationXMatrix = m4.rotationX(rotx);

  let rotationMatrix = m4.multiply(rotationYMatrix, rotationXMatrix);

  let viewDirection = m4.transformDirection(rotationMatrix, [0,0,1]);

  let dist = viewData.Distance * extents.dia * 0.5;
  

  
  let eyePosition = v3.add(extents.center, v3.mulScalar(viewDirection, dist));

  let cameraMatrix = m4.lookAt(eyePosition, extents.center, [0, 1, 0]);

  
  return m4.inverse(cameraMatrix);
}
)}

function _getProjectionMatrx(m4,deg2Rad,viewData,gl,extents){return(
() =>
{
   return m4.perspective(deg2Rad(viewData.fov), gl.canvas.width / gl.canvas.height, 0.1, 2.5 * extents.dia);
}
)}

function _getModelMatrix(v3,deg2Rad,m4){return(
(scaleArray, rotationArray, translationArray, offsetArray) =>
{
  let finalOffset = v3.add(translationArray, offsetArray);
  let rotRad = rotationArray.map((d) => deg2Rad(d));

  let translation = m4.translation(finalOffset);
  
  let rotx = m4.rotationX(rotRad[0]);
  let roty = m4.rotationY(rotRad[1]);
  let rotz = m4.rotationZ(rotRad[2]);

  let scale = m4.scaling(scaleArray);

  let temp = m4.identity();

  temp = m4.multiply(temp, scale);
  temp = m4.rotateZ(temp, rotRad[2]);
  temp = m4.rotateY(temp, rotRad[1]);
  temp = m4.rotateX(temp, rotRad[0]);
  temp = m4.translate(temp, finalOffset);

  return temp;
  
}
)}

function _deg2Rad(){return(
function(angleInDegrees)
{
  return angleInDegrees * (Math.PI / 180);
}
)}

function _rad2Deg(){return(
(angleInRadians) =>
{
  return angleInRadians * (180 / Math.PI);
}
)}

function _glMatrix(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)}

function _m4(twgl){return(
twgl.m4
)}

function _v3(twgl){return(
twgl.v3
)}

function _52(md){return(
md`## Model Loading`
)}

function _DragonURL(FileAttachment){return(
FileAttachment("Mesh008.obj").url()
)}

function _DragonObj(loadModelFromURL,DragonURL){return(
loadModelFromURL(DragonURL , "obj")
)}

function _modelInUse(DragonObj){return(
DragonObj
)}

function _extents(computeModelExtent,modelInUse){return(
computeModelExtent(modelInUse)
)}

function _buffer(mapObjToBuffer,modelInUse){return(
mapObjToBuffer(modelInUse)
)}

function _60(md){return(
md`# Untitled`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Mesh008.obj", {url: new URL("./files/52252884443a5d2de9a34e8190cff62a03a83f0dc90771a826f8f68db255343ac005a80b872f46ed17748ddb3cb681e0b238d04d50d962abb6dc866d5ea98c16.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof transformModel")).define("viewof transformModel", ["columns","slider","extents"], _transformModel);
  main.variable(observer("transformModel")).define("transformModel", ["Generators", "viewof transformModel"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("viewof viewData")).define("viewof viewData", ["columns","slider"], _viewData);
  main.variable(observer("viewData")).define("viewData", ["Generators", "viewof viewData"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("viewof lightData")).define("viewof lightData", ["columns","slider"], _lightData);
  main.variable(observer("lightData")).define("lightData", ["Generators", "viewof lightData"], (G, _) => G.input(_));
  main.variable(observer("viewof lightData2")).define("viewof lightData2", ["columns","slider"], _lightData2);
  main.variable(observer("lightData2")).define("lightData2", ["Generators", "viewof lightData2"], (G, _) => G.input(_));
  main.variable(observer("viewof MatData")).define("viewof MatData", ["columns","slider"], _MatData);
  main.variable(observer("MatData")).define("MatData", ["Generators", "viewof MatData"], (G, _) => G.input(_));
  main.variable(observer("viewof lightingType")).define("viewof lightingType", ["ChoiceSystem"], _lightingType);
  main.variable(observer("lightingType")).define("lightingType", ["Generators", "viewof lightingType"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("viewof colorData")).define("viewof colorData", ["columns","color"], _colorData);
  main.variable(observer("colorData")).define("colorData", ["Generators", "viewof colorData"], (G, _) => G.input(_));
  main.variable(observer("viewof physicalMaterial")).define("viewof physicalMaterial", ["Inputs"], _physicalMaterial);
  main.variable(observer("physicalMaterial")).define("physicalMaterial", ["Generators", "viewof physicalMaterial"], (G, _) => G.input(_));
  main.variable(observer()).define(["gl","hex2rgb","colorData","runRender"], _16);
  main.variable(observer("runRender")).define("runRender", ["rgb2hex","physicalMaterial","shaders","gl","getPointLightData","getDirectionalLightData","lightingType","getProjectionMatrx","getViewMatrix","m4","transformModel","getModelMatrix","MatData","lightData2","hex2rgb","lightData","twgl","buffer"], _runRender);
  main.variable(observer("getPointLightData")).define("getPointLightData", ["lightData","extents","m4","deg2Rad","v3"], _getPointLightData);
  main.variable(observer("getDirectionalLightData")).define("getDirectionalLightData", ["m4","deg2Rad","lightData"], _getDirectionalLightData);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("ErrorDiffuse")).define("ErrorDiffuse", ["errorBlockMaker"], _ErrorDiffuse);
  main.variable(observer("ErrorSpecular")).define("ErrorSpecular", ["errorBlockMaker"], _ErrorSpecular);
  main.variable(observer("ErrorDiffuseSpecularAmbient")).define("ErrorDiffuseSpecularAmbient", ["errorBlockMaker"], _ErrorDiffuseSpecularAmbient);
  main.variable(observer("diffuseShader")).define("diffuseShader", _diffuseShader);
  main.variable(observer("SpecularShader")).define("SpecularShader", _SpecularShader);
  main.variable(observer("diffuseSpecularAmbientShader")).define("diffuseSpecularAmbientShader", _diffuseSpecularAmbientShader);
  main.variable(observer("PBRShader")).define("PBRShader", _PBRShader);
  main.variable(observer("shaders")).define("shaders", ["compile","ErrorDiffuse","diffuseShader","ErrorSpecular","PBRShader","ErrorDiffuseSpecularAmbient","diffuseSpecularAmbientShader"], _shaders);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer("gl")).define("gl", ["DOM"], _gl);
  main.variable(observer("compile")).define("compile", ["twgl","gl"], _compile);
  main.variable(observer("mapObjToBuffer")).define("mapObjToBuffer", ["twgl","gl"], _mapObjToBuffer);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("ChoiceSystem")).define("ChoiceSystem", ["Inputs"], _ChoiceSystem);
  main.variable(observer("errorBlockMaker")).define("errorBlockMaker", ["html","width"], _errorBlockMaker);
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("radio", child1);
  main.import("color", child1);
  const child2 = runtime.module(define2);
  main.import("columns", child2);
  const child3 = runtime.module(define3);
  main.import("Checkbox", child3);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("rgb2hex")).define("rgb2hex", _rgb2hex);
  main.variable(observer("getViewMatrix")).define("getViewMatrix", ["v3","extents","deg2Rad","viewData","m4"], _getViewMatrix);
  main.variable(observer("getProjectionMatrx")).define("getProjectionMatrx", ["m4","deg2Rad","viewData","gl","extents"], _getProjectionMatrx);
  main.variable(observer("getModelMatrix")).define("getModelMatrix", ["v3","deg2Rad","m4"], _getModelMatrix);
  const child4 = runtime.module(define4);
  main.import("hex2rgb", child4);
  main.variable(observer("deg2Rad")).define("deg2Rad", _deg2Rad);
  main.variable(observer("rad2Deg")).define("rad2Deg", _rad2Deg);
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], _glMatrix);
  main.variable(observer("m4")).define("m4", ["twgl"], _m4);
  main.variable(observer("v3")).define("v3", ["twgl"], _v3);
  main.variable(observer()).define(["md"], _52);
  const child5 = runtime.module(define5);
  main.import("loadModelFromURL", child5);
  main.import("computeModelExtent", child5);
  const child6 = runtime.module(define6);
  main.import("raymanObj", child6);
  main.import("teapotObj", child6);
  main.import("boyObj", child6);
  main.import("windmillObj", child6);
  main.import("houseObj", child6);
  main.variable(observer("DragonURL")).define("DragonURL", ["FileAttachment"], _DragonURL);
  main.variable(observer("DragonObj")).define("DragonObj", ["loadModelFromURL","DragonURL"], _DragonObj);
  main.variable(observer("modelInUse")).define("modelInUse", ["DragonObj"], _modelInUse);
  main.variable(observer("extents")).define("extents", ["computeModelExtent","modelInUse"], _extents);
  main.variable(observer("buffer")).define("buffer", ["mapObjToBuffer","modelInUse"], _buffer);
  main.variable(observer()).define(["md"], _60);
  return main;
}

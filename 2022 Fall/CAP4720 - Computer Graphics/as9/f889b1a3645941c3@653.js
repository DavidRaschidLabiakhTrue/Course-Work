import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./10023e7d8ddc32bc@90.js";
import define3 from "./a2e58f97fd5e8d7c@736.js";
import define4 from "./1b675294aba5f9ea@583.js";
import define5 from "./dd5e3bdbece67f4e@210.js";
import define6 from "./9d0fa713ea129540@422.js";
import define7 from "./a7481270343815fd@706.js";

function _1(md){return(
md`# Assignment 9:
# Textures`
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

function _transformModel(columns,slider){return(
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
    value: -2, 
    title: "Translate Y"
  })
  
})
)}

function _6(md){return(
md`#### When Mixture is set to 1 and environment mapping is enabled, the below shader act as the given assignment instructions.
#### This is to allow the Given Assignment Visual to also be generated.`
)}

function _mixture(slider){return(
slider({
    min: 0.0, 
    max: 1.0, 
    step: 0.1, 
    value: 1, 
    title: "Mixture"
  })
)}

function _8(md){return(
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
    value: 106, 
    title: "Vertical FOV",
  })
})
)}

function _shaderChoice(ChoiceSystem){return(
ChoiceSystem(["Texture Mapping", "Environment Mapping"], "Shader Type")
)}

function _11(md){return(
md`##### To Hot-Reload Environment Texture, Change Texture and Shift Mixture Knob.   
##### *This will force Observable JavaScript to stop being silly about how far it updates back to.*`
)}

function _textureChoice(Inputs,StarData,FieldData,LagoonData){return(
Inputs.select(new Map([["Stars", StarData], ["Field", FieldData], ["Lagoon", LagoonData]]), {value: FieldData, label: "Choose Texture"})
)}

function _13(gl,runRender)
{ 
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  runRender();
  return gl.canvas;
}


function _runRender(gl,shaders,CubeTextureData,inverseProjectionMatrix,twgl,quad,shaderChoice,getProjectionMatrx,getViewMatrix,m4,transformModel,getModelMatrix,texture,mixture,buffer){return(
() =>
{
  let access = 4;
  gl.depthFunc(gl.LEQUAL);

  gl.useProgram(shaders[access].program);

  let skyUniforms = 
  {
      cubemap: CubeTextureData,
      invViewProjectionMatrix:inverseProjectionMatrix
  };

  twgl.setUniforms(shaders[access], skyUniforms);
  twgl.setBuffersAndAttributes(gl, shaders[access], quad);
  twgl.drawBufferInfo(gl, quad);
  
  
  for (let i = 0; i < 1; ++i) 
  {

    if(shaderChoice == "Texture Mapping")
    {
      access = 3;
    }
    else
    {
      access = 5;
    }
    let shader = shaders[access];
    gl.useProgram(shader.program);


    

    let projectionMatrix = getProjectionMatrx();
    let viewMatrix = getViewMatrix([0,0,0]);
    let eye = m4.inverse(viewMatrix).slice(12, 15);
    let translateArray = [transformModel.translateX, transformModel.translateY, 0];
    let scaleArray = [transformModel.scale, transformModel.scale, transformModel.scale];
    let model = getModelMatrix(scaleArray, [0,0,0], translateArray, [0,0,0]);
    
    let uniforms = 
    {
        PI: Math.PI,
        tex: texture,
        eyePosition: eye,
        modelMatrix: model,
        viewMatrix,
        projectionMatrix,
        mixture,
        cubemap: CubeTextureData
    };

    // BufferInfoArray.forEach((bufferInfo) => {
    // twgl.setBuffersAndAttributes(gl, shader, bufferInfo);
    // twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);});
    
    twgl.setUniforms(shader, uniforms);
    twgl.setBuffersAndAttributes(gl, shader, buffer);
    twgl.drawBufferInfo(gl, buffer, gl.TRIANGLES);

    
  }
}
)}

function _15(md){return(
md`### Sky Data`
)}

function _16(md){return(
md`#### https://tools.wwwtyro.net/space-3d/index.html was used to generate galaxy skyboxes.`
)}

function _CubeTextureData(makeCubeTexture,textureChoice){return(
makeCubeTexture(textureChoice)
)}

function _quad(makeTWGLQuad){return(
makeTWGLQuad()
)}

function _inverseProjectionMatrix(m4,deg2Rad,viewData,gl){return(
m4.inverse(m4.perspective(deg2Rad(viewData.fov), gl.canvas.width/gl.canvas.height, 0.1, 2.5))
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

function _ErrorTextureShader(errorBlockMaker){return(
errorBlockMaker()
)}

function _ErrorSkyBoxShader(errorBlockMaker){return(
errorBlockMaker()
)}

function _ErrorReflectiveShader(errorBlockMaker){return(
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

function _textureShader(){return(
{
  vs: `#version 300 es
    precision mediump float;

    in vec3 position;
    in vec3 normal;
    in vec2 uv;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec3 fragNormal;
    out vec3 fragPosition;
    out vec2 fragUV;

    void main () 
    {
      fragUV = uv;
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
    in vec2 fragUV;
    uniform sampler2D tex;
    uniform vec4 light;
    uniform vec3 eyePosition;
    uniform samplerCube cubemap;
    uniform vec3 materialColor;
    uniform float ambientIntensity;
    uniform vec3 specularColor;
    uniform float shininess;    
    uniform float K_s;
    uniform vec3 F0;
    uniform float PI;
    uniform float R2;


    vec3 
    getN()
    {
      return normalize(fragNormal);
    }
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
    vec3 
    getSpecular()
    {
      return vec3(1.0);
    }
    float 
    getShininess()
    {
      return shininess;
    }
    float 
    getK_s()
    {
      return K_s;
    }

    vec3
    getTexelRGB()
    {
        return texture(tex, fragUV).rgb;
    }


    void main () 
    {
      vec3 N = getN();
      vec3 L = getL();
      vec3 V = getV();
      vec3 H = getH(L, V);
      vec3 spec = getSpecular();
      float shine = getShininess();
      float Ks = getK_s();
      vec3 texel = getTexelRGB();
      outColor = vec4(texel, 1.0);
    }`}
)}

function _skyboxShader(){return(
{
  vs: `#version 300 es
    precision mediump float;

    in vec2 position;
    out vec4 fragmentDirection;
    uniform mat4 invViewProjectionMatrix;
    vec4 
    getSkyboxDirection()
    {
      return invViewProjectionMatrix*vec4(position, 1.0, 1.0);
    }
    vec4 
    getSkyboxPosition()
    {
      return vec4(position, 1.0, 1.0);
    }
    void main () 
    {
      fragmentDirection = getSkyboxDirection();
      gl_Position = getSkyboxPosition();
    }`,
  fs: `#version 300 es
    precision mediump float;

    in vec4 fragmentDirection;
    out vec4 outColor;
    uniform samplerCube cubemap;
    
    vec4
    getTextureColor()
    {
      return vec4(texture(cubemap, normalize(fragmentDirection.xyz / fragmentDirection.w)).rgb, 1.0); 
    } 
    void main () 
    {
        outColor = getTextureColor();
    }`}
)}

function _reflectiveTextureShader(){return(
{
  vs: `#version 300 es
    precision mediump float;

    in vec3 position;
    in vec3 normal;
    in vec2 uv;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec3 fragNormal;
    out vec3 fragPosition;
    out vec2 fragUV;

    void main () 
    {
      fragUV = uv;
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
    in vec2 fragUV;
    uniform sampler2D tex;
    uniform vec4 light;
    uniform vec3 eyePosition;
    uniform samplerCube cubemap;
    uniform vec3 materialColor;
    uniform float ambientIntensity;
    uniform vec3 specularColor;
    uniform float shininess;    
    uniform float K_s;
    uniform vec3 F0;
    uniform float PI;
    uniform float R2;
    uniform float mixture;


    vec3 
    getN()
    {
      return normalize(fragNormal);
    }
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



    vec3 
    getSpecular()
    {
      return vec3(1.0);
    }
    float 
    getShininess()
    {
      return 5.0f;
    }
    float 
    getK_s()
    {
      return 0.3f;
    }

    vec3
    getTexelRGB()
    {
        return texture(tex, fragUV).rgb;
    }
    vec3 
    getR(vec3 V, vec3 N)
    {
      return reflect(-V, N);
    }

    vec3 
    getReflectedTextureColor(vec3 R)
    {
      return texture(cubemap, normalize(R)).rgb;
    }

    void main () 
    {
      vec3 N = getN();
      vec3 L = getL();
      vec3 V = getV();
      vec3 R = getR(V, N);


      float Ks = getK_s();

    
      vec3 texel = getTexelRGB(); // material
      vec3 reflectedColor = getReflectedTextureColor(R); // specular
      vec3 color = mix(texel, reflectedColor, mixture); // simulate more of a passive blend on slider.
      outColor = vec4(color, 1.0);
    }`}
)}

function _capture(FileAttachment){return(
FileAttachment("Capture.PNG").image()
)}

function _36(md){return(
md`##### Somewhat confused about source image and given instructions. 
##### These explicitly do not factor texture color.

##### "mix" is included to simulate between desired instructions and what looks to be desired visual effect`
)}

function _shaders(compile,ErrorDiffuse,diffuseShader,ErrorSpecular,PBRShader,ErrorDiffuseSpecularAmbient,diffuseSpecularAmbientShader,ErrorTextureShader,textureShader,ErrorSkyBoxShader,skyboxShader,ErrorReflectiveShader,reflectiveTextureShader){return(
[compile(ErrorDiffuse, diffuseShader),
          compile(ErrorSpecular, PBRShader),
          compile(ErrorDiffuseSpecularAmbient, diffuseSpecularAmbientShader),
          compile(ErrorTextureShader, textureShader),
          compile(ErrorSkyBoxShader, skyboxShader),
          compile(ErrorReflectiveShader, reflectiveTextureShader)
          ]
)}

function _38(md){return(
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
    normal: { numComponents: 3, data: d.sc.normals },
    uv: {numComponents: 2, data: d.sc.uvs}
    
  }))
  .map((vertexAttributes) =>
    twgl.createBufferInfoFromArrays(gl, vertexAttributes)
  )
}
)}

function _makeLinearTexture(twgl,gl){return(
(url) =>
{
  return twgl.createTexture(gl, {
      src: url,
      flipY: true,
      min: gl.LINEAR_MIPMAP_LINEAR,
      max: gl.LINEAR
    })
}
)}

function _makeCubeTexture(twgl,gl){return(
(cubeUrlData) =>
{
  return twgl.createTexture(gl, {
  target: gl.TEXTURE_CUBE_MAP,
  src: [cubeUrlData.squareData[0],cubeUrlData.squareData[1],cubeUrlData.squareData[2],cubeUrlData.squareData[3],cubeUrlData.squareData[4],cubeUrlData.squareData[5]],//imageURLs,
  flipY: false,
  min: gl.LINEAR_MIPMAP_LINEAR
}) 
}
)}

function _makeTWGLQuad(twgl,gl){return(
() => 
{
  // Creating a quad taken from Alexis Benamira's Lecture 14 Notebook.
  return twgl.createBufferInfoFromArrays(gl, {position: {numComponents: 2, data: [-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1]}}); 
}
)}

function _generateVertexAttributesArray(){return(
(modelObjData) =>
{
  // maps one system to another to fit our desired data format.
  return modelObjData.map((d) => ({position: { numComponents: 3, data: d.sc.positions }, normal: { numComponents: 3, data: d.sc.normals }, uv:{numComponents: 2, data: d.sc.uvs } }));
}
)}

function _makeBufferInfo(twgl,gl){return(
(vertexAttributes) =>
{
  return vertexAttributes.map((d) =>
  twgl.createBufferInfoFromArrays(gl, d)
); 
}
)}

function _48(md){return(
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

function _54(md){return(
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

function _getProjectionMatrx(m4,deg2Rad,viewData,gl){return(
() =>
{
   return m4.perspective(deg2Rad(viewData.fov), gl.canvas.width / gl.canvas.height, 0.1, 2.5);
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

function _65(md){return(
md`## Model Loading`
)}

function _StormTrooperUrl(FileAttachment){return(
FileAttachment("stormtrooper.dae").url()
)}

function _DragonURL(FileAttachment){return(
FileAttachment("Mesh008.obj").url()
)}

function _stormtrooper_diffuse_URL(FileAttachment){return(
FileAttachment("Stormtrooper_D.jpg").url()
)}

function _StarData(star_posx,star_negx,star_posy,star_negy,star_posz,star_negz){return(
{
  squareData:[star_posx, star_negx, star_posy, star_negy, star_posz, star_negz]
}
)}

function _FieldData(field_posx,field_negx,field_posy,field_negy,field_posz,field_negz){return(
{
  squareData:[field_posx, field_negx, field_posy, field_negy, field_posz, field_negz]
}
)}

function _LagoonData(lg_posx,lg_negx,lg_posy,lg_negy,lg_posz,lg_negz){return(
{
  squareData:[lg_posx, lg_negx, lg_posy, lg_negy, lg_posz, lg_negz]
}
)}

async function _star_posx(getImageData,FileAttachment){return(
getImageData(await FileAttachment("posx.png").blob())
)}

async function _star_negx(getImageData,FileAttachment){return(
getImageData(await FileAttachment("negx.png").blob())
)}

async function _star_posy(getImageData,FileAttachment){return(
getImageData(await FileAttachment("posy.png").blob())
)}

async function _star_negy(getImageData,FileAttachment){return(
getImageData(await FileAttachment("negy.png").blob())
)}

async function _star_posz(getImageData,FileAttachment){return(
getImageData(await FileAttachment("posz.png").blob())
)}

async function _star_negz(getImageData,FileAttachment){return(
getImageData(await FileAttachment("negz.png").blob())
)}

async function _field_posx(getImageData,FileAttachment){return(
getImageData(await FileAttachment("field_posx.jpg").blob())
)}

async function _field_negx(getImageData,FileAttachment){return(
getImageData(await FileAttachment("field_negx.jpg").blob())
)}

async function _field_posy(getImageData,FileAttachment){return(
getImageData(await FileAttachment("field_posy.jpg").blob())
)}

async function _field_negy(getImageData,FileAttachment){return(
getImageData(await FileAttachment("field_negy.jpg").blob())
)}

async function _field_posz(getImageData,FileAttachment){return(
getImageData(await FileAttachment("field_posz.jpg").blob())
)}

async function _field_negz(getImageData,FileAttachment){return(
getImageData(await FileAttachment("field_negz.jpg").blob())
)}

async function _lg_posx(getImageData,FileAttachment){return(
getImageData(await FileAttachment("lg_posx.png").blob())
)}

async function _lg_negx(getImageData,FileAttachment){return(
getImageData(await FileAttachment("lg_negx.png").blob())
)}

async function _lg_posy(getImageData,FileAttachment){return(
getImageData(await FileAttachment("lg_posy.png").blob())
)}

async function _lg_negy(getImageData,FileAttachment){return(
getImageData(await FileAttachment("lg_negy.png").blob())
)}

async function _lg_posz(getImageData,FileAttachment){return(
getImageData(await FileAttachment("lg_posz.png").blob())
)}

async function _lg_negz(getImageData,FileAttachment){return(
getImageData(await FileAttachment("lg_negz.png").blob())
)}

function _DragonObj(loadModelFromURL,DragonURL){return(
loadModelFromURL(DragonURL , "obj")
)}

function _StormTrooperObj(loadModelFromURL,StormTrooperUrl){return(
loadModelFromURL(StormTrooperUrl , "collada")
)}

function _modelInUse(StormTrooperObj){return(
StormTrooperObj
)}

function _attributes(modelInUse){return(
{
    position: { numComponents: 3, data: modelInUse[0].sc.positions },
    normal: { numComponents: 3, data: modelInUse[0].sc.normals },
    uv: { numComponents: 2, data: modelInUse[0].sc.uvs }
  }
)}

function _extents(computeModelExtent,modelInUse){return(
computeModelExtent(modelInUse)
)}

function _texture(makeLinearTexture,stormtrooper_diffuse_URL){return(
makeLinearTexture(stormtrooper_diffuse_URL)
)}

function _buffer(twgl,gl,attributes){return(
twgl.createBufferInfoFromArrays(gl, attributes)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Mesh008.obj", {url: new URL("./files/52252884443a5d2de9a34e8190cff62a03a83f0dc90771a826f8f68db255343ac005a80b872f46ed17748ddb3cb681e0b238d04d50d962abb6dc866d5ea98c16.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["stormtrooper.dae", {url: new URL("./files/44c84a97d4f6f4f65bdd7e1829fcf4f4376875ab6910a7657f73a80b53c54d0342311453c00ff5e56d9bae58a56ff6a56459f0585582f038864abf0d4f2af3cf.xml", import.meta.url), mimeType: "application/xml", toString}],
    ["Stormtrooper_D.jpg", {url: new URL("./files/fee8bc54b11052314146aef6718c657ededb811e3d5a216d7b263e95491cfe0d7de03d7762ab2ce3c272aa2fce836e57b8378cd945ee59162098564856863549.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["negx.png", {url: new URL("./files/aa4e39743d2e0ca7d30913f65cfca1d741ec661874d931ce9c3656719889fb66298ada6d1de0af3400ff9f3d6db2c9966f904aad199b84024a4078f6b5914ed3.png", import.meta.url), mimeType: "image/png", toString}],
    ["negy.png", {url: new URL("./files/04d44e153a98fff4cfecde99ccfb45ba748c80ef5c508212456d260fb68cb91c9cfca3c13cd09ac94826a6744c1f06cd8ca564db93cadab1652669c48a923682.png", import.meta.url), mimeType: "image/png", toString}],
    ["negz.png", {url: new URL("./files/14849959111d2ad76ea210b0d28dbaf0c81bdb55b210b45234065ca89b962d20c8cc39e7d5c15dd3bce440075ab90ab7657d044a7095473126250dc193bf7895.png", import.meta.url), mimeType: "image/png", toString}],
    ["posz.png", {url: new URL("./files/9528469bfd466d785f7bdc4a770822ca1b6e0080af951a51113cd35db19fcdb65647337b476f26b98ef47d8da586d04d971507417caf30be9981e4734728bf4d.png", import.meta.url), mimeType: "image/png", toString}],
    ["posx.png", {url: new URL("./files/59b4a93d6c77f72d713116043f673e37f1e7831f307234dfb2c79ab90b3c9b1d658007fe23437f1c571a2b867a4cec118f9c59720e1b5c2b986926005432f791.png", import.meta.url), mimeType: "image/png", toString}],
    ["posy.png", {url: new URL("./files/63e550a210de28ffcc2573e4f0cf8665253b0532ace1c22c9f609c850d030c1ddb219694ca3cb0611de3657181bd5cb8d4e811947a2b0614bade6aebb39e8615.png", import.meta.url), mimeType: "image/png", toString}],
    ["field_posx.jpg", {url: new URL("./files/eda5ffb7fc48368067ebff8d35b9c00cb84fa7cf60e47b06dd409eaf990da62ca1030017e446836dce634b03abb773cd72624b5f5ddb1ecc5b39ca584f0f952f.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["field_negx.jpg", {url: new URL("./files/c082e84fa6337044f59feb780721f03ea34e70b92cd37b60350b9b701ecba7689c14a37e3512b011b5f6dbbd171cf37046388a888c2e6372fe2dd404d7f92237.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["field_posy.jpg", {url: new URL("./files/37b58a33e5c25e9fc6cb3079b1d62130158a9d28e9226a14419ca71bc2d69ab7d39b9fdf433e3eefe93614a3fee5718ebd37ace1ad5e83da39d0a9e5f651051e.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["field_negy.jpg", {url: new URL("./files/7ac0f48d4e07610c0f62cfbeb784a72a5b895aa2ff169ca3ac4bfb50c37acdb68152fce9f4b9cb4e6a4e89f9054be88548f8453a7a9c0e4e8078d0ce8da74841.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["field_posz.jpg", {url: new URL("./files/ab703e779c328d112f669508e19e6a301a2a0bafe84877cc558248914c7dde8efde6f1ee9319f12e084800d2f868ca3bb6f72f3af89d60af9f25c1a4b85d05c3.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["field_negz.jpg", {url: new URL("./files/00383a1deca523b064804dad7db3c836675b3a1b17cfcec60644c9a82cb653d871bd503511a3bea0a3a79038b76268414eb16d4f48b5f217ecaeb13c3f2576b2.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["Capture.PNG", {url: new URL("./files/2f2a40a4863f62ca3789e26df990fd6b18a6a10d87f7a45b0bc35ea937b102f21772cf4ec18d819937180a295d65cf710a23bb64b8f8f2a3321018c9da538f9b.png", import.meta.url), mimeType: "image/png", toString}],
    ["lg_posx.png", {url: new URL("./files/4c27ec309e4f8a148f52961e29bf830f24bcc5f7813f6f2bd70a22343132a048d8eb49517d2b7420c861ace0173ea3895c83a15b721f2ce198c9c09173fb3a68.png", import.meta.url), mimeType: "image/png", toString}],
    ["lg_negx.png", {url: new URL("./files/1d16b77017f18f70c56d9cb076484f36009a835ff88e049e0066e7810e68b7b2d9f6ec6f741d81a611ed27f91b7f2c445bce8e897ba84b0094f835e3b3068ed2.png", import.meta.url), mimeType: "image/png", toString}],
    ["lg_posy.png", {url: new URL("./files/567207e8a944900087f41f4844795fdbc9b79aacc03463741ba211fc2de433fa0ec6cc65d6cacf6e707c7b62a68bc146a87dfb61ffd0de5da55b713f86804726.png", import.meta.url), mimeType: "image/png", toString}],
    ["lg_negy.png", {url: new URL("./files/4f73049b5a006e06df14da93c06d157ed7841e12172edca69d4b6eb83cd82d4525de153f1e6ad690133a0bb7500f8b5270b9e965dfa28ce1e1b82f69ef11af64.png", import.meta.url), mimeType: "image/png", toString}],
    ["lg_posz.png", {url: new URL("./files/5b58c2f2f4d431cec7c07dc374e7aaf8198f10dde9ec526b7555cb9a43325a12684fb676afdf637f559e61848f9c6aa556721a9ad5839026b55ded81cadd1c9c.png", import.meta.url), mimeType: "image/png", toString}],
    ["lg_negz.png", {url: new URL("./files/954d5590af5561e3b3ee0d0c65ffba143516015aca22a507d45f0dfe1f43df7b3eaf6992d26ec974ffacf3d1cc8cd4ba6b96e6acde32e1e93d62b53a4c4f3db9.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof transformModel")).define("viewof transformModel", ["columns","slider"], _transformModel);
  main.variable(observer("transformModel")).define("transformModel", ["Generators", "viewof transformModel"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("viewof mixture")).define("viewof mixture", ["slider"], _mixture);
  main.variable(observer("mixture")).define("mixture", ["Generators", "viewof mixture"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("viewof viewData")).define("viewof viewData", ["columns","slider"], _viewData);
  main.variable(observer("viewData")).define("viewData", ["Generators", "viewof viewData"], (G, _) => G.input(_));
  main.variable(observer("viewof shaderChoice")).define("viewof shaderChoice", ["ChoiceSystem"], _shaderChoice);
  main.variable(observer("shaderChoice")).define("shaderChoice", ["Generators", "viewof shaderChoice"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("viewof textureChoice")).define("viewof textureChoice", ["Inputs","StarData","FieldData","LagoonData"], _textureChoice);
  main.variable(observer("textureChoice")).define("textureChoice", ["Generators", "viewof textureChoice"], (G, _) => G.input(_));
  main.variable(observer()).define(["gl","runRender"], _13);
  main.variable(observer("runRender")).define("runRender", ["gl","shaders","CubeTextureData","inverseProjectionMatrix","twgl","quad","shaderChoice","getProjectionMatrx","getViewMatrix","m4","transformModel","getModelMatrix","texture","mixture","buffer"], _runRender);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("CubeTextureData")).define("CubeTextureData", ["makeCubeTexture","textureChoice"], _CubeTextureData);
  main.variable(observer("quad")).define("quad", ["makeTWGLQuad"], _quad);
  main.variable(observer("inverseProjectionMatrix")).define("inverseProjectionMatrix", ["m4","deg2Rad","viewData","gl"], _inverseProjectionMatrix);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("ErrorDiffuse")).define("ErrorDiffuse", ["errorBlockMaker"], _ErrorDiffuse);
  main.variable(observer("ErrorSpecular")).define("ErrorSpecular", ["errorBlockMaker"], _ErrorSpecular);
  main.variable(observer("ErrorDiffuseSpecularAmbient")).define("ErrorDiffuseSpecularAmbient", ["errorBlockMaker"], _ErrorDiffuseSpecularAmbient);
  main.variable(observer("ErrorTextureShader")).define("ErrorTextureShader", ["errorBlockMaker"], _ErrorTextureShader);
  main.variable(observer("ErrorSkyBoxShader")).define("ErrorSkyBoxShader", ["errorBlockMaker"], _ErrorSkyBoxShader);
  main.variable(observer("ErrorReflectiveShader")).define("ErrorReflectiveShader", ["errorBlockMaker"], _ErrorReflectiveShader);
  main.variable(observer("diffuseShader")).define("diffuseShader", _diffuseShader);
  main.variable(observer("SpecularShader")).define("SpecularShader", _SpecularShader);
  main.variable(observer("diffuseSpecularAmbientShader")).define("diffuseSpecularAmbientShader", _diffuseSpecularAmbientShader);
  main.variable(observer("PBRShader")).define("PBRShader", _PBRShader);
  main.variable(observer("textureShader")).define("textureShader", _textureShader);
  main.variable(observer("skyboxShader")).define("skyboxShader", _skyboxShader);
  main.variable(observer("reflectiveTextureShader")).define("reflectiveTextureShader", _reflectiveTextureShader);
  main.variable(observer("capture")).define("capture", ["FileAttachment"], _capture);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer("shaders")).define("shaders", ["compile","ErrorDiffuse","diffuseShader","ErrorSpecular","PBRShader","ErrorDiffuseSpecularAmbient","diffuseSpecularAmbientShader","ErrorTextureShader","textureShader","ErrorSkyBoxShader","skyboxShader","ErrorReflectiveShader","reflectiveTextureShader"], _shaders);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer("gl")).define("gl", ["DOM"], _gl);
  main.variable(observer("compile")).define("compile", ["twgl","gl"], _compile);
  main.variable(observer("mapObjToBuffer")).define("mapObjToBuffer", ["twgl","gl"], _mapObjToBuffer);
  main.variable(observer("makeLinearTexture")).define("makeLinearTexture", ["twgl","gl"], _makeLinearTexture);
  main.variable(observer("makeCubeTexture")).define("makeCubeTexture", ["twgl","gl"], _makeCubeTexture);
  main.variable(observer("makeTWGLQuad")).define("makeTWGLQuad", ["twgl","gl"], _makeTWGLQuad);
  main.variable(observer("generateVertexAttributesArray")).define("generateVertexAttributesArray", _generateVertexAttributesArray);
  main.variable(observer("makeBufferInfo")).define("makeBufferInfo", ["twgl","gl"], _makeBufferInfo);
  main.variable(observer()).define(["md"], _48);
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
  main.variable(observer()).define(["md"], _54);
  main.variable(observer("rgb2hex")).define("rgb2hex", _rgb2hex);
  main.variable(observer("getViewMatrix")).define("getViewMatrix", ["v3","extents","deg2Rad","viewData","m4"], _getViewMatrix);
  main.variable(observer("getProjectionMatrx")).define("getProjectionMatrx", ["m4","deg2Rad","viewData","gl"], _getProjectionMatrx);
  main.variable(observer("getModelMatrix")).define("getModelMatrix", ["v3","deg2Rad","m4"], _getModelMatrix);
  const child4 = runtime.module(define4);
  main.import("hex2rgb", child4);
  main.variable(observer("deg2Rad")).define("deg2Rad", _deg2Rad);
  main.variable(observer("rad2Deg")).define("rad2Deg", _rad2Deg);
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], _glMatrix);
  main.variable(observer("m4")).define("m4", ["twgl"], _m4);
  main.variable(observer("v3")).define("v3", ["twgl"], _v3);
  main.variable(observer()).define(["md"], _65);
  const child5 = runtime.module(define5);
  main.import("getImageData", child5);
  const child6 = runtime.module(define6);
  main.import("loadModelFromURL", child6);
  main.import("computeModelExtent", child6);
  const child7 = runtime.module(define7);
  main.import("raymanObj", child7);
  main.import("teapotObj", child7);
  main.import("boyObj", child7);
  main.import("windmillObj", child7);
  main.import("houseObj", child7);
  main.variable(observer("StormTrooperUrl")).define("StormTrooperUrl", ["FileAttachment"], _StormTrooperUrl);
  main.variable(observer("DragonURL")).define("DragonURL", ["FileAttachment"], _DragonURL);
  main.variable(observer("stormtrooper_diffuse_URL")).define("stormtrooper_diffuse_URL", ["FileAttachment"], _stormtrooper_diffuse_URL);
  main.variable(observer("StarData")).define("StarData", ["star_posx","star_negx","star_posy","star_negy","star_posz","star_negz"], _StarData);
  main.variable(observer("FieldData")).define("FieldData", ["field_posx","field_negx","field_posy","field_negy","field_posz","field_negz"], _FieldData);
  main.variable(observer("LagoonData")).define("LagoonData", ["lg_posx","lg_negx","lg_posy","lg_negy","lg_posz","lg_negz"], _LagoonData);
  main.variable(observer("star_posx")).define("star_posx", ["getImageData","FileAttachment"], _star_posx);
  main.variable(observer("star_negx")).define("star_negx", ["getImageData","FileAttachment"], _star_negx);
  main.variable(observer("star_posy")).define("star_posy", ["getImageData","FileAttachment"], _star_posy);
  main.variable(observer("star_negy")).define("star_negy", ["getImageData","FileAttachment"], _star_negy);
  main.variable(observer("star_posz")).define("star_posz", ["getImageData","FileAttachment"], _star_posz);
  main.variable(observer("star_negz")).define("star_negz", ["getImageData","FileAttachment"], _star_negz);
  main.variable(observer("field_posx")).define("field_posx", ["getImageData","FileAttachment"], _field_posx);
  main.variable(observer("field_negx")).define("field_negx", ["getImageData","FileAttachment"], _field_negx);
  main.variable(observer("field_posy")).define("field_posy", ["getImageData","FileAttachment"], _field_posy);
  main.variable(observer("field_negy")).define("field_negy", ["getImageData","FileAttachment"], _field_negy);
  main.variable(observer("field_posz")).define("field_posz", ["getImageData","FileAttachment"], _field_posz);
  main.variable(observer("field_negz")).define("field_negz", ["getImageData","FileAttachment"], _field_negz);
  main.variable(observer("lg_posx")).define("lg_posx", ["getImageData","FileAttachment"], _lg_posx);
  main.variable(observer("lg_negx")).define("lg_negx", ["getImageData","FileAttachment"], _lg_negx);
  main.variable(observer("lg_posy")).define("lg_posy", ["getImageData","FileAttachment"], _lg_posy);
  main.variable(observer("lg_negy")).define("lg_negy", ["getImageData","FileAttachment"], _lg_negy);
  main.variable(observer("lg_posz")).define("lg_posz", ["getImageData","FileAttachment"], _lg_posz);
  main.variable(observer("lg_negz")).define("lg_negz", ["getImageData","FileAttachment"], _lg_negz);
  main.variable(observer("DragonObj")).define("DragonObj", ["loadModelFromURL","DragonURL"], _DragonObj);
  main.variable(observer("StormTrooperObj")).define("StormTrooperObj", ["loadModelFromURL","StormTrooperUrl"], _StormTrooperObj);
  main.variable(observer("modelInUse")).define("modelInUse", ["StormTrooperObj"], _modelInUse);
  main.variable(observer("attributes")).define("attributes", ["modelInUse"], _attributes);
  main.variable(observer("extents")).define("extents", ["computeModelExtent","modelInUse"], _extents);
  main.variable(observer("texture")).define("texture", ["makeLinearTexture","stormtrooper_diffuse_URL"], _texture);
  main.variable(observer("buffer")).define("buffer", ["twgl","gl","attributes"], _buffer);
  return main;
}

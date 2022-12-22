import define1 from "./1b675294aba5f9ea@583.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./9d0fa713ea129540@422.js";

function _1(md){return(
md`# Assignment 2: David Labiakh-True`
)}

function _color(colorInput){return(
colorInput()
)}

function _color_rgb(hex2rgb,color){return(
hex2rgb(color)
)}

function _4(DOM,color_rgb)
{
    const myCanvas = DOM.canvas(256, 256);
    const gl = myCanvas.getContext("webgl2");
    gl.clearColor(...color_rgb, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    return myCanvas;
}


function _5(md){return(
md`### Teapot`
)}

function _modelObject(loadModelFromURL,modelURL){return(
loadModelFromURL(modelURL, "obj")
)}

function _modelURL(FileAttachment){return(
FileAttachment("teapot.obj").url()
)}

function _modelExtents(getExtents,modelObject){return(
getExtents(modelObject)
)}

function _vertexAttributes(GetVertexAttributes,modelObject){return(
GetVertexAttributes(modelObject)
)}

function _10(md){return(
md`### External Libraries and Imports`
)}

function _twgl(require){return(
require("twgl.js")
)}

function _15(md){return(
md`### Student Defined Functions`
)}

function _getExtents(MakeExtentObject){return(
(modelObject) =>
{
  let lengObject = modelObject.length;
 // get reference for readability
  var offset = 0;
  let ExtentArray = Array();
  
  for (let index = 0; index < lengObject; ++index) 
  {
      if((modelObject.at(index).sc.positions.length <= 0))
      {
        continue; // improper size
      }
      let positionArray = modelObject.at(index).sc.positions; // set reference;
      let extent = MakeExtentObject(); // format new object
      for (let indexOfArray = 0; indexOfArray < positionArray.length; ++indexOfArray) 
      {
          offset = indexOfArray % 3; // check offset
          if (positionArray[indexOfArray] < extent.min[offset])
          {
            // if it's less than
            extent.min[offset] = positionArray[indexOfArray];
          } 
          if (positionArray[indexOfArray] > extent.max[offset]) 
          {
            // then it might be greater than
            extent.max[offset] = positionArray[indexOfArray];
          }
      }
     ExtentArray.push(extent);
  }
  return ExtentArray;
}
)}

function _GetVertexAttributes(MakeVertexAtttributeObject){return(
(objData) => 
{
    let lengObject = objData.length; // get length of object data slots
    var attribArray = Array(); // initialize array
    for (let index = 0; index < lengObject; ++index) 
    {
       let scene = objData.at(index).sc; // get current scene processed
       if(scene.positions.length <= 0)
       {
         continue;  // bad length
       }
       let attriObject = MakeVertexAtttributeObject(scene.positions.length, scene.normals.length); // format object 
       attriObject.position.data = scene.positions.slice(); // INTENTIONAL COPY
       attriObject.normal.data = scene.normals.slice(); // INTENTIONAL COPY
       attribArray.push(attriObject); // load to array
    }
  return attribArray;

}
)}

function _MakeExtentObject(){return(
() => 
{
  return Object({ min: Array(3).fill(Number.MAX_VALUE), max: Array(3).fill(Number.MIN_VALUE) }); // preformat extend object and 0 it out
}
)}

function _MakeVertexAtttributeObject(){return(
(totalPosition, totalNormal) => 
{
    return Object
    (
      {
        position:{numComponents:3, data: new Float32Array(totalPosition)},
        normal:{numComponents:3, data: new Float32Array(totalNormal)}
      }
    ); // preformat vertex attribute object with dynamic size allocation
}
)}

function _20(md){return(
md`### File Attachments`
)}

function _teapot(FileAttachment){return(
FileAttachment("teapot.obj")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["teapot.obj", {url: new URL("./files/d1652511080b6593a3eb5e9ce6dc9aa886a65015ba49b361ea5583e91aa9ffe76b822c494cee5f6f0bfefba9ff76ce8f55e9fbf170f816e02707f9edeccf96e0.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof color")).define("viewof color", ["colorInput"], _color);
  main.variable(observer("color")).define("color", ["Generators", "viewof color"], (G, _) => G.input(_));
  main.variable(observer("color_rgb")).define("color_rgb", ["hex2rgb","color"], _color_rgb);
  main.variable(observer()).define(["DOM","color_rgb"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("modelObject")).define("modelObject", ["loadModelFromURL","modelURL"], _modelObject);
  main.variable(observer("modelURL")).define("modelURL", ["FileAttachment"], _modelURL);
  main.variable(observer("modelExtents")).define("modelExtents", ["getExtents","modelObject"], _modelExtents);
  main.variable(observer("vertexAttributes")).define("vertexAttributes", ["GetVertexAttributes","modelObject"], _vertexAttributes);
  main.variable(observer()).define(["md"], _10);
  const child1 = runtime.module(define1);
  main.import("hex2rgb", child1);
  const child2 = runtime.module(define2);
  main.import("color", "colorInput", child2);
  const child3 = runtime.module(define3);
  main.import("loadModelFromURL", child3);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("getExtents")).define("getExtents", ["MakeExtentObject"], _getExtents);
  main.variable(observer("GetVertexAttributes")).define("GetVertexAttributes", ["MakeVertexAtttributeObject"], _GetVertexAttributes);
  main.variable(observer("MakeExtentObject")).define("MakeExtentObject", _MakeExtentObject);
  main.variable(observer("MakeVertexAtttributeObject")).define("MakeVertexAtttributeObject", _MakeVertexAtttributeObject);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("teapot")).define("teapot", ["FileAttachment"], _teapot);
  return main;
}

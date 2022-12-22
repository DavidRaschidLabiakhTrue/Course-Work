function _1(md){return(
md`
# Assignment 1: David Labiakh-True`
)}

function _2(md){return(
md`## Part 1`
)}

function _angle(){return(
65
)}

function _deg2Rad(){return(
function(angleInDegrees)
{
  return angleInDegrees * (Math.PI / 180);
}
)}

function _angleRadian(deg2Rad,angle){return(
deg2Rad(angle)
)}

function _cosAngle(angleRadian){return(
Math.cos(angleRadian)
)}

function _sinAngle(angleRadian){return(
Math.sin(angleRadian)
)}

function _8(md,angle,sinAngle,cosAngle){return(
md`sin(${ angle }) is ${ sinAngle.toFixed(3) } and cos(${ angle }) is ${ cosAngle.toFixed(3) }`
)}

function _9(md){return(
md`## Part 2`
)}

function _p1(){return(
Object ({x: 2, y: 3})
)}

function _p2(){return(
Object ({x: 5, y: 7})
)}

function _distance2DPoints(){return(
function(point1, point2)
{
  return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
}
)}

function _distanceP1P2(distance2DPoints,p1,p2){return(
distance2DPoints(p1, p2)
)}

function _14(md,distanceP1P2){return(
md`Distance between p1 and p2 is ${ distanceP1P2 }`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("angle")).define("angle", _angle);
  main.variable(observer("deg2Rad")).define("deg2Rad", _deg2Rad);
  main.variable(observer("angleRadian")).define("angleRadian", ["deg2Rad","angle"], _angleRadian);
  main.variable(observer("cosAngle")).define("cosAngle", ["angleRadian"], _cosAngle);
  main.variable(observer("sinAngle")).define("sinAngle", ["angleRadian"], _sinAngle);
  main.variable(observer()).define(["md","angle","sinAngle","cosAngle"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("p1")).define("p1", _p1);
  main.variable(observer("p2")).define("p2", _p2);
  main.variable(observer("distance2DPoints")).define("distance2DPoints", _distance2DPoints);
  main.variable(observer("distanceP1P2")).define("distanceP1P2", ["distance2DPoints","p1","p2"], _distanceP1P2);
  main.variable(observer()).define(["md","distanceP1P2"], _14);
  return main;
}

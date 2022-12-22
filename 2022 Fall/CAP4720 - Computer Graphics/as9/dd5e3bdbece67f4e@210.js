import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Utils`
)}

function _corsFetch(){return(
url => fetch(`https://cors-anywhere.herokuapp.com/${url}`)
)}

function _fetchProgress(viewofProgressBar){return(
(url, init, max, title) => {
  const { bar, set, dispatch } = viewofProgressBar(title, max);
  fetch(url, init).then(async response => {
    const reader = response.body && response.body.getReader()
    const concat = new Uint8Array(max)
    let length = 0
    while (true) {
      const {done, value} = await reader.read()
      if (done) break;
      concat.set(value, length)
      length += value.length
      set(length)
    }
    dispatch(concat.buffer)
  });
  return bar
}
)}

function _promisify(){return(
fn => (...args) => new Promise((resolve, reject) => {
  fn(...args, (err, data) => err ? reject(err) : resolve(data))
})
)}

function _Logger(DOM,width){return(
() => {
  const container = DOM.element("div");
  const ta = DOM.element("textarea");
  Object.assign(ta.style, {
    width: "100%",
    height: "200px",
    fontFamily: "monospace",
    fontSize: "13px"
  });
  ta.readOnly = true;
  container.appendChild(ta);
  Object.assign(container.style, { width: width + "px" });
  container.value = {
    log: txt => {
      ta.value += txt + "\n";
    },
    reset: () => {
      ta.value = "";
    }
  };
  return container;
}
)}

function _6(md){return(
md`---`
)}

function _createImageBitmap(){return(
window.createImageBitmap ||
  async function(blob) {
    return new Promise((resolve, reject) => {
      let img = document.createElement('img');
      img.addEventListener('load', function() {
        resolve(this);
      });
      img.src = URL.createObjectURL(blob);
    });
  }
)}

function _getImageData(createImageBitmap,DOM){return(
async function(blob) {
  const bitmap = await createImageBitmap(blob);
  const [width, height] = [bitmap.width, bitmap.height];

  // an intermediate "buffer" 2D context is necessary
  const ctx = DOM.context2d(width, height, 1);
  ctx.drawImage(bitmap, 0, 0);

  return ctx.getImageData(0, 0, width, height);
}
)}

function _decodeImage(){return(
(imageData, cb, [stepX, stepY] = [1, 1]) => {
  const { width, height, data } = imageData;
  const [stepIx, stepIy] = [stepX * 4, (stepY - 1) * 4];
  for (let index = 0, j = 0; j < height; j += stepY, index += stepIy)
    for (let i = 0; i < width; i += stepX, index += stepIx)
      cb([i, j], data.slice(index, index + 3));
}
)}

function _resizeImageData(DOM){return(
(imageData, sx, sy, sWidth, sHeight, dWidth, dHeight) => {
  const scontext = DOM.context2d(sWidth + sx, sHeight + sy, 1);
  scontext.putImageData(imageData, 0, 0, sx, sy, sWidth + sx, sHeight + sy);
  const context = DOM.context2d(dWidth, dHeight, 1);
  context.drawImage(
    scontext.canvas,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    dWidth,
    dHeight
  );
  return context.getImageData(0, 0, dWidth, dHeight);
}
)}

function _canvas(DOM){return(
(param1, param2) => {
  const fromDims = dims => [DOM.context2d(...dims, 1), ...dims];
  const fromContext = ctx => [ctx, ctx.canvas.width, ctx.canvas.height];
  const [ctx, width, height] = (param1.canvas ? fromContext : fromDims)(param1);
  const fill = (data, [W, H], color) => {
    for (let j = H - 1, index = 0; j >= 0; j--) {
      for (let i = 0; i < W; i++, index += 4) {
        data.set(color(i, j), index);
        data[index + 3] = 255;
      }
    }
  };
  const imageData = ([W, H], color) => {
    const data = new Uint8ClampedArray(4 * W * H);
    fill(data, [W, H], typeof color == "function" ? color : () => color);
    return new ImageData(data, W, H);
  };
  const data = param2.width ? param2 : imageData([width, height], param2);
  ctx.putImageData(data, 0, 0);
  return ctx.canvas;
}
)}

function _viewofCanvas(DOM){return(
function(W, H) {
  const context = DOM.context2d(W, H, 1);
  const canvas = context.canvas;
  const set = (obj, propname, value) => ((obj[propname] = value), obj);
  const fill = color => set(context, 'fillStyle', color).fillRect(0, 0, W, H);
  const input = () => new CustomEvent("input");
  const dispatch = value => set(canvas, 'value', value).dispatchEvent(input());
  fill("hsl(0,0%,80%)");
  return { context, canvas, dispatch, fill };
}
)}

function _viewofText(DOM){return(
function() {
  const div = DOM.element("div");
  return {
    div,
    dispatch: function(value) {
      div.value = value;
      div.dispatchEvent(new CustomEvent("input"));
    }
  };
}
)}

function _viewofProgressBar(DOM,html){return(
function(title, max = 100, height) {
  const container = DOM.element("div")
  if (height) container.style.height = `${height}px`
  const label = html`<label style="margin-right: 20px">${title}...</label>`
  const progress = html`<progress value="0" max="${max}"/>`
  container.append(label, progress)
  return {
    bar: container,
    set: value => {
      progress.setAttribute('value', value)
      if (value >= max) {
        label.textContent = `${title}: done`
        progress.remove()
      }
    },
    dispatch: function(value) {
      container.value = value
      container.dispatchEvent(new CustomEvent("input"))
    }
  }
}
)}

function _zoomAndPan(){return(
function(element, cb) {
  element.addEventListener("wheel", e => {
    cb(0, 0, e.deltaY);
    e.preventDefault();
  });
  element.addEventListener("mousedown", e => {
    let [x0, y0] = [e.layerX, e.layerY];
    const mm = e => {
      const [x, y] = [e.layerX, e.layerY];
      cb(x - x0, y - y0, 0);
      [x0, y0] = [x, y];
    };
    const mu = e => {
      element.removeEventListener("mousemove", mm);
      element.removeEventListener("mouseup", mu);
      element.removeEventListener("mouseleave", mu);
    };

    element.addEventListener("mousemove", mm);
    element.addEventListener("mouseup", mu);
    element.addEventListener("mouseleave", mu);

    e.preventDefault();
  });
}
)}

function _image2canvas(DOM){return(
(imageData, width) => {
  const context = DOM.context2d(imageData.width, imageData.height, 1);
  context.putImageData(imageData, 0, 0);
  if (!width || imageData.width <= width) return context.canvas;

  const height = (imageData.height * width) / imageData.width;
  const contextr = DOM.context2d(width, height, 1);
  contextr.drawImage(context.canvas, 0, 0, width, height);
  return contextr.canvas;
}
)}

function _rgb2hsl(){return(
([r, g, b]) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max == r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max == g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }

  return [h, s, l];
}
)}

function _rgb2hsv(){return(
([r, g, b]) => {
  const [min, max] = [Math.min(r, g, b), Math.max(r, g, b)];
  let h,
    s,
    v = max;
  const diff = max - min;
  const diffc = c => (max - c) / 6 / diff + 0.5;

  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / max;
    let [rr, gg, bb] = [diffc(r), diffc(g), diffc(b)];

    if (r === max) h = bb - gg;
    else if (g === max) h = 1 / 3 + rr - bb;
    else if (b === max) h = 2 / 3 + gg - rr;

    if (h < 0) h += 1;
    else if (h > 1) h -= 1;
  }
  return [h, s, v];
}
)}

function _colorGradient(){return(
([r, g, b], nb) => {
  const [rf, gf, bf] = [r / nb, g / nb, b / nb];
  return [...Array(nb)]
    .map((_, i) => [(i * rf) | 0, (i * gf) | 0, (i * bf) | 0]);
}
)}

function _interpolateRGB(){return(
([r1, g1, b1], [r2, g2, b2], r) => [
  (r1 + r * (r2 - r1)) | 0,
  (g1 + r * (g2 - g1)) | 0,
  (b1 + r * (b2 - b1)) | 0
]
)}

function _interpolatePalette(interpolateRGB){return(
(palette, color, r) => palette.map(c => interpolateRGB(c, color, r))
)}

function _colorShades(){return(
(rgb, n) =>
  [...Array(n)].map((_, i) => rgb.map(f => ((i * f) / n) | 0))
)}

function _23(md){return(
md`---`
)}

function _separator(html){return(
function() {
  return html`<div style="height: 16px">`
}
)}

function _floor(){return(
function(n, dec) {
  const pow = 10**dec;
  return Math.floor(n*pow)/pow;
}
)}

function _minstRand0(){return(
function(seed) {
  var rndval = seed;
  const mod = 2**31-1;
  return function() {
    rndval = rndval * 16807 % mod;
    return (rndval - 1) / (mod - 1);
  }
}
)}

function _Range(){return(
bounds => {
  let [min, max] = bounds || [+Infinity, -Infinity];
  return {
    bounds: () => [min, max],
    expand: value => {
      [min, max] = [Math.min(min, value), Math.max(max, value)];
      return this;
    },
    constrain: value => Math.max(min, Math.min(max, value))
  };
}
)}

function _MultiRange(Range){return(
dimensions => {
  const ranges = [...Array(dimensions)].map(_ => Range());
  const r = {
    bounds: () => ranges.map(r => r.bounds()),
    expand: (...points) => {
      points.forEach(coords => {
        ranges.forEach((r, i) => {
          r.expand(coords[i]);
        });
      });
      return r;
    },
    constrain: (...points) =>
      points.map(coords => ranges.map((r, i) => r.constrain(coords[i])))
  };
  return r;
}
)}

function _fillArray(){return(
(array, values) => {
  const N = array.length;
  const n = values.length;
  for (let index = 0; index < N; index += n) array.set(values, index);
  return array;
}
)}

function _umod(){return(
(val, mod) => val < 0 ? val-Math.floor(val) : val % mod
)}

function _31(md){return(
md`---`
)}

function _sliders(DOM,slider){return(
function(params, filter) {
  const form = DOM.element('form');
  var value = {};
  for (let name in params) {
    let input = slider(params[name]);
    let div = input.querySelector('div');
    if (div) div.style.marginTop = '10px';
    let update = function() {
      value[name] = input.value;
      form.value = filter ? filter(value) : value;
    };
	input.addEventListener('input', update);
    update();
    form.appendChild(input);
  }
  return form;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("corsFetch")).define("corsFetch", _corsFetch);
  main.variable(observer("fetchProgress")).define("fetchProgress", ["viewofProgressBar"], _fetchProgress);
  main.variable(observer("promisify")).define("promisify", _promisify);
  main.variable(observer("Logger")).define("Logger", ["DOM","width"], _Logger);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("createImageBitmap")).define("createImageBitmap", _createImageBitmap);
  main.variable(observer("getImageData")).define("getImageData", ["createImageBitmap","DOM"], _getImageData);
  main.variable(observer("decodeImage")).define("decodeImage", _decodeImage);
  main.variable(observer("resizeImageData")).define("resizeImageData", ["DOM"], _resizeImageData);
  main.variable(observer("canvas")).define("canvas", ["DOM"], _canvas);
  main.variable(observer("viewofCanvas")).define("viewofCanvas", ["DOM"], _viewofCanvas);
  main.variable(observer("viewofText")).define("viewofText", ["DOM"], _viewofText);
  main.variable(observer("viewofProgressBar")).define("viewofProgressBar", ["DOM","html"], _viewofProgressBar);
  main.variable(observer("zoomAndPan")).define("zoomAndPan", _zoomAndPan);
  main.variable(observer("image2canvas")).define("image2canvas", ["DOM"], _image2canvas);
  main.variable(observer("rgb2hsl")).define("rgb2hsl", _rgb2hsl);
  main.variable(observer("rgb2hsv")).define("rgb2hsv", _rgb2hsv);
  main.variable(observer("colorGradient")).define("colorGradient", _colorGradient);
  main.variable(observer("interpolateRGB")).define("interpolateRGB", _interpolateRGB);
  main.variable(observer("interpolatePalette")).define("interpolatePalette", ["interpolateRGB"], _interpolatePalette);
  main.variable(observer("colorShades")).define("colorShades", _colorShades);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("separator")).define("separator", ["html"], _separator);
  main.variable(observer("floor")).define("floor", _floor);
  main.variable(observer("minstRand0")).define("minstRand0", _minstRand0);
  main.variable(observer("Range")).define("Range", _Range);
  main.variable(observer("MultiRange")).define("MultiRange", ["Range"], _MultiRange);
  main.variable(observer("fillArray")).define("fillArray", _fillArray);
  main.variable(observer("umod")).define("umod", _umod);
  main.variable(observer()).define(["md"], _31);
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.variable(observer("sliders")).define("sliders", ["DOM","slider"], _sliders);
  return main;
}

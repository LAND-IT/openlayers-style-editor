import { fromString } from "ol/color.js";
var AttributeTypeEnum = /* @__PURE__ */ ((AttributeTypeEnum2) => {
  AttributeTypeEnum2[AttributeTypeEnum2["STRING"] = 0] = "STRING";
  AttributeTypeEnum2[AttributeTypeEnum2["INTEGER"] = 1] = "INTEGER";
  AttributeTypeEnum2[AttributeTypeEnum2["FLOAT"] = 2] = "FLOAT";
  AttributeTypeEnum2[AttributeTypeEnum2["BOOLEAN"] = 3] = "BOOLEAN";
  AttributeTypeEnum2[AttributeTypeEnum2["DATE"] = 4] = "DATE";
  AttributeTypeEnum2[AttributeTypeEnum2["JSON"] = 5] = "JSON";
  return AttributeTypeEnum2;
})(AttributeTypeEnum || {});
var RenderType = /* @__PURE__ */ ((RenderType2) => {
  RenderType2["Unique"] = "Unique";
  RenderType2["Categorized"] = "Categorized";
  RenderType2["Graduated"] = "Graduated";
  RenderType2["ByRules"] = "ByRules";
  return RenderType2;
})(RenderType || {});
var GraduatedModes = /* @__PURE__ */ ((GraduatedModes2) => {
  GraduatedModes2["Manual"] = "Manual";
  GraduatedModes2["EqualInterval"] = "EqualInterval";
  GraduatedModes2["DefinedInterval"] = "DefinedInterval";
  GraduatedModes2["Quantile"] = "Quantile";
  GraduatedModes2["NaturalBreaks"] = "NaturalBreaks";
  GraduatedModes2["GeometricInterval"] = "GeometricInterval";
  GraduatedModes2["StandardDeviation"] = "StandardDeviation";
  return GraduatedModes2;
})(GraduatedModes || {});
function getCategorizedStyle(attribute, colors, outlineColor, outlineWidth, defaultColor) {
  let aux = [];
  aux.push("match");
  aux.push(["get", attribute]);
  colors.forEach((color) => {
    aux.push(color.value);
    aux.push(color.color);
  });
  aux.push(defaultColor || fromString("#333333"));
  return {
    "stroke-color": [
      "case",
      ["==", ["var", "highlightedId"], ["id"]],
      "white",
      outlineColor || "#000000"
    ],
    "stroke-width": ["case", ["==", ["var", "highlightedId"], ["id"]], 2, outlineWidth || 1],
    "fill-color": aux
  };
}
function singleColorStyle(color, outlineColor, outlineWidth) {
  return {
    "stroke-color": [
      "case",
      ["==", ["var", "highlightedId"], ["id"]],
      "white",
      outlineColor || "#000000"
    ],
    "stroke-width": ["case", ["==", ["var", "highlightedId"], ["id"]], 2, outlineWidth || 1],
    "stroke-offset": 0,
    "fill-color": color
  };
}
function singleColorStyleForLines(color) {
  return {
    "stroke-color": color,
    "stroke-width": 1,
    "stroke-offset": 0
  };
}
function getGraduatedStyle(attribute, ramp, outlineColor, outlineWidth) {
  let aux = [];
  aux.push("interpolate");
  aux.push(["linear"]);
  aux.push(["get", attribute]);
  ramp.forEach((stop) => {
    aux.push(stop.value);
    aux.push(stop.color);
  });
  return {
    "stroke-color": [
      "case",
      ["==", ["var", "highlightedId"], ["id"]],
      "white",
      outlineColor || "#000000"
    ],
    "stroke-width": ["case", ["==", ["var", "highlightedId"], ["id"]], 2, outlineWidth || 1],
    "fill-color": aux
  };
}
function getRendererOpacity(renderer) {
  if (renderer.type == "Unique")
    return renderer.rendererOL["fill-color"][3] * 100;
  if (renderer.type == "Categorized")
    return renderer.rendererOL["fill-color"][3][3] * 100;
  if (renderer.type == "Graduated")
    return renderer.rendererOL["fill-color"][4][3] * 100;
  return 100;
}
function changeRendererOpacity(renderer, opacity) {
  let newRenderer = renderer;
  if (renderer.type == "Unique") {
    let aux = renderer.rendererOL["fill-color"];
    aux = [...aux];
    aux[3] = opacity / 100;
    newRenderer = { ...renderer };
    newRenderer.rendererOL["fill-color"] = aux;
  }
  if (renderer.type == "Categorized") {
    let aux = renderer.rendererOL["fill-color"].slice(3);
    let newAux = [...aux];
    for (let i = 0; i < aux.length; i += 2) {
      let color = [...aux[i]];
      color[3] = opacity / 100;
      newAux[i] = color;
    }
    console.log(renderer);
    newRenderer = {
      ...renderer,
      rendererOL: {
        ...renderer.rendererOL,
        ["fill-color"]: renderer.rendererOL["fill-color"].slice(0, 3).concat(newAux)
      }
    };
    console.log(newRenderer);
  }
  if (renderer.type == "Graduated") {
    let aux = renderer.rendererOL["fill-color"].slice(4);
    let newAux = [...aux];
    for (let i = 0; i < aux.length; i += 2) {
      let color = [...aux[i]];
      color[3] = opacity / 100;
      newAux[i] = color;
    }
    newRenderer = { ...renderer };
    newRenderer.rendererOL["fill-color"] = renderer.rendererOL["fill-color"].slice(0, 4).concat(newAux);
  }
  return newRenderer;
}
function getStyleColorsAndValues(style, type) {
  let colors = [];
  if (type == "Categorized") {
    for (let i = 2; i < style["fill-color"].length - 1; i += 2) {
      colors.push({
        value: style["fill-color"][i],
        color: style["fill-color"][i + 1]
      });
    }
    colors.push({
      value: "Nulo",
      color: style["fill-color"][style["fill-color"].length - 1]
    });
  }
  if (type == "Graduated") {
    for (let i = 3; i < style["fill-color"].length - 1; i += 2) {
      colors.push({
        value: style["fill-color"][i],
        color: style["fill-color"][i + 1]
      });
    }
    colors.push({
      value: "Nulo",
      color: style["fill-color"][style["fill-color"].length - 1]
    });
  }
  if (type == "Unique")
    colors = [{ value: "Único", color: style["fill-color"] }];
  return colors;
}
function getRendererColorAndSizeStroke(renderer) {
  return {
    color: renderer.rendererOL["stroke-color"][3],
    size: renderer.rendererOL["stroke-width"][3]
  };
}
function generateRandomColor() {
  return fromString("#" + (16777216 + Math.random() * 16777215).toString(16).substr(1, 6));
}
export {
  AttributeTypeEnum,
  GraduatedModes,
  RenderType,
  changeRendererOpacity,
  generateRandomColor,
  getCategorizedStyle,
  getGraduatedStyle,
  getRendererColorAndSizeStroke,
  getRendererOpacity,
  getStyleColorsAndValues,
  singleColorStyle,
  singleColorStyleForLines
};

import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { PrimeReactProvider } from "primereact/api/api.esm.js";
import { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog/dialog.esm.js";
import { asString, fromString } from "ol/color.js";
import { Slider } from "primereact/slider/slider.esm.js";
import ColorPicker from "react-best-gradient-color-picker";
import { useTranslation, initReactI18next, I18nextProvider } from "react-i18next";
import { Button } from "primereact/button/button.esm.js";
import { Dropdown } from "primereact/dropdown/dropdown.esm.js";
import { Checkbox } from "primereact/checkbox/checkbox.esm.js";
import { DataTable } from "primereact/datatable/datatable.esm.js";
import { Column } from "primereact/column/column.esm.js";
import { Chart } from "primereact/chart/chart.esm.js";
import { InputNumber } from "primereact/inputnumber/inputnumber.esm.js";
import { Toast } from "primereact/toast/toast.esm.js";
import { standardDeviationBuckets, quantileBuckets, jenksBuckets } from "geobuckets/dist/src/index.js";
import i18n from "i18next";
const MyColorPicker = (props) => {
  const { color, onChange, hideAlpha } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const selectColor = t("color_picker.select_color");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: { backgroundColor: asString(color) },
        className: "color-picker",
        onClick: () => setVisible(true)
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { header: selectColor, onHide: () => setVisible(false), visible, children: /* @__PURE__ */ jsx(ColorPicker, { value: asString(color), onChange, hideOpacity: hideAlpha, hideControls: true }) })
  ] });
};
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
  let outlineColorCopy = outlineColor ? [...outlineColor] : void 0;
  if (outlineWidth == 0 && outlineColorCopy != void 0)
    outlineColorCopy[3] = 0;
  else if (outlineWidth != void 0 && outlineWidth > 0 && outlineColorCopy)
    outlineColorCopy[3] = 1;
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
      outlineColorCopy || "#000000"
    ],
    "stroke-width": ["case", ["==", ["var", "highlightedId"], ["id"]], 2, outlineWidth == void 0 ? 1 : outlineWidth],
    "fill-color": aux
  };
}
function singleColorStyle(color, outlineColor, outlineWidth) {
  let outlineColorCopy = outlineColor ? [...outlineColor] : void 0;
  if (outlineWidth == 0 && outlineColorCopy != void 0)
    outlineColorCopy[3] = 0;
  else if (outlineWidth != void 0 && outlineWidth > 0 && outlineColorCopy)
    outlineColorCopy[3] = 1;
  return {
    "stroke-color": [
      "case",
      ["==", ["var", "highlightedId"], ["id"]],
      "white",
      outlineColorCopy || "#000000"
    ],
    "stroke-width": ["case", ["==", ["var", "highlightedId"], ["id"]], 2, outlineWidth == void 0 ? 1 : outlineWidth],
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
  let outlineColorCopy = outlineColor ? [...outlineColor] : void 0;
  if (outlineWidth == 0 && outlineColorCopy != void 0)
    outlineColorCopy[3] = 0;
  else if (outlineWidth != void 0 && outlineWidth > 0 && outlineColorCopy)
    outlineColorCopy[3] = 1;
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
      outlineColorCopy || "#000000"
    ],
    "stroke-width": ["case", ["==", ["var", "highlightedId"], ["id"]], 2, outlineWidth == void 0 ? 1 : outlineWidth],
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
    newRenderer = {
      ...renderer,
      rendererOL: {
        ...renderer.rendererOL,
        ["fill-color"]: aux
      }
    };
  }
  if (renderer.type == "Categorized") {
    let aux = renderer.rendererOL["fill-color"].slice(3);
    let newAux = [...aux];
    for (let i = 0; i < aux.length; i += 2) {
      let color = [...aux[i]];
      color[3] = opacity / 100;
      newAux[i] = color;
    }
    newRenderer = {
      ...renderer,
      rendererOL: {
        ...renderer.rendererOL,
        ["fill-color"]: renderer.rendererOL["fill-color"].slice(0, 3).concat(newAux)
      }
    };
  }
  if (renderer.type == "Graduated") {
    let aux = renderer.rendererOL["fill-color"].slice(4);
    let newAux = [...aux];
    for (let i = 0; i < aux.length; i += 2) {
      let color = [...aux[i]];
      color[3] = opacity / 100;
      newAux[i] = color;
    }
    newRenderer = {
      ...renderer,
      rendererOL: {
        ...renderer.rendererOL,
        ["fill-color"]: renderer.rendererOL["fill-color"].slice(0, 4).concat(newAux)
      }
    };
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
const UniqueSymbol = (props) => {
  const { layerCurrentRenderer, applyRenderer, setVisible } = props;
  const { t } = useTranslation();
  const fillColorLabel = t("unique_symbol.fill_color");
  const strokeColorLabel = t("categorized.stroke_color");
  const strokeWidthLabel = t("categorized.stroke_width");
  const concludeLabel = t("common.conclude");
  const start = "#18d7ba";
  const currentStyle = layerCurrentRenderer.field ? null : layerCurrentRenderer.rendererOL;
  const [color, setColor] = useState(currentStyle ? currentStyle["fill-color"] : fromString(start));
  let auxBorder;
  if (currentStyle) {
    if (currentStyle["stroke-color"])
      if (currentStyle["stroke-color"][0] == "case")
        auxBorder = currentStyle["stroke-color"][3];
      else
        auxBorder = currentStyle["stroke-color"];
    else
      auxBorder = fromString("#000000");
  } else {
    auxBorder = fromString("#000000");
  }
  const [borderColor, setBorderColor] = useState(auxBorder);
  let auxBorderWidth;
  if (currentStyle) {
    if (currentStyle["stroke-width"] instanceof Array)
      auxBorderWidth = currentStyle["stroke-width"][3];
    else
      auxBorderWidth = currentStyle["stroke-width"];
  } else {
    auxBorderWidth = 0;
  }
  const [borderThickness, setBorderThickness] = useState(auxBorderWidth);
  function createRenderUnique(color2, outlineColor, outlineWidth) {
    return singleColorStyle(color2, outlineColor, outlineWidth);
  }
  return /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-row-unique", children: [
        /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
          fillColorLabel,
          ":"
        ] }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          MyColorPicker,
          {
            color,
            onChange: (e) => setColor(fromString(e))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-row-unique", children: [
        /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
          strokeColorLabel,
          ":"
        ] }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          MyColorPicker,
          {
            color: (() => {
              if (borderColor.at(3) < 1)
                return [borderColor[0], borderColor[1], borderColor[2], 1];
              return borderColor;
            })(),
            hideAlpha: true,
            onChange: (e) => setBorderColor(fromString(e))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-column-gap-7", children: [
        /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
          strokeWidthLabel,
          ": "
        ] }) }),
        /* @__PURE__ */ jsx(
          Slider,
          {
            max: 10,
            min: 0,
            className: "slider-wrapper",
            value: borderThickness,
            onChange: (e) => setBorderThickness(e.value)
          }
        ),
        /* @__PURE__ */ jsxs("span", { children: [
          borderThickness,
          " px"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "button-wrapper", children: /* @__PURE__ */ jsx(
      Button,
      {
        label: concludeLabel,
        onClick: () => {
          applyRenderer({
            type: RenderType.Unique,
            rendererOL: createRenderUnique(color, borderColor, borderThickness)
          });
          setVisible(false);
        }
      }
    ) })
  ] });
};
function getColorRampString(ramp) {
  let rampString = "linear-gradient(90deg, ";
  ramp.forEach((color, index) => {
    rampString += asString(color.color) + " " + color.offset * 100 + "%";
    if (index < ramp.length - 1) {
      rampString += ", ";
    }
  });
  rampString += ")";
  return rampString;
}
function hexToRgb(hex) {
  return {
    r: hex[0],
    g: hex[1],
    b: hex[2]
  };
}
function rgbToHex({ r, g, b }) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function interpolateColor(color1, color2, factor) {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * factor),
    g: Math.round(color1.g + (color2.g - color1.g) * factor),
    b: Math.round(color1.b + (color2.b - color1.b) * factor)
  };
}
function generateGradient(stops, numberOfSteps) {
  const rgbStops = stops.map(({ color, offset }) => ({
    rgb: hexToRgb(color),
    offset
  }));
  const start = rgbStops[0].offset;
  const end = rgbStops[rgbStops.length - 1].offset;
  const range = end - start;
  const normalizedStops = rgbStops.map((stop) => ({
    ...stop,
    normalizedPosition: (stop.offset - start) / range
  }));
  const result = [];
  const stepIncrement = 1 / (numberOfSteps - 1);
  for (let i = 0; i < numberOfSteps; i++) {
    const stepPosition = i * stepIncrement;
    const lowerStop = normalizedStops.find((stop) => stop.normalizedPosition <= stepPosition);
    const upperStop = normalizedStops.find((stop) => stop.normalizedPosition >= stepPosition);
    if (lowerStop.normalizedPosition === upperStop.normalizedPosition) {
      result.push(rgbToHex(lowerStop.rgb));
    } else {
      const segmentProgress = (stepPosition - lowerStop.normalizedPosition) / (upperStop.normalizedPosition - lowerStop.normalizedPosition);
      const interpolatedColor = interpolateColor(
        lowerStop.rgb,
        upperStop.rgb,
        segmentProgress
      );
      result.push(rgbToHex(interpolatedColor));
    }
  }
  return result;
}
const colorRamps = [
  {
    id: 0,
    name: "Blues",
    palette: [
      { offset: 0.13, color: fromString("rgb(222,235,247)") },
      { offset: 0.26, color: fromString("rgb(198,219,239)") },
      { offset: 0.39, color: fromString("rgb(158,202,225)") },
      { offset: 0.52, color: fromString("rgb(107,174,214)") },
      { offset: 0.65, color: fromString("rgb(66,146,198)") },
      { offset: 0.78, color: fromString("rgb(33,113,181)") },
      { offset: 0.9, color: fromString("rgb(8,81,156)") }
    ]
  },
  {
    id: 1,
    name: "BrBG",
    palette: [
      { offset: 0.25, color: fromString("rgb(223,194,125)") },
      { offset: 0.5, color: fromString("rgb(245,245,245)") },
      { offset: 0.75, color: fromString("rgb(128,205,193)") }
    ]
  },
  {
    id: 2,
    name: "BuGn",
    palette: [
      { offset: 0.25, color: fromString("rgb(178,226,226)") },
      { offset: 0.5, color: fromString("rgb(102,194,164)") },
      { offset: 0.75, color: fromString("rgb(44,162,95)") }
    ]
  },
  {
    id: 3,
    name: "BuPu",
    palette: [
      { offset: 0.25, color: fromString("rgb(179,205,227)") },
      { offset: 0.5, color: fromString("rgb(140,150,198)") },
      { offset: 0.75, color: fromString("rgb(136,86,167)") }
    ]
  },
  {
    id: 4,
    name: "GnBu",
    palette: [
      { offset: 0.25, color: fromString("rgb(186,228,188)") },
      { offset: 0.5, color: fromString("rgb(123,204,196)") },
      { offset: 0.75, color: fromString("rgb(67,162,202)") }
    ]
  },
  {
    id: 5,
    name: "Greens",
    palette: [
      { offset: 0.13, color: fromString("rgb(229,245,224)") },
      { offset: 0.26, color: fromString("rgb(199,233,192)") },
      { offset: 0.39, color: fromString("rgb(161,217,155)") },
      { offset: 0.52, color: fromString("rgb(116,196,118)") },
      { offset: 0.65, color: fromString("rgb(65,171,93)") },
      { offset: 0.78, color: fromString("rgb(35,139,69)") },
      { offset: 0.9, color: fromString("rgb(0,109,44)") }
    ]
  },
  {
    id: 6,
    name: "Greys",
    palette: [
      { offset: 0, color: fromString("rgb(250,250,250)") },
      { offset: 1, color: fromString("rgb(5,5,5)") }
    ]
  },
  {
    id: 7,
    name: "OrRd",
    palette: [
      { offset: 0.25, color: fromString("rgb(253,204,138)") },
      { offset: 0.5, color: fromString("rgb(252,141,89)") },
      { offset: 0.75, color: fromString("rgb(227,74,51)") }
    ]
  },
  {
    id: 8,
    name: "Oranges",
    palette: [
      { offset: 0.13, color: fromString("rgb(254,230,206)") },
      { offset: 0.26, color: fromString("rgb(253,208,162)") },
      { offset: 0.39, color: fromString("rgb(253,174,107)") },
      { offset: 0.52, color: fromString("rgb(253,141,60)") },
      { offset: 0.65, color: fromString("rgb(241,105,19)") },
      { offset: 0.78, color: fromString("rgb(217,72,1)") },
      { offset: 0.9, color: fromString("rgb(166,54,3)") }
    ]
  },
  {
    id: 9,
    name: "PRGn",
    palette: [
      { offset: 0.25, color: fromString("rgb(194,165,207)") },
      { offset: 0.5, color: fromString("rgb(247,247,247)") },
      { offset: 0.75, color: fromString("rgb(166,219,160)") }
    ]
  },
  {
    id: 10,
    name: "PiYG",
    palette: [
      { offset: 0.25, color: fromString("rgb(241,182,218)") },
      { offset: 0.5, color: fromString("rgb(247,247,247)") },
      { offset: 0.75, color: fromString("rgb(184,225,134)") }
    ]
  },
  {
    id: 11,
    name: "PuBu",
    palette: [
      { offset: 0.25, color: fromString("rgb(189,201,225)") },
      { offset: 0.5, color: fromString("rgb(116,169,207)") },
      { offset: 0.75, color: fromString("rgb(43,140,190)") }
    ]
  },
  {
    id: 12,
    name: "PuBuGn",
    palette: [
      { offset: 0.25, color: fromString("rgb(189,201,225)") },
      { offset: 0.5, color: fromString("rgb(103,169,207)") },
      { offset: 0.75, color: fromString("rgb(28,144,153)") }
    ]
  },
  {
    id: 13,
    name: "PuOr",
    palette: [
      { offset: 0.25, color: fromString("rgb(230,97,1)") },
      { offset: 0.5, color: fromString("rgb(94,60,153)") },
      { offset: 0.75, color: fromString("rgb(178,171,210)") }
    ]
  },
  {
    id: 14,
    name: "PuRd",
    palette: [
      { offset: 0.25, color: fromString("rgb(215,181,216)") },
      { offset: 0.5, color: fromString("rgb(223,101,176)") },
      { offset: 0.75, color: fromString("rgb(221,28,119)") }
    ]
  },
  {
    id: 15,
    name: "Purples",
    palette: [
      { offset: 0.13, color: fromString("rgb(239,237,245)") },
      { offset: 0.26, color: fromString("rgb(218,218,235)") },
      { offset: 0.39, color: fromString("rgb(188,189,220)") },
      { offset: 0.52, color: fromString("rgb(158,154,200)") },
      { offset: 0.65, color: fromString("rgb(128,125,186)") },
      { offset: 0.75, color: fromString("rgb(106,81,163)") },
      { offset: 0.9, color: fromString("rgb(84,39,143)") }
    ]
  },
  {
    id: 16,
    name: "RdBu",
    palette: [
      { offset: 0.25, color: fromString("rgb(244,165,130)") },
      { offset: 0.5, color: fromString("rgb(247,247,247)") },
      { offset: 0.75, color: fromString("rgb(146,197,222)") }
    ]
  },
  {
    id: 17,
    name: "RdGy",
    palette: [
      { offset: 0.25, color: fromString("rgb(244,165,130)") },
      { offset: 0.5, color: fromString("rgb(255,255,255)") },
      { offset: 0.75, color: fromString("rgb(186,186,186)") }
    ]
  },
  {
    id: 18,
    name: "RdPu",
    palette: [
      { offset: 0.25, color: fromString("rgb(253,180,185)") },
      { offset: 0.5, color: fromString("rgb(247,104,161)") },
      { offset: 0.75, color: fromString("rgb(197,27,138)") }
    ]
  },
  {
    id: 19,
    name: "RdYlBu",
    palette: [
      { offset: 0.25, color: fromString("rgb(253,184,99)") },
      { offset: 0.5, color: fromString("rgb(255,255,191)") },
      { offset: 0.75, color: fromString("rgb(171,217,233)") }
    ]
  },
  {
    id: 20,
    name: "RdYlGn",
    palette: [
      { offset: 0.25, color: fromString("rgb(253,174,97)") },
      { offset: 0.5, color: fromString("rgb(255,255,192)") },
      { offset: 0.75, color: fromString("rgb(166,217,106)") }
    ]
  },
  {
    id: 21,
    name: "Reds",
    palette: [
      { offset: 0.13, color: fromString("rgb(254,224,210)") },
      { offset: 0.26, color: fromString("rgb(252,187,161)") },
      { offset: 0.39, color: fromString("rgb(252,146,114)") },
      { offset: 0.52, color: fromString("rgb(251,106,74)") },
      { offset: 0.65, color: fromString("rgb(239,59,44)") },
      { offset: 0.78, color: fromString("rgb(203,24,29)") },
      { offset: 0.9, color: fromString("rgb(165,15,21)") }
    ]
  },
  {
    id: 22,
    name: "Spectral",
    palette: [
      { offset: 0.25, color: fromString("rgb(253,174,97)") },
      { offset: 0.5, color: fromString("rgb(255,255,191)") },
      { offset: 0.75, color: fromString("rgb(171,221,164)") }
    ]
  },
  {
    id: 23,
    name: "YlGn",
    palette: [
      { offset: 0.25, color: fromString("rgb(194,230,153)") },
      { offset: 0.5, color: fromString("rgb(120,198,121)") },
      { offset: 0.75, color: fromString("rgb(49,163,84)") }
    ]
  },
  {
    id: 24,
    name: "YlGnBu",
    palette: [
      { offset: 0.25, color: fromString("rgb(161,218,180)") },
      { offset: 0.5, color: fromString("rgb(65,182,196)") },
      { offset: 0.75, color: fromString("rgb(44,127,184)") }
    ]
  },
  {
    id: 25,
    name: "YlOrBr",
    palette: [
      { offset: 0.25, color: fromString("rgb(254,217,142)") },
      { offset: 0.5, color: fromString("rgb(254,153,41)") },
      { offset: 0.75, color: fromString("rgb(217,95,14)") }
    ]
  },
  {
    id: 26,
    name: "YlOrRd",
    palette: [
      { offset: 0.25, color: fromString("rgb(254,204,92)") },
      { offset: 0.5, color: fromString("rgb(253,141,60)") },
      { offset: 0.75, color: fromString("rgb(240,59,32)") }
    ]
  },
  {
    id: 27,
    name: "Semaphore",
    palette: [
      { offset: 0.1, color: fromString("rgb(215,48,39)") },
      { offset: 0.3, color: fromString("rgb(252,141,89)") },
      { offset: 0.5, color: fromString("rgb(218,225,12)") },
      { offset: 0.7, color: fromString("rgb(145,207,96)") },
      { offset: 0.9, color: fromString("rgb(26,152,80)") }
    ]
  }
];
const Categorized = (props) => {
  const {
    attr,
    layerCurrentRenderer,
    showPreDefinedRamps,
    predefinedStyles,
    moreRamps,
    applyRenderer,
    setVisible
  } = props;
  const { t } = useTranslation();
  const nullText = t("common.null");
  const errorRamps = t("errors.error_ramps_same_name");
  const predefinedStylesLabel = t("categorized.predefined_styles");
  const colorRampLabel = t("categorized.color_ramps");
  const strokeColorLabel = t("categorized.stroke_color");
  const strokeWidthLabel = t("categorized.stroke_width");
  const attributeLabel = t("categorized.attribute");
  const selectAttributeLabel = t("categorized.select_attribute");
  const updateColorsLabel = t("categorized.update_colors");
  const colorOpacityLabel = t("categorized.color_opacity");
  const selectSpectrumLabel = t("categorized.select_spectrum");
  const concludeLabel = t("common.conclude");
  const colorLabel = t("graduated.color");
  const customStyleLabel = t("categorized.custom_style");
  const valueLabel = t("graduated.value");
  const reverseColorsLabel = t("categorized.reverse_colors");
  const colorStyleLabel = t("categorized.color_style");
  const currentRender = layerCurrentRenderer.type != RenderType.Categorized ? [] : layerCurrentRenderer.rendererOL["fill-color"];
  const valuesAndColors = [];
  for (let i = 2; i < currentRender.length - 1; i += 2) {
    valuesAndColors.push({
      value: currentRender[i],
      color: currentRender[i + 1],
      visible: true
    });
  }
  if (currentRender.length > 0)
    valuesAndColors.push({
      value: nullText,
      color: currentRender[currentRender.length - 1],
      visible: true
    });
  const stroke = getRendererColorAndSizeStroke(layerCurrentRenderer);
  const [selectedSpectrumColors, setSelectedSpectrumColors] = useState({ label: customStyleLabel, value: [] });
  const [table, setTable] = useState(valuesAndColors);
  const [selectedAttr, setSelectedAttr] = useState(layerCurrentRenderer.field ? attr.find((at) => at.name == layerCurrentRenderer.field) : void 0);
  const [rowClick] = useState(false);
  const currentStyle = layerCurrentRenderer.type != RenderType.Categorized ? null : layerCurrentRenderer.rendererOL;
  const [borderColor, setBorderColor] = useState(currentStyle ? stroke.color : fromString("#000000"));
  const [borderThickness, setBorderThickness] = useState(currentStyle ? stroke.size : 1);
  const [fillOpacity, setFillOpacity] = useState(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100);
  const [isReversed, setIsReversed] = useState(false);
  let allRamps;
  if (showPreDefinedRamps)
    if (moreRamps)
      allRamps = moreRamps.concat(colorRamps);
    else
      allRamps = colorRamps;
  else {
    if (moreRamps)
      allRamps = moreRamps;
    else
      allRamps = [];
  }
  const existingRenderers = allRamps.filter(
    (ramp, _index, self) => self.filter((r) => r.name === ramp.name).length > 1
  );
  if (existingRenderers.length > 0) {
    console.error(errorRamps + existingRenderers.map((ramp) => ramp.name));
    return;
  }
  const preDefinedPalettes = [
    {
      label: customStyleLabel,
      items: [{ label: customStyleLabel, value: { label: customStyleLabel, value: [] } }]
    },
    {
      label: predefinedStylesLabel,
      items: predefinedStyles.map((renderer) => {
        return {
          label: renderer.name,
          value: {
            label: renderer.name,
            value: renderer.renderer
          }
        };
      })
    },
    {
      label: colorRampLabel,
      items: allRamps.map((ramp) => {
        return {
          label: ramp.name,
          value: { label: ramp.name, value: ramp.palette }
        };
      })
    }
  ];
  const itemTemplate = (option) => {
    if (option.value.value.length > 0 && "offset" in option.value.value[0])
      return /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "3px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          background: getColorRampString(option.value.value),
          width: "90px",
          height: "20px"
        } }),
        /* @__PURE__ */ jsx("span", { children: option.label })
      ] });
    return /* @__PURE__ */ jsx("span", { children: option.label });
  };
  const visibleColumnTemplate = (tr) => {
    return /* @__PURE__ */ jsx(Checkbox, { checked: tr.visible });
  };
  const updateColorPicker = (newColor, tableRow) => {
    const tableUpdated = [];
    table.forEach(({ value, visible, color }) => {
      if (value === tableRow.value) {
        tableUpdated.push({
          value,
          visible,
          color: newColor
        });
      } else {
        tableUpdated.push({ value, visible, color });
      }
    });
    setTable(tableUpdated);
  };
  const colorColumnTemplate = (tr) => {
    return /* @__PURE__ */ jsx("div", { hidden: !tr.visible, children: /* @__PURE__ */ jsx(
      MyColorPicker,
      {
        onChange: (e) => updateColorPicker(fromString(e), tr),
        color: tr.color
      }
    ) });
  };
  function updateColorsByColorRamp(colorRampInput, reversed) {
    const colorRamp = { label: colorRampInput.label, value: [...colorRampInput.value] };
    if (reversed) {
      colorRamp.value.reverse();
    }
    if (colorRamp.value.length > 0 && "offset" in colorRamp.value[0]) {
      const value = colorRamp.value.map((stop) => ({ offset: stop.offset, color: stop.color }));
      const colors = generateGradient(value, table.filter((row) => row.visible).length);
      const tableUpdated = [];
      let i = 0;
      table.forEach(({ value: value2, visible }) => {
        if (visible)
          tableUpdated.push({
            value: value2,
            visible,
            color: fromString(colors[i++])
          });
        else
          tableUpdated.push({
            value: value2,
            visible,
            color: fromString("white")
          });
      });
      setTable(tableUpdated);
    } else if (colorRamp.value.length > 0) {
      const style = getCategorizedStyle(selectedAttr == null ? void 0 : selectedAttr.name, colorRamp.value);
      const colors = getStyleColorsAndValues(style, RenderType.Categorized);
      const tableUpdated = [];
      table.forEach(({ value, visible }) => {
        const color = colors.find((c) => c.value == value);
        if (color)
          tableUpdated.push({
            value,
            visible,
            color: color.color
          });
        else
          tableUpdated.push({
            value,
            visible,
            color: fromString("white")
          });
      });
      setTable(tableUpdated);
    } else {
      const tableUpdated = [];
      table.forEach(({ value, visible }) => {
        tableUpdated.push({
          value,
          visible,
          color: generateRandomColor()
        });
      });
      setTable(tableUpdated);
    }
  }
  function revertColors() {
    setIsReversed(!isReversed);
    updateColorsByColorRamp(selectedSpectrumColors, !isReversed);
  }
  function changeColorsOfValues(e) {
    const colorRamp = e;
    setIsReversed(false);
    setSelectedSpectrumColors(colorRamp);
    updateColorsByColorRamp(colorRamp, false);
  }
  function changeAttribute(e) {
    let attribute = attr.find((a) => a.name == e.value.name);
    setSelectedAttr(attribute);
    setSelectedSpectrumColors({ label: customStyleLabel, value: [] });
    let tableValues = [];
    attribute.values.forEach((value) => {
      if (value && value != "")
        tableValues.push({
          visible: true,
          value,
          color: generateRandomColor()
        });
    });
    tableValues.push({
      value: nullText,
      color: generateRandomColor(),
      visible: true
    });
    setTable(tableValues);
  }
  const changeVisibility = (trs) => {
    let tableValues = [];
    table.forEach((tr) => {
      let found = trs.some((trs2) => trs2 === tr);
      tableValues.push({
        value: tr.value,
        visible: found,
        color: found ? tr.color : [0, 0, 0, 0]
      });
    });
    setTable(tableValues);
  };
  return /* @__PURE__ */ jsxs("div", { className: "categorized-container", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "attribute-container", children: [
        /* @__PURE__ */ jsx("span", { style: { width: "auto" }, children: /* @__PURE__ */ jsxs("b", { children: [
          attributeLabel,
          ":"
        ] }) }),
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            value: selectedAttr,
            onChange: (e) => changeAttribute(e),
            options: attr,
            optionLabel: "name",
            itemTemplate: (option) => /* @__PURE__ */ jsxs("span", { children: [
              option.name,
              " (",
              option.values.length,
              ")"
            ] }),
            placeholder: selectAttributeLabel
          }
        )
      ] }),
      table.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "stroke-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "stroke-color-container", children: [
            /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
              strokeColorLabel,
              ":"
            ] }) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              MyColorPicker,
              {
                color: (() => {
                  if (borderColor.at(3) < 1)
                    return [borderColor[0], borderColor[1], borderColor[2], 1];
                  return borderColor;
                })(),
                hideAlpha: true,
                onChange: (e) => setBorderColor(fromString(e))
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "stroke-width-container", children: [
            /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
              strokeWidthLabel,
              ":"
            ] }) }),
            /* @__PURE__ */ jsx(
              Slider,
              {
                max: 10,
                min: 0,
                className: "stroke-slider",
                value: borderThickness,
                onChange: (e) => setBorderThickness(e.value)
              }
            ),
            /* @__PURE__ */ jsxs("span", { children: [
              borderThickness,
              " px"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "opacity-container", children: [
          /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
            colorOpacityLabel,
            ":"
          ] }) }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              max: 100,
              min: 0,
              className: "opacity-slider",
              value: fillOpacity,
              onChange: (e) => {
                setFillOpacity(e.value);
                let aux = [...table];
                let newTable = aux.map((tr) => {
                  let aux2 = [];
                  aux2.push(tr.color[0]);
                  aux2.push(tr.color[1]);
                  aux2.push(tr.color[2]);
                  aux2.push(e.value / 100);
                  return { ...tr, color: aux2 };
                });
                setTable(newTable);
              }
            }
          ),
          /* @__PURE__ */ jsxs("span", { children: [
            fillOpacity,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "spectrum-container", children: [
          /* @__PURE__ */ jsx("span", { style: { width: "auto" }, children: /* @__PURE__ */ jsxs("b", { children: [
            colorStyleLabel,
            ":"
          ] }) }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              value: selectedSpectrumColors,
              options: preDefinedPalettes,
              onChange: (e) => changeColorsOfValues(e.value),
              placeholder: selectSpectrumLabel,
              optionLabel: "label",
              optionGroupLabel: "label",
              itemTemplate
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              text: true,
              icon: "pi pi-refresh",
              disabled: !selectedSpectrumColors,
              tooltip: updateColorsLabel,
              onClick: () => updateColorsByColorRamp(selectedSpectrumColors, isReversed)
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              text: true,
              icon: "pi pi-arrow-right-arrow-left",
              disabled: !selectedSpectrumColors,
              tooltip: reverseColorsLabel,
              onClick: () => revertColors()
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxs(
          DataTable,
          {
            value: table,
            selectionMode: rowClick ? null : "checkbox",
            tableStyle: { minWidth: "25rem" },
            selection: table.filter((tr) => tr.visible),
            onSelectionChange: (e) => {
              const value = e.value;
              changeVisibility(value);
            },
            reorderableRows: true,
            onRowReorder: (e) => setTable(e.value),
            children: [
              /* @__PURE__ */ jsx(Column, { rowReorder: true, style: { width: "3rem" } }),
              /* @__PURE__ */ jsx(
                Column,
                {
                  selectionMode: "multiple",
                  field: "visible",
                  body: visibleColumnTemplate
                }
              ),
              /* @__PURE__ */ jsx(Column, { field: "color", header: colorLabel, body: colorColumnTemplate }),
              /* @__PURE__ */ jsx(Column, { field: "value", header: valueLabel, sortable: true })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "footer-container", children: /* @__PURE__ */ jsx(
      Button,
      {
        label: concludeLabel,
        onClick: () => {
          applyRenderer({
            type: RenderType.Categorized,
            field: selectedAttr == null ? void 0 : selectedAttr.name,
            rendererOL: getCategorizedStyle(selectedAttr == null ? void 0 : selectedAttr.name, table.filter((row) => row.value != nullText && row.visible).map((tr) => ({
              value: tr.value,
              color: tr.color
            })), borderColor, borderThickness, table.find((row) => row.value == nullText).color)
          });
          setVisible(false);
        }
      }
    ) })
  ] });
};
const Graduated = (props) => {
  const {
    attr,
    applyRenderer,
    setVisible,
    layerCurrentRenderer,
    moreRamps,
    showPreDefinedRamps,
    numbersLocale
  } = props;
  const { t } = useTranslation();
  const errorRamps = t("errors.error_ramps_same_name");
  const colorRampLabel = t("categorized.color_ramps");
  const errorDiffLabel = t("errors.error_diff");
  const errorSumLabel = t("errors.error_sum");
  const errorSum2Label = t("errors.error_sum2");
  const amountValuesLabel = t("graduated.amount_values");
  const valuesLabel = t("graduated.values");
  const amountLabel = t("graduated.amount");
  const attributeLabel = t("categorized.attribute");
  const selectAttributeLabel = t("categorized.select_attribute");
  const selectModeLabel = t("graduated.select_mode");
  const whichModeLabel = t("graduated.which_mode");
  const intervalSizeLabel = t("graduated.interval_size");
  const classesNumberLabel = t("graduated.classes_number");
  const colorsSpectrumLabel = t("categorized.colors_spectrum");
  const selectSpectrumLabel = t("categorized.select_spectrum");
  const invertColorsLabel = t("graduated.invert_colors");
  const gradientIntervalsLabel = t("graduated.gradient_intervals");
  const valueLabel = t("graduated.value");
  const strokeColorLabel = t("categorized.stroke_color");
  const strokeWidthLabel = t("categorized.stroke_width");
  const colorOpacityLabel = t("categorized.color_opacity");
  const concludeLabel = t("common.conclude");
  const previewLabel = t("graduated.preview");
  const errorValuesLabel = t("errors.error_values");
  const minValueLabel = t("graduated.min_value");
  const maxValueLabel = t("graduated.max_value");
  const colorLabel = t("graduated.color");
  const modeLabel = t("graduated.mode");
  const locale = numbersLocale;
  const toast = useRef(null);
  const showToast = (message, severity) => {
    var _a;
    (_a = toast.current) == null ? void 0 : _a.show({ severity, summary: "Error", detail: message });
  };
  const currentRender = layerCurrentRenderer.type != RenderType.Graduated ? [] : layerCurrentRenderer.rendererOL["fill-color"];
  const valuesAndColors = [];
  for (let i = 3; i < currentRender.length - 1; i += 2) {
    valuesAndColors.push({
      value: currentRender[i],
      color: currentRender[i + 1]
    });
  }
  const currentStyle = layerCurrentRenderer.type != RenderType.Graduated ? null : layerCurrentRenderer.rendererOL;
  const stroke = getRendererColorAndSizeStroke(layerCurrentRenderer);
  const [opacity, setOpacity] = useState(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100);
  const [stops, setStops] = useState(valuesAndColors);
  const [selectedAttr, setSelectedAttr] = useState(layerCurrentRenderer.field ? attr.find((at) => at.name == layerCurrentRenderer.field) : void 0);
  const [selectedMode, setSelectedMode] = useState(layerCurrentRenderer.type == RenderType.Graduated ? layerCurrentRenderer.graduatedType : void 0);
  const [intervals, setIntervals] = useState([]);
  const [classNo, setClassNo] = useState(layerCurrentRenderer.type == RenderType.Graduated ? valuesAndColors.length - 1 : 5);
  const [intervalSize, setIntervalSize] = useState(0);
  const [selectedSpectrumColors, setSelectedSpectrumColors] = useState();
  const [borderColor, setBorderColor] = useState(currentStyle ? stroke.color : fromString("#000000"));
  const [borderThickness, setBorderThickness] = useState(currentStyle ? stroke.size : 1);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  let allRamps;
  if (showPreDefinedRamps)
    if (moreRamps)
      allRamps = moreRamps.concat(colorRamps);
    else
      allRamps = colorRamps;
  else {
    if (moreRamps)
      allRamps = moreRamps;
    else
      allRamps = [];
  }
  const existingRenderers = allRamps.filter(
    (ramp, _index, self) => self.filter((r) => r.name === ramp.name).length > 1
  );
  if (existingRenderers.length > 0) {
    console.error(errorRamps + existingRenderers.map((ramp) => ramp.name));
    return;
  }
  const preDefinedPalettes = [
    {
      label: colorRampLabel,
      items: allRamps.map((ramp) => {
        return {
          label: ramp.name,
          value: { label: ramp.name, value: ramp.palette }
        };
      })
    }
  ];
  const itemTemplate = (option) => {
    if (option.value.value.length > 0 && "offset" in option.value.value[0])
      return /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "3px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          background: getColorRampString(option.value.value),
          width: "90px",
          height: "20px"
        } }),
        /* @__PURE__ */ jsx("span", { children: option.label })
      ] });
    return /* @__PURE__ */ jsx("span", { children: option.label });
  };
  function applyRampToStops(ramp, invert) {
    const aux = [...stops];
    if (invert) {
      const inverse = aux.map((s) => s.color).reverse();
      const newTable = aux.map((tr, index) => {
        const aux2 = [];
        const color = inverse[index];
        aux2.push(color[0]);
        aux2.push(color[1]);
        aux2.push(color[2]);
        aux2.push(opacity / 100);
        return { ...tr, color: aux2 };
      });
      setStops(newTable);
      return;
    }
    const colors = generateGradient(ramp.value, aux.length);
    const newTable2 = aux.map((tr, index) => {
      const aux2 = [];
      const color = fromString(colors[index]);
      aux2.push(color[0]);
      aux2.push(color[1]);
      aux2.push(color[2]);
      aux2.push(opacity / 100);
      return { ...tr, color: aux2 };
    });
    setStops(newTable2);
  }
  function countNumbers(list) {
    const counting = {};
    list.filter((n) => n != null).forEach((num) => {
      const rounded = Math.round(num);
      counting[rounded] = (counting[rounded] || 0) + 1;
    });
    const maxNumber = Math.round(Math.max(...list));
    const minNumber = Math.round(Math.min(...list));
    if (maxNumber - minNumber <= 0)
      showToast(errorDiffLabel + (maxNumber - minNumber), "error");
    const result = new Array(maxNumber - minNumber).fill(0);
    Object.entries(counting).forEach(([n, times]) => {
      result[Number(n) - minNumber] = times;
    });
    let intervals2 = result.map((value, index) => {
      return { min: index + minNumber, max: index + minNumber + 1, count: value };
    });
    if (list.length != intervals2.reduce((acc, curr) => acc + curr.count, 0))
      showToast(errorSumLabel, "error");
    const reduceFactor = 2;
    while (intervals2.length > 100) {
      const newIntervals = [];
      for (let i = 0; i <= intervals2.length - reduceFactor; i += reduceFactor) {
        const min = intervals2[i].min;
        let max;
        const isLast = i == intervals2.length - reduceFactor || i + reduceFactor > intervals2.length - reduceFactor;
        if (isLast) {
          max = intervals2[intervals2.length - 1].max;
        } else
          max = intervals2[i + reduceFactor].min;
        const count = intervals2.slice(i, isLast ? intervals2.length : i + reduceFactor).reduce((acc, curr) => acc + curr.count, 0);
        newIntervals.push({ min, max, count });
      }
      intervals2 = newIntervals;
    }
    const lastInterval = intervals2[intervals2.length - 1];
    intervals2.push({ min: lastInterval.max, max: lastInterval.max + (lastInterval.max - lastInterval.min), count: 0 });
    const total = intervals2.reduce((acc, curr) => acc + curr.count, 0);
    if (list.length != total)
      showToast(errorSum2Label + (list.length - total), "error");
    intervals2 = intervals2.map((i) => {
      return { min: i.min, max: i.max, count: i.count * 100 / list.length };
    });
    return intervals2;
  }
  async function calculateStopsByMode(mode, nClasses, intervalSize2) {
    let stops2 = [];
    let values = (selectedAttr == null ? void 0 : selectedAttr.values.map(Number)) || [];
    values = values.filter((v) => !isNaN(v) && v != null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    switch (mode) {
      case GraduatedModes.EqualInterval:
      case GraduatedModes.Manual: {
        const interval2 = range / nClasses;
        for (let i = 0; i < nClasses; i++) {
          stops2.push({ value: min + interval2 * i, color: fromString("rgb(0,0,0)") });
        }
        stops2.push({ value: max, color: fromString("rgb(0,0,0)") });
        break;
      }
      case GraduatedModes.DefinedInterval: {
        const interval = range / intervalSize2;
        console.log("interval", interval, intervalSize2);
        for (let i = 0; i <= interval; i++) {
          stops2.push({ value: min + intervalSize2 * i, color: fromString("rgb(0,0,0)") });
        }
        break;
      }
      case GraduatedModes.NaturalBreaks: {
        const auxJenks = await jenksBuckets(values, nClasses);
        stops2 = auxJenks.map((value) => {
          return { value, color: fromString("rgb(0,0,0)") };
        });
        break;
      }
      case GraduatedModes.Quantile: {
        const auxQuantile = await quantileBuckets(values, nClasses);
        stops2 = auxQuantile.map((value) => {
          return { value, color: fromString("rgb(0,0,0)") };
        });
        break;
      }
      // case Modes.GeometricInterval:
      //     for (let i = 0; i < 5; i++) {
      //         stops.push({value: min + interval * i, color: fromString("rgb(0,0,0)")})
      //     }
      //     break
      case GraduatedModes.StandardDeviation:
        const auxStand = await standardDeviationBuckets(values, nClasses);
        stops2 = auxStand.map((value) => {
          return { value, color: fromString("rgb(0,0,0)") };
        });
        break;
    }
    setIntervals(countNumbers(values || []));
    return stops2;
  }
  useEffect(() => {
    if (stops.length > 0) {
      let values = (selectedAttr == null ? void 0 : selectedAttr.values.map(Number)) || [];
      values = values.filter((v) => !isNaN(v) && v != null);
      setIntervals(countNumbers(values || []));
    }
  }, []);
  const stopsValues = stops.map((s) => s.value).join(", ");
  useEffect(() => {
    if (intervals && intervals.length > 0) {
      const chartData2 = {
        //max value of the attribute
        labels: intervals.map((i) => i.min.toString()),
        datasets: [
          {
            label: amountValuesLabel,
            data: intervals.map((i) => i.count),
            backgroundColor: "rgb(54, 162, 235)",
            borderWidth: 2,
            borderColor: "rgb(54, 162, 235)"
          }
        ]
      };
      setChartData(chartData2);
      const chartOptions2 = {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: valuesLabel
            },
            ticks: {
              autoSkip: false,
              color: function(val) {
                return val.index % 2 === 0 ? "#000" : "rgba(255,255,255,0)";
              }
            },
            grid: {
              display: true,
              drawTicks: true,
              color: function(context) {
                if (context.tick) {
                  const value = Number.parseInt(context.tick.label);
                  const interval = stops.map((stop) => intervals.find((i) => i.min <= stop.value && stop.value < i.max));
                  return interval.find((i) => (i == null ? void 0 : i.min) <= value && value < i.max) ? "#ea1010" : "rgba(0,0,0,0)";
                } else
                  return "rgba(0,0,0,0)";
              },
              // color: "#da1010",
              drawBorder: false
            }
          },
          y: {
            title: {
              display: true,
              text: amountLabel
            }
          }
        }
      };
      setChartOptions(chartOptions2);
    }
  }, [intervals, stopsValues]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-column", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-row-small-gap", children: [
          /* @__PURE__ */ jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxs("b", { children: [
            attributeLabel,
            ":"
          ] }) }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              value: selectedAttr,
              onChange: (e) => {
                setStops([]);
                setSelectedAttr(e.value);
                setSelectedMode(void 0);
                setSelectedSpectrumColors(void 0);
              },
              options: attr.filter((a) => a.type === AttributeTypeEnum.INTEGER || a.type === AttributeTypeEnum.FLOAT),
              optionLabel: "name",
              placeholder: selectAttributeLabel
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-row-small-gap", children: [
          /* @__PURE__ */ jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxs("b", { children: [
            modeLabel,
            ":"
          ] }) }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              disabled: !selectedAttr,
              value: selectedMode,
              onChange: async (e) => {
                let iSize = Math.round(Math.max(...selectedAttr.values.map(Number).filter((v) => v != null && !isNaN(v))) / 10);
                if (iSize == 0)
                  iSize = 1;
                setIntervalSize(iSize);
                const classNumber = selectedAttr.values.length > 5 ? 5 : selectedAttr.values.length - 1;
                setClassNo(classNumber);
                setStops(await calculateStopsByMode(e.value, classNumber, iSize));
                setSelectedMode(e.value);
                setSelectedSpectrumColors(void 0);
              },
              options: Object.values(GraduatedModes).filter((m) => m != GraduatedModes.GeometricInterval),
              itemTemplate: (option) => {
                return t(`graduate_modes.${option}`);
              },
              valueTemplate: (option) => {
                if (option)
                  return t(`graduate_modes.${option}`);
                else return selectModeLabel;
              },
              placeholder: selectModeLabel
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://resources.arcgis.com/en/help/main/10.2/index.html#//00s50000001r000000",
              target: "_blank",
              children: whichModeLabel
            }
          )
        ] })
      ] }),
      selectedMode && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-row-small-gap", children: [
          selectedAttr && /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsxs("b", { children: [
              minValueLabel,
              ":"
            ] }),
            " ",
            Math.min(...selectedAttr.values.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)
          ] }),
          selectedAttr && /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsxs("b", { children: [
              maxValueLabel,
              ":"
            ] }),
            " ",
            Math.max(...selectedAttr.values.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)
          ] })
        ] }),
        (selectedMode == GraduatedModes.Manual || selectedMode == GraduatedModes.EqualInterval || selectedMode == GraduatedModes.Quantile || selectedMode == GraduatedModes.NaturalBreaks || selectedMode == GraduatedModes.GeometricInterval) && /* @__PURE__ */ jsxs("div", { className: "flex-row-gap-15", children: [
          /* @__PURE__ */ jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxs("b", { children: [
            classesNumberLabel,
            ":"
          ] }) }),
          /* @__PURE__ */ jsx(
            InputNumber,
            {
              value: classNo,
              locale,
              onChange: async (e) => {
                setClassNo(e.value);
                setSelectedSpectrumColors(void 0);
                setStops(await calculateStopsByMode(selectedMode, e.value, intervalSize));
              }
            }
          )
        ] }),
        (selectedMode == GraduatedModes.DefinedInterval || selectedMode == GraduatedModes.StandardDeviation) && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "auto-width-span", children: [
            intervalSizeLabel,
            ":"
          ] }),
          /* @__PURE__ */ jsx(
            InputNumber,
            {
              value: intervalSize,
              locale,
              onChange: async (e) => {
                setIntervalSize(e.value);
                setSelectedSpectrumColors(void 0);
                setStops(await calculateStopsByMode(selectedMode, classNo, e.value));
              }
            }
          )
        ] })
      ] }),
      selectedMode && selectedAttr && /* @__PURE__ */ jsx(
        Chart,
        {
          className: "chart-wrapper",
          type: "bar",
          data: chartData,
          options: chartOptions
        }
      ),
      stops.length > 0 && selectedMode && /* @__PURE__ */ jsxs("div", { className: "flex-column-gap-15px", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-row-gap-50px", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-row-center", children: [
              /* @__PURE__ */ jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxs("b", { children: [
                colorsSpectrumLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsx(
                Dropdown,
                {
                  value: selectedSpectrumColors,
                  options: preDefinedPalettes,
                  onChange: (e) => {
                    setSelectedSpectrumColors(e.value);
                    applyRampToStops(e.value);
                  },
                  placeholder: selectSpectrumLabel,
                  optionLabel: "label",
                  optionGroupLabel: "label",
                  itemTemplate
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  text: true,
                  icon: "pi pi-arrow-right-arrow-left",
                  tooltip: invertColorsLabel,
                  disabled: !selectedSpectrumColors,
                  onClick: () => applyRampToStops(selectedSpectrumColors, true)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-column-small-gap", children: [
              /* @__PURE__ */ jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxs("b", { children: [
                gradientIntervalsLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-row-small-gap", children: [
                /* @__PURE__ */ jsxs("span", { className: "auto-width-span", children: [
                  valueLabel,
                  "             "
                ] }),
                /* @__PURE__ */ jsx("span", { className: "auto-width-span", children: colorLabel })
              ] }),
              stops.map(
                (value, index) => {
                  var _a, _b;
                  return /* @__PURE__ */ jsxs("div", { className: "flex-row-small-small-gap", children: [
                    /* @__PURE__ */ jsx(
                      InputNumber,
                      {
                        placeholder: valueLabel,
                        allowEmpty: false,
                        locale,
                        min: stops[0].value,
                        max: index < stops.length - 1 ? ((_a = stops[index + 1]) == null ? void 0 : _a.value) - 1e-3 : (_b = stops[stops.length]) == null ? void 0 : _b.value,
                        disabled: index === 0 || selectedMode != GraduatedModes.Manual || index === stops.length - 1,
                        onChange: (e) => {
                          const aux = [...stops];
                          aux[index].value = e.value;
                          setStops(aux);
                        },
                        value: value.value
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      MyColorPicker,
                      {
                        color: value.color,
                        onChange: (e) => {
                          const aux = [...stops];
                          aux[index].color = fromString(e);
                          setStops(aux);
                        }
                      }
                    )
                  ] }, index);
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-row-gap-50px", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "color-picker-wrapper", children: [
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
                strokeColorLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                MyColorPicker,
                {
                  color: (() => {
                    if (borderColor.at(3) < 1)
                      return [borderColor[0], borderColor[1], borderColor[2], 1];
                    return borderColor;
                  })(),
                  hideAlpha: true,
                  onChange: (e) => setBorderColor(fromString(e))
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-column-gap-7px", children: [
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
                strokeWidthLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsx(
                Slider,
                {
                  max: 10,
                  min: 0,
                  className: "slider-wrapper",
                  value: borderThickness,
                  onChange: (e) => setBorderThickness(e.value)
                }
              ),
              /* @__PURE__ */ jsxs("span", { children: [
                borderThickness,
                " px"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-column-gap-7px", children: [
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
                colorOpacityLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsx(
                Slider,
                {
                  max: 100,
                  min: 0,
                  className: "slider-wrapper",
                  value: opacity,
                  onChange: (e) => {
                    setOpacity(e.value);
                    const aux = [...stops];
                    const newTable = aux.map((tr) => {
                      const aux2 = [];
                      aux2.push(tr.color[0]);
                      aux2.push(tr.color[1]);
                      aux2.push(tr.color[2]);
                      aux2.push(e.value / 100);
                      return { ...tr, color: aux2 };
                    });
                    setStops(newTable);
                  }
                }
              ),
              /* @__PURE__ */ jsxs("span", { children: [
                opacity,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-column-gap-7px", children: [
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
                previewLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsx("div", { style: {
                background: getColorRampString(stops.map((stop, index) => {
                  return { offset: index / stops.length, color: stop.color };
                }))
              }, className: "preview-color-ramp" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "button-wrapper", children: /* @__PURE__ */ jsx(
          Button,
          {
            label: concludeLabel,
            onClick: () => {
              let allGood = true;
              stops.forEach((stop, index) => {
                if (index < stops.length - 1 && stop.value >= stops[index + 1].value) {
                  showToast(errorValuesLabel, "error");
                  allGood = false;
                }
              });
              if (allGood) {
                applyRenderer({
                  type: RenderType.Graduated,
                  graduatedType: selectedMode,
                  field: selectedAttr == null ? void 0 : selectedAttr.name,
                  rendererOL: getGraduatedStyle(selectedAttr == null ? void 0 : selectedAttr.name, stops, borderColor, borderThickness)
                });
                setVisible(false);
              }
            }
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Toast, { ref: toast })
  ] });
};
const GeometryEditor = (props) => {
  const {
    layerCurrentRenderer,
    layerDefaultRenderer,
    moreRamps,
    predefinedStyles,
    showPreDefinedRamps,
    applyRenderer,
    setVisible,
    numbersLocale
  } = props;
  const { t } = useTranslation();
  const uniqueSymbol = t("common.unique_symbol");
  const categorized2 = t("common.categorized");
  const graduated2 = t("common.graduated");
  const resetStyle = t("common.reset_style");
  const selectStyle = t("common.select_type");
  const styleType = t("common.style_type");
  const [attr, setAttr] = useState(props.attributes);
  const [currentRenderer, setCurrentRenderer] = useState(layerCurrentRenderer);
  const options = [
    { label: uniqueSymbol, code: 0 },
    { label: categorized2, code: 1 },
    { label: graduated2, code: 2 }
  ];
  const [activeIndex, setActiveIndex] = useState(layerCurrentRenderer.type == RenderType.Categorized ? options[1] : layerCurrentRenderer.type == RenderType.Graduated ? options[2] : options[0]);
  useEffect(() => {
    setActiveIndex(currentRenderer.type == RenderType.Categorized ? options[1] : currentRenderer.type == RenderType.Graduated ? options[2] : options[0]);
  }, [currentRenderer]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "geometry-editor", children: [
    /* @__PURE__ */ jsxs("div", { className: "dropdown", children: [
      /* @__PURE__ */ jsxs("div", { className: "style-type", children: [
        /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [
          styleType,
          ":"
        ] }) }),
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            options,
            placeholder: selectStyle,
            optionLabel: "label",
            value: activeIndex,
            onChange: (e) => setActiveIndex(e.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          label: resetStyle,
          disabled: currentRenderer == layerDefaultRenderer,
          onClick: () => {
            applyRenderer(layerDefaultRenderer);
            setCurrentRenderer(layerDefaultRenderer);
          }
        }
      )
    ] }),
    (activeIndex == null ? void 0 : activeIndex.code) == 0 && /* @__PURE__ */ jsx(
      UniqueSymbol,
      {
        layerCurrentRenderer: currentRenderer,
        layerDefaultRenderer,
        applyRenderer,
        setVisible
      }
    ),
    (activeIndex == null ? void 0 : activeIndex.code) == 1 && /* @__PURE__ */ jsx(
      Categorized,
      {
        attr,
        layerCurrentRenderer: currentRenderer,
        layerDefaultRenderer,
        applyRenderer,
        setVisible,
        moreRamps,
        predefinedStyles,
        showPreDefinedRamps
      }
    ),
    (activeIndex == null ? void 0 : activeIndex.code) == 2 && /* @__PURE__ */ jsx(
      Graduated,
      {
        attr,
        setAttr,
        applyRenderer,
        moreRamps,
        setVisible,
        showPreDefinedRamps,
        layerCurrentRenderer,
        numbersLocale
      }
    )
  ] }) });
};
function mapFeaturesToSEAttributes(features) {
  const attributeMap = {};
  features.forEach((feature) => {
    const properties = feature.getProperties();
    Object.keys(properties).forEach((key) => {
      if (key === "geometry") return;
      if (!attributeMap[key]) {
        attributeMap[key] = /* @__PURE__ */ new Set();
      }
      attributeMap[key].add(properties[key]);
    });
  });
  const seAttributes = Object.keys(attributeMap).map((key, index) => {
    const valuesArray = Array.from(attributeMap[key]);
    const attributeType = determineAttributeType(valuesArray);
    return {
      id: index,
      name: key,
      type: attributeType,
      values: valuesArray.map(String)
      // Convert all values to strings
    };
  });
  return seAttributes;
}
function determineAttributeType(values) {
  if (values.length === 0) {
    return AttributeTypeEnum.STRING;
  }
  const sampleValue = values[0];
  if (typeof sampleValue === "string") {
    return AttributeTypeEnum.STRING;
  } else if (typeof sampleValue === "number") {
    return Number.isInteger(sampleValue) ? AttributeTypeEnum.INTEGER : AttributeTypeEnum.FLOAT;
  } else if (typeof sampleValue === "boolean") {
    return AttributeTypeEnum.BOOLEAN;
  } else if (sampleValue instanceof Date) {
    return AttributeTypeEnum.DATE;
  } else if (typeof sampleValue === "object") {
    return AttributeTypeEnum.JSON;
  } else {
    return AttributeTypeEnum.STRING;
  }
}
const StyleEditorComponent = (props) => {
  const {
    layerDefaultRenderer,
    layerCurrentRenderer,
    applyRenderer,
    showPreDefinedRamps,
    moreRamps,
    predefinedStyles,
    addingToHeader,
    features,
    visible,
    setVisible,
    numbersLocale
  } = props;
  const { t } = useTranslation();
  const titleHeader = t("common.style_editor");
  const [activeIndex] = useState(1);
  const [attributesAndValues, setAttributesAndValues] = useState([]);
  useEffect(() => {
    setAttributesAndValues(mapFeaturesToSEAttributes(features));
  }, [features]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Dialog,
    {
      visible: props.visible,
      header: titleHeader + (addingToHeader ? " - " + addingToHeader : ""),
      style: { height: "90%", width: "80%" },
      onHide: () => {
        props.setVisible(false);
      },
      children: activeIndex === 1 && attributesAndValues && /* @__PURE__ */ jsx(
        GeometryEditor,
        {
          attributes: attributesAndValues,
          visible,
          layerCurrentRenderer,
          applyRenderer,
          setVisible,
          layerDefaultRenderer,
          moreRamps,
          numbersLocale,
          predefinedStyles: predefinedStyles ? predefinedStyles : [],
          showPreDefinedRamps
        }
      )
    }
  ) });
};
const common$1 = { "style_editor": "Editor de Estilos", "reset_style": "Repor Estilo", "conclude": "Concluir", "unique_symbol": "Símbolo Único", "categorized": "Categorizado", "graduated": "Graduado", "null": "Nulo", "select_type": "Selecionar um tipo de estilo", "style_type": "Tipo de Estilo" };
const errors$1 = { "error_ramps_same_name": "Existem rampas com o mesmo nome: ", "error_diff": "A diferença entre os valores máximo e mínimo deve ser maior do que 0, é: ", "error_sum": "A soma das contagens dos intervalos deve ser igual ao número de valores", "error_sum2": "A soma das contagens está incorreta: ", "error_values": "Os valores dos intervalos devem ser crescentes." };
const categorized$1 = { "predefined_styles": "Estilos Pré-definidos", "color_ramps": "Rampas de Cores", "stroke_color": "Cor do Contorno", "stroke_width": "Largura do Contorno", "attribute": "Atributo", "select_attribute": "Selecionar um atributo", "update_colors": "Atualizar cores", "color_opacity": "Opacidade da Cor", "colors_spectrum": "Espetro de Cores", "select_spectrum": "Selecionar um espetro", "custom_style": "Estilo Personalizado", "reverse_colors": "Inverter cores", "color_style": "Estilo de Cores" };
const unique_symbol$1 = { "fill_color": "Cor de Preenchimento" };
const color_picker$1 = { "select_color": "Selecionar uma cor" };
const graduated$1 = { "amount_values": "Quantidade de valores (%)", "values": "Valores", "amount": "Quantidade (%)", "select_mode": "Selecionar um modo", "which_mode": "Qual modo escolher?", "interval_size": "Tamanho do intervalo", "classes_number": "Nº de classes", "invert_colors": "Inverter cores do espetro", "gradient_intervals": "Intervalos de Gradiente", "value": "Valor", "preview": "Pré-visualização", "min_value": "Valor Mínimo", "max_value": "Valor Máximo", "color": "Cor", "mode": "Modo" };
const graduate_modes$1 = { "EqualInterval": "Intervalos Iguais", "Quantile": "Quantil", "NaturalBreaks": "Quebras Naturais (Jenks)", "DefinedInterval": "Intervalos Definidos", "Manual": "Manual", "GeometricInterval": "Intervalo Geométrico", "StandardDeviation": "Desvio Padrão" };
const translationPT = {
  common: common$1,
  errors: errors$1,
  categorized: categorized$1,
  unique_symbol: unique_symbol$1,
  color_picker: color_picker$1,
  graduated: graduated$1,
  graduate_modes: graduate_modes$1
};
const common = { "style_editor": "Style Editor", "reset_style": "Reset Style", "conclude": "Apply", "unique_symbol": "Unique Symbol", "categorized": "Categorized", "graduated": "Graduated", "null": "Null", "select_type": "Select a style type", "style_type": "Style Type" };
const errors = { "error_ramps_same_name": "There are ramps with the same name: ", "error_diff": "The difference between the max and min values must be greater than 0, it is: ", "error_sum": "The sum of the counts of the intervals must be equal to the number of values", "error_sum2": "The sum of the counts is wrong: ", "error_values": "The interval values must be increasing." };
const categorized = { "predefined_styles": "Predefined Styles", "color_ramps": "Color Ramps", "stroke_color": "Stroke Color", "stroke_width": "Stroke Width", "attribute": "Attribute", "select_attribute": "Select an attribute", "update_colors": "Update colors", "color_opacity": "Color Opacity", "colors_spectrum": "Colors Spectrum", "select_spectrum": "Select a spectrum", "custom_style": "Custom Style", "reverse_colors": "Reverse colors", "color_style": "Color Style" };
const unique_symbol = { "fill_color": "Fill Color" };
const color_picker = { "select_color": "Select a color" };
const graduated = { "amount_values": "Amount of values (%)", "values": "Values", "amount": "Amount (%)", "select_mode": "Select a mode", "which_mode": "Which mode to choose?", "interval_size": "Interval size", "classes_number": "Number of classes", "invert_colors": "Invert colors of the spectrum", "gradient_intervals": "Gradient Intervals", "value": "Value", "preview": "Preview", "min_value": "Minimum Value", "max_value": "Maximum Value", "color": "Color", "mode": "Mode" };
const graduate_modes = { "EqualInterval": "Equal Intervals", "Quantile": "Quantile", "NaturalBreaks": "Natural Breaks (Jenks)", "DefinedInterval": "Defined Intervals", "Manual": "Manual", "GeometricInterval": "Geometric Interval", "StandardDeviation": "Standard Deviation" };
const translationEN = {
  common,
  errors,
  categorized,
  unique_symbol,
  color_picker,
  graduated,
  graduate_modes
};
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  debug: true,
  resources: {
    pt: {
      translation: translationPT
    },
    en: {
      translation: translationEN
    }
  },
  interpolation: {
    escapeValue: false
    // not needed for react as it escapes by default
  }
});
function StyleEditor(props) {
  const {
    visible,
    setVisible,
    layerDefaultRenderer,
    layerCurrentRenderer,
    addingToHeader,
    applyRenderer,
    features,
    showPreDefinedRamps,
    moreRamps,
    predefinedStyles,
    primeReactTheme,
    numbersLocale,
    textLocale,
    customLocale
  } = props;
  const addLink = (href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "theme-link";
    link.href = href;
    document.head.appendChild(link);
  };
  if (document.getElementById("primeTheme") == null)
    if (primeReactTheme == void 0)
      addLink("https://land-it.github.io/openlayers-style-editor/themes/lara-light-green/theme.css");
    else {
      addLink("https://land-it.github.io/openlayers-style-editor/themes/" + primeReactTheme + "/theme.css");
    }
  useEffect(() => {
    if (textLocale == "custom" && customLocale) {
      i18n.addResourceBundle("custom", "translation", customLocale, true, true);
      i18n.changeLanguage("custom");
    } else
      i18n.changeLanguage(textLocale ? textLocale : "en");
  }, []);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(I18nextProvider, { i18n, children: /* @__PURE__ */ jsx(PrimeReactProvider, { children: /* @__PURE__ */ jsx(
    StyleEditorComponent,
    {
      visible,
      setVisible,
      layerDefaultRenderer,
      moreRamps,
      predefinedStyles,
      showPreDefinedRamps,
      applyRenderer,
      features,
      layerCurrentRenderer,
      addingToHeader,
      numbersLocale: numbersLocale ? numbersLocale : "en-US"
    }
  ) }) }) });
}
export {
  AttributeTypeEnum,
  GraduatedModes,
  RenderType,
  StyleEditor,
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

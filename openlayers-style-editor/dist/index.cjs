(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("react/jsx-runtime"), require("primereact/api/api.esm.js"), require("react"), require("primereact/dialog/dialog.esm.js"), require("primereact/button/button.esm.js"), require("react-i18next"), require("ol/color.js"), require("react-best-gradient-color-picker"), require("primereact/slider/slider.esm.js"), require("primereact/dropdown/dropdown.esm.js"), require("primereact/checkbox/checkbox.esm.js"), require("primereact/datatable/datatable.esm.js"), require("primereact/column/column.esm.js"), require("primereact/chart/chart.esm.js"), require("primereact/inputnumber/inputnumber.esm.js"), require("primereact/toast/toast.esm.js"), require("geobuckets/dist/src/index.js"), require("primereact/scrollpanel/scrollpanel.esm.js"), require("primereact/panel/panel.esm.js"), require("primereact/fieldset/fieldset.esm.js"), require("primereact/inputtext/inputtext.esm.js"), require("primereact/radiobutton/radiobutton.esm.js"), require("i18next")) : typeof define === "function" && define.amd ? define(["exports", "react/jsx-runtime", "primereact/api/api.esm.js", "react", "primereact/dialog/dialog.esm.js", "primereact/button/button.esm.js", "react-i18next", "ol/color.js", "react-best-gradient-color-picker", "primereact/slider/slider.esm.js", "primereact/dropdown/dropdown.esm.js", "primereact/checkbox/checkbox.esm.js", "primereact/datatable/datatable.esm.js", "primereact/column/column.esm.js", "primereact/chart/chart.esm.js", "primereact/inputnumber/inputnumber.esm.js", "primereact/toast/toast.esm.js", "geobuckets/dist/src/index.js", "primereact/scrollpanel/scrollpanel.esm.js", "primereact/panel/panel.esm.js", "primereact/fieldset/fieldset.esm.js", "primereact/inputtext/inputtext.esm.js", "primereact/radiobutton/radiobutton.esm.js", "i18next"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["OpenLayers Style Editor"] = {}, global.jsxRuntime, global.api_esm_js, global.React, global.dialog_esm_js, global.button_esm_js, global.reactI18next, global.color_js, global.ColorPicker, global.slider_esm_js, global.dropdown_esm_js, global.checkbox_esm_js, global.datatable_esm_js, global.column_esm_js, global.chart_esm_js, global.inputnumber_esm_js, global.toast_esm_js, global.index_js, global.scrollpanel_esm_js, global.panel_esm_js, global.fieldset_esm_js, global.inputtext_esm_js, global.radiobutton_esm_js, global.i18n));
})(this, function(exports2, jsxRuntime, api_esm_js, react, dialog_esm_js, button_esm_js, reactI18next, color_js, ColorPicker, slider_esm_js, dropdown_esm_js, checkbox_esm_js, datatable_esm_js, column_esm_js, chart_esm_js, inputnumber_esm_js, toast_esm_js, index_js, scrollpanel_esm_js, panel_esm_js, fieldset_esm_js, inputtext_esm_js, radiobutton_esm_js, i18n) {
  "use strict";
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
    aux.push(defaultColor || color_js.fromString("#333333"));
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
    return color_js.fromString("#" + (16777216 + Math.random() * 16777215).toString(16).substr(1, 6));
  }
  const MyColorPicker = (props) => {
    const { color, onChange, hideAlpha } = props;
    const [visible, setVisible] = react.useState(false);
    const { t } = reactI18next.useTranslation();
    const selectColor = t("color_picker.select_color");
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          style: { backgroundColor: color_js.asString(color) },
          className: "color-picker",
          onClick: () => setVisible(true)
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(dialog_esm_js.Dialog, { header: selectColor, onHide: () => setVisible(false), visible, children: /* @__PURE__ */ jsxRuntime.jsx(ColorPicker, { value: color_js.asString(color), onChange, hideOpacity: hideAlpha, hideControls: true }) })
    ] });
  };
  function UniqueSymbolComponent(props) {
    const { currentStyle, setColor, setBorderColor, setBorderThickness, borderThickness, color, borderColor } = props;
    const start = "#18d7ba";
    setColor(currentStyle ? currentStyle["fill-color"] : color_js.fromString(start));
    const { t } = reactI18next.useTranslation();
    const fillColorLabel = t("unique_symbol.fill_color");
    const strokeColorLabel = t("categorized.stroke_color");
    const strokeWidthLabel = t("categorized.stroke_width");
    let auxBorder;
    if (currentStyle) {
      if (currentStyle["stroke-color"])
        if (currentStyle["stroke-color"][0] == "case")
          auxBorder = currentStyle["stroke-color"][3];
        else
          auxBorder = currentStyle["stroke-color"];
      else
        auxBorder = color_js.fromString("#000000");
    } else {
      auxBorder = color_js.fromString("#000000");
    }
    setBorderColor(auxBorder);
    let auxBorderWidth;
    if (currentStyle) {
      if (currentStyle["stroke-width"] instanceof Array)
        auxBorderWidth = currentStyle["stroke-width"][3];
      else
        auxBorderWidth = currentStyle["stroke-width"];
    } else {
      auxBorderWidth = 0;
    }
    setBorderThickness(auxBorderWidth);
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-unique", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
          fillColorLabel,
          ":"
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { children: color && /* @__PURE__ */ jsxRuntime.jsx(
          MyColorPicker,
          {
            color,
            onChange: (e) => setColor(color_js.fromString(e))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-unique", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
          strokeColorLabel,
          ":"
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { children: borderColor && /* @__PURE__ */ jsxRuntime.jsx(
          MyColorPicker,
          {
            color: borderColor,
            hideAlpha: true,
            onChange: (e) => setBorderColor(color_js.fromString(e))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-column-gap-7", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
          strokeWidthLabel,
          ": "
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          slider_esm_js.Slider,
          {
            max: 10,
            min: 0,
            className: "slider-wrapper",
            value: borderThickness,
            onChange: (e) => setBorderThickness(e.value)
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
          borderThickness,
          " px"
        ] })
      ] })
    ] }) }) });
  }
  const UniqueSymbol = (props) => {
    const { layerCurrentRenderer, applyRenderer, setVisible } = props;
    const { t } = reactI18next.useTranslation();
    const concludeLabel = t("common.conclude");
    const [color, setColor] = react.useState();
    const [borderColor, setBorderColor] = react.useState();
    const [borderThickness, setBorderThickness] = react.useState();
    const currentStyle = layerCurrentRenderer.field ? null : layerCurrentRenderer.rendererOL;
    function createRenderUnique(color2, outlineColor, outlineWidth) {
      return singleColorStyle(color2, outlineColor, outlineWidth);
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        UniqueSymbolComponent,
        {
          color,
          setColor,
          currentStyle,
          borderColor,
          setBorderColor,
          borderThickness,
          setBorderThickness
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "button-wrapper", children: /* @__PURE__ */ jsxRuntime.jsx(
        button_esm_js.Button,
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
      rampString += color_js.asString(color.color) + " " + color.offset * 100 + "%";
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
        { offset: 0.13, color: color_js.fromString("rgb(222,235,247)") },
        { offset: 0.26, color: color_js.fromString("rgb(198,219,239)") },
        { offset: 0.39, color: color_js.fromString("rgb(158,202,225)") },
        { offset: 0.52, color: color_js.fromString("rgb(107,174,214)") },
        { offset: 0.65, color: color_js.fromString("rgb(66,146,198)") },
        { offset: 0.78, color: color_js.fromString("rgb(33,113,181)") },
        { offset: 0.9, color: color_js.fromString("rgb(8,81,156)") }
      ]
    },
    {
      id: 1,
      name: "BrBG",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(223,194,125)") },
        { offset: 0.5, color: color_js.fromString("rgb(245,245,245)") },
        { offset: 0.75, color: color_js.fromString("rgb(128,205,193)") }
      ]
    },
    {
      id: 2,
      name: "BuGn",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(178,226,226)") },
        { offset: 0.5, color: color_js.fromString("rgb(102,194,164)") },
        { offset: 0.75, color: color_js.fromString("rgb(44,162,95)") }
      ]
    },
    {
      id: 3,
      name: "BuPu",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(179,205,227)") },
        { offset: 0.5, color: color_js.fromString("rgb(140,150,198)") },
        { offset: 0.75, color: color_js.fromString("rgb(136,86,167)") }
      ]
    },
    {
      id: 4,
      name: "GnBu",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(186,228,188)") },
        { offset: 0.5, color: color_js.fromString("rgb(123,204,196)") },
        { offset: 0.75, color: color_js.fromString("rgb(67,162,202)") }
      ]
    },
    {
      id: 5,
      name: "Greens",
      palette: [
        { offset: 0.13, color: color_js.fromString("rgb(229,245,224)") },
        { offset: 0.26, color: color_js.fromString("rgb(199,233,192)") },
        { offset: 0.39, color: color_js.fromString("rgb(161,217,155)") },
        { offset: 0.52, color: color_js.fromString("rgb(116,196,118)") },
        { offset: 0.65, color: color_js.fromString("rgb(65,171,93)") },
        { offset: 0.78, color: color_js.fromString("rgb(35,139,69)") },
        { offset: 0.9, color: color_js.fromString("rgb(0,109,44)") }
      ]
    },
    {
      id: 6,
      name: "Greys",
      palette: [
        { offset: 0, color: color_js.fromString("rgb(250,250,250)") },
        { offset: 1, color: color_js.fromString("rgb(5,5,5)") }
      ]
    },
    {
      id: 7,
      name: "OrRd",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(253,204,138)") },
        { offset: 0.5, color: color_js.fromString("rgb(252,141,89)") },
        { offset: 0.75, color: color_js.fromString("rgb(227,74,51)") }
      ]
    },
    {
      id: 8,
      name: "Oranges",
      palette: [
        { offset: 0.13, color: color_js.fromString("rgb(254,230,206)") },
        { offset: 0.26, color: color_js.fromString("rgb(253,208,162)") },
        { offset: 0.39, color: color_js.fromString("rgb(253,174,107)") },
        { offset: 0.52, color: color_js.fromString("rgb(253,141,60)") },
        { offset: 0.65, color: color_js.fromString("rgb(241,105,19)") },
        { offset: 0.78, color: color_js.fromString("rgb(217,72,1)") },
        { offset: 0.9, color: color_js.fromString("rgb(166,54,3)") }
      ]
    },
    {
      id: 9,
      name: "PRGn",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(194,165,207)") },
        { offset: 0.5, color: color_js.fromString("rgb(247,247,247)") },
        { offset: 0.75, color: color_js.fromString("rgb(166,219,160)") }
      ]
    },
    {
      id: 10,
      name: "PiYG",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(241,182,218)") },
        { offset: 0.5, color: color_js.fromString("rgb(247,247,247)") },
        { offset: 0.75, color: color_js.fromString("rgb(184,225,134)") }
      ]
    },
    {
      id: 11,
      name: "PuBu",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(189,201,225)") },
        { offset: 0.5, color: color_js.fromString("rgb(116,169,207)") },
        { offset: 0.75, color: color_js.fromString("rgb(43,140,190)") }
      ]
    },
    {
      id: 12,
      name: "PuBuGn",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(189,201,225)") },
        { offset: 0.5, color: color_js.fromString("rgb(103,169,207)") },
        { offset: 0.75, color: color_js.fromString("rgb(28,144,153)") }
      ]
    },
    {
      id: 13,
      name: "PuOr",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(230,97,1)") },
        { offset: 0.5, color: color_js.fromString("rgb(94,60,153)") },
        { offset: 0.75, color: color_js.fromString("rgb(178,171,210)") }
      ]
    },
    {
      id: 14,
      name: "PuRd",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(215,181,216)") },
        { offset: 0.5, color: color_js.fromString("rgb(223,101,176)") },
        { offset: 0.75, color: color_js.fromString("rgb(221,28,119)") }
      ]
    },
    {
      id: 15,
      name: "Purples",
      palette: [
        { offset: 0.13, color: color_js.fromString("rgb(239,237,245)") },
        { offset: 0.26, color: color_js.fromString("rgb(218,218,235)") },
        { offset: 0.39, color: color_js.fromString("rgb(188,189,220)") },
        { offset: 0.52, color: color_js.fromString("rgb(158,154,200)") },
        { offset: 0.65, color: color_js.fromString("rgb(128,125,186)") },
        { offset: 0.75, color: color_js.fromString("rgb(106,81,163)") },
        { offset: 0.9, color: color_js.fromString("rgb(84,39,143)") }
      ]
    },
    {
      id: 16,
      name: "RdBu",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(244,165,130)") },
        { offset: 0.5, color: color_js.fromString("rgb(247,247,247)") },
        { offset: 0.75, color: color_js.fromString("rgb(146,197,222)") }
      ]
    },
    {
      id: 17,
      name: "RdGy",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(244,165,130)") },
        { offset: 0.5, color: color_js.fromString("rgb(255,255,255)") },
        { offset: 0.75, color: color_js.fromString("rgb(186,186,186)") }
      ]
    },
    {
      id: 18,
      name: "RdPu",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(253,180,185)") },
        { offset: 0.5, color: color_js.fromString("rgb(247,104,161)") },
        { offset: 0.75, color: color_js.fromString("rgb(197,27,138)") }
      ]
    },
    {
      id: 19,
      name: "RdYlBu",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(253,184,99)") },
        { offset: 0.5, color: color_js.fromString("rgb(255,255,191)") },
        { offset: 0.75, color: color_js.fromString("rgb(171,217,233)") }
      ]
    },
    {
      id: 20,
      name: "RdYlGn",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(253,174,97)") },
        { offset: 0.5, color: color_js.fromString("rgb(255,255,192)") },
        { offset: 0.75, color: color_js.fromString("rgb(166,217,106)") }
      ]
    },
    {
      id: 21,
      name: "Reds",
      palette: [
        { offset: 0.13, color: color_js.fromString("rgb(254,224,210)") },
        { offset: 0.26, color: color_js.fromString("rgb(252,187,161)") },
        { offset: 0.39, color: color_js.fromString("rgb(252,146,114)") },
        { offset: 0.52, color: color_js.fromString("rgb(251,106,74)") },
        { offset: 0.65, color: color_js.fromString("rgb(239,59,44)") },
        { offset: 0.78, color: color_js.fromString("rgb(203,24,29)") },
        { offset: 0.9, color: color_js.fromString("rgb(165,15,21)") }
      ]
    },
    {
      id: 22,
      name: "Spectral",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(253,174,97)") },
        { offset: 0.5, color: color_js.fromString("rgb(255,255,191)") },
        { offset: 0.75, color: color_js.fromString("rgb(171,221,164)") }
      ]
    },
    {
      id: 23,
      name: "YlGn",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(194,230,153)") },
        { offset: 0.5, color: color_js.fromString("rgb(120,198,121)") },
        { offset: 0.75, color: color_js.fromString("rgb(49,163,84)") }
      ]
    },
    {
      id: 24,
      name: "YlGnBu",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(161,218,180)") },
        { offset: 0.5, color: color_js.fromString("rgb(65,182,196)") },
        { offset: 0.75, color: color_js.fromString("rgb(44,127,184)") }
      ]
    },
    {
      id: 25,
      name: "YlOrBr",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(254,217,142)") },
        { offset: 0.5, color: color_js.fromString("rgb(254,153,41)") },
        { offset: 0.75, color: color_js.fromString("rgb(217,95,14)") }
      ]
    },
    {
      id: 26,
      name: "YlOrRd",
      palette: [
        { offset: 0.25, color: color_js.fromString("rgb(254,204,92)") },
        { offset: 0.5, color: color_js.fromString("rgb(253,141,60)") },
        { offset: 0.75, color: color_js.fromString("rgb(240,59,32)") }
      ]
    },
    {
      id: 27,
      name: "Semaphore",
      palette: [
        { offset: 0.1, color: color_js.fromString("rgb(215,48,39)") },
        { offset: 0.3, color: color_js.fromString("rgb(252,141,89)") },
        { offset: 0.5, color: color_js.fromString("rgb(218,225,12)") },
        { offset: 0.7, color: color_js.fromString("rgb(145,207,96)") },
        { offset: 0.9, color: color_js.fromString("rgb(26,152,80)") }
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
    const { t } = reactI18next.useTranslation();
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
    const [selectedSpectrumColors, setSelectedSpectrumColors] = react.useState({ label: customStyleLabel, value: [] });
    const [table, setTable] = react.useState(valuesAndColors);
    const [selectedAttr, setSelectedAttr] = react.useState(layerCurrentRenderer.field ? attr.find((at) => at.name == layerCurrentRenderer.field) : void 0);
    const [rowClick] = react.useState(false);
    const currentStyle = layerCurrentRenderer.type != RenderType.Categorized ? null : layerCurrentRenderer.rendererOL;
    const [borderColor, setBorderColor] = react.useState(currentStyle ? stroke.color : color_js.fromString("#000000"));
    const [borderThickness, setBorderThickness] = react.useState(currentStyle ? stroke.size : 1);
    const [fillOpacity, setFillOpacity] = react.useState(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100);
    const [isReversed, setIsReversed] = react.useState(false);
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
      (ramp, _index, self2) => self2.filter((r) => r.name === ramp.name).length > 1
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
        return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: "3px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
            background: getColorRampString(option.value.value),
            width: "90px",
            height: "20px"
          } }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: option.label })
        ] });
      return /* @__PURE__ */ jsxRuntime.jsx("span", { children: option.label });
    };
    const visibleColumnTemplate = (tr) => {
      return /* @__PURE__ */ jsxRuntime.jsx(checkbox_esm_js.Checkbox, { checked: tr.visible });
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
      return /* @__PURE__ */ jsxRuntime.jsx("div", { hidden: !tr.visible, children: /* @__PURE__ */ jsxRuntime.jsx(
        MyColorPicker,
        {
          onChange: (e) => updateColorPicker(color_js.fromString(e), tr),
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
              color: color_js.fromString(colors[i++])
            });
          else
            tableUpdated.push({
              value: value2,
              visible,
              color: color_js.fromString("white")
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
              color: color_js.fromString("white")
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
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "categorized-container", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "attribute-container", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { width: "auto" }, children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
            attributeLabel,
            ":"
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            dropdown_esm_js.Dropdown,
            {
              value: selectedAttr,
              onChange: (e) => changeAttribute(e),
              options: attr,
              optionLabel: "name",
              itemTemplate: (option) => /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                option.name,
                " (",
                option.values.length,
                ")"
              ] }),
              placeholder: selectAttributeLabel
            }
          )
        ] }),
        table.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "stroke-row", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "stroke-color-container", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                strokeColorLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(
                MyColorPicker,
                {
                  color: borderColor,
                  hideAlpha: true,
                  onChange: (e) => setBorderColor(color_js.fromString(e))
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "stroke-width-container", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                strokeWidthLabel,
                ":"
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(
                slider_esm_js.Slider,
                {
                  max: 10,
                  min: 0,
                  className: "stroke-slider",
                  value: borderThickness,
                  onChange: (e) => setBorderThickness(e.value)
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                borderThickness,
                " px"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "opacity-container", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
              colorOpacityLabel,
              ":"
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              slider_esm_js.Slider,
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
            /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
              fillOpacity,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "spectrum-container", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { style: { width: "auto" }, children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
              colorStyleLabel,
              ":"
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              dropdown_esm_js.Dropdown,
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
            /* @__PURE__ */ jsxRuntime.jsx(
              button_esm_js.Button,
              {
                text: true,
                icon: "pi pi-refresh",
                disabled: !selectedSpectrumColors,
                tooltip: updateColorsLabel,
                onClick: () => updateColorsByColorRamp(selectedSpectrumColors, isReversed)
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              button_esm_js.Button,
              {
                text: true,
                icon: "pi pi-arrow-right-arrow-left",
                disabled: !selectedSpectrumColors,
                tooltip: reverseColorsLabel,
                onClick: () => revertColors()
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntime.jsxs(
            datatable_esm_js.DataTable,
            {
              value: table,
              selectionMode: rowClick ? void 0 : "checkbox",
              tableStyle: { minWidth: "25rem" },
              selection: table.filter((tr) => tr.visible),
              onSelectionChange: (event) => {
                const value = event.value;
                changeVisibility(value);
              },
              reorderableRows: true,
              onRowReorder: (e) => setTable(e.value),
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(column_esm_js.Column, { rowReorder: true, style: { width: "3rem" } }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  column_esm_js.Column,
                  {
                    selectionMode: "multiple",
                    field: "visible",
                    body: visibleColumnTemplate
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(column_esm_js.Column, { field: "color", header: colorLabel, body: colorColumnTemplate }),
                /* @__PURE__ */ jsxRuntime.jsx(column_esm_js.Column, { field: "value", header: valueLabel, sortable: true })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "footer-container", children: /* @__PURE__ */ jsxRuntime.jsx(
        button_esm_js.Button,
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
    const { t } = reactI18next.useTranslation();
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
    const toast = react.useRef(null);
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
    const [opacity, setOpacity] = react.useState(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100);
    const [stops, setStops] = react.useState(valuesAndColors);
    const [selectedAttr, setSelectedAttr] = react.useState(layerCurrentRenderer.field ? attr.find((at) => at.name == layerCurrentRenderer.field) : void 0);
    const [selectedMode, setSelectedMode] = react.useState(layerCurrentRenderer.type == RenderType.Graduated ? layerCurrentRenderer.graduatedType : void 0);
    const [intervals, setIntervals] = react.useState([]);
    const [classNo, setClassNo] = react.useState(layerCurrentRenderer.type == RenderType.Graduated ? valuesAndColors.length - 1 : 5);
    const [intervalSize, setIntervalSize] = react.useState(0);
    const [selectedSpectrumColors, setSelectedSpectrumColors] = react.useState();
    const [borderColor, setBorderColor] = react.useState(currentStyle ? stroke.color : color_js.fromString("#000000"));
    const [borderThickness, setBorderThickness] = react.useState(currentStyle ? stroke.size : 1);
    const [chartData, setChartData] = react.useState({});
    const [chartOptions, setChartOptions] = react.useState({});
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
      (ramp, _index, self2) => self2.filter((r) => r.name === ramp.name).length > 1
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
        return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: "3px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
            background: getColorRampString(option.value.value),
            width: "90px",
            height: "20px"
          } }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: option.label })
        ] });
      return /* @__PURE__ */ jsxRuntime.jsx("span", { children: option.label });
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
        const color = color_js.fromString(colors[index]);
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
            stops2.push({ value: min + interval2 * i, color: color_js.fromString("rgb(0,0,0)") });
          }
          stops2.push({ value: max, color: color_js.fromString("rgb(0,0,0)") });
          break;
        }
        case GraduatedModes.DefinedInterval: {
          const interval = range / intervalSize2;
          console.log("interval", interval, intervalSize2);
          for (let i = 0; i <= interval; i++) {
            stops2.push({ value: min + intervalSize2 * i, color: color_js.fromString("rgb(0,0,0)") });
          }
          break;
        }
        case GraduatedModes.NaturalBreaks: {
          const auxJenks = await index_js.jenksBuckets(values, nClasses);
          stops2 = auxJenks.map((value) => {
            return { value, color: color_js.fromString("rgb(0,0,0)") };
          });
          break;
        }
        case GraduatedModes.Quantile: {
          const auxQuantile = await index_js.quantileBuckets(values, nClasses);
          stops2 = auxQuantile.map((value) => {
            return { value, color: color_js.fromString("rgb(0,0,0)") };
          });
          break;
        }
        // case Modes.GeometricInterval:
        //     for (let i = 0; i < 5; i++) {
        //         stops.push({value: min + interval * i, color: fromString("rgb(0,0,0)")})
        //     }
        //     break
        case GraduatedModes.StandardDeviation:
          const auxStand = await index_js.standardDeviationBuckets(values, nClasses);
          stops2 = auxStand.map((value) => {
            return { value, color: color_js.fromString("rgb(0,0,0)") };
          });
          break;
      }
      setIntervals(countNumbers(values || []));
      return stops2;
    }
    react.useEffect(() => {
      if (stops.length > 0) {
        let values = (selectedAttr == null ? void 0 : selectedAttr.values.map(Number)) || [];
        values = values.filter((v) => !isNaN(v) && v != null);
        setIntervals(countNumbers(values || []));
      }
    }, []);
    const stopsValues = stops.map((s) => s.value).join(", ");
    react.useEffect(() => {
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
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-column", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-small-gap", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
              attributeLabel,
              ":"
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              dropdown_esm_js.Dropdown,
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
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-small-gap", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
              modeLabel,
              ":"
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              dropdown_esm_js.Dropdown,
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
            /* @__PURE__ */ jsxRuntime.jsx(
              "a",
              {
                href: "https://resources.arcgis.com/en/help/main/10.2/index.html#//00s50000001r000000",
                target: "_blank",
                children: whichModeLabel
              }
            )
          ] })
        ] }),
        selectedMode && /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-small-gap", children: [
            selectedAttr && /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                minValueLabel,
                ":"
              ] }),
              " ",
              Math.min(...selectedAttr.values.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)
            ] }),
            selectedAttr && /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                maxValueLabel,
                ":"
              ] }),
              " ",
              Math.max(...selectedAttr.values.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)
            ] })
          ] }),
          (selectedMode == GraduatedModes.Manual || selectedMode == GraduatedModes.EqualInterval || selectedMode == GraduatedModes.Quantile || selectedMode == GraduatedModes.NaturalBreaks || selectedMode == GraduatedModes.GeometricInterval) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-gap-15", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
              classesNumberLabel,
              ":"
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              inputnumber_esm_js.InputNumber,
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
          (selectedMode == GraduatedModes.DefinedInterval || selectedMode == GraduatedModes.StandardDeviation) && /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "auto-width-span", children: [
              intervalSizeLabel,
              ":"
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(
              inputnumber_esm_js.InputNumber,
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
        selectedMode && selectedAttr && /* @__PURE__ */ jsxRuntime.jsx(
          chart_esm_js.Chart,
          {
            className: "chart-wrapper",
            type: "bar",
            data: chartData,
            options: chartOptions
          }
        ),
        stops.length > 0 && selectedMode && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-column-gap-15px", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-gap-50px", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-center", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                  colorsSpectrumLabel,
                  ":"
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  dropdown_esm_js.Dropdown,
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
                /* @__PURE__ */ jsxRuntime.jsx(
                  button_esm_js.Button,
                  {
                    text: true,
                    icon: "pi pi-arrow-right-arrow-left",
                    tooltip: invertColorsLabel,
                    disabled: !selectedSpectrumColors,
                    onClick: () => applyRampToStops(selectedSpectrumColors, true)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-column-small-gap", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "auto-width-span", children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                  gradientIntervalsLabel,
                  ":"
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-small-gap", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "auto-width-span", children: [
                    valueLabel,
                    "             "
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "auto-width-span", children: colorLabel })
                ] }),
                stops.map(
                  (value, index) => {
                    var _a, _b;
                    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-row-small-small-gap", children: [
                      /* @__PURE__ */ jsxRuntime.jsx(
                        inputnumber_esm_js.InputNumber,
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
                      /* @__PURE__ */ jsxRuntime.jsx(
                        MyColorPicker,
                        {
                          color: value.color,
                          onChange: (e) => {
                            const aux = [...stops];
                            aux[index].color = color_js.fromString(e);
                            setStops(aux);
                          }
                        }
                      )
                    ] }, index);
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-row-gap-50px", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "color-picker-wrapper", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                  strokeColorLabel,
                  ":"
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(
                  MyColorPicker,
                  {
                    color: borderColor,
                    hideAlpha: true,
                    onChange: (e) => setBorderColor(color_js.fromString(e))
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-column-gap-7px", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                  strokeWidthLabel,
                  ":"
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  slider_esm_js.Slider,
                  {
                    max: 10,
                    min: 0,
                    className: "slider-wrapper",
                    value: borderThickness,
                    onChange: (e) => setBorderThickness(e.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                  borderThickness,
                  " px"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-column-gap-7px", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                  colorOpacityLabel,
                  ":"
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  slider_esm_js.Slider,
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
                /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                  opacity,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-column-gap-7px", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
                  previewLabel,
                  ":"
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: {
                  background: getColorRampString(stops.map((stop, index) => {
                    return { offset: index / stops.length, color: stop.color };
                  }))
                }, className: "preview-color-ramp" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "button-wrapper", children: /* @__PURE__ */ jsxRuntime.jsx(
            button_esm_js.Button,
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
      /* @__PURE__ */ jsxRuntime.jsx(toast_esm_js.Toast, { ref: toast })
    ] });
  };
  const FilterWidgetContext = react.createContext(null);
  function FilterWidgetContextProvider({ children, attributes }) {
    const initial = {
      title: "",
      attributes,
      expressionSet: [
        {
          id: 0,
          conditions: [0],
          expression: {
            conditions: [{ attribute: "", op: "", value: "" }],
            isAll: void 0
          }
        }
      ],
      expressionsComponents: [0]
    };
    const [queryWidget, setQueryWidget] = react.useState(initial);
    function setTitle(value) {
      setQueryWidget({ ...queryWidget, title: value });
    }
    function setExpressionSet(value) {
      setQueryWidget({ ...queryWidget, expressionSet: value });
    }
    function setExpressionsComponents(value) {
      setQueryWidget({ ...queryWidget, expressionsComponents: value });
    }
    function setAttributes(value) {
      setQueryWidget({ ...queryWidget, attributes: value });
    }
    function reset() {
      let aux = initial;
      setQueryWidget(aux);
    }
    function addAttributes(atts) {
      let aux = queryWidget.attributes;
      aux.push(...atts);
      setAttributes(aux);
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      FilterWidgetContext.Provider,
      {
        value: {
          queryWidget,
          setTitle,
          setExpressionSet,
          setExpressionsComponents,
          reset,
          setAttributes,
          addAttributes
        },
        children
      }
    );
  }
  const ConditionOnFilter = (props) => {
    const { parentID, id, deleteF } = props;
    const {
      queryWidget,
      setExpressionSet
    } = react.useContext(FilterWidgetContext);
    const toast = react.useRef(null);
    const [selectedAttribute, setSelectedAttribute] = react.useState();
    const [conditionData, setConditionData] = react.useState(null);
    const [selectedFunction, setSelectedFunction] = react.useState();
    const functionsBooleans = [
      { name: "Sim", logic: "true" },
      { name: "Não", logic: "false" }
    ];
    const functionsTexts = [
      { name: "é", logic: "==" },
      { name: "não é", logic: "!=" },
      { name: "começa com", logic: "startsWith" },
      { name: "acaba com", logic: "endsWith" },
      { name: "contém", logic: "in" },
      { name: "não contém", logic: "!in" },
      { name: "é nulo", logic: "null" }
    ];
    const functionsNumbers = [
      { name: "é", logic: "==" },
      { name: "não é", logic: "!=" },
      { name: "é pelo menos", logic: ">=" },
      { name: "é menor que", logic: "<" },
      { name: "é no máximo", logic: "<=" },
      { name: "é maior que", logic: ">" },
      { name: "é nulo", logic: "null" }
    ];
    const [selectedValue, setSelectedValue] = react.useState();
    const [values, setValues] = react.useState();
    react.useEffect(() => {
      if (selectedAttribute != void 0) {
        let aux = queryWidget.attributes.filter((feature) => feature.name == selectedAttribute.name)[0];
        setValues(aux == null ? void 0 : aux.values.filter((i) => i != null));
      }
    }, [queryWidget.attributes, selectedAttribute]);
    react.useEffect(() => {
      const fullExp = queryWidget.expressionSet.find((item) => item.id === parentID);
      if (!fullExp) return;
      const conditionIndex = fullExp.conditions.findIndex((c) => c === id);
      if (conditionIndex === -1) return;
      const condition = fullExp.expression.conditions[conditionIndex];
      const foundAttribute = queryWidget.attributes.find((a) => a.name === condition.attribute);
      if (foundAttribute) {
        setSelectedAttribute(foundAttribute);
      }
      let functionSet;
      if ((foundAttribute == null ? void 0 : foundAttribute.type) === AttributeTypeEnum.STRING || (foundAttribute == null ? void 0 : foundAttribute.type) === AttributeTypeEnum.JSON) {
        functionSet = functionsTexts;
      } else if ((foundAttribute == null ? void 0 : foundAttribute.type) === AttributeTypeEnum.BOOLEAN) {
        functionSet = functionsBooleans;
      } else {
        functionSet = functionsNumbers;
      }
      const foundFunction = functionSet.find((f) => f.logic === condition.op);
      if (foundFunction) {
        setSelectedFunction(foundFunction);
      }
      if (condition.value) {
        setSelectedValue(condition.value);
      }
    }, [queryWidget.expressionSet, queryWidget.attributes, id]);
    function update(funct, value, attribute) {
      var _a, _b, _c;
      let fullExp = queryWidget.expressionSet.find((item) => item.id === parentID);
      let expression = fullExp.expression;
      let condition = expression.conditions.at((_a = fullExp.conditions) == null ? void 0 : _a.findIndex((c) => c == id));
      if (funct) {
        condition.op = funct.logic;
      }
      if (value) {
        if (value.includes("'") || value.includes('"'))
          (_b = toast.current) == null ? void 0 : _b.show({
            severity: "error",
            summary: "Error",
            detail: "A condição " + parentID + "." + id + " contém caracteres inválidos."
          });
        else {
          condition.value = value;
        }
      }
      if (attribute) {
        if (attribute.name != null)
          condition.attribute = attribute.name;
        else
          (_c = toast.current) == null ? void 0 : _c.show({
            severity: "error",
            summary: "Error",
            detail: "A condição tem um atributo inválido"
          });
      }
      queryWidget.expressionSet.splice(
        queryWidget.expressionSet.findIndex((item) => item.id === parentID),
        1,
        { id: parentID, conditions: fullExp.conditions, expression }
      );
      setExpressionSet(queryWidget.expressionSet);
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { position: "relative", paddingBottom: "5px" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { position: "absolute", right: 0 }, children: /* @__PURE__ */ jsxRuntime.jsx(button_esm_js.Button, { icon: "pi pi-times", onClick: () => {
          return deleteF(id);
        } }) }),
        /* @__PURE__ */ jsxRuntime.jsx(fieldset_esm_js.Fieldset, { legend: "Condição " + parentID + "." + id, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            dropdown_esm_js.Dropdown,
            {
              value: selectedAttribute,
              onChange: (e) => {
                setSelectedFunction(void 0);
                setSelectedAttribute(e.value);
                update(void 0, void 0, e.value);
              },
              options: queryWidget.attributes,
              optionLabel: "name",
              placeholder: "Selecione o atributo",
              className: "w-full md:w-14rem"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            dropdown_esm_js.Dropdown,
            {
              value: selectedFunction,
              onChange: (e) => {
                setSelectedFunction(e.value);
                update(e.value, void 0, void 0);
              },
              options: (selectedAttribute == null ? void 0 : selectedAttribute.type) == AttributeTypeEnum.STRING || (selectedAttribute == null ? void 0 : selectedAttribute.type) == AttributeTypeEnum.JSON ? functionsTexts : (selectedAttribute == null ? void 0 : selectedAttribute.type) == AttributeTypeEnum.BOOLEAN ? functionsBooleans : functionsNumbers,
              disabled: selectedAttribute == void 0,
              optionLabel: "name",
              placeholder: "Selecione o operador"
            }
          ),
          (selectedAttribute == null ? void 0 : selectedAttribute.type) != AttributeTypeEnum.BOOLEAN && (selectedFunction == null ? void 0 : selectedFunction.name) != "é nulo" && /* @__PURE__ */ jsxRuntime.jsx(
            dropdown_esm_js.Dropdown,
            {
              value: selectedValue,
              editable: true,
              onChange: (e) => {
                setSelectedValue(e.value);
                update(void 0, e.value, void 0);
              },
              options: (values == null ? void 0 : values.length) < 200 ? values : values == null ? void 0 : values.slice(0, 200),
              filter: true,
              placeholder: "Selecione um valor",
              disabled: selectedFunction == void 0,
              className: "w-full md:w-14rem"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(toast_esm_js.Toast, { ref: toast })
    ] });
  };
  const ExpressionOnFilter = (props) => {
    const { id } = props;
    const {
      queryWidget,
      setExpressionSet
    } = react.useContext(FilterWidgetContext);
    const [selectedOp, setSelectedOp] = react.useState(null);
    const ops = [
      { name: "Todas verdadeiras" },
      { name: "Pelo menos uma verdadeira" }
    ];
    react.useEffect(() => {
      const currentExp2 = queryWidget.expressionSet.find((item) => item.id === id);
      if ((currentExp2 == null ? void 0 : currentExp2.expression.isAll) !== void 0) {
        setSelectedOp(currentExp2.expression.isAll ? ops[0] : ops[1]);
      }
    }, [queryWidget.expressionSet, id]);
    const currentExp = queryWidget.expressionSet.find((item) => item.id === id);
    function addCondition() {
      var _a, _b;
      if (currentExp.conditions.length < 10) {
        let expression = (_a = queryWidget.expressionSet.find((item) => item.id === id)) == null ? void 0 : _a.expression;
        (_b = expression.conditions) == null ? void 0 : _b.push({
          attribute: "",
          op: "",
          value: ""
        });
        queryWidget.expressionSet.splice(
          queryWidget.expressionSet.findIndex((item) => item.id === id),
          1,
          {
            id,
            conditions: [...currentExp.conditions, currentExp.conditions.at(currentExp.conditions.length - 1) + 1],
            expression
          }
        );
        setExpressionSet(queryWidget.expressionSet);
      }
    }
    function deleteCondition(idCond) {
      var _a, _b;
      if (currentExp.conditions.length > 1) {
        let index = currentExp.conditions.findIndex((item) => item === idCond);
        let expression = (_a = queryWidget.expressionSet.find((item) => item.id === id)) == null ? void 0 : _a.expression;
        (_b = expression.conditions) == null ? void 0 : _b.splice(index, 1);
        queryWidget.expressionSet.splice(
          queryWidget.expressionSet.findIndex((item) => item.id === id),
          1,
          {
            id,
            conditions: currentExp.conditions.filter((item) => item !== idCond),
            expression
          }
        );
        setExpressionSet(queryWidget.expressionSet);
      }
    }
    function update(op) {
      var _a;
      let expression = (_a = queryWidget.expressionSet.find((item) => item.id === id)) == null ? void 0 : _a.expression;
      expression.isAll = op === "Todas verdadeiras";
      queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex((item) => item.id === id), 1, {
        id,
        conditions: currentExp.conditions,
        expression
      });
      setExpressionSet(queryWidget.expressionSet);
    }
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { position: "relative", paddingBottom: "5px" }, children: /* @__PURE__ */ jsxRuntime.jsx(panel_esm_js.Panel, { header: "Expressão " + id, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(scrollpanel_esm_js.ScrollPanel, { style: { width: "100%", height: "90%" }, children: /* @__PURE__ */ jsxRuntime.jsx("ul", { style: { paddingLeft: "0" }, children: currentExp.conditions.map(
        (item, index) => /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(
          ConditionOnFilter,
          {
            id: item,
            parentID: id,
            deleteF: deleteCondition
          }
        ) }, index)
      ) }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        width: "230px",
        gap: "5px"
      }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(button_esm_js.Button, { label: "Adicionar Condição", outlined: true, onClick: addCondition }),
        /* @__PURE__ */ jsxRuntime.jsx(
          dropdown_esm_js.Dropdown,
          {
            style: { paddingBottom: "5px" },
            value: selectedOp,
            onChange: (e) => {
              setSelectedOp(e.value);
              update(e.value.name);
            },
            options: ops,
            optionLabel: "name",
            placeholder: "Selecione o operador",
            className: "w-full md:w-14rem"
          }
        )
      ] })
    ] }) }) }) });
  };
  const expressions = "_expressions_115p4_1";
  const text = "_text_115p4_13";
  const dialogDimensions = "_dialogDimensions_115p4_51";
  const addExpression = "_addExpression_115p4_61";
  const styles = {
    expressions,
    text,
    dialogDimensions,
    addExpression
  };
  const FilterWidget = (props) => {
    const [isDataLoaded, setIsDataLoaded] = react.useState(false);
    const { visible, setVisible, filter } = props;
    const { queryWidget, setTitle, setExpressionSet, setExpressionsComponents, reset } = react.useContext(FilterWidgetContext);
    const toast = react.useRef(null);
    const [color, setColor] = react.useState();
    const [borderColor, setBorderColor] = react.useState();
    const [borderThickness, setBorderThickness] = react.useState();
    const [isElse, setIsElse] = react.useState(false);
    function constructJsonString(operator, attribute, value) {
      if (value === "") {
        return `{"==": [{"var": "${attribute}"}, null]}`;
      }
      return !isNaN(parseFloat(value)) ? constructJsonStringNumerical(operator, attribute, parseFloat(value)) : constructJsonStringText(operator, attribute, value);
    }
    function constructJsonStringNumerical(operator, attribute, value) {
      const min = value - 1e-3;
      const max = value + 1e-3;
      switch (operator) {
        case "==":
          return `{
                "and": [
                    { "<=": [{ "var": "${attribute}" }, ${max}] },
                    { ">=": [{ "var": "${attribute}" }, ${min}] }
                ]
            }`;
        case "!=":
          return `{
                "!": {
                    "and": [
                        { "<=": [{ "var": "${attribute}" }, ${max}] },
                        { ">=": [{ "var": "${attribute}" }, ${min}] }
                    ]
                }
            }`;
        case "<":
          return `{
                "<": [{ "var": "${attribute}" }, ${max}]
            }`;
        case ">":
          return `{
                ">": [{ "var": "${attribute}" }, ${min}]
            }`;
        default:
          return `{
                "${operator}": [{ "var": "${attribute}" }, ${value}]
            }`;
      }
    }
    function constructJsonStringText(operator, attribute, value) {
      switch (operator) {
        // Json-Logic does not have explicit "startsWith" or "endsWith" operators.
        // Instead, these are implemented using substring extraction and equality checks.
        case "startsWith":
          return `{
                "==": [
                    { "substr": [{ "var": "${attribute}" }, 0, ${value.length}] },
                    "${value}"
                ]
            }`;
        case "endsWith":
          return `{
                "==": [
                    { "substr": [{ "var": "${attribute}" }, -${value.length}] },
                    "${value}"
                ]
            }`;
        //Json-Logic does not have a "!in" operator. Instead, one must negate the "in" operator.
        case "!in":
          return `{
                "!": {
                    "in": [${JSON.stringify(value)}, { "var": "${attribute}" }]
                }
            }`;
        //no particular case
        default:
          return `{
                "${operator}": [{ "var": "${attribute}" }, "${value}"]
            }`;
      }
    }
    function buildJsonLogicRule(conditions, isAll) {
      if (conditions.length === 0) return "";
      const operator = isAll ? "and" : "or";
      return `{ "${operator}": [${conditions.join(", ")}] }`;
    }
    function generateRulesFromExpression(expression) {
      const conditionGroups = [];
      if (!expression || !Array.isArray(expression.conditions)) {
        return "";
      }
      expression.conditions.forEach((condition) => {
        const { type, op, attribute, value } = condition;
        const jsonString = constructJsonString(op, attribute, value);
        conditionGroups.push(jsonString);
      });
      return buildJsonLogicRule(conditionGroups, expression.isAll);
    }
    function deconstructRule(rule) {
      const parsedRule = JSON.parse(rule);
      const isAll = parsedRule.hasOwnProperty("and");
      const conditions = parsedRule[isAll ? "and" : "or"];
      const deconstructedConditions = conditions.map((condition) => {
        const operator = Object.keys(condition)[0];
        const value = condition[operator];
        if (operator === "==" && value[0].hasOwnProperty("substr")) {
          const substr = value[0].substr;
          const valueString = value[1];
          if (substr[1] < 0) {
            return {
              operator: "endsWith",
              attribute: substr[0].var,
              value: valueString
            };
          } else {
            return {
              operator: "startsWith",
              attribute: substr[0].var,
              value: valueString
            };
          }
        }
        if (operator === "!in") {
          return {
            operator: "!in",
            attribute: value[0].var,
            value: value[1].toString()
          };
        }
        if (operator === "!") {
          const innerOperator = Object.keys(value)[0];
          const innerCondition = value[innerOperator];
          if (innerOperator === "and") {
            const subConditions = innerCondition;
            const firstCondition = subConditions[0];
            const secondCondition = subConditions[1];
            const firstOperator = Object.keys(firstCondition)[0];
            const secondOperator = Object.keys(secondCondition)[0];
            if (firstOperator === "<=" && secondOperator === ">=") {
              const firstValue = firstCondition[firstOperator][1];
              secondCondition[secondOperator][1];
              const adjustedValue = !isNaN(parseFloat(firstValue)) ? firstValue - 1e-3 : firstValue;
              return {
                operator: "!=",
                attribute: firstCondition[firstOperator][0].var,
                value: adjustedValue
              };
            }
          } else if (innerOperator === "in") {
            return {
              operator: "!in",
              attribute: innerCondition[1].var,
              value: innerCondition[0]
            };
          }
        }
        if (operator === "and") {
          const subConditions = value;
          if (subConditions.length === 2) {
            const firstCondition = subConditions[0];
            const secondCondition = subConditions[1];
            const firstOperator = Object.keys(firstCondition)[0];
            const secondOperator = Object.keys(secondCondition)[0];
            if (firstOperator === "<=" && secondOperator === ">=") {
              const firstValue = firstCondition[firstOperator][1];
              const adjustedValue = !isNaN(parseFloat(firstValue)) ? firstValue - 1e-3 : firstValue;
              return {
                operator: "==",
                attribute: firstCondition[firstOperator][0].var,
                value: adjustedValue
              };
            }
          }
        }
        if (operator === "==") {
          const max = value[1];
          if (max === null) {
            return {
              operator: "null",
              attribute: value[0].var
            };
          }
          return {
            operator: "==",
            attribute: value[0].var,
            value: !isNaN(parseFloat(max)) ? max - 1e-3 : max
          };
        }
        if (operator === "!=") {
          return {
            operator: "!=",
            attribute: value[0].var,
            value: value[1].toString()
          };
        }
        if (operator === "in") {
          return {
            operator: "in",
            attribute: value[0].var,
            value: value[1].toString()
          };
        }
        if (operator === ">=") {
          const max = value[1];
          return {
            operator: ">=",
            attribute: value[0].var,
            value: max
          };
        }
        if (operator === "<=") {
          const max = value[1];
          return {
            operator: "<=",
            attribute: value[0].var,
            value: max
          };
        }
        if (operator === "<") {
          const max = value[1];
          return {
            operator: "<",
            attribute: value[0].var,
            value: max + 1e-3
          };
        }
        if (operator === ">") {
          const max = value[1];
          return {
            operator: ">",
            attribute: value[0].var,
            value: max + 1e-3
          };
        }
        return {};
      });
      return {
        isAll,
        conditions: deconstructedConditions
      };
    }
    react.useEffect(() => {
      if (!filter) {
        setIsDataLoaded(true);
        return;
      }
      setTitle(filter.name);
      queryWidget.title = filter.name;
      if (filter) {
        const allConditions = [];
        const deconstructed = deconstructRule(filter.filterJson);
        deconstructed.conditions.forEach((condition) => {
          allConditions.push({
            attribute: condition.attribute || "",
            op: condition.operator || "==",
            value: condition.value
          });
        });
        const unifiedExpression = {
          id: 0,
          conditions: allConditions.map((_, index) => index),
          expression: {
            conditions: allConditions,
            isAll: filter.isAll
          }
        };
        setExpressionSet([unifiedExpression]);
      }
      if (queryWidget.title === filter.name && queryWidget.expressionSet.length > 0) {
        setIsDataLoaded(true);
      }
    }, [filter]);
    react.useEffect(() => {
      setExpressionsComponents(queryWidget.expressionSet.map((exp) => exp.id));
    }, [queryWidget.expressionSet]);
    function addPolygons() {
      var _a, _b;
      if (queryWidget.title === "") {
        (_a = toast.current) == null ? void 0 : _a.show({
          severity: "info",
          summary: "Info",
          detail: "Título não pode ser vazio!"
        });
        return;
      }
      const exps = queryWidget.expressionSet;
      if (exps.length === 0) {
        (_b = toast.current) == null ? void 0 : _b.show({
          severity: "info",
          summary: "Info",
          detail: "Tenha pelo menos uma expressão!"
        });
        return;
      }
      let hasToStop = false;
      exps.forEach((tuple, expIndex) => {
        var _a2, _b2;
        if (tuple.expression.isAll == void 0) {
          (_a2 = toast.current) == null ? void 0 : _a2.show({
            severity: "info",
            summary: "Info",
            detail: "Selecione se a expressão " + tuple.id + ' é "E" ou "OU"'
          });
          hasToStop = true;
          return;
        }
        (_b2 = tuple.expression.conditions) == null ? void 0 : _b2.forEach((cond, index) => {
          var _a3, _b3, _c;
          if (cond.attribute == "") {
            (_a3 = toast.current) == null ? void 0 : _a3.show({
              severity: "info",
              summary: "Info",
              detail: "Selecione um atributo para a condição " + expIndex + "." + index
            });
            hasToStop = true;
            return;
          }
          if (cond.op == "") {
            (_b3 = toast.current) == null ? void 0 : _b3.show({
              severity: "info",
              summary: "Info",
              detail: "Selecione uma função para a condição " + expIndex + "." + index
            });
            hasToStop = true;
            return;
          }
          let aux = cond.op == "null" || (cond.op == "true" || cond.op == "false");
          if (cond.value == void 0 && !aux) {
            (_c = toast.current) == null ? void 0 : _c.show({
              severity: "info",
              summary: "Info",
              detail: "Selecione um valor para a condição " + expIndex + "." + index
            });
            hasToStop = true;
            return;
          }
        });
      });
      if (!hasToStop) {
        let res2 = queryWidget.expressionSet.map((tuple) => tuple.expression);
        generateRulesFromExpression(res2[0]);
        ({
          name: queryWidget.title,
          isAll: queryWidget.expressionSet[0].expression.isAll,
          symbol: {
            type: RenderType.Unique
          }
        });
      }
    }
    function close() {
      reset();
      setVisible(false);
    }
    return isDataLoaded ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        dialog_esm_js.Dialog,
        {
          header: "Adicionar Filtro",
          visible,
          className: styles.dialogDimensions,
          onHide: () => close(),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles.text, children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "p-float-label", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                inputtext_esm_js.InputText,
                {
                  id: "title",
                  value: queryWidget.title,
                  onChange: (e) => setTitle(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "title", children: "Nome" })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex align-items-center", children: [
                /* @__PURE__ */ jsxRuntime.jsx(radiobutton_esm_js.RadioButton, { inputId: "filter1", name: "filterType", value: "Filtro", onChange: (e) => setIsElse(false), checked: !isElse }),
                /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "filter1", children: "Filtro" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex align-items-center", children: [
                /* @__PURE__ */ jsxRuntime.jsx(radiobutton_esm_js.RadioButton, { inputId: "filter2", name: "filterType", value: "Todas as restantes geometrias", onChange: (e) => setIsElse(true), checked: isElse }),
                /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "filter2", children: "Todas as restantes geometrias" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(
              UniqueSymbolComponent,
              {
                color,
                setColor,
                borderColor,
                setBorderColor,
                currentStyle: filter == null ? void 0 : filter.symbol.rendererOL,
                borderThickness,
                setBorderThickness
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(scrollpanel_esm_js.ScrollPanel, { children: /* @__PURE__ */ jsxRuntime.jsx("ul", { className: styles.expressions, style: { paddingLeft: "0" }, children: queryWidget.expressionsComponents.map(
              (item, index) => /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(
                ExpressionOnFilter,
                {
                  id: item
                }
              ) }, index)
            ) }) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles.addExpression, children: /* @__PURE__ */ jsxRuntime.jsx(button_esm_js.Button, { label: "Concluir", onClick: addPolygons }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(toast_esm_js.Toast, { ref: toast })
    ] }) : null;
  };
  function BasedOnRules() {
    const [rules, setRules] = react.useState([]);
    const [selectedRule, setSelectedRule] = react.useState();
    const [showDialog, setShowDialog] = react.useState(false);
    const { t } = reactI18next.useTranslation();
    const nameLabel = t("based_on_rules.name");
    const columns = [
      { field: "name", header: nameLabel },
      { field: "isElse", header: "Name" },
      { field: "symbol", header: "Category" }
    ];
    function addFilter(filter) {
      setRules([...rules, filter]);
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "container-bor", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bor-buttons", children: [
          /* @__PURE__ */ jsxRuntime.jsx(button_esm_js.Button, { label: "Add Rule", icon: "pi pi-plus", outlined: true, onClick: () => setShowDialog(true) }),
          /* @__PURE__ */ jsxRuntime.jsx(button_esm_js.Button, { label: "Remove Rule", icon: "pi pi-minus", outlined: true }),
          /* @__PURE__ */ jsxRuntime.jsx(button_esm_js.Button, { label: "Edit Rule", icon: "pi pi-pencil", outlined: true })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          datatable_esm_js.DataTable,
          {
            value: rules,
            selectionMode: "single",
            selection: selectedRule,
            onSelectionChange: (e) => setSelectedRule(e.value),
            children: columns.map((col, i) => /* @__PURE__ */ jsxRuntime.jsx(column_esm_js.Column, { field: col.field, header: col.header }, col.field))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(FilterWidget, { visible: showDialog, setVisible: setShowDialog, filter: void 0, setFilter: addFilter })
    ] });
  }
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
    const { t } = reactI18next.useTranslation();
    const uniqueSymbol = t("common.unique_symbol");
    const categorized2 = t("common.categorized");
    const graduated2 = t("common.graduated");
    const resetStyle = t("common.reset_style");
    const selectStyle = t("common.select_type");
    const styleType = t("common.style_type");
    const basedOnRules = t("common.based_on_rules");
    const [attr, setAttr] = react.useState(props.attributes);
    const [currentRenderer, setCurrentRenderer] = react.useState(layerCurrentRenderer);
    const options = [
      { label: uniqueSymbol, code: 0 },
      { label: categorized2, code: 1 },
      { label: graduated2, code: 2 },
      { label: basedOnRules, code: 3 }
    ];
    const [activeIndex, setActiveIndex] = react.useState(layerCurrentRenderer.type == RenderType.Categorized ? options[1] : layerCurrentRenderer.type == RenderType.Graduated ? options[2] : options[0]);
    react.useEffect(() => {
      setActiveIndex(currentRenderer.type == RenderType.Categorized ? options[1] : currentRenderer.type == RenderType.Graduated ? options[2] : options[0]);
    }, [currentRenderer]);
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "geometry-editor", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dropdown", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "style-type", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsxs("b", { children: [
            styleType,
            ":"
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            dropdown_esm_js.Dropdown,
            {
              options,
              placeholder: selectStyle,
              optionLabel: "label",
              value: activeIndex,
              onChange: (e) => setActiveIndex(e.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          button_esm_js.Button,
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
      (activeIndex == null ? void 0 : activeIndex.code) == 0 && /* @__PURE__ */ jsxRuntime.jsx(
        UniqueSymbol,
        {
          layerCurrentRenderer: currentRenderer,
          layerDefaultRenderer,
          applyRenderer,
          setVisible
        }
      ),
      (activeIndex == null ? void 0 : activeIndex.code) == 1 && /* @__PURE__ */ jsxRuntime.jsx(
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
      (activeIndex == null ? void 0 : activeIndex.code) == 2 && /* @__PURE__ */ jsxRuntime.jsx(
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
      ),
      (activeIndex == null ? void 0 : activeIndex.code) == 3 && /* @__PURE__ */ jsxRuntime.jsx(FilterWidgetContextProvider, { attributes: attr, children: /* @__PURE__ */ jsxRuntime.jsx(BasedOnRules, {}) })
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
    const { t } = reactI18next.useTranslation();
    const titleHeader = t("common.style_editor");
    const [activeIndex] = react.useState(1);
    const [attributesAndValues, setAttributesAndValues] = react.useState([]);
    react.useEffect(() => {
      setAttributesAndValues(mapFeaturesToSEAttributes(features));
    }, [features]);
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(
      dialog_esm_js.Dialog,
      {
        visible: props.visible,
        header: titleHeader + (addingToHeader ? " - " + addingToHeader : ""),
        style: { height: "90%", width: "80%" },
        onHide: () => {
          props.setVisible(false);
        },
        children: activeIndex === 1 && attributesAndValues && /* @__PURE__ */ jsxRuntime.jsx(
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
  const common$1 = { "style_editor": "Editor de Estilos", "reset_style": "Repor Estilo", "conclude": "Concluir", "unique_symbol": "Símbolo Único", "categorized": "Categorizado", "graduated": "Graduado", "null": "Nulo", "select_type": "Selecionar um tipo de estilo", "style_type": "Tipo de Estilo", "based_on_rules": "Baseado em regras" };
  const errors$1 = { "error_ramps_same_name": "Existem rampas com o mesmo nome: ", "error_diff": "A diferença entre os valores máximo e mínimo deve ser maior do que 0, é: ", "error_sum": "A soma das contagens dos intervalos deve ser igual ao número de valores", "error_sum2": "A soma das contagens está incorreta: ", "error_values": "Os valores dos intervalos devem ser crescentes." };
  const categorized$1 = { "predefined_styles": "Estilos Pré-definidos", "color_ramps": "Rampas de Cores", "stroke_color": "Cor do Contorno", "stroke_width": "Largura do Contorno", "attribute": "Atributo", "select_attribute": "Selecionar um atributo", "update_colors": "Atualizar cores", "color_opacity": "Opacidade da Cor", "colors_spectrum": "Espetro de Cores", "select_spectrum": "Selecionar um espetro", "custom_style": "Estilo Personalizado", "reverse_colors": "Inverter cores", "color_style": "Estilo de Cores" };
  const unique_symbol$1 = { "fill_color": "Cor de Preenchimento" };
  const color_picker$1 = { "select_color": "Selecionar uma cor" };
  const graduated$1 = { "amount_values": "Quantidade de valores (%)", "values": "Valores", "amount": "Quantidade (%)", "select_mode": "Selecionar um modo", "which_mode": "Qual modo escolher?", "interval_size": "Tamanho do intervalo", "classes_number": "Nº de classes", "invert_colors": "Inverter cores do espetro", "gradient_intervals": "Intervalos de Gradiente", "value": "Valor", "preview": "Pré-visualização", "min_value": "Valor Mínimo", "max_value": "Valor Máximo", "color": "Cor", "mode": "Modo" };
  const graduate_modes$1 = { "EqualInterval": "Intervalos Iguais", "Quantile": "Quantil", "NaturalBreaks": "Quebras Naturais (Jenks)", "DefinedInterval": "Intervalos Definidos", "Manual": "Manual", "GeometricInterval": "Intervalo Geométrico", "StandardDeviation": "Desvio Padrão" };
  const based_on_rules$1 = { "name": "Nome" };
  const translationPT = {
    common: common$1,
    errors: errors$1,
    categorized: categorized$1,
    unique_symbol: unique_symbol$1,
    color_picker: color_picker$1,
    graduated: graduated$1,
    graduate_modes: graduate_modes$1,
    based_on_rules: based_on_rules$1
  };
  const common = { "style_editor": "Style Editor", "reset_style": "Reset Style", "conclude": "Apply", "unique_symbol": "Unique Symbol", "categorized": "Categorized", "graduated": "Graduated", "null": "Null", "select_type": "Select a style type", "style_type": "Style Type", "based_on_rules": "Based on rules" };
  const errors = { "error_ramps_same_name": "There are ramps with the same name: ", "error_diff": "The difference between the max and min values must be greater than 0, it is: ", "error_sum": "The sum of the counts of the intervals must be equal to the number of values", "error_sum2": "The sum of the counts is wrong: ", "error_values": "The interval values must be increasing." };
  const categorized = { "predefined_styles": "Predefined Styles", "color_ramps": "Color Ramps", "stroke_color": "Stroke Color", "stroke_width": "Stroke Width", "attribute": "Attribute", "select_attribute": "Select an attribute", "update_colors": "Update colors", "color_opacity": "Color Opacity", "colors_spectrum": "Colors Spectrum", "select_spectrum": "Select a spectrum", "custom_style": "Custom Style", "reverse_colors": "Reverse colors", "color_style": "Color Style" };
  const unique_symbol = { "fill_color": "Fill Color" };
  const color_picker = { "select_color": "Select a color" };
  const graduated = { "amount_values": "Amount of values (%)", "values": "Values", "amount": "Amount (%)", "select_mode": "Select a mode", "which_mode": "Which mode to choose?", "interval_size": "Interval size", "classes_number": "Number of classes", "invert_colors": "Invert colors of the spectrum", "gradient_intervals": "Gradient Intervals", "value": "Value", "preview": "Preview", "min_value": "Minimum Value", "max_value": "Maximum Value", "color": "Color", "mode": "Mode" };
  const graduate_modes = { "EqualInterval": "Equal Intervals", "Quantile": "Quantile", "NaturalBreaks": "Natural Breaks (Jenks)", "DefinedInterval": "Defined Intervals", "Manual": "Manual", "GeometricInterval": "Geometric Interval", "StandardDeviation": "Standard Deviation" };
  const based_on_rules = { "name": "Name" };
  const translationEN = {
    common,
    errors,
    categorized,
    unique_symbol,
    color_picker,
    graduated,
    graduate_modes,
    based_on_rules
  };
  i18n.use(reactI18next.initReactI18next).init({
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
    react.useEffect(() => {
      if (textLocale == "custom" && customLocale) {
        i18n.addResourceBundle("custom", "translation", customLocale, true, true);
        i18n.changeLanguage("custom");
      } else
        i18n.changeLanguage(textLocale ? textLocale : "en");
    }, []);
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(reactI18next.I18nextProvider, { i18n, children: /* @__PURE__ */ jsxRuntime.jsx(api_esm_js.PrimeReactProvider, { children: /* @__PURE__ */ jsxRuntime.jsx(
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
  exports2.AttributeTypeEnum = AttributeTypeEnum;
  exports2.GraduatedModes = GraduatedModes;
  exports2.RenderType = RenderType;
  exports2.StyleEditor = StyleEditor;
  exports2.changeRendererOpacity = changeRendererOpacity;
  exports2.generateRandomColor = generateRandomColor;
  exports2.getCategorizedStyle = getCategorizedStyle;
  exports2.getGraduatedStyle = getGraduatedStyle;
  exports2.getRendererColorAndSizeStroke = getRendererColorAndSizeStroke;
  exports2.getRendererOpacity = getRendererOpacity;
  exports2.getStyleColorsAndValues = getStyleColorsAndValues;
  exports2.singleColorStyle = singleColorStyle;
  exports2.singleColorStyleForLines = singleColorStyleForLines;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});

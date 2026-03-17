import { PrimeReactProvider } from "primereact/api/api.esm.js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog/dialog.esm.js";
import { asString, fromString } from "ol/color.js";
import { Slider } from "primereact/slider/slider.esm.js";
import ColorPicker from "react-best-gradient-color-picker";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Button } from "primereact/button/button.esm.js";
import { Dropdown } from "primereact/dropdown/dropdown.esm.js";
import { Checkbox } from "primereact/checkbox/checkbox.esm.js";
import { DataTable } from "primereact/datatable/datatable.esm.js";
import { Column } from "primereact/column/column.esm.js";
import { Chart } from "primereact/chart/chart.esm.js";
import { InputNumber } from "primereact/inputnumber/inputnumber.esm.js";
import { Toast } from "primereact/toast/toast.esm.js";
import { jenksBuckets, quantileBuckets, standardDeviationBuckets } from "geobuckets/dist/src/index.js";
import { ScrollPanel } from "primereact/scrollpanel/scrollpanel.esm.js";
import { Panel } from "primereact/panel/panel.esm.js";
import { Fieldset } from "primereact/fieldset/fieldset.esm.js";
import { InputText } from "primereact/inputtext/inputtext.esm.js";
import { RadioButton } from "primereact/radiobutton/radiobutton.esm.js";
import jsonLogic from "json-logic-js";
import i18n from "i18next";
//#region src/components/myColorPicker.tsx
var MyColorPicker = (props) => {
	const { color, onChange, hideAlpha } = props;
	const [visible, setVisible] = useState(false);
	const { t } = useTranslation();
	const selectColor = t("color_picker.select_color");
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		style: { backgroundColor: asString(color) },
		className: "color-picker",
		onClick: () => setVisible(true)
	}), /* @__PURE__ */ jsx(Dialog, {
		header: selectColor,
		onHide: () => setVisible(false),
		visible,
		children: /* @__PURE__ */ jsx(ColorPicker, {
			value: asString(color),
			onChange,
			hideOpacity: hideAlpha,
			hideControls: true
		})
	})] });
};
//#endregion
//#region src/rendererUtils.ts
var AttributeTypeEnum = /* @__PURE__ */ function(AttributeTypeEnum) {
	AttributeTypeEnum[AttributeTypeEnum["STRING"] = 0] = "STRING";
	AttributeTypeEnum[AttributeTypeEnum["INTEGER"] = 1] = "INTEGER";
	AttributeTypeEnum[AttributeTypeEnum["FLOAT"] = 2] = "FLOAT";
	AttributeTypeEnum[AttributeTypeEnum["BOOLEAN"] = 3] = "BOOLEAN";
	AttributeTypeEnum[AttributeTypeEnum["DATE"] = 4] = "DATE";
	AttributeTypeEnum[AttributeTypeEnum["JSON"] = 5] = "JSON";
	return AttributeTypeEnum;
}({});
var RenderType = /* @__PURE__ */ function(RenderType) {
	RenderType["Unique"] = "Unique";
	RenderType["Categorized"] = "Categorized";
	RenderType["Graduated"] = "Graduated";
	RenderType["ByRules"] = "ByRules";
	return RenderType;
}({});
var GraduatedModes = /* @__PURE__ */ function(GraduatedModes) {
	GraduatedModes["Manual"] = "Manual";
	GraduatedModes["EqualInterval"] = "EqualInterval";
	GraduatedModes["DefinedInterval"] = "DefinedInterval";
	GraduatedModes["Quantile"] = "Quantile";
	GraduatedModes["NaturalBreaks"] = "NaturalBreaks";
	GraduatedModes["GeometricInterval"] = "GeometricInterval";
	GraduatedModes["StandardDeviation"] = "StandardDeviation";
	return GraduatedModes;
}({});
function getCategorizedStyle(attribute, colors, outlineColor, outlineWidth, defaultColor) {
	let outlineColorCopy = outlineColor ? [...outlineColor] : void 0;
	if (outlineWidth == 0 && outlineColorCopy != void 0) outlineColorCopy[3] = 0;
	else if (outlineWidth != void 0 && outlineWidth > 0 && outlineColorCopy) outlineColorCopy[3] = 1;
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
			[
				"==",
				["var", "highlightedId"],
				["id"]
			],
			"white",
			outlineColorCopy || "#000000"
		],
		"stroke-width": [
			"case",
			[
				"==",
				["var", "highlightedId"],
				["id"]
			],
			2,
			outlineWidth == void 0 ? 1 : outlineWidth
		],
		"fill-color": aux
	};
}
function singleColorStyle(color, outlineColor, outlineWidth) {
	let outlineColorCopy = outlineColor ? [...outlineColor] : void 0;
	if (outlineWidth == 0 && outlineColorCopy != void 0) outlineColorCopy[3] = 0;
	else if (outlineWidth != void 0 && outlineWidth > 0 && outlineColorCopy) outlineColorCopy[3] = 1;
	return {
		"stroke-color": [
			"case",
			[
				"==",
				["var", "highlightedId"],
				["id"]
			],
			"white",
			outlineColorCopy || "#000000"
		],
		"stroke-width": [
			"case",
			[
				"==",
				["var", "highlightedId"],
				["id"]
			],
			2,
			outlineWidth == void 0 ? 1 : outlineWidth
		],
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
	if (outlineWidth == 0 && outlineColorCopy != void 0) outlineColorCopy[3] = 0;
	else if (outlineWidth != void 0 && outlineWidth > 0 && outlineColorCopy) outlineColorCopy[3] = 1;
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
			[
				"==",
				["var", "highlightedId"],
				["id"]
			],
			"white",
			outlineColorCopy || "#000000"
		],
		"stroke-width": [
			"case",
			[
				"==",
				["var", "highlightedId"],
				["id"]
			],
			2,
			outlineWidth == void 0 ? 1 : outlineWidth
		],
		"fill-color": aux
	};
}
function getRendererOpacity(renderer) {
	if (renderer.type == RenderType.Unique) return renderer.rendererOL["fill-color"][3] * 100;
	if (renderer.type == RenderType.Categorized) return renderer.rendererOL["fill-color"][3][3] * 100;
	if (renderer.type == RenderType.Graduated) return renderer.rendererOL["fill-color"][4][3] * 100;
	return 100;
}
function changeRendererOpacity(renderer, opacity) {
	let newRenderer = renderer;
	if (renderer.type == RenderType.Unique) {
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
	if (renderer.type == RenderType.Categorized) {
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
	if (renderer.type == RenderType.Graduated) {
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
	if (type == RenderType.Categorized) {
		for (let i = 2; i < style["fill-color"].length - 1; i += 2) colors.push({
			value: style["fill-color"][i],
			color: style["fill-color"][i + 1]
		});
		colors.push({
			value: "Nulo",
			color: style["fill-color"][style["fill-color"].length - 1]
		});
	}
	if (type == RenderType.Graduated) {
		for (let i = 3; i < style["fill-color"].length - 1; i += 2) colors.push({
			value: style["fill-color"][i],
			color: style["fill-color"][i + 1]
		});
		colors.push({
			value: "Nulo",
			color: style["fill-color"][style["fill-color"].length - 1]
		});
	}
	if (type == RenderType.Unique) colors = [{
		value: "Único",
		color: style["fill-color"]
	}];
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
function getByRulesStyle(filters, idFieldName, elseFilter) {
	console.log(filters);
	if (filters.length === 0 || filters.filter((f) => f.ids.length > 0).length == 0) if (elseFilter) {
		let fillColor = getStyleColorsAndValues(elseFilter.symbol.rendererOL, RenderType.Unique)[0].color;
		let stroke = getRendererColorAndSizeStroke(elseFilter.symbol);
		return {
			"stroke-color": Object.values(stroke.color),
			"stroke-width": stroke.size,
			"fill-color": fillColor,
			"_rules": filters.map((f) => ({
				expression: f.filter.friendlyExpression,
				render: f.filter.symbol
			}))
		};
	} else return {
		"stroke-color": fromString("#000000"),
		"stroke-width": 1,
		"fill-color": fromString("#ffffff"),
		"_rules": filters.map((f) => ({
			expression: f.filter.friendlyExpression,
			render: f.filter.symbol
		}))
	};
	let fillColorArray = ["case"];
	let strokeColorArray = ["case"];
	let strokeWidthArray = ["case"];
	filters.forEach((filter) => {
		if (filter.ids.length > 0) {
			let fillColor = getStyleColorsAndValues(filter.filter.symbol.rendererOL, RenderType.Unique)[0].color;
			let cond = [
				"in",
				["get", idFieldName],
				filter.ids
			];
			fillColorArray.push(cond);
			fillColorArray.push(fillColor);
			let stroke = getRendererColorAndSizeStroke(filter.filter.symbol);
			strokeColorArray.push(cond);
			strokeColorArray.push(Object.values(stroke.color));
			strokeWidthArray.push(cond);
			strokeWidthArray.push(stroke.size);
		}
	});
	if (elseFilter) {
		let fillColor = getStyleColorsAndValues(elseFilter.symbol.rendererOL, RenderType.Unique)[0].color;
		fillColorArray.push(fillColor);
		let stroke = getRendererColorAndSizeStroke(elseFilter.symbol);
		strokeColorArray.push(Object.values(stroke.color));
		strokeWidthArray.push(stroke.size);
	} else {
		fillColorArray.push(fromString("#ffffff"));
		strokeColorArray.push(fromString("#000000"));
		strokeWidthArray.push(1);
	}
	const res = {
		"stroke-color": strokeColorArray,
		"stroke-width": strokeWidthArray,
		"fill-color": fillColorArray,
		"_rules": filters.map((f) => ({
			expression: f.filter.friendlyExpression,
			render: f.filter.symbol
		}))
	};
	console.log(res);
	return res;
}
//#endregion
//#region src/components/uniqueSymbol.tsx
var UniqueSymbol = (props) => {
	const { layerCurrentRenderer, applyRenderer, setVisible } = props;
	const { t } = useTranslation();
	const fillColorLabel = t("unique_symbol.fill_color");
	const strokeColorLabel = t("categorized.stroke_color");
	const strokeWidthLabel = t("categorized.stroke_width");
	const concludeLabel = t("common.conclude");
	const start = "#18d7ba";
	const getStatesFromRenderer = (renderer) => {
		const currentStyle = renderer.field ? null : renderer.rendererOL;
		const color = currentStyle && currentStyle["fill-color"] ? currentStyle["fill-color"] : fromString(start);
		let auxBorder;
		if (currentStyle) if (currentStyle["stroke-color"]) if (currentStyle["stroke-color"][0] == "case") auxBorder = currentStyle["stroke-color"][3];
		else auxBorder = currentStyle["stroke-color"];
		else auxBorder = fromString("#000000");
		else auxBorder = fromString("#000000");
		let auxBorderWidth;
		if (currentStyle) if (currentStyle["stroke-width"] instanceof Array) auxBorderWidth = currentStyle["stroke-width"][3];
		else auxBorderWidth = currentStyle["stroke-width"];
		else auxBorderWidth = 0;
		return {
			color,
			auxBorder,
			auxBorderWidth
		};
	};
	const initialStates = getStatesFromRenderer(layerCurrentRenderer);
	const [color, setColor] = useState(initialStates.color);
	const [borderColor, setBorderColor] = useState(initialStates.auxBorder);
	const [borderThickness, setBorderThickness] = useState(initialStates.auxBorderWidth);
	useEffect(() => {
		const states = getStatesFromRenderer(layerCurrentRenderer);
		setColor(states.color);
		setBorderColor(states.auxBorder);
		setBorderThickness(states.auxBorderWidth);
	}, [layerCurrentRenderer]);
	function createRenderUnique(color, outlineColor, outlineWidth) {
		return singleColorStyle(color, outlineColor, outlineWidth);
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "container",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex-row-unique",
				children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [fillColorLabel, ":"] }) }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(MyColorPicker, {
					color,
					onChange: (e) => setColor(fromString(e))
				}) })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-row-unique",
				children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeColorLabel, ":"] }) }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(MyColorPicker, {
					color: (() => {
						if (borderColor.at(3) < 1) return [
							borderColor[0],
							borderColor[1],
							borderColor[2],
							1
						];
						return borderColor;
					})(),
					hideAlpha: true,
					onChange: (e) => setBorderColor(fromString(e))
				}) })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-column-gap-7",
				children: [
					/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeWidthLabel, ": "] }) }),
					/* @__PURE__ */ jsx(Slider, {
						max: 10,
						min: 0,
						className: "slider-wrapper",
						value: borderThickness,
						onChange: (e) => setBorderThickness(e.value)
					}),
					/* @__PURE__ */ jsxs("span", { children: [borderThickness, " px"] })
				]
			})
		] }), /* @__PURE__ */ jsx("div", {
			className: "button-wrapper",
			children: /* @__PURE__ */ jsx(Button, {
				label: concludeLabel,
				onClick: () => {
					applyRenderer({
						type: RenderType.Unique,
						rendererOL: createRenderUnique(color, borderColor, borderThickness)
					});
					setVisible(false);
				}
			})
		})]
	});
};
//#endregion
//#region src/components/rampColors.ts
function getColorRampString(ramp) {
	let rampString = "linear-gradient(90deg, ";
	ramp.forEach((color, index) => {
		rampString += asString(color.color) + " " + color.offset * 100 + "%";
		if (index < ramp.length - 1) rampString += ", ";
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
	const range = rgbStops[rgbStops.length - 1].offset - start;
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
		if (lowerStop.normalizedPosition === upperStop.normalizedPosition) result.push(rgbToHex(lowerStop.rgb));
		else {
			const segmentProgress = (stepPosition - lowerStop.normalizedPosition) / (upperStop.normalizedPosition - lowerStop.normalizedPosition);
			const interpolatedColor = interpolateColor(lowerStop.rgb, upperStop.rgb, segmentProgress);
			result.push(rgbToHex(interpolatedColor));
		}
	}
	return result;
}
var colorRamps = [
	{
		id: 0,
		name: "Blues",
		palette: [
			{
				offset: .13,
				color: fromString("rgb(222,235,247)")
			},
			{
				offset: .26,
				color: fromString("rgb(198,219,239)")
			},
			{
				offset: .39,
				color: fromString("rgb(158,202,225)")
			},
			{
				offset: .52,
				color: fromString("rgb(107,174,214)")
			},
			{
				offset: .65,
				color: fromString("rgb(66,146,198)")
			},
			{
				offset: .78,
				color: fromString("rgb(33,113,181)")
			},
			{
				offset: .9,
				color: fromString("rgb(8,81,156)")
			}
		]
	},
	{
		id: 1,
		name: "BrBG",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(223,194,125)")
			},
			{
				offset: .5,
				color: fromString("rgb(245,245,245)")
			},
			{
				offset: .75,
				color: fromString("rgb(128,205,193)")
			}
		]
	},
	{
		id: 2,
		name: "BuGn",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(178,226,226)")
			},
			{
				offset: .5,
				color: fromString("rgb(102,194,164)")
			},
			{
				offset: .75,
				color: fromString("rgb(44,162,95)")
			}
		]
	},
	{
		id: 3,
		name: "BuPu",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(179,205,227)")
			},
			{
				offset: .5,
				color: fromString("rgb(140,150,198)")
			},
			{
				offset: .75,
				color: fromString("rgb(136,86,167)")
			}
		]
	},
	{
		id: 4,
		name: "GnBu",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(186,228,188)")
			},
			{
				offset: .5,
				color: fromString("rgb(123,204,196)")
			},
			{
				offset: .75,
				color: fromString("rgb(67,162,202)")
			}
		]
	},
	{
		id: 5,
		name: "Greens",
		palette: [
			{
				offset: .13,
				color: fromString("rgb(229,245,224)")
			},
			{
				offset: .26,
				color: fromString("rgb(199,233,192)")
			},
			{
				offset: .39,
				color: fromString("rgb(161,217,155)")
			},
			{
				offset: .52,
				color: fromString("rgb(116,196,118)")
			},
			{
				offset: .65,
				color: fromString("rgb(65,171,93)")
			},
			{
				offset: .78,
				color: fromString("rgb(35,139,69)")
			},
			{
				offset: .9,
				color: fromString("rgb(0,109,44)")
			}
		]
	},
	{
		id: 6,
		name: "Greys",
		palette: [{
			offset: 0,
			color: fromString("rgb(250,250,250)")
		}, {
			offset: 1,
			color: fromString("rgb(5,5,5)")
		}]
	},
	{
		id: 7,
		name: "OrRd",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(253,204,138)")
			},
			{
				offset: .5,
				color: fromString("rgb(252,141,89)")
			},
			{
				offset: .75,
				color: fromString("rgb(227,74,51)")
			}
		]
	},
	{
		id: 8,
		name: "Oranges",
		palette: [
			{
				offset: .13,
				color: fromString("rgb(254,230,206)")
			},
			{
				offset: .26,
				color: fromString("rgb(253,208,162)")
			},
			{
				offset: .39,
				color: fromString("rgb(253,174,107)")
			},
			{
				offset: .52,
				color: fromString("rgb(253,141,60)")
			},
			{
				offset: .65,
				color: fromString("rgb(241,105,19)")
			},
			{
				offset: .78,
				color: fromString("rgb(217,72,1)")
			},
			{
				offset: .9,
				color: fromString("rgb(166,54,3)")
			}
		]
	},
	{
		id: 9,
		name: "PRGn",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(194,165,207)")
			},
			{
				offset: .5,
				color: fromString("rgb(247,247,247)")
			},
			{
				offset: .75,
				color: fromString("rgb(166,219,160)")
			}
		]
	},
	{
		id: 10,
		name: "PiYG",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(241,182,218)")
			},
			{
				offset: .5,
				color: fromString("rgb(247,247,247)")
			},
			{
				offset: .75,
				color: fromString("rgb(184,225,134)")
			}
		]
	},
	{
		id: 11,
		name: "PuBu",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(189,201,225)")
			},
			{
				offset: .5,
				color: fromString("rgb(116,169,207)")
			},
			{
				offset: .75,
				color: fromString("rgb(43,140,190)")
			}
		]
	},
	{
		id: 12,
		name: "PuBuGn",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(189,201,225)")
			},
			{
				offset: .5,
				color: fromString("rgb(103,169,207)")
			},
			{
				offset: .75,
				color: fromString("rgb(28,144,153)")
			}
		]
	},
	{
		id: 13,
		name: "PuOr",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(230,97,1)")
			},
			{
				offset: .5,
				color: fromString("rgb(94,60,153)")
			},
			{
				offset: .75,
				color: fromString("rgb(178,171,210)")
			}
		]
	},
	{
		id: 14,
		name: "PuRd",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(215,181,216)")
			},
			{
				offset: .5,
				color: fromString("rgb(223,101,176)")
			},
			{
				offset: .75,
				color: fromString("rgb(221,28,119)")
			}
		]
	},
	{
		id: 15,
		name: "Purples",
		palette: [
			{
				offset: .13,
				color: fromString("rgb(239,237,245)")
			},
			{
				offset: .26,
				color: fromString("rgb(218,218,235)")
			},
			{
				offset: .39,
				color: fromString("rgb(188,189,220)")
			},
			{
				offset: .52,
				color: fromString("rgb(158,154,200)")
			},
			{
				offset: .65,
				color: fromString("rgb(128,125,186)")
			},
			{
				offset: .75,
				color: fromString("rgb(106,81,163)")
			},
			{
				offset: .9,
				color: fromString("rgb(84,39,143)")
			}
		]
	},
	{
		id: 16,
		name: "RdBu",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(244,165,130)")
			},
			{
				offset: .5,
				color: fromString("rgb(247,247,247)")
			},
			{
				offset: .75,
				color: fromString("rgb(146,197,222)")
			}
		]
	},
	{
		id: 17,
		name: "RdGy",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(244,165,130)")
			},
			{
				offset: .5,
				color: fromString("rgb(255,255,255)")
			},
			{
				offset: .75,
				color: fromString("rgb(186,186,186)")
			}
		]
	},
	{
		id: 18,
		name: "RdPu",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(253,180,185)")
			},
			{
				offset: .5,
				color: fromString("rgb(247,104,161)")
			},
			{
				offset: .75,
				color: fromString("rgb(197,27,138)")
			}
		]
	},
	{
		id: 19,
		name: "RdYlBu",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(253,184,99)")
			},
			{
				offset: .5,
				color: fromString("rgb(255,255,191)")
			},
			{
				offset: .75,
				color: fromString("rgb(171,217,233)")
			}
		]
	},
	{
		id: 20,
		name: "RdYlGn",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(253,174,97)")
			},
			{
				offset: .5,
				color: fromString("rgb(255,255,192)")
			},
			{
				offset: .75,
				color: fromString("rgb(166,217,106)")
			}
		]
	},
	{
		id: 21,
		name: "Reds",
		palette: [
			{
				offset: .13,
				color: fromString("rgb(254,224,210)")
			},
			{
				offset: .26,
				color: fromString("rgb(252,187,161)")
			},
			{
				offset: .39,
				color: fromString("rgb(252,146,114)")
			},
			{
				offset: .52,
				color: fromString("rgb(251,106,74)")
			},
			{
				offset: .65,
				color: fromString("rgb(239,59,44)")
			},
			{
				offset: .78,
				color: fromString("rgb(203,24,29)")
			},
			{
				offset: .9,
				color: fromString("rgb(165,15,21)")
			}
		]
	},
	{
		id: 22,
		name: "Spectral",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(253,174,97)")
			},
			{
				offset: .5,
				color: fromString("rgb(255,255,191)")
			},
			{
				offset: .75,
				color: fromString("rgb(171,221,164)")
			}
		]
	},
	{
		id: 23,
		name: "YlGn",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(194,230,153)")
			},
			{
				offset: .5,
				color: fromString("rgb(120,198,121)")
			},
			{
				offset: .75,
				color: fromString("rgb(49,163,84)")
			}
		]
	},
	{
		id: 24,
		name: "YlGnBu",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(161,218,180)")
			},
			{
				offset: .5,
				color: fromString("rgb(65,182,196)")
			},
			{
				offset: .75,
				color: fromString("rgb(44,127,184)")
			}
		]
	},
	{
		id: 25,
		name: "YlOrBr",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(254,217,142)")
			},
			{
				offset: .5,
				color: fromString("rgb(254,153,41)")
			},
			{
				offset: .75,
				color: fromString("rgb(217,95,14)")
			}
		]
	},
	{
		id: 26,
		name: "YlOrRd",
		palette: [
			{
				offset: .25,
				color: fromString("rgb(254,204,92)")
			},
			{
				offset: .5,
				color: fromString("rgb(253,141,60)")
			},
			{
				offset: .75,
				color: fromString("rgb(240,59,32)")
			}
		]
	},
	{
		id: 27,
		name: "Semaphore",
		palette: [
			{
				offset: .1,
				color: fromString("rgb(215,48,39)")
			},
			{
				offset: .3,
				color: fromString("rgb(252,141,89)")
			},
			{
				offset: .5,
				color: fromString("rgb(218,225,12)")
			},
			{
				offset: .7,
				color: fromString("rgb(145,207,96)")
			},
			{
				offset: .9,
				color: fromString("rgb(26,152,80)")
			}
		]
	}
];
//#endregion
//#region src/components/categorized.tsx
var Categorized = (props) => {
	const { attr, layerCurrentRenderer, showPreDefinedRamps, predefinedStyles, moreRamps, applyRenderer, setVisible } = props;
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
	for (let i = 2; i < currentRender.length - 1; i += 2) valuesAndColors.push({
		value: currentRender[i],
		color: currentRender[i + 1],
		visible: true
	});
	if (currentRender.length > 0) valuesAndColors.push({
		value: nullText,
		color: currentRender[currentRender.length - 1],
		visible: true
	});
	const stroke = getRendererColorAndSizeStroke(layerCurrentRenderer);
	const [selectedSpectrumColors, setSelectedSpectrumColors] = useState({
		label: customStyleLabel,
		value: []
	});
	const [table, setTable] = useState(valuesAndColors);
	const [selectedAttr, setSelectedAttr] = useState(layerCurrentRenderer.field ? attr.find((at) => at.name == layerCurrentRenderer.field) : void 0);
	const [rowClick] = useState(false);
	const currentStyle = layerCurrentRenderer.type != RenderType.Categorized ? null : layerCurrentRenderer.rendererOL;
	const [borderColor, setBorderColor] = useState(currentStyle ? stroke.color : fromString("#000000"));
	const [borderThickness, setBorderThickness] = useState(currentStyle ? stroke.size : 1);
	const [fillOpacity, setFillOpacity] = useState(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100);
	const [isReversed, setIsReversed] = useState(false);
	let allRamps;
	if (showPreDefinedRamps) if (moreRamps) allRamps = moreRamps.concat(colorRamps);
	else allRamps = colorRamps;
	else if (moreRamps) allRamps = moreRamps;
	else allRamps = [];
	const existingRenderers = allRamps.filter((ramp, _index, self) => self.filter((r) => r.name === ramp.name).length > 1);
	if (existingRenderers.length > 0) {
		console.error(errorRamps + existingRenderers.map((ramp) => ramp.name));
		return;
	}
	const preDefinedPalettes = [
		{
			label: customStyleLabel,
			items: [{
				label: customStyleLabel,
				value: {
					label: customStyleLabel,
					value: []
				}
			}]
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
					value: {
						label: ramp.name,
						value: ramp.palette
					}
				};
			})
		}
	];
	const itemTemplate = (option) => {
		if (option.value.value.length > 0 && "offset" in option.value.value[0]) return /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				gap: "3px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx("div", { style: {
				background: getColorRampString(option.value.value),
				width: "90px",
				height: "20px"
			} }), /* @__PURE__ */ jsx("span", { children: option.label })]
		});
		return /* @__PURE__ */ jsx("span", { children: option.label });
	};
	const visibleColumnTemplate = (tr) => {
		return /* @__PURE__ */ jsx(Checkbox, { checked: tr.visible });
	};
	const updateColorPicker = (newColor, tableRow) => {
		const tableUpdated = [];
		table.forEach(({ value, visible, color }) => {
			if (value === tableRow.value) tableUpdated.push({
				value,
				visible,
				color: newColor
			});
			else tableUpdated.push({
				value,
				visible,
				color
			});
		});
		setTable(tableUpdated);
	};
	const colorColumnTemplate = (tr) => {
		return /* @__PURE__ */ jsx("div", {
			hidden: !tr.visible,
			children: /* @__PURE__ */ jsx(MyColorPicker, {
				onChange: (e) => updateColorPicker(fromString(e), tr),
				color: tr.color
			})
		});
	};
	function updateColorsByColorRamp(colorRampInput, reversed) {
		const colorRamp = {
			label: colorRampInput.label,
			value: [...colorRampInput.value]
		};
		if (reversed) colorRamp.value.reverse();
		if (colorRamp.value.length > 0 && "offset" in colorRamp.value[0]) {
			const colors = generateGradient(colorRamp.value.map((stop) => ({
				offset: stop.offset,
				color: stop.color
			})), table.filter((row) => row.visible).length);
			const tableUpdated = [];
			let i = 0;
			table.forEach(({ value, visible }) => {
				if (visible) tableUpdated.push({
					value,
					visible,
					color: fromString(colors[i++])
				});
				else tableUpdated.push({
					value,
					visible,
					color: fromString("white")
				});
			});
			setTable(tableUpdated);
		} else if (colorRamp.value.length > 0) {
			const colors = getStyleColorsAndValues(getCategorizedStyle(selectedAttr?.name, colorRamp.value), RenderType.Categorized);
			const tableUpdated = [];
			table.forEach(({ value, visible }) => {
				const color = colors.find((c) => c.value == value);
				if (color) tableUpdated.push({
					value,
					visible,
					color: color.color
				});
				else tableUpdated.push({
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
		setSelectedSpectrumColors({
			label: customStyleLabel,
			value: []
		});
		let tableValues = [];
		attribute.values.forEach((value) => {
			if (value && value != "") tableValues.push({
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
			let found = trs.some((trs) => trs === tr);
			tableValues.push({
				value: tr.value,
				visible: found,
				color: found ? tr.color : [
					0,
					0,
					0,
					0
				]
			});
		});
		setTable(tableValues);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "categorized-container",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
			className: "attribute-container",
			children: [/* @__PURE__ */ jsx("span", {
				style: { width: "auto" },
				children: /* @__PURE__ */ jsxs("b", { children: [attributeLabel, ":"] })
			}), /* @__PURE__ */ jsx(Dropdown, {
				value: selectedAttr,
				onChange: (e) => changeAttribute(e),
				options: attr.filter((a) => a.values && a.values.length > 0 && a.values.length < 200),
				optionLabel: "name",
				itemTemplate: (option) => /* @__PURE__ */ jsxs("span", { children: [
					option.name,
					" (",
					option.values.length,
					")"
				] }),
				placeholder: selectAttributeLabel
			})]
		}), table.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "stroke-row",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "stroke-color-container",
					children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeColorLabel, ":"] }) }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(MyColorPicker, {
						color: (() => {
							if (borderColor.at(3) < 1) return [
								borderColor[0],
								borderColor[1],
								borderColor[2],
								1
							];
							return borderColor;
						})(),
						hideAlpha: true,
						onChange: (e) => setBorderColor(fromString(e))
					}) })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "stroke-width-container",
					children: [
						/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeWidthLabel, ":"] }) }),
						/* @__PURE__ */ jsx(Slider, {
							max: 10,
							min: 0,
							className: "stroke-slider",
							value: borderThickness,
							onChange: (e) => setBorderThickness(e.value)
						}),
						/* @__PURE__ */ jsxs("span", { children: [borderThickness, " px"] })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "opacity-container",
				children: [
					/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [colorOpacityLabel, ":"] }) }),
					/* @__PURE__ */ jsx(Slider, {
						max: 100,
						min: 0,
						className: "opacity-slider",
						value: fillOpacity,
						onChange: (e) => {
							setFillOpacity(e.value);
							setTable([...table].map((tr) => {
								let aux2 = [];
								aux2.push(tr.color[0]);
								aux2.push(tr.color[1]);
								aux2.push(tr.color[2]);
								aux2.push(e.value / 100);
								return {
									...tr,
									color: aux2
								};
							}));
						}
					}),
					/* @__PURE__ */ jsxs("span", { children: [fillOpacity, "%"] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "spectrum-container",
				children: [
					/* @__PURE__ */ jsx("span", {
						style: { width: "auto" },
						children: /* @__PURE__ */ jsxs("b", { children: [colorStyleLabel, ":"] })
					}),
					/* @__PURE__ */ jsx(Dropdown, {
						value: selectedSpectrumColors,
						options: preDefinedPalettes,
						onChange: (e) => changeColorsOfValues(e.value),
						placeholder: selectSpectrumLabel,
						optionLabel: "label",
						optionGroupLabel: "label",
						itemTemplate
					}),
					/* @__PURE__ */ jsx(Button, {
						text: true,
						icon: "pi pi-refresh",
						disabled: !selectedSpectrumColors,
						tooltip: updateColorsLabel,
						onClick: () => updateColorsByColorRamp(selectedSpectrumColors, isReversed)
					}),
					/* @__PURE__ */ jsx(Button, {
						text: true,
						icon: "pi pi-arrow-right-arrow-left",
						disabled: !selectedSpectrumColors,
						tooltip: reverseColorsLabel,
						onClick: () => revertColors()
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "table-container",
				children: /* @__PURE__ */ jsxs(DataTable, {
					value: table,
					selectionMode: rowClick ? null : "checkbox",
					tableStyle: { minWidth: "25rem" },
					dataKey: "value",
					selection: table.filter((tr) => tr.visible),
					onSelectionChange: (event) => {
						const value = event.value;
						changeVisibility(value);
					},
					reorderableRows: true,
					onRowReorder: (e) => setTable(e.value),
					children: [
						/* @__PURE__ */ jsx(Column, {
							rowReorder: true,
							style: { width: "3rem" }
						}),
						/* @__PURE__ */ jsx(Column, {
							selectionMode: "multiple",
							field: "visible",
							body: visibleColumnTemplate
						}),
						/* @__PURE__ */ jsx(Column, {
							field: "color",
							header: colorLabel,
							body: colorColumnTemplate
						}),
						/* @__PURE__ */ jsx(Column, {
							field: "value",
							header: valueLabel,
							sortable: true
						})
					]
				})
			})
		] })] }), /* @__PURE__ */ jsx("div", {
			className: "footer-container",
			children: /* @__PURE__ */ jsx(Button, {
				label: concludeLabel,
				onClick: () => {
					applyRenderer({
						type: RenderType.Categorized,
						field: selectedAttr?.name,
						rendererOL: getCategorizedStyle(selectedAttr?.name, table.filter((row) => row.value != nullText && row.visible).map((tr) => ({
							value: tr.value,
							color: tr.color
						})), borderColor, borderThickness, table.find((row) => row.value == nullText).color)
					});
					setVisible(false);
				}
			})
		})]
	});
};
//#endregion
//#region src/components/graduated.tsx
var Graduated = (props) => {
	const { attr, applyRenderer, setVisible, layerCurrentRenderer, moreRamps, showPreDefinedRamps, numbersLocale } = props;
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
		toast.current?.show({
			severity,
			summary: "Error",
			detail: message
		});
	};
	const currentRender = layerCurrentRenderer.type != RenderType.Graduated ? [] : layerCurrentRenderer.rendererOL["fill-color"];
	const valuesAndColors = [];
	for (let i = 3; i < currentRender.length - 1; i += 2) valuesAndColors.push({
		value: currentRender[i],
		color: currentRender[i + 1]
	});
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
	if (showPreDefinedRamps) if (moreRamps) allRamps = moreRamps.concat(colorRamps);
	else allRamps = colorRamps;
	else if (moreRamps) allRamps = moreRamps;
	else allRamps = [];
	const existingRenderers = allRamps.filter((ramp, _index, self) => self.filter((r) => r.name === ramp.name).length > 1);
	if (existingRenderers.length > 0) {
		console.error(errorRamps + existingRenderers.map((ramp) => ramp.name));
		return;
	}
	const preDefinedPalettes = [{
		label: colorRampLabel,
		items: allRamps.map((ramp) => {
			return {
				label: ramp.name,
				value: {
					label: ramp.name,
					value: ramp.palette
				}
			};
		})
	}];
	const itemTemplate = (option) => {
		if (option.value.value.length > 0 && "offset" in option.value.value[0]) return /* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				gap: "3px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ jsx("div", { style: {
				background: getColorRampString(option.value.value),
				width: "90px",
				height: "20px"
			} }), /* @__PURE__ */ jsx("span", { children: option.label })]
		});
		return /* @__PURE__ */ jsx("span", { children: option.label });
	};
	function applyRampToStops(ramp, invert) {
		const aux = [...stops];
		if (invert) {
			const inverse = aux.map((s) => s.color).reverse();
			setStops(aux.map((tr, index) => {
				const aux2 = [];
				const color = inverse[index];
				aux2.push(color[0]);
				aux2.push(color[1]);
				aux2.push(color[2]);
				aux2.push(opacity / 100);
				return {
					...tr,
					color: aux2
				};
			}));
			return;
		}
		const colors = generateGradient(ramp.value, aux.length);
		setStops(aux.map((tr, index) => {
			const aux2 = [];
			const color = fromString(colors[index]);
			aux2.push(color[0]);
			aux2.push(color[1]);
			aux2.push(color[2]);
			aux2.push(opacity / 100);
			return {
				...tr,
				color: aux2
			};
		}));
	}
	function countNumbers(list) {
		const counting = {};
		list.filter((n) => n != null).forEach((num) => {
			const rounded = Math.round(num);
			counting[rounded] = (counting[rounded] || 0) + 1;
		});
		const maxNumber = Math.round(Math.max(...list));
		const minNumber = Math.round(Math.min(...list));
		if (maxNumber - minNumber <= 0) showToast(errorDiffLabel + (maxNumber - minNumber), "error");
		const result = new Array(maxNumber - minNumber).fill(0);
		Object.entries(counting).forEach(([n, times]) => {
			result[Number(n) - minNumber] = times;
		});
		let intervals = result.map((value, index) => {
			return {
				min: index + minNumber,
				max: index + minNumber + 1,
				count: value
			};
		});
		if (list.length != intervals.reduce((acc, curr) => acc + curr.count, 0)) showToast(errorSumLabel, "error");
		const reduceFactor = 2;
		while (intervals.length > 100) {
			const newIntervals = [];
			for (let i = 0; i <= intervals.length - reduceFactor; i += reduceFactor) {
				const min = intervals[i].min;
				let max;
				const isLast = i == intervals.length - reduceFactor || i + reduceFactor > intervals.length - reduceFactor;
				if (isLast) max = intervals[intervals.length - 1].max;
				else max = intervals[i + reduceFactor].min;
				const count = intervals.slice(i, isLast ? intervals.length : i + reduceFactor).reduce((acc, curr) => acc + curr.count, 0);
				newIntervals.push({
					min,
					max,
					count
				});
			}
			intervals = newIntervals;
		}
		const lastInterval = intervals[intervals.length - 1];
		intervals.push({
			min: lastInterval.max,
			max: lastInterval.max + (lastInterval.max - lastInterval.min),
			count: 0
		});
		const total = intervals.reduce((acc, curr) => acc + curr.count, 0);
		if (list.length != total) showToast(errorSum2Label + (list.length - total), "error");
		intervals = intervals.map((i) => {
			return {
				min: i.min,
				max: i.max,
				count: i.count * 100 / list.length
			};
		});
		return intervals;
	}
	async function calculateStopsByMode(mode, nClasses, intervalSize) {
		let stops = [];
		let values = selectedAttr?.values.map(Number) || [];
		values = values.filter((v) => !isNaN(v) && v != null);
		const min = Math.min(...values);
		const max = Math.max(...values);
		const range = max - min;
		switch (mode) {
			case GraduatedModes.EqualInterval:
			case GraduatedModes.Manual: {
				const interval2 = range / nClasses;
				for (let i = 0; i < nClasses; i++) stops.push({
					value: min + interval2 * i,
					color: fromString("rgb(0,0,0)")
				});
				stops.push({
					value: max,
					color: fromString("rgb(0,0,0)")
				});
				break;
			}
			case GraduatedModes.DefinedInterval: {
				const interval = range / intervalSize;
				for (let i = 0; i <= interval; i++) stops.push({
					value: min + intervalSize * i,
					color: fromString("rgb(0,0,0)")
				});
				break;
			}
			case GraduatedModes.NaturalBreaks:
				stops = (await jenksBuckets(values, nClasses)).map((value) => {
					return {
						value,
						color: fromString("rgb(0,0,0)")
					};
				});
				break;
			case GraduatedModes.Quantile:
				stops = (await quantileBuckets(values, nClasses)).map((value) => {
					return {
						value,
						color: fromString("rgb(0,0,0)")
					};
				});
				break;
			case GraduatedModes.StandardDeviation:
				stops = (await standardDeviationBuckets(values, nClasses)).map((value) => {
					return {
						value,
						color: fromString("rgb(0,0,0)")
					};
				});
				break;
			default: break;
		}
		setIntervals(countNumbers(values || []));
		return stops;
	}
	useEffect(() => {
		if (stops.length > 0) {
			let values = selectedAttr?.values.map(Number) || [];
			values = values.filter((v) => !isNaN(v) && v != null);
			setIntervals(countNumbers(values || []));
		}
	}, []);
	useEffect(() => {
		if (intervals && intervals.length > 0) {
			setChartData({
				labels: intervals.map((i) => i.min.toString()),
				datasets: [{
					label: amountValuesLabel,
					data: intervals.map((i) => i.count),
					backgroundColor: "rgb(54, 162, 235)",
					borderWidth: 2,
					borderColor: "rgb(54, 162, 235)"
				}]
			});
			setChartOptions({
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
									return stops.map((stop) => intervals.find((i) => i.min <= stop.value && stop.value < i.max)).find((i) => i?.min <= value && value < i.max) ? "#ea1010" : "rgba(0,0,0,0)";
								} else return "rgba(0,0,0,0)";
							},
							drawBorder: false
						}
					},
					y: { title: {
						display: true,
						text: amountLabel
					} }
				}
			});
		}
	}, [intervals, stops.map((s) => s.value).join(", ")]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex-column",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex-row",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-row-small-gap",
					children: [/* @__PURE__ */ jsx("span", {
						className: "auto-width-span",
						children: /* @__PURE__ */ jsxs("b", { children: [attributeLabel, ":"] })
					}), /* @__PURE__ */ jsx(Dropdown, {
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
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-row-small-gap",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "auto-width-span",
							children: /* @__PURE__ */ jsxs("b", { children: [modeLabel, ":"] })
						}),
						/* @__PURE__ */ jsx(Dropdown, {
							disabled: !selectedAttr,
							value: selectedMode,
							onChange: async (e) => {
								let iSize = Math.round(Math.max(...selectedAttr.values.map(Number).filter((v) => v != null && !isNaN(v))) / 10);
								if (iSize == 0) iSize = 1;
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
								if (option) return t(`graduate_modes.${option}`);
								else return selectModeLabel;
							},
							placeholder: selectModeLabel
						}),
						/* @__PURE__ */ jsx("a", {
							href: "https://resources.arcgis.com/en/help/main/10.2/index.html#//00s50000001r000000",
							target: "_blank",
							children: whichModeLabel
						})
					]
				})]
			}),
			selectedMode && /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex-row-small-gap",
					children: [selectedAttr && /* @__PURE__ */ jsxs("span", { children: [
						/* @__PURE__ */ jsxs("b", { children: [minValueLabel, ":"] }),
						" ",
						Math.min(...selectedAttr.values.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)
					] }), selectedAttr && /* @__PURE__ */ jsxs("span", { children: [
						/* @__PURE__ */ jsxs("b", { children: [maxValueLabel, ":"] }),
						" ",
						Math.max(...selectedAttr.values.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)
					] })]
				}),
				(selectedMode == GraduatedModes.Manual || selectedMode == GraduatedModes.EqualInterval || selectedMode == GraduatedModes.Quantile || selectedMode == GraduatedModes.NaturalBreaks || selectedMode == GraduatedModes.GeometricInterval) && /* @__PURE__ */ jsxs("div", {
					className: "flex-row-gap-15",
					children: [/* @__PURE__ */ jsx("span", {
						className: "auto-width-span",
						children: /* @__PURE__ */ jsxs("b", { children: [classesNumberLabel, ":"] })
					}), /* @__PURE__ */ jsx(InputNumber, {
						value: classNo,
						min: 0,
						max: 50,
						inputMode: "numeric",
						maxFractionDigits: 0,
						locale,
						onChange: async (e) => {
							setClassNo(e.value);
							setSelectedSpectrumColors(void 0);
							setStops(await calculateStopsByMode(selectedMode, e.value, intervalSize));
						}
					})]
				}),
				(selectedMode == GraduatedModes.DefinedInterval || selectedMode == GraduatedModes.StandardDeviation) && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
					className: "auto-width-span",
					children: [intervalSizeLabel, ":"]
				}), /* @__PURE__ */ jsx(InputNumber, {
					value: intervalSize,
					locale,
					onChange: async (e) => {
						setIntervalSize(e.value);
						setSelectedSpectrumColors(void 0);
						setStops(await calculateStopsByMode(selectedMode, classNo, e.value));
					}
				})] })
			] }),
			selectedMode && selectedAttr && /* @__PURE__ */ jsx(Chart, {
				className: "chart-wrapper",
				type: "bar",
				data: chartData,
				options: chartOptions
			}),
			stops.length > 0 && selectedMode && /* @__PURE__ */ jsxs("div", {
				className: "flex-column-gap-15px",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-row-gap-50px",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex-row-center",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "auto-width-span",
								children: /* @__PURE__ */ jsxs("b", { children: [colorsSpectrumLabel, ":"] })
							}),
							/* @__PURE__ */ jsx(Dropdown, {
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
							}),
							/* @__PURE__ */ jsx(Button, {
								text: true,
								icon: "pi pi-arrow-right-arrow-left",
								tooltip: invertColorsLabel,
								disabled: !selectedSpectrumColors,
								onClick: () => applyRampToStops(selectedSpectrumColors, true)
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-column-small-gap",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "auto-width-span",
								children: /* @__PURE__ */ jsxs("b", { children: [gradientIntervalsLabel, ":"] })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-row-small-gap",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "auto-width-span",
									children: [valueLabel, "             "]
								}), /* @__PURE__ */ jsx("span", {
									className: "auto-width-span",
									children: colorLabel
								})]
							}),
							stops.map((value, index) => {
								return /* @__PURE__ */ jsxs("div", {
									className: "flex-row-small-small-gap",
									children: [/* @__PURE__ */ jsx(InputNumber, {
										placeholder: valueLabel,
										allowEmpty: false,
										locale,
										inputMode: "numeric",
										min: stops[0].value,
										maxFractionDigits: 3,
										max: stops[stops.length - 1].value,
										disabled: index === 0 || selectedMode != GraduatedModes.Manual || index === stops.length - 1,
										onChange: (e) => {
											const aux = [...stops];
											aux[index].value = e.value;
											setStops(aux);
										},
										value: stops[index].value
									}), /* @__PURE__ */ jsx(MyColorPicker, {
										color: value.color,
										onChange: (e) => {
											const aux = [...stops];
											aux[index].color = fromString(e);
											setStops(aux);
										}
									})]
								}, index);
							})
						]
					})] }), /* @__PURE__ */ jsx("div", {
						className: "flex-row-gap-50px",
						children: /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "color-picker-wrapper",
								children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeColorLabel, ":"] }) }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(MyColorPicker, {
									color: (() => {
										if (borderColor.at(3) < 1) return [
											borderColor[0],
											borderColor[1],
											borderColor[2],
											1
										];
										return borderColor;
									})(),
									hideAlpha: true,
									onChange: (e) => setBorderColor(fromString(e))
								}) })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-column-gap-7px",
								children: [
									/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeWidthLabel, ":"] }) }),
									/* @__PURE__ */ jsx(Slider, {
										max: 10,
										min: 0,
										className: "slider-wrapper",
										value: borderThickness,
										onChange: (e) => setBorderThickness(e.value)
									}),
									/* @__PURE__ */ jsxs("span", { children: [borderThickness, " px"] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-column-gap-7px",
								children: [
									/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [colorOpacityLabel, ":"] }) }),
									/* @__PURE__ */ jsx(Slider, {
										max: 100,
										min: 0,
										className: "slider-wrapper",
										value: opacity,
										onChange: (e) => {
											setOpacity(e.value);
											setStops([...stops].map((tr) => {
												const aux2 = [];
												aux2.push(tr.color[0]);
												aux2.push(tr.color[1]);
												aux2.push(tr.color[2]);
												aux2.push(e.value / 100);
												return {
													...tr,
													color: aux2
												};
											}));
										}
									}),
									/* @__PURE__ */ jsxs("span", { children: [opacity, "%"] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-column-gap-7px",
								children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [previewLabel, ":"] }) }), /* @__PURE__ */ jsx("div", {
									style: { background: getColorRampString(stops.map((stop, index) => {
										return {
											offset: index / stops.length,
											color: stop.color
										};
									})) },
									className: "preview-color-ramp"
								})]
							})
						] })
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "button-wrapper",
					children: /* @__PURE__ */ jsx(Button, {
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
									field: selectedAttr?.name,
									rendererOL: getGraduatedStyle(selectedAttr?.name, stops, borderColor, borderThickness)
								});
								setVisible(false);
							}
						}
					})
				})]
			})
		]
	}), /* @__PURE__ */ jsx(Toast, { ref: toast })] });
};
//#endregion
//#region src/components/filters/filterWidgetContext.tsx
var FilterWidgetContext = createContext(null);
function FilterWidgetContextProvider({ children, attributes }) {
	const initial = {
		title: "",
		attributes,
		expressionSet: [{
			id: 0,
			conditions: [0],
			expression: {
				conditions: [{
					attribute: "",
					op: "",
					value: ""
				}],
				isAll: void 0
			}
		}],
		expressionsComponents: [0]
	};
	const [queryWidget, setQueryWidget] = useState(initial);
	function setTitle(value) {
		setQueryWidget({
			...queryWidget,
			title: value
		});
	}
	function setExpressionSet(value) {
		setQueryWidget({
			...queryWidget,
			expressionSet: value
		});
	}
	function setExpressionsComponents(value) {
		setQueryWidget({
			...queryWidget,
			expressionsComponents: value
		});
	}
	function setAttributes(value) {
		setQueryWidget({
			...queryWidget,
			attributes: value
		});
	}
	function reset() {
		setQueryWidget(initial);
	}
	function addAttributes(atts) {
		let aux = queryWidget.attributes;
		aux.push(...atts);
		setAttributes(aux);
	}
	return /* @__PURE__ */ jsx(FilterWidgetContext.Provider, {
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
	});
}
//#endregion
//#region src/components/filters/conditionOnFilter.tsx
var ConditionOnFilter = (props) => {
	const { parentID, id, deleteF } = props;
	const { queryWidget, setExpressionSet } = useContext(FilterWidgetContext);
	const toast = useRef(null);
	const { t } = useTranslation();
	const [selectedAttribute, setSelectedAttribute] = useState();
	const [selectedFunction, setSelectedFunction] = useState();
	const functionsBooleans = [{
		name: t("filters.yes"),
		logic: "true"
	}, {
		name: t("filters.no"),
		logic: "false"
	}];
	const functionsTexts = [
		{
			name: t("filters.is"),
			logic: "=="
		},
		{
			name: t("filters.is_not"),
			logic: "!="
		},
		{
			name: t("filters.starts_with"),
			logic: "startsWith"
		},
		{
			name: t("filters.ends_with"),
			logic: "endsWith"
		},
		{
			name: t("filters.contains"),
			logic: "in"
		},
		{
			name: t("filters.does_not_contain"),
			logic: "!in"
		},
		{
			name: t("filters.is_null"),
			logic: "null"
		}
	];
	const functionsNumbers = [
		{
			name: t("filters.is"),
			logic: "=="
		},
		{
			name: t("filters.is_not"),
			logic: "!="
		},
		{
			name: t("filters.is_at_least"),
			logic: ">="
		},
		{
			name: t("filters.is_less_than"),
			logic: "<"
		},
		{
			name: t("filters.is_at_most"),
			logic: "<="
		},
		{
			name: t("filters.is_greater_than"),
			logic: ">"
		},
		{
			name: t("filters.is_null"),
			logic: "null"
		}
	];
	const [selectedValue, setSelectedValue] = useState();
	const [values, setValues] = useState();
	useEffect(() => {
		if (selectedAttribute != void 0) {
			let aux = queryWidget.attributes.filter((feature) => feature.name == selectedAttribute.name)[0];
			setValues(aux?.values.filter((i) => i != null));
		}
	}, [queryWidget.attributes, selectedAttribute]);
	useEffect(() => {
		const fullExp = queryWidget.expressionSet.find((item) => item.id === parentID);
		if (!fullExp) return;
		const conditionIndex = fullExp.conditions.findIndex((c) => c === id);
		if (conditionIndex === -1) return;
		const condition = fullExp.expression.conditions[conditionIndex];
		const foundAttribute = queryWidget.attributes.find((a) => a.name === condition.attribute);
		if (foundAttribute) setSelectedAttribute(foundAttribute);
		let functionSet;
		if (foundAttribute?.type === AttributeTypeEnum.STRING || foundAttribute?.type === AttributeTypeEnum.JSON) functionSet = functionsTexts;
		else if (foundAttribute?.type === AttributeTypeEnum.BOOLEAN) functionSet = functionsBooleans;
		else functionSet = functionsNumbers;
		const foundFunction = functionSet.find((f) => f.logic === condition.op);
		if (foundFunction) setSelectedFunction(foundFunction);
		if (condition.value) setSelectedValue(condition.value);
	}, [
		queryWidget.expressionSet,
		queryWidget.attributes,
		id
	]);
	function update(funct, value, attribute) {
		let fullExp = queryWidget.expressionSet.find((item) => item.id === parentID);
		let expression = fullExp.expression;
		let condition = expression.conditions.at(fullExp.conditions?.findIndex((c) => c == id));
		if (funct) condition.op = funct.logic;
		if (value) if (value.includes("'") || value.includes("\"")) toast.current?.show({
			severity: "error",
			summary: "Error",
			detail: t("filters.invalid_chars_error", { id: parentID + "." + id })
		});
		else condition.value = value;
		if (attribute) if (attribute.name != null) condition.attribute = attribute.name;
		else toast.current?.show({
			severity: "error",
			summary: "Error",
			detail: t("filters.invalid_attribute_error")
		});
		queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex((item) => item.id === parentID), 1, {
			id: parentID,
			conditions: fullExp.conditions,
			expression
		});
		setExpressionSet(queryWidget.expressionSet);
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		style: {
			position: "relative",
			paddingBottom: "5px"
		},
		children: [/* @__PURE__ */ jsx("div", {
			style: {
				position: "absolute",
				right: 0
			},
			children: /* @__PURE__ */ jsx(Button, {
				icon: "pi pi-times",
				onClick: () => {
					return deleteF(id);
				}
			})
		}), /* @__PURE__ */ jsx(Fieldset, {
			legend: t("filters.condition") + (id + 1),
			children: /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx(Dropdown, {
					value: selectedAttribute,
					onChange: (e) => {
						setSelectedFunction(void 0);
						setSelectedAttribute(e.value);
						setSelectedValue(void 0);
						update(void 0, void 0, e.value);
					},
					options: queryWidget.attributes,
					optionLabel: "name",
					placeholder: t("filters.select_attribute"),
					className: "w-full md:w-14rem"
				}),
				/* @__PURE__ */ jsx(Dropdown, {
					value: selectedFunction,
					onChange: (e) => {
						setSelectedFunction(e.value);
						if (e.value.logic == "null") setSelectedValue(void 0);
						update(e.value, void 0, void 0);
					},
					options: selectedAttribute?.type == AttributeTypeEnum.STRING || selectedAttribute?.type == AttributeTypeEnum.JSON ? functionsTexts : selectedAttribute?.type == AttributeTypeEnum.BOOLEAN ? functionsBooleans : functionsNumbers,
					disabled: selectedAttribute == void 0,
					optionLabel: "name",
					placeholder: t("filters.select_operator")
				}),
				selectedAttribute?.type != AttributeTypeEnum.BOOLEAN && selectedFunction?.name != t("filters.is_null") && /* @__PURE__ */ jsx(Dropdown, {
					value: selectedValue,
					editable: true,
					maxLength: 150,
					onChange: (e) => {
						setSelectedValue(e.value);
						update(void 0, e.value, void 0);
					},
					options: values?.length < 200 ? values : values?.slice(0, 200),
					filter: true,
					placeholder: t("filters.select_value"),
					disabled: selectedFunction == void 0,
					className: "w-full md:w-14rem"
				})
			] })
		})]
	}), /* @__PURE__ */ jsx(Toast, { ref: toast })] });
};
//#endregion
//#region src/components/filters/expressionOnFilter.tsx
var ExpressionOnFilter = (props) => {
	const { id } = props;
	const { queryWidget, setExpressionSet } = useContext(FilterWidgetContext);
	const { t } = useTranslation();
	const [selectedOp, setSelectedOp] = useState(null);
	const ops = [{ name: t("filters.all_true") }, { name: t("filters.any_true") }];
	useEffect(() => {
		const currentExp = queryWidget.expressionSet.find((item) => item.id === id);
		if (currentExp?.expression.isAll !== void 0) setSelectedOp(currentExp.expression.isAll ? ops[0] : ops[1]);
	}, [queryWidget.expressionSet, id]);
	const currentExp = queryWidget.expressionSet.find((item) => item.id === id);
	function addCondition() {
		if (currentExp.conditions.length < 10) {
			let expression = queryWidget.expressionSet.find((item) => item.id === id)?.expression;
			expression.conditions?.push({
				attribute: "",
				op: "",
				value: ""
			});
			queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex((item) => item.id === id), 1, {
				id,
				conditions: [...currentExp.conditions, currentExp.conditions.at(currentExp.conditions.length - 1) + 1],
				expression
			});
			setExpressionSet(queryWidget.expressionSet);
		}
	}
	function deleteCondition(idCond) {
		if (currentExp.conditions.length > 1) {
			let index = currentExp.conditions.findIndex((item) => item === idCond);
			let expression = queryWidget.expressionSet.find((item) => item.id === id)?.expression;
			expression.conditions?.splice(index, 1);
			queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex((item) => item.id === id), 1, {
				id,
				conditions: currentExp.conditions.filter((item) => item !== idCond),
				expression
			});
			setExpressionSet(queryWidget.expressionSet);
		}
	}
	function update(op) {
		let expression = queryWidget.expressionSet.find((item) => item.id === id)?.expression;
		expression.isAll = op === t("filters.all_true");
		queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex((item) => item.id === id), 1, {
			id,
			conditions: currentExp.conditions,
			expression
		});
		setExpressionSet(queryWidget.expressionSet);
	}
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", {
		style: {
			position: "relative",
			paddingBottom: "5px"
		},
		children: /* @__PURE__ */ jsx(Panel, {
			header: t("filters.expression"),
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column"
				},
				children: [/* @__PURE__ */ jsx(ScrollPanel, {
					style: {
						width: "100%",
						height: "90%"
					},
					children: /* @__PURE__ */ jsx("ul", {
						style: { paddingLeft: "0" },
						children: currentExp.conditions.map((item, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(ConditionOnFilter, {
							id: item,
							parentID: id,
							deleteF: deleteCondition
						}) }, index))
					})
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						width: "230px",
						gap: "5px"
					},
					children: [/* @__PURE__ */ jsx(Button, {
						label: t("filters.add_condition"),
						outlined: true,
						onClick: addCondition
					}), /* @__PURE__ */ jsx(Dropdown, {
						style: { paddingBottom: "5px" },
						value: selectedOp,
						onChange: (e) => {
							setSelectedOp(e.value);
							update(e.value.name);
						},
						options: ops,
						optionLabel: "name",
						placeholder: t("filters.select_operator"),
						className: "w-full md:w-14rem"
					})]
				})]
			})
		})
	}) });
};
var filterWidget_module_default = {
	expressions: "_expressions_14903_1",
	text: "_text_14903_7",
	menu: "_menu_14903_15",
	alignCenter: "_alignCenter_14903_22",
	dialogDimensions: "_dialogDimensions_14903_27",
	addExpression: "_addExpression_14903_32",
	conclude: "_conclude_14903_39"
};
//#endregion
//#region src/components/uniqueSymbolComponent.tsx
function UniqueSymbolComponent(props) {
	const { currentStyle, setColor, setBorderColor, setBorderThickness, borderThickness, color, borderColor } = props;
	const { t } = useTranslation();
	const fillColorLabel = t("unique_symbol.fill_color");
	const strokeColorLabel = t("categorized.stroke_color");
	const strokeWidthLabel = t("categorized.stroke_width");
	const start = "#18d7ba";
	useEffect(() => {
		setColor(currentStyle ? currentStyle["fill-color"] : fromString(start));
		let auxBorder;
		if (currentStyle) if (currentStyle["stroke-color"]) if (currentStyle["stroke-color"][0] == "case") auxBorder = currentStyle["stroke-color"][3];
		else auxBorder = currentStyle["stroke-color"];
		else auxBorder = fromString("#000000");
		else auxBorder = fromString("#000000");
		setBorderColor(auxBorder);
		let auxBorderWidth;
		if (currentStyle) if (currentStyle["stroke-width"] instanceof Array) auxBorderWidth = currentStyle["stroke-width"][3];
		else auxBorderWidth = currentStyle["stroke-width"];
		else auxBorderWidth = 1;
		setBorderThickness(auxBorderWidth);
	}, []);
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", {
		className: "container2",
		children: /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex-row-unique",
				children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [fillColorLabel, ":"] }) }), /* @__PURE__ */ jsx("div", { children: color && /* @__PURE__ */ jsx(MyColorPicker, {
					color,
					onChange: (e) => setColor(fromString(e))
				}) })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-row-unique",
				children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeColorLabel, ":"] }) }), /* @__PURE__ */ jsx("div", { children: borderColor && /* @__PURE__ */ jsx(MyColorPicker, {
					color: borderColor,
					hideAlpha: true,
					onChange: (e) => setBorderColor(fromString(e))
				}) })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-column-gap-7",
				children: [
					/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [strokeWidthLabel, ": "] }) }),
					/* @__PURE__ */ jsx(Slider, {
						max: 10,
						min: 0,
						className: "slider-wrapper",
						value: borderThickness,
						onChange: (e) => setBorderThickness(e.value)
					}),
					/* @__PURE__ */ jsxs("span", { children: [borderThickness, " px"] })
				]
			})
		] })
	}) });
}
//#endregion
//#region src/components/filters/filterWidget.tsx
var FilterWidget = (props) => {
	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const { visible, setVisible, filter, setFilter, canBeElse } = props;
	const { queryWidget, setTitle, setExpressionSet, setExpressionsComponents, reset } = useContext(FilterWidgetContext);
	const toast = useRef(null);
	const { t } = useTranslation();
	const [color, setColor] = useState();
	const [borderColor, setBorderColor] = useState();
	const [borderThickness, setBorderThickness] = useState();
	const [isElse, setIsElse] = useState(false);
	function constructJsonString(operator, attribute, value) {
		if (value === "") return `{"==": [{"var": "${attribute}"}, null]}`;
		return !isNaN(parseFloat(value)) ? constructJsonStringNumerical(operator, attribute, parseFloat(value)) : constructJsonStringText(operator, attribute, value);
	}
	function constructJsonStringNumerical(operator, attribute, value) {
		return `{
                "${operator}": [{ "var": "${attribute}" }, ${value}]
            }`;
	}
	function constructJsonStringText(operator, attribute, value) {
		switch (operator) {
			case "startsWith": return `{
                "==": [
                    { "substr": [{ "var": "${attribute}" }, 0, ${value.length}] },
                    "${value}"
                ]
            }`;
			case "endsWith": return `{
                "==": [
                    { "substr": [{ "var": "${attribute}" }, -${value.length}] },
                    "${value}"
                ]
            }`;
			case "!in": return `{
                "!": {
                    "in": [${JSON.stringify(value)}, { "var": "${attribute}" }]
                }
            }`;
			default: return `{"${operator}": ["${value}", { "var": "${attribute}" }]}`;
		}
	}
	function buildJsonLogicRule(conditions, isAll) {
		if (conditions.length === 0) return "";
		return `{ "${isAll ? "and" : "or"}": [${conditions.join(", ")}] }`;
	}
	function generateRulesFromExpression(expression) {
		const conditionGroups = [];
		if (!expression || !Array.isArray(expression.conditions)) return "";
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
		return {
			isAll,
			conditions: parsedRule[isAll ? "and" : "or"].map((condition) => {
				const operator = Object.keys(condition)[0];
				const value = condition[operator];
				if (operator === "==" && value[0].hasOwnProperty("substr")) {
					const substr = value[0].substr;
					const valueString = value[1];
					if (substr[1] < 0) return {
						operator: "endsWith",
						attribute: substr[0].var,
						value: valueString
					};
					else return {
						operator: "startsWith",
						attribute: substr[0].var,
						value: valueString
					};
				}
				if (operator === "!") {
					const innerCondition = value[Object.keys(value)[0]];
					return {
						operator: "!in",
						attribute: innerCondition[1].var,
						value: innerCondition[0]
					};
				}
				if (operator === "==") {
					if (value[0] === null) return {
						operator: "null",
						attribute: value[1].var
					};
				}
				const max = value[0];
				if (max.hasOwnProperty("var")) return {
					operator,
					attribute: max.var,
					value: value[1]
				};
				return {
					operator,
					attribute: value[1].var,
					value: max
				};
			})
		};
	}
	useEffect(() => {
		if (!filter) {
			setIsDataLoaded(true);
			return;
		}
		setTitle(filter.name);
		setIsElse(filter.isElse);
		queryWidget.title = filter.name;
		if (filter && !filter.isElse) {
			const allConditions = [];
			deconstructRule(filter.filterJson).conditions.forEach((condition) => {
				allConditions.push({
					attribute: condition.attribute || "",
					op: condition.operator || "==",
					value: condition.value
				});
			});
			setExpressionSet([{
				id: 0,
				conditions: allConditions.map((_, index) => index),
				expression: {
					conditions: allConditions,
					isAll: filter.isAll
				}
			}]);
		}
		if (queryWidget.title === filter.name && queryWidget.expressionSet.length > 0) setIsDataLoaded(true);
	}, [filter]);
	useEffect(() => {
		setExpressionsComponents(queryWidget.expressionSet.map((exp) => exp.id));
	}, [queryWidget.expressionSet]);
	function addPolygons() {
		if (queryWidget.title === "") {
			toast.current?.show({
				severity: "info",
				summary: "Info",
				detail: t("filters.title_empty_error")
			});
			return;
		}
		let hasToStop = false;
		if (!isElse) {
			const exps = queryWidget.expressionSet;
			if (exps.length === 0) {
				toast.current?.show({
					severity: "info",
					summary: "Info",
					detail: t("filters.min_one_expression_error")
				});
				return;
			}
			exps.forEach((tuple, expIndex) => {
				if (tuple.expression.isAll == void 0) {
					toast.current?.show({
						severity: "info",
						summary: "Info",
						detail: t("filters.select_and_or_error", { id: tuple.id })
					});
					hasToStop = true;
					return;
				}
				tuple.expression.conditions?.forEach((cond, index) => {
					if (cond.attribute == "") {
						toast.current?.show({
							severity: "info",
							summary: "Info",
							detail: t("filters.select_attribute_error", { id: expIndex + "." + index })
						});
						hasToStop = true;
						return;
					}
					if (cond.op == "") {
						toast.current?.show({
							severity: "info",
							summary: "Info",
							detail: t("filters.select_function_error", { id: expIndex + "." + index })
						});
						hasToStop = true;
						return;
					}
					let aux = cond.op == "null" || cond.op == "true" || cond.op == "false";
					if (cond.value == void 0 && !aux) {
						toast.current?.show({
							severity: "info",
							summary: "Info",
							detail: t("filters.select_value_error", { id: expIndex + "." + index })
						});
						hasToStop = true;
						return;
					}
				});
			});
		}
		if (!hasToStop) {
			let dto;
			if (isElse) dto = {
				name: queryWidget.title,
				isElse,
				symbol: {
					type: RenderType.Unique,
					rendererOL: singleColorStyle(color, borderColor, borderThickness)
				}
			};
			else {
				let rule = generateRulesFromExpression(queryWidget.expressionSet.map((tuple) => tuple.expression)[0]);
				dto = {
					name: queryWidget.title,
					filterJson: rule,
					isAll: queryWidget.expressionSet[0].expression.isAll,
					isElse,
					symbol: {
						type: RenderType.Unique,
						rendererOL: singleColorStyle(color, borderColor, borderThickness)
					}
				};
			}
			setFilter(dto);
			close();
		}
	}
	function close() {
		reset();
		setIsElse(false);
		setVisible(false);
	}
	return isDataLoaded ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Dialog, {
		header: t("filters.add_filter"),
		visible,
		className: filterWidget_module_default.dialogDimensions,
		onHide: () => close(),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: filterWidget_module_default.text,
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "p-float-label",
						children: [/* @__PURE__ */ jsx(InputText, {
							id: "title",
							value: queryWidget.title,
							maxLength: 100,
							onChange: (e) => setTitle(e.target.value)
						}), /* @__PURE__ */ jsx("label", {
							htmlFor: "title",
							children: t("filters.name")
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex align-items-center",
						children: [/* @__PURE__ */ jsx(RadioButton, {
							inputId: "filter1",
							name: "filterType",
							value: t("filters.filter"),
							onChange: (e) => setIsElse(false),
							checked: !isElse
						}), /* @__PURE__ */ jsx("label", {
							htmlFor: "filter1",
							children: t("filters.filter")
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex align-items-center",
						children: [/* @__PURE__ */ jsx(RadioButton, {
							inputId: "filter2",
							name: "filterType",
							value: t("filters.all_other_geometries"),
							disabled: !canBeElse,
							onChange: (e) => setIsElse(true),
							checked: isElse
						}), /* @__PURE__ */ jsx("label", {
							htmlFor: "filter2",
							children: t("filters.all_other_geometries")
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "bor-radio-buttons" }),
			/* @__PURE__ */ jsx(UniqueSymbolComponent, {
				color,
				setColor,
				borderColor,
				setBorderColor,
				currentStyle: filter?.symbol.rendererOL,
				borderThickness,
				setBorderThickness
			}),
			!isElse && /* @__PURE__ */ jsx(ScrollPanel, { children: /* @__PURE__ */ jsx("ul", {
				className: filterWidget_module_default.expressions,
				style: { paddingLeft: "0" },
				children: queryWidget.expressionsComponents.map((item, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(ExpressionOnFilter, { id: item }) }, index))
			}) }),
			/* @__PURE__ */ jsx("div", {
				className: filterWidget_module_default.conclude,
				children: /* @__PURE__ */ jsx(Button, {
					label: t("common.conclude"),
					onClick: addPolygons
				})
			})
		]
	}), /* @__PURE__ */ jsx(Toast, { ref: toast })] }) : null;
};
//#endregion
//#region src/components/basedOnRules.tsx
function BasedOnRules(props) {
	const { setVisible, features, applyRenderer, layerCurrentRenderer, attributes } = props;
	const [rules, setRules] = useState(layerCurrentRenderer.type == RenderType.ByRules ? layerCurrentRenderer.filters ? layerCurrentRenderer.filters : [] : []);
	const [selectedRule, setSelectedRule] = useState();
	const [showDialog, setShowDialog] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [selectedAttribute, setSelectedAttribute] = useState(attributes.find((a) => a.name === layerCurrentRenderer.field));
	useEffect(() => {
		if (!selectedAttribute && layerCurrentRenderer.field && attributes.length > 0) {
			const attr = attributes.find((a) => a.name === layerCurrentRenderer.field);
			if (attr) setSelectedAttribute(attr);
		}
	}, [attributes, layerCurrentRenderer.field]);
	const { t } = useTranslation();
	const nameLabel = t("based_on_rules.name");
	const typeLabel = t("based_on_rules.type");
	const previewLabel = t("based_on_rules.preview");
	const expressionLabel = t("based_on_rules.expression");
	const allOtherGeometriesLabel = t("based_on_rules.all_other_geometries");
	const filterLabel = t("based_on_rules.filter");
	const selectIdAttributeLabel = t("based_on_rules.select_id_attribute");
	const idsNotUniqueLabel = t("based_on_rules.ids_not_unique");
	const addRuleLabel = t("based_on_rules.add_rule");
	const removeRuleLabel = t("based_on_rules.remove_rule");
	const editRuleLabel = t("based_on_rules.edit_rule");
	const concludeLabel = t("common.conclude");
	const columns = [
		{
			field: "name",
			header: nameLabel
		},
		{
			field: "isElse",
			header: typeLabel,
			body: (data) => data.isElse ? allOtherGeometriesLabel : filterLabel
		},
		{
			field: "symbol",
			header: previewLabel,
			body: (data) => {
				const color = getStyleColorsAndValues(data.symbol.rendererOL, RenderType.Unique);
				const stroke = getRendererColorAndSizeStroke(data.symbol);
				return /* @__PURE__ */ jsx("div", {
					style: {
						backgroundColor: asString(color.at(0).color),
						borderColor: asString(stroke.color),
						borderWidth: stroke.size
					},
					className: "bor-preview"
				});
			}
		},
		{
			field: "filterJson",
			header: expressionLabel,
			body: (data) => getFriendlyExpression(data)
		}
	];
	function getFriendlyExpression(data) {
		if (!data.filterJson) return "";
		try {
			const parsed = JSON.parse(data.filterJson);
			const formatCondition = (cond) => {
				const operator = Object.keys(cond)[0];
				const value = cond[operator];
				if (operator === "!" && value.hasOwnProperty("in")) {
					const innerCondition = value["in"];
					return `${innerCondition[1].var} not in ${JSON.stringify(innerCondition[0])}`;
				}
				if (operator === "==" && Array.isArray(value) && value[0] && value[0].hasOwnProperty("substr")) {
					const substr = value[0].substr;
					const valueString = value[1];
					return `${substr[0].var} ${substr[1] < 0 ? "endsWith" : "startsWith"} "${valueString}"`;
				}
				if (operator === "==" && Array.isArray(value) && value[0] === null) return `${value[1].var} is null`;
				const max = Array.isArray(value) ? value[0] : null;
				if (max && max.hasOwnProperty("var")) return `${max.var} ${operator} ${JSON.stringify(value[1])}`;
				if (Array.isArray(value) && value[1] && value[1].hasOwnProperty("var")) return `${value[1].var} ${operator} ${JSON.stringify(max)}`;
				return JSON.stringify(cond);
			};
			const isAll = parsed.hasOwnProperty("and");
			const isAny = parsed.hasOwnProperty("or");
			if (isAll || isAny) {
				const operator = isAll ? " AND " : " OR ";
				return parsed[isAll ? "and" : "or"].map(formatCondition).join(operator);
			} else return formatCondition(parsed);
		} catch (e) {
			return data.filterJson;
		}
	}
	function addFilter(filter) {
		setRules([...rules, filter]);
	}
	function editFilter(filter) {
		const index = rules.findIndex((r) => r === selectedRule);
		if (index >= 0) {
			const newRules = [...rules];
			newRules[index] = filter;
			setRules(newRules);
		}
		setSelectedRule(void 0);
	}
	function hasUniqueIDs(features, IDAttribute) {
		const idSet = /* @__PURE__ */ new Set();
		for (const feature of features) {
			const id = feature.get(IDAttribute.name);
			if (id === void 0 || id === null) return false;
			if (idSet.has(id)) return false;
			idSet.add(id);
		}
		return true;
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "container-bor",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bor-id",
				children: [/* @__PURE__ */ jsx(Dropdown, {
					options: attributes,
					optionLabel: "name",
					value: selectedAttribute,
					placeholder: selectIdAttributeLabel,
					onChange: (e) => setSelectedAttribute(e.value)
				}), selectedAttribute && !hasUniqueIDs(features, selectedAttribute) && /* @__PURE__ */ jsxs("div", {
					className: "bor-id",
					children: [/* @__PURE__ */ jsx("i", {
						className: "pi pi-exclamation-triangle",
						style: { color: "orange" }
					}), /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("b", { children: idsNotUniqueLabel }) })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bor-buttons",
				children: [
					/* @__PURE__ */ jsx(Button, {
						label: addRuleLabel,
						icon: "pi pi-plus",
						outlined: true,
						onClick: () => {
							setIsAdding(true);
							setShowDialog(true);
						}
					}),
					/* @__PURE__ */ jsx(Button, {
						label: removeRuleLabel,
						disabled: !selectedRule,
						icon: "pi pi-minus",
						outlined: true,
						onClick: () => {
							if (selectedRule) {
								setRules(rules.filter((r) => r !== selectedRule));
								setSelectedRule(void 0);
							}
						}
					}),
					/* @__PURE__ */ jsx(Button, {
						label: editRuleLabel,
						disabled: !selectedRule,
						icon: "pi pi-pencil",
						outlined: true,
						onClick: () => {
							if (selectedRule) {
								setIsAdding(false);
								setShowDialog(true);
							}
						}
					})
				]
			}),
			/* @__PURE__ */ jsx(DataTable, {
				value: rules,
				selectionMode: "single",
				selection: selectedRule,
				onSelectionChange: (e) => setSelectedRule(e.value),
				children: columns.map((col) => /* @__PURE__ */ jsx(Column, {
					field: col.field,
					header: col.header,
					body: col.body
				}, col.field))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "footer-container",
				children: /* @__PURE__ */ jsx(Button, {
					label: concludeLabel,
					disabled: !selectedAttribute || !hasUniqueIDs(features, selectedAttribute),
					onClick: () => {
						const appliedFilters = [];
						rules.filter((r) => !r.isElse).forEach((filter) => {
							const res = [];
							try {
								const parsedLogic = JSON.parse(filter.filterJson);
								features.forEach((feature) => {
									if (jsonLogic.apply(parsedLogic, feature.getProperties())) res.push(feature.get(selectedAttribute.name));
								});
							} catch (e) {
								console.error("Error evaluating jsonLogic rule", e);
							}
							appliedFilters.push({
								filter,
								ids: res
							});
						});
						const completedFilters = appliedFilters.map((r) => ({
							ids: [...r.ids],
							filter: {
								...r.filter,
								friendlyExpression: getFriendlyExpression(r.filter)
							}
						}));
						applyRenderer({
							type: RenderType.ByRules,
							field: selectedAttribute.name,
							filters: rules,
							rendererOL: getByRulesStyle(completedFilters, selectedAttribute.name, rules.find((r) => r.isElse))
						});
						setVisible(false);
					}
				})
			})
		]
	}), /* @__PURE__ */ jsx(FilterWidget, {
		visible: showDialog,
		setVisible: setShowDialog,
		filter: isAdding ? void 0 : selectedRule,
		setFilter: isAdding ? addFilter : editFilter,
		canBeElse: !isAdding && selectedRule?.isElse || rules.find((r) => r.isElse) == void 0
	})] });
}
//#endregion
//#region src/components/geometryEditor.tsx
var GeometryEditor = (props) => {
	const { layerCurrentRenderer, layerDefaultRenderer, moreRamps, predefinedStyles, showPreDefinedRamps, applyRenderer, setVisible, numbersLocale, features } = props;
	const { t } = useTranslation();
	const uniqueSymbol = t("common.unique_symbol");
	const categorized = t("common.categorized");
	const graduated = t("common.graduated");
	const resetStyle = t("common.reset_style");
	const selectStyle = t("common.select_type");
	const styleType = t("common.style_type");
	const basedOnRules = t("common.based_on_rules");
	const [attr, setAttr] = useState(props.attributes);
	useEffect(() => {
		setAttr(props.attributes);
	}, [props.attributes]);
	const [currentRenderer, setCurrentRenderer] = useState(layerCurrentRenderer);
	const options = [
		{
			label: uniqueSymbol,
			code: 0
		},
		{
			label: categorized,
			code: 1
		},
		{
			label: graduated,
			code: 2
		},
		{
			label: basedOnRules,
			code: 3
		}
	];
	const [activeIndex, setActiveIndex] = useState(layerCurrentRenderer.type == RenderType.Categorized ? options[1] : layerCurrentRenderer.type == RenderType.Graduated ? options[2] : layerCurrentRenderer.type == RenderType.ByRules ? options[3] : options[0]);
	useEffect(() => {
		setActiveIndex(currentRenderer.type == RenderType.Categorized ? options[1] : currentRenderer.type == RenderType.Graduated ? options[2] : layerCurrentRenderer.type == RenderType.ByRules ? options[3] : options[0]);
	}, [currentRenderer]);
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", {
		className: "geometry-editor",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "dropdown",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "style-type",
					children: [/* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs("b", { children: [styleType, ":"] }) }), /* @__PURE__ */ jsx(Dropdown, {
						options,
						placeholder: selectStyle,
						optionLabel: "label",
						value: activeIndex,
						onChange: (e) => setActiveIndex(e.value)
					})]
				}), /* @__PURE__ */ jsx(Button, {
					label: resetStyle,
					disabled: currentRenderer == layerDefaultRenderer,
					onClick: () => {
						applyRenderer(layerDefaultRenderer);
						setCurrentRenderer(layerDefaultRenderer);
					}
				})]
			}),
			activeIndex?.code == 0 && /* @__PURE__ */ jsx(UniqueSymbol, {
				layerCurrentRenderer: currentRenderer,
				layerDefaultRenderer,
				applyRenderer,
				setVisible
			}),
			activeIndex?.code == 1 && /* @__PURE__ */ jsx(Categorized, {
				attr,
				layerCurrentRenderer: currentRenderer,
				layerDefaultRenderer,
				applyRenderer,
				setVisible,
				moreRamps,
				predefinedStyles,
				showPreDefinedRamps
			}),
			activeIndex?.code == 2 && /* @__PURE__ */ jsx(Graduated, {
				attr,
				setAttr,
				applyRenderer,
				moreRamps,
				setVisible,
				showPreDefinedRamps,
				layerCurrentRenderer,
				numbersLocale
			}),
			activeIndex?.code == 3 && /* @__PURE__ */ jsx(FilterWidgetContextProvider, {
				attributes: attr,
				children: /* @__PURE__ */ jsx(BasedOnRules, {
					applyRenderer,
					layerCurrentRenderer,
					setVisible,
					features,
					attributes: attr
				})
			})
		]
	}) });
};
//#endregion
//#region src/components/utills.ts
function mapFeaturesToSEAttributes(features) {
	const attributeMap = {};
	features.forEach((feature) => {
		const properties = feature.getProperties();
		Object.keys(properties).forEach((key) => {
			if (key === "geometry") return;
			if (!attributeMap[key]) attributeMap[key] = /* @__PURE__ */ new Set();
			attributeMap[key].add(properties[key]);
		});
	});
	return Object.keys(attributeMap).map((key, index) => {
		const valuesArray = Array.from(attributeMap[key]);
		return {
			id: index,
			name: key,
			type: determineAttributeType(valuesArray),
			values: valuesArray.map(String)
		};
	});
}
function determineAttributeType(values) {
	if (values.length === 0) return AttributeTypeEnum.STRING;
	const sampleValue = values[0];
	if (typeof sampleValue === "string") return AttributeTypeEnum.STRING;
	else if (typeof sampleValue === "number") return Number.isInteger(sampleValue) ? AttributeTypeEnum.INTEGER : AttributeTypeEnum.FLOAT;
	else if (typeof sampleValue === "boolean") return AttributeTypeEnum.BOOLEAN;
	else if (sampleValue instanceof Date) return AttributeTypeEnum.DATE;
	else if (typeof sampleValue === "object") return AttributeTypeEnum.JSON;
	else return AttributeTypeEnum.STRING;
}
//#endregion
//#region src/components/main/StyleEditorComponent.tsx
var StyleEditorComponent = (props) => {
	const { layerDefaultRenderer, layerCurrentRenderer, applyRenderer, showPreDefinedRamps, moreRamps, predefinedStyles, addingToHeader, features, visible, setVisible, numbersLocale } = props;
	const { t } = useTranslation();
	const titleHeader = t("common.style_editor");
	const [activeIndex] = useState(1);
	const [attributesAndValues, setAttributesAndValues] = useState([]);
	useEffect(() => {
		setAttributesAndValues(mapFeaturesToSEAttributes(features));
	}, [features]);
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Dialog, {
		visible: props.visible,
		header: titleHeader + (addingToHeader ? " - " + addingToHeader : ""),
		style: {
			height: "90%",
			width: "80%"
		},
		onHide: () => {
			props.setVisible(false);
		},
		children: activeIndex === 1 && attributesAndValues && /* @__PURE__ */ jsx(GeometryEditor, {
			attributes: attributesAndValues,
			visible,
			layerCurrentRenderer,
			applyRenderer,
			setVisible,
			layerDefaultRenderer,
			moreRamps,
			numbersLocale,
			features,
			predefinedStyles: predefinedStyles ? predefinedStyles : [],
			showPreDefinedRamps
		})
	}) });
};
//#endregion
//#region src/i18n.ts
i18n.use(initReactI18next).init({
	lng: "en",
	fallbackLng: "en",
	debug: true,
	resources: {
		pt: { translation: {
			common: {
				"style_editor": "Editor de Estilos",
				"reset_style": "Repor Estilo",
				"conclude": "Concluir",
				"unique_symbol": "Símbolo Único",
				"categorized": "Categorizado",
				"graduated": "Quantitativo",
				"null": "Nulo",
				"select_type": "Selecionar um tipo de estilo",
				"style_type": "Tipo de Estilo",
				"based_on_rules": "Baseado em regras"
			},
			errors: {
				"error_ramps_same_name": "Existem rampas com o mesmo nome: ",
				"error_diff": "A diferença entre os valores máximo e mínimo deve ser maior do que 0, é: ",
				"error_sum": "A soma das contagens dos intervalos deve ser igual ao número de valores",
				"error_sum2": "A soma das contagens está incorreta: ",
				"error_values": "Os valores dos intervalos devem ser crescentes."
			},
			categorized: {
				"predefined_styles": "Estilos Pré-definidos",
				"color_ramps": "Rampas de Cores",
				"stroke_color": "Cor do Contorno",
				"stroke_width": "Largura do Contorno",
				"attribute": "Atributo",
				"select_attribute": "Selecionar um atributo",
				"update_colors": "Atualizar cores",
				"color_opacity": "Opacidade da Cor",
				"colors_spectrum": "Espetro de Cores",
				"select_spectrum": "Selecionar um espetro",
				"custom_style": "Estilo Personalizado",
				"reverse_colors": "Inverter cores",
				"color_style": "Estilo de Cores"
			},
			unique_symbol: { "fill_color": "Cor de Preenchimento" },
			color_picker: { "select_color": "Selecionar uma cor" },
			graduated: {
				"amount_values": "Quantidade de valores (%)",
				"values": "Valores",
				"amount": "Quantidade (%)",
				"select_mode": "Selecionar um modo",
				"which_mode": "Qual modo escolher?",
				"interval_size": "Tamanho do intervalo",
				"classes_number": "Nº de classes",
				"invert_colors": "Inverter cores do espetro",
				"gradient_intervals": "Intervalos de Gradiente",
				"value": "Valor",
				"preview": "Pré-visualização",
				"min_value": "Valor Mínimo",
				"max_value": "Valor Máximo",
				"color": "Cor",
				"mode": "Modo"
			},
			graduate_modes: {
				"EqualInterval": "Intervalos Iguais",
				"Quantile": "Quantil",
				"NaturalBreaks": "Quebras Naturais (Jenks)",
				"DefinedInterval": "Intervalos Definidos",
				"Manual": "Manual",
				"GeometricInterval": "Intervalo Geométrico",
				"StandardDeviation": "Desvio Padrão"
			},
			based_on_rules: {
				"name": "Nome",
				"type": "Tipo",
				"preview": "Pré-visualização",
				"expression": "Expressão",
				"all_other_geometries": "Todas as restantes geometrias",
				"filter": "Filtro",
				"select_id_attribute": "Selecione o atributo de ID",
				"ids_not_unique": "Os IDs não são únicos",
				"add_rule": "Adicionar Regra",
				"remove_rule": "Remover Regra",
				"edit_rule": "Editar Regra"
			},
			filters: {
				"yes": "Sim",
				"no": "Não",
				"is": "é",
				"is_not": "não é",
				"starts_with": "começa com",
				"ends_with": "acaba com",
				"contains": "contém",
				"does_not_contain": "não contém",
				"is_null": "é nulo",
				"is_at_least": "é pelo menos",
				"is_less_than": "é menor que",
				"is_at_most": "é no máximo",
				"is_greater_than": "é maior que",
				"condition": "Condição ",
				"select_attribute": "Selecione o atributo",
				"select_operator": "Selecione o operador",
				"select_value": "Selecione um valor",
				"invalid_chars_error": "A condição {{id}} contém caracteres inválidos.",
				"invalid_attribute_error": "A condição tem um atributo inválido",
				"all_true": "Todas verdadeiras",
				"any_true": "Pelo menos uma verdadeira",
				"expression": "Expressão",
				"add_condition": "Adicionar Condição",
				"add_filter": "Adicionar Filtro",
				"name": "Nome",
				"filter": "Filtro",
				"all_other_geometries": "Todas as restantes geometrias",
				"title_empty_error": "Título não pode ser vazio!",
				"min_one_expression_error": "Tenha pelo menos uma expressão!",
				"select_and_or_error": "Selecione se a expressão {{id}} é \"E\" ou \"OU\"",
				"select_attribute_error": "Selecione um atributo para a condição {{id}}",
				"select_function_error": "Selecione uma função para a condição {{id}}",
				"select_value_error": "Selecione um valor para a condição {{id}}"
			}
		} },
		en: { translation: {
			common: {
				"style_editor": "Style Editor",
				"reset_style": "Reset Style",
				"conclude": "Apply",
				"unique_symbol": "Unique Symbol",
				"categorized": "Categorized",
				"graduated": "Quantitative",
				"null": "Null",
				"select_type": "Select a style type",
				"style_type": "Style Type",
				"based_on_rules": "Based on rules"
			},
			errors: {
				"error_ramps_same_name": "There are ramps with the same name: ",
				"error_diff": "The difference between the max and min values must be greater than 0, it is: ",
				"error_sum": "The sum of the counts of the intervals must be equal to the number of values",
				"error_sum2": "The sum of the counts is wrong: ",
				"error_values": "The interval values must be increasing."
			},
			categorized: {
				"predefined_styles": "Predefined Styles",
				"color_ramps": "Color Ramps",
				"stroke_color": "Stroke Color",
				"stroke_width": "Stroke Width",
				"attribute": "Attribute",
				"select_attribute": "Select an attribute",
				"update_colors": "Update colors",
				"color_opacity": "Color Opacity",
				"colors_spectrum": "Colors Spectrum",
				"select_spectrum": "Select a spectrum",
				"custom_style": "Custom Style",
				"reverse_colors": "Reverse colors",
				"color_style": "Color Style"
			},
			unique_symbol: { "fill_color": "Fill Color" },
			color_picker: { "select_color": "Select a color" },
			graduated: {
				"amount_values": "Amount of values (%)",
				"values": "Values",
				"amount": "Amount (%)",
				"select_mode": "Select a mode",
				"which_mode": "Which mode to choose?",
				"interval_size": "Interval size",
				"classes_number": "Number of classes",
				"invert_colors": "Invert colors of the spectrum",
				"gradient_intervals": "Gradient Intervals",
				"value": "Value",
				"preview": "Preview",
				"min_value": "Minimum Value",
				"max_value": "Maximum Value",
				"color": "Color",
				"mode": "Mode"
			},
			graduate_modes: {
				"EqualInterval": "Equal Intervals",
				"Quantile": "Quantile",
				"NaturalBreaks": "Natural Breaks (Jenks)",
				"DefinedInterval": "Defined Intervals",
				"Manual": "Manual",
				"GeometricInterval": "Geometric Interval",
				"StandardDeviation": "Standard Deviation"
			},
			based_on_rules: {
				"name": "Name",
				"type": "Type",
				"preview": "Preview",
				"expression": "Expression",
				"all_other_geometries": "All other geometries",
				"filter": "Filter",
				"select_id_attribute": "Select the ID attribute",
				"ids_not_unique": "IDs are not unique",
				"add_rule": "Add Rule",
				"remove_rule": "Remove Rule",
				"edit_rule": "Edit Rule"
			},
			filters: {
				"yes": "Yes",
				"no": "No",
				"is": "is",
				"is_not": "is not",
				"starts_with": "starts with",
				"ends_with": "ends with",
				"contains": "contains",
				"does_not_contain": "does not contain",
				"is_null": "is null",
				"is_at_least": "is at least",
				"is_less_than": "is less than",
				"is_at_most": "is at most",
				"is_greater_than": "is greater than",
				"condition": "Condition ",
				"select_attribute": "Select the attribute",
				"select_operator": "Select the operator",
				"select_value": "Select a value",
				"invalid_chars_error": "Condition {{id}} contains invalid characters.",
				"invalid_attribute_error": "The condition has an invalid attribute",
				"all_true": "All true",
				"any_true": "At least one true",
				"expression": "Expression",
				"add_condition": "Add Condition",
				"add_filter": "Add Filter",
				"name": "Name",
				"filter": "Filter",
				"all_other_geometries": "All other geometries",
				"title_empty_error": "Title cannot be empty!",
				"min_one_expression_error": "Have at least one expression!",
				"select_and_or_error": "Select whether the expression {{id}} is \"AND\" or \"OR\"",
				"select_attribute_error": "Select an attribute for condition {{id}}",
				"select_function_error": "Select a function for condition {{id}}",
				"select_value_error": "Select a value for condition {{id}}"
			}
		} }
	},
	interpolation: { escapeValue: false }
});
var i18n_default = i18n;
//#endregion
//#region src/components/main/StyleEditor.tsx
function StyleEditor(props) {
	const { visible, setVisible, layerDefaultRenderer, layerCurrentRenderer, addingToHeader, applyRenderer, features, showPreDefinedRamps, moreRamps, predefinedStyles, primeReactTheme, numbersLocale, textLocale, customLocale } = props;
	const addLink = (href) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.id = "theme-link";
		link.href = href;
		document.head.appendChild(link);
	};
	if (document.getElementById("primeTheme") == null) if (primeReactTheme == void 0) addLink("https://land-it.github.io/openlayers-style-editor/themes/lara-light-green/theme.css");
	else addLink("https://land-it.github.io/openlayers-style-editor/themes/" + primeReactTheme + "/theme.css");
	useEffect(() => {
		if (textLocale == "custom" && customLocale) {
			i18n_default.addResourceBundle("custom", "translation", customLocale, true, true);
			i18n_default.changeLanguage("custom");
		} else i18n_default.changeLanguage(textLocale ? textLocale : "en");
	}, []);
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(I18nextProvider, {
		i18n: i18n_default,
		children: /* @__PURE__ */ jsx(PrimeReactProvider, { children: /* @__PURE__ */ jsx(StyleEditorComponent, {
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
		}) })
	}) });
}
//#endregion
export { AttributeTypeEnum, GraduatedModes, RenderType, StyleEditor, changeRendererOpacity, generateRandomColor, getByRulesStyle, getCategorizedStyle, getGraduatedStyle, getRendererColorAndSizeStroke, getRendererOpacity, getStyleColorsAndValues, singleColorStyle, singleColorStyleForLines };

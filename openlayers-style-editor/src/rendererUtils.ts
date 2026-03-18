import { Color, fromString } from "ol/color";
import { FlatStyle } from "ol/style/flat";
import { Stop } from "./components/rampColors.ts";
import { Feature } from "ol";
import jsonLogic from "json-logic-js";

export interface FilterRule {
    name: string
    filterJson?: string
    isElse: boolean
    symbol: Render
    isAll?: boolean
}

//https://openlayers.org/en/latest/apidoc/module-ol_style_expressions.html

export enum AttributeTypeEnum {
    'STRING',
    'INTEGER',
    'FLOAT',
    'BOOLEAN',
    'DATE',
    'JSON'
}

export interface SEAttribute {
    id: number;
    name: string;
    type: AttributeTypeEnum;
    values: Array<string>;
}

export interface Render {
    type: RenderType;
    field?: string | null
    graduatedType?: GraduatedModes
    rendererOL: FlatStyle
    filters?: FilterRule[]
}

export enum RenderType {
    Unique = "Unique",
    Categorized = "Categorized",
    Graduated = "Graduated",
    ByRules = "ByRules"
}


// //taken from: https://resources.arcgis.com/en/help/main/10.2/index.html#//00s50000001r000000
export enum GraduatedModes {
    Manual = "Manual",
    EqualInterval = "EqualInterval",
    DefinedInterval = "DefinedInterval",
    Quantile = "Quantile",
    NaturalBreaks = "NaturalBreaks",
    //not yet implemented
    GeometricInterval = "GeometricInterval",
    StandardDeviation = "StandardDeviation",
}


export interface PredefinedRenderer {
    name: string
    renderer: Row[]
}

export interface Row {
    value: number | string,
    color: Color
}

export interface ColorRampDropdownItem {
    label: string
    value: ColorRampItem
}

export interface ColorRampItem {
    label: string,
    value: Row[] | Stop[]
}

export function getCategorizedStyle(attribute: string, colors: Row[], outlineColor?: Color, outlineWidth?: number, defaultColor?: Color): FlatStyle {
    let outlineColorCopy: Color | undefined = outlineColor ? [...outlineColor] : undefined
    if (outlineWidth == 0 && outlineColorCopy != undefined)
        outlineColorCopy[3] = 0
    else if (outlineWidth != undefined && outlineWidth > 0 && outlineColorCopy)
        outlineColorCopy[3] = 1

    let aux = []
    aux.push('match')
    aux.push(['get', attribute])
    colors.forEach((color) => {
        aux.push(color.value)
        aux.push(color.color)
    })
    aux.push(defaultColor || fromString('#333333'))

    return ({
        'stroke-color': [
            'case',
            ['==', ['var', 'highlightedId'], ['id']],
            'white',
            outlineColorCopy || '#000000'
        ],
        'stroke-width': ['case', ['==', ['var', 'highlightedId'], ['id']], 2, outlineWidth == undefined ? 1 : outlineWidth],
        'fill-color': aux
    })
}

export function singleColorStyle(color: Color, outlineColor?: Color, outlineWidth?: number): FlatStyle {
    let outlineColorCopy: Color | undefined = outlineColor ? [...outlineColor] : undefined
    if (outlineWidth == 0 && outlineColorCopy != undefined)
        outlineColorCopy[3] = 0
    else if (outlineWidth != undefined && outlineWidth > 0 && outlineColorCopy)
        outlineColorCopy[3] = 1

    return ({
        'stroke-color': [
            'case',
            ['==', ['var', 'highlightedId'], ['id']],
            'white',
            outlineColorCopy || '#000000'
        ],
        'stroke-width': ['case', ['==', ['var', 'highlightedId'], ['id']], 2, outlineWidth == undefined ? 1 : outlineWidth],
        "stroke-offset": 0,
        'fill-color': color
    })
}

export function singleColorStyleForLines(color: Color): FlatStyle {
    return ({
        'stroke-color': color,
        'stroke-width': 1,
        "stroke-offset": 0
    })
}

export function getGraduatedStyle(attribute: string, ramp: Row[], outlineColor?: Color, outlineWidth?: number): FlatStyle {
    let outlineColorCopy: Color | undefined = outlineColor ? [...outlineColor] : undefined
    if (outlineWidth == 0 && outlineColorCopy != undefined)
        outlineColorCopy[3] = 0
    else if (outlineWidth != undefined && outlineWidth > 0 && outlineColorCopy)
        outlineColorCopy[3] = 1

    let aux = []
    aux.push('interpolate')
    aux.push(['linear'])
    aux.push(['get', attribute])
    ramp.forEach((stop) => {
        aux.push(stop.value)
        aux.push(stop.color)
    })

    const res = ({
        'stroke-color': [
            'case',
            ['==', ['var', 'highlightedId'], ['id']],
            'white',
            outlineColorCopy || '#000000'
        ],
        'stroke-width': ['case', ['==', ['var', 'highlightedId'], ['id']], 2, outlineWidth == undefined ? 1 : outlineWidth],
        'fill-color': aux
    })

    return res
}

export function getRendererOpacity(renderer: Render) {
    if (renderer.type == RenderType.Unique)
        return (renderer.rendererOL["fill-color"]! as Color)[3] * 100
    if (renderer.type == RenderType.Categorized)
        return ((renderer.rendererOL["fill-color"]! as any[])[3] as number[])[3] * 100
    if (renderer.type == RenderType.Graduated)
        return ((renderer.rendererOL["fill-color"]! as any[])[4] as number[])[3] * 100
    if (renderer.type == RenderType.ByRules)
        return ((renderer.rendererOL["fill-color"]! as any[])[2] as Color)[3] * 100
    return 100
}

export function changeRendererOpacity(renderer: Render, opacity: number): Render {
    let newRenderer: Render = renderer
    if (renderer.type == RenderType.Unique) {
        let aux = renderer.rendererOL["fill-color"]! as Color
        aux = [...aux]
        aux[3] = opacity / 100
        newRenderer = {
            ...renderer, rendererOL: {
                ...renderer.rendererOL,
                ["fill-color"]: aux
            }
        } as Render
    }
    if (renderer.type == RenderType.Categorized) {
        let aux = (renderer.rendererOL["fill-color"]! as any[]).slice(3) as any[]
        let newAux = [...aux]
        for (let i = 0; i < aux.length; i += 2) {
            let color = [...aux[i]] as Color
            color[3] = opacity / 100
            newAux[i] = color
        }
        newRenderer = {
            ...renderer, rendererOL: {
                ...renderer.rendererOL,
                ["fill-color"]: (renderer.rendererOL["fill-color"]! as any[]).slice(0, 3).concat(newAux)
            }
        } as Render
        // newRenderer.rendererOL["fill-color"] = (renderer.rendererOL["fill-color"]! as any[]).slice(0, 3).concat(newAux)
    }
    if (renderer.type == RenderType.Graduated) {
        let aux = (renderer.rendererOL["fill-color"]! as any[]).slice(4) as any[]
        let newAux = [...aux]
        for (let i = 0; i < aux.length; i += 2) {
            let color = [...aux[i]] as Color
            color[3] = opacity / 100
            newAux[i] = color
        }
        newRenderer = {
            ...renderer, rendererOL: {
                ...renderer.rendererOL,
                ["fill-color"]: (renderer.rendererOL["fill-color"]! as any[]).slice(0, 4).concat(newAux)
            }
        } as Render
    }
    if (renderer.type == RenderType.ByRules) {
        let fillColorArray = renderer.rendererOL["fill-color"]! as any[]
        let newFillColorArray = [...fillColorArray]
        // Colors are at indices 2,4,6,... and the last element (else color)
        for (let i = 2; i < newFillColorArray.length - 1; i += 2) {
            if (Array.isArray(newFillColorArray[i]) && newFillColorArray[i].length === 4) {
                newFillColorArray[i] = [...newFillColorArray[i]]
                newFillColorArray[i][3] = opacity / 100
            }
        }
        // Update the else color
        if (Array.isArray(newFillColorArray[newFillColorArray.length - 1]) && newFillColorArray[newFillColorArray.length - 1].length === 4) {
            newFillColorArray[newFillColorArray.length - 1] = [...newFillColorArray[newFillColorArray.length - 1]]
            newFillColorArray[newFillColorArray.length - 1][3] = opacity / 100
        }
        newRenderer = {
            ...renderer, rendererOL: {
                ...renderer.rendererOL,
                ["fill-color"]: newFillColorArray
            }
        } as Render
    }
    return newRenderer
}

export function getStyleColorsAndValues(style: FlatStyle, type: RenderType): Row[] {
    let colors: Row[] = []
    if (type == RenderType.Categorized) {

        for (let i = 2; i < style["fill-color"]!.length - 1; i += 2) {
            colors.push({
                value: style["fill-color"]![i] as string | number,
                color: style["fill-color"]![i + 1] as Color
            })
        }
        colors.push({
            value: "Nulo",
            color: style["fill-color"]![style["fill-color"]!.length - 1] as Color
        })
    }
    if (type == RenderType.Graduated) {
        for (let i = 3; i < style["fill-color"]!.length - 1; i += 2) {
            colors.push({
                value: style["fill-color"]![i] as string | number,
                color: style["fill-color"]![i + 1] as Color
            })
        }
        colors.push({
            value: "Nulo",
            color: style["fill-color"]![style["fill-color"]!.length - 1] as Color
        })
    }
    if (type == RenderType.Unique)
        colors = [{ value: "Único", color: style["fill-color"]! as Color }]
    return colors
}

export function getRendererColorAndSizeStroke(renderer: Render): { color: Color, size: number } {
    return {
        color: renderer.rendererOL["stroke-color"]![3] as Color,
        size: (renderer.rendererOL["stroke-width"]! as any[])[3] as number
    }
}

export function generateRandomColor() {
    return fromString('#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6))
}

function jsonLogicToOlExpression(logic: any, features: Feature[] = [], idFieldName: string = ""): any {
    if (logic === null) return "";
    if (typeof logic !== "object") return logic;
    if (Array.isArray(logic)) return ["literal", logic];

    const operator = Object.keys(logic)[0];
    const value = logic[operator];

    if (operator === "var") return ["get", value];

    if (operator === "and" || operator === "or") {
        const olOp = operator === "and" ? "all" : "any";
        if (!Array.isArray(value) || value.length === 0) return true;

        const children = value.map(v => {
            const compiled = jsonLogicToOlExpression(v, features, idFieldName);
            if (compiled !== null) return compiled;
            return fallbackToIds(v, features, idFieldName);
        });

        if (children.length === 0) return true;
        if (children.length === 1) return children[0];
        return [olOp, ...children];
    }

    if (operator === "!") {
        const inner = jsonLogicToOlExpression(value, features, idFieldName);
        if (inner === null) return null; // Let parent try to wrap the `!` or fallback the whole ! block
        return ["!", inner];
    }

    // Generic comparisons
    const comparisons = ["==", "===", "!=", "!==", "<", ">", "<=", ">="];
    if (comparisons.includes(operator) && Array.isArray(value) && value.length === 2) {
        const arg1 = jsonLogicToOlExpression(value[0], features, idFieldName);
        const arg2 = jsonLogicToOlExpression(value[1], features, idFieldName);

        if (arg1 === null || arg2 === null) return null;

        let olOp = operator;
        if (operator === "===") olOp = "==";
        if (operator === "!==") olOp = "!=";

        // Ensure literal values are wrapped or safe
        const safeArg1 = (arg1 === "") ? "" : arg1;
        const safeArg2 = (arg2 === "") ? "" : arg2;

        return [olOp, safeArg1, safeArg2];
    }

    if (operator === "in" && Array.isArray(value) && value.length === 2) {
        const arg1 = jsonLogicToOlExpression(value[0], features, idFieldName);
        const arg2 = jsonLogicToOlExpression(value[1], features, idFieldName);

        if (arg1 === null || arg2 === null) return null;

        // Only literal arrays are supported haystacks for 'in' in WebGL
        if (Array.isArray(arg2) && arg2[0] === "literal" && Array.isArray(arg2[1])) {
            return [operator, arg1, arg2];
        }
        return null; // fallback
    }

    if (operator === "true" || operator === "false" || operator === "null") {
        const target = Array.isArray(value) ? value[0] : value;
        const attrVal = jsonLogicToOlExpression(target, features, idFieldName);
        if (attrVal === null) return null;
        if (operator === "null") return ["==", attrVal, ""];
        return ["==", attrVal, operator === "true"];
    }

    return null;
}

function fallbackToIds(logic: any, features: Feature[], idFieldName: string): any {
    if (!idFieldName || !features || features.length === 0) return ["==", 1, 0];
    
    let matchingIds = features
        .filter(f => {
            try {
                return !!jsonLogic.apply(logic, f.getProperties());
            } catch (e) {
                // Ignore errors caused by jsonLogic trying to run string ops on null properties
                return false;
            }
        })
        .map(f => f.get(idFieldName))
        .filter(id => id !== undefined && id !== null) as (string|number)[];
    
    const idExpr = ["get", idFieldName];
    const strings: string[] = [];
    const numbers: number[] = [];
    matchingIds.forEach(id => {
        if (typeof id === 'string') strings.push(id);
        else if (typeof id === 'number') numbers.push(id);
    });

    const conds: any[] = [];
    if (strings.length > 0) conds.push(["in", idExpr, strings]);
    if (numbers.length > 0) conds.push(["in", idExpr, numbers]);

    if (conds.length === 0) return ["==", 1, 0];
    if (conds.length === 1) return conds[0];
    return ["any", ...conds];
}

export function getFriendlyExpression(data: FilterRule): string {
    if (!data.filterJson) return "";
    try {
        const parsed = JSON.parse(data.filterJson);
        const formatCondition = (cond: any): string => {
            const operator = Object.keys(cond)[0];
            const value = cond[operator];
            if (operator === "!" && value.hasOwnProperty("in")) {
                const innerCondition = value["in"];
                const attributeName = Array.isArray(innerCondition[1].var) ? innerCondition[1].var[0] : innerCondition[1].var;
                return `${attributeName} not in ${JSON.stringify(innerCondition[0])}`;
            }
            if (operator === "==" && Array.isArray(value) && value[0] && value[0].hasOwnProperty("substr")) {
                const substr = value[0].substr;
                const valueString = value[1];
                const attributeName = Array.isArray(substr[0].var) ? substr[0].var[0] : substr[0].var;
                return `${attributeName} ${substr[1] < 0 ? 'endsWith' : 'startsWith'} "${valueString}"`;
            }
            if (operator === "==" && Array.isArray(value) && value[0] === null) {
                const attributeName = Array.isArray(value[1].var) ? value[1].var[0] : value[1].var;
                return `${attributeName} is null`;
            }
            const max = Array.isArray(value) ? value[0] : null;
            if (max && max.hasOwnProperty("var")) {
                const attributeName = Array.isArray(max.var) ? max.var[0] : max.var;
                return `${attributeName} ${operator} ${JSON.stringify(value[1])}`;
            }
            if (Array.isArray(value) && value[1] && value[1].hasOwnProperty("var")) {
                const attributeName = Array.isArray(value[1].var) ? value[1].var[0] : value[1].var;
                return `${attributeName} ${operator} ${JSON.stringify(max)}`;
            }
            return JSON.stringify(cond);
        };
        const isAll = parsed.hasOwnProperty("and");
        const isAny = parsed.hasOwnProperty("or");
        if (isAll || isAny) {
            const operator = isAll ? " AND " : " OR ";
            return parsed[isAll ? "and" : "or"].map(formatCondition).join(operator);
        } else {
            return formatCondition(parsed);
        }
    } catch (e) {
        return data.filterJson;
    }
}

export function getByRulesStyle(filters: FilterRule[], idFieldName: string, features: Feature[],
    elseFilter?: FilterRule): FlatStyle {
    if (filters.length === 0) {
        const defaultStyle = {
            'stroke-color': [0, 0, 0, 1],
            'stroke-width': 1,
            'fill-color': [255, 255, 255, 1],
            '_rules': []
        };
        if (elseFilter) {
            let fillColor = getStyleColorsAndValues(elseFilter.symbol.rendererOL, RenderType.Unique)[0].color;
            let stroke = getRendererColorAndSizeStroke(elseFilter.symbol);
            return {
                ...defaultStyle,
                'stroke-color': stroke.color,
                'stroke-width': stroke.size,
                'fill-color': fillColor
            } as any;
        }
        return defaultStyle as any;
    }

    let fillColorArray: any[] = ['case'];
    let strokeColorArray: any[] = ['case'];
    let strokeWidthArray: any[] = ['case'];

    filters.forEach(filter => {
        let fillColor = getStyleColorsAndValues(filter.symbol.rendererOL, RenderType.Unique)[0].color;
        let cond: any = ["==", 1, 0]; // WebGL safe 'false'

        try {
            if (filter.filterJson) {
                const parsedLogic = JSON.parse(filter.filterJson);
                const nativeExpression = jsonLogicToOlExpression(parsedLogic, features, idFieldName);

                if (nativeExpression !== null) {
                    cond = nativeExpression;
                } else {
                    // Fallback at the root if the root node wasn't an AND/OR that we recursively fell back,
                    // e.g. if the entire root is a single `startsWith` block.
                    cond = fallbackToIds(parsedLogic, features, idFieldName);
                }
            }
        } catch (e) {
            console.error("Error creating OL expression", e);
        }

        fillColorArray.push(cond);
        fillColorArray.push(fillColor);

        let stroke = getRendererColorAndSizeStroke(filter.symbol);
        strokeColorArray.push(cond);
        strokeColorArray.push(stroke.color);
        strokeWidthArray.push(cond);
        strokeWidthArray.push(stroke.size);
    })

    if (elseFilter) {
        let fillColor = getStyleColorsAndValues(elseFilter.symbol.rendererOL, RenderType.Unique)[0].color
        fillColorArray.push(fillColor)
        let stroke = getRendererColorAndSizeStroke(elseFilter.symbol)
        strokeColorArray.push(stroke.color)
        strokeWidthArray.push(stroke.size)
    } else {
        fillColorArray.push([255, 255, 255, 1])
        strokeColorArray.push([0, 0, 0, 1])
        strokeWidthArray.push(1)
    }

    const res = {
        'stroke-color': strokeColorArray,
        'stroke-width': strokeWidthArray,
        'fill-color': fillColorArray,
        '_rules': filters.map(f => ({ expression: getFriendlyExpression(f), name: f.name, json: f.filterJson,
            render: f.symbol }))
    } as any;

    return res;
}
import {Color, fromString} from "ol/color";
import {FlatStyle} from "ol/style/flat";
import {Stop} from "./components/rampColors.ts";

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



export interface PreDefinedRenderer {
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
            outlineColor || '#000000'
        ],
        'stroke-width': ['case', ['==', ['var', 'highlightedId'], ['id']], 2, outlineWidth || 1],
        'fill-color': aux
    })
}

export function singleColorStyle(color: Color, outlineColor?: Color, outlineWidth?: number): FlatStyle {
    return ({
        'stroke-color': [
            'case',
            ['==', ['var', 'highlightedId'], ['id']],
            'white',
            outlineColor || '#000000'
        ],
        'stroke-width': ['case', ['==', ['var', 'highlightedId'], ['id']], 2, outlineWidth || 1],
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
    let aux = []
    aux.push('interpolate')
    aux.push(['linear'])
    aux.push(['get', attribute])
    ramp.forEach((stop) => {
        aux.push(stop.value)
        aux.push(stop.color)
    })

    return ({
        'stroke-color': [
            'case',
            ['==', ['var', 'highlightedId'], ['id']],
            'white',
            outlineColor || '#000000'
        ],
        'stroke-width': ['case', ['==', ['var', 'highlightedId'], ['id']], 2, outlineWidth || 1],
        'fill-color': aux
    })
}

export function getRendererOpacity(renderer: Render) {
    if (renderer.type == RenderType.Unique)
        return (renderer.rendererOL["fill-color"]! as Color)[3] * 100
    if (renderer.type == RenderType.Categorized)
        return ((renderer.rendererOL["fill-color"]! as any[])[3] as number[])[3] * 100
    if (renderer.type == RenderType.Graduated)
        return ((renderer.rendererOL["fill-color"]! as any[])[4] as number[])[3] * 100
    return 100
}

export function changeRendererOpacity(renderer: Render, opacity: number): Render {
    let newRenderer: Render = renderer
    if (renderer.type == RenderType.Unique) {
        let aux = renderer.rendererOL["fill-color"]! as Color
        aux = [...aux]
        aux[3] = opacity / 100
        newRenderer = {...renderer} as Render
        newRenderer.rendererOL["fill-color"] = aux
    }
    if (renderer.type == RenderType.Categorized) {
        let aux = (renderer.rendererOL["fill-color"]! as any[]).slice(3) as any[]
        let newAux = [...aux]
        for (let i = 0; i < aux.length; i += 2) {
            let color = [...aux[i]] as Color
            color[3] = opacity / 100
            newAux[i] = color
        }
        console.log(renderer)
        newRenderer = {
            ...renderer, rendererOL: {
                ...renderer.rendererOL,
                ["fill-color"]: (renderer.rendererOL["fill-color"]! as any[]).slice(0, 3).concat(newAux)
            }
        } as Render
        console.log(newRenderer)
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
        newRenderer = {...renderer} as Render
        newRenderer.rendererOL["fill-color"] = (renderer.rendererOL["fill-color"]! as any[]).slice(0, 4).concat(newAux)
    }
    return newRenderer
}

export function getStyleColorsAndValues(style: FlatStyle, type: RenderType): Row[] {
    let colors: Row[] = []
    if (type == RenderType.Categorized) {

        for (let i = 2; i < style["fill-color"]!.length - 1; i += 2) {
            colors.push({
                value: style["fill-color"]![i] as string,
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
                value: style["fill-color"]![i] as string,
                color: style["fill-color"]![i + 1] as Color
            })
        }
        colors.push({
            value: "Nulo",
            color: style["fill-color"]![style["fill-color"]!.length - 1] as Color
        })
    }
    if (type == RenderType.Unique)
        colors = [{value: "Único", color: style["fill-color"]! as Color}]
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
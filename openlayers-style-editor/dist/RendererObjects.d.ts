import { Color } from 'ol/color';
import { FlatStyle } from 'ol/style/flat';
import { Stop } from './components/rampColors.ts';
export declare enum AttributeTypeEnum {
    'STRING' = 0,
    'INTEGER' = 1,
    'FLOAT' = 2,
    'BOOLEAN' = 3,
    'DATE' = 4,
    'JSON' = 5
}
export interface SEAttribute {
    id: number;
    name: string;
    type: AttributeTypeEnum;
    values: Array<string>;
}
export interface Render {
    type: RenderType;
    field?: string | null;
    graduatedType?: GraduatedModes;
    rendererOL: FlatStyle;
}
export declare enum RenderType {
    Unique = "Unique",
    Categorized = "Categorized",
    Graduated = "Graduated",
    ByRules = "ByRules"
}
export declare enum GraduatedModes {
    Manual = "Manual",
    EqualInterval = "Intervalos Iguais",
    DefinedInterval = "Intervalos Definidos",
    Quantile = "Quantil",
    NaturalBreaks = "Quebras Naturais (Jenks)",
    GeometricInterval = "GeometricInterval",
    StandardDeviation = "StandardDeviation"
}
export interface PreDefinedRenderer {
    name: string;
    renderer: Row[];
}
export interface Row {
    value: number | string;
    color: Color;
}
export interface ColorRampDropdownItem {
    label: string;
    value: ColorRampItem;
}
export interface ColorRampItem {
    label: string;
    value: Row[] | Stop[];
}
export declare function getCategorizedStyle(attribute: string, colors: Row[], outlineColor?: Color, outlineWidth?: number, defaultColor?: Color): FlatStyle;
export declare function singleColorStyle(color: Color, outlineColor?: Color, outlineWidth?: number): FlatStyle;
export declare function singleColorStyleForLines(color: Color): FlatStyle;
export declare function getGraduatedStyle(attribute: string, ramp: Row[], outlineColor?: Color, outlineWidth?: number): FlatStyle;
export declare function getRendererOpacity(renderer: Render): number;
export declare function changeRendererOpacity(renderer: Render, opacity: number): Render;
export declare function getStyleColorsAndValues(style: FlatStyle, type: RenderType): Row[];
export declare function getRendererColorAndSizeStroke(renderer: Render): {
    color: Color;
    size: number;
};
export declare function generateRandomColor(): Color;

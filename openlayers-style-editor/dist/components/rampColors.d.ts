import { Color } from 'ol/color';
export interface Stop {
    color: Color;
    offset: number;
}
export interface ColorRamp {
    id: number;
    name: string;
    palette: Stop[];
}
export declare function getColorRampString(ramp: Stop[]): string;
export declare function generateGradient(stops: Stop[], numberOfSteps: number): string[];
export declare function getColorAtPosition(stops: Stop[], position: number): Color;
export declare const colorRamps: ColorRamp[];

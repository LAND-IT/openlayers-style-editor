import { default as React } from 'react';
import { Render, SEAttribute } from '../rendererUtils';
import { ColorRamp } from './rampColors.ts';
interface GraduatedProps {
    attr: SEAttribute[];
    setAttr: (value: never) => void;
    applyRenderer: (renderer: Render) => void;
    setVisible: (e: boolean) => void;
    showPreDefinedRamps: boolean;
    moreRamps?: ColorRamp[];
    layerCurrentRenderer: Render;
    numbersLocale: string;
}
export declare const Graduated: React.FC<GraduatedProps>;
export {};

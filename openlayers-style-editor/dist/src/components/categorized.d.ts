import { default as React } from 'react';
import { ColorRamp } from './rampColors';
import { PredefinedRenderer, Render, SEAttribute } from '../RendererObjects.ts';
interface Props {
    attr: SEAttribute[];
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    setVisible: (e: boolean) => void;
    showPreDefinedRamps: boolean;
    moreRamps?: ColorRamp[];
    predefinedStyles: PredefinedRenderer[];
}
export declare const Categorized: React.FC<Props>;
export {};

import { default as React } from 'react';
import { AttributeDTO, Render } from './rendererObjects';
import { ColorRamp } from './rampColors.ts';
interface GraduatedProps {
    attr: AttributeDTO[];
    setAttr: (value: never) => void;
    applyRenderer: (renderer: Render) => void;
    setVisible: (e: boolean) => void;
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    layerCurrentRenderer: Render;
}
export declare const Graduated: React.FC<GraduatedProps>;
export {};

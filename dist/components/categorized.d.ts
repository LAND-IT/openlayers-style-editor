import { default as React } from 'react';
import { ColorRamp } from './rampColors';
import { PreDefinedRenderer, Render } from './rendererObjects';
import { AttributeDTO } from './rendererObjects.ts';
interface Props {
    attr: AttributeDTO[];
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    setVisible: (e: boolean) => void;
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    preDefinedStyles: PreDefinedRenderer[];
}
export declare const Categorized: React.FC<Props>;
export {};

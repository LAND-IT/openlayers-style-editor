import { default as React, Dispatch, SetStateAction } from 'react';
import { PreDefinedRenderer, Render } from './RendererObjects.ts';
import { ColorRamp } from './components/rampColors.ts';
import { default as VectorSource } from 'ol/source/Vector';
import { Feature } from 'ol';
interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    vectorSource: VectorSource | Feature[];
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    preDefinedStyles: PreDefinedRenderer[];
    addingToHeader?: string;
}
declare const StyleEditor: React.FC<Props>;
export default StyleEditor;

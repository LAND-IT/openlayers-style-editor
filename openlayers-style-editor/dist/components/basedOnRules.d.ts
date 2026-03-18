import { Render } from '../rendererUtils';
import { Feature } from 'ol';
interface Props {
    setVisible: (e: boolean) => void;
    applyRenderer: (renderer: Render) => void;
    layerCurrentRenderer: Render;
    features: Feature[];
    idFieldName: string | null;
}
export declare function BasedOnRules(props: Props): import("react/jsx-runtime").JSX.Element;
export {};

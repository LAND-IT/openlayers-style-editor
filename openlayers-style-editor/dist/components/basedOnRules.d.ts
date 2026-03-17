import { Render, SEAttribute } from '../rendererUtils';
import { Feature } from 'ol';
export interface FilterRule {
    name: string;
    filterJson?: string;
    isElse: boolean;
    symbol: Render;
    isAll?: boolean;
    friendlyExpression?: string;
}
interface Props {
    setVisible: (e: boolean) => void;
    features: Feature[];
    applyRenderer: (renderer: Render) => void;
    layerCurrentRenderer: Render;
    attributes: SEAttribute[];
}
export declare function BasedOnRules(props: Props): import("react/jsx-runtime").JSX.Element;
export {};

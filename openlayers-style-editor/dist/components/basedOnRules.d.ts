import { Render } from '../rendererUtils';
export interface FilterRule {
    name: string;
    filterJson: string;
    isElse: boolean;
    symbol: Render;
    isAll: boolean;
}
export declare function BasedOnRules(): import("react/jsx-runtime").JSX.Element;

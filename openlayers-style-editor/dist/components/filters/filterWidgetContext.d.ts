import { ReactNode } from 'react';
import { SEAttribute } from '../../rendererUtils.ts';
interface FilterWidgetI {
    title: string;
    expressionSet: {
        id: number;
        conditions: number[];
        expression: {
            conditions: {
                op: string;
                attribute: string;
                value: string;
            }[];
            isAll: boolean | undefined;
        };
    }[];
    expressionsComponents: number[];
    attributes: SEAttribute[];
    idFieldName: string | null;
}
export type FilterWidgetContextType = {
    queryWidget: FilterWidgetI;
    setTitle: (value: string) => void;
    setExpressionSet: (value: {
        id: number;
        conditions: number[];
        expression: {
            conditions: {
                op: string;
                attribute: string;
                value: string;
            }[];
            isAll: boolean | undefined;
        };
    }[]) => void;
    setExpressionsComponents: (value: number[]) => void;
    setAttributes: (value: SEAttribute[]) => void;
    reset: () => void;
    addAttributes: (atts: SEAttribute[]) => void;
    idFieldName: string | null;
};
export declare const FilterWidgetContext: import('react').Context<FilterWidgetContextType | null>;
interface ProviderProps {
    children: ReactNode;
    attributes: SEAttribute[];
    idFieldName: string | null;
}
export declare function FilterWidgetContextProvider({ children, attributes, idFieldName }: ProviderProps): import("react/jsx-runtime").JSX.Element;
export {};

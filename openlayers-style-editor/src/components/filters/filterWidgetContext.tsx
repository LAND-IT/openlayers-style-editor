import {createContext, ReactNode, useState} from "react";
import {SEAttribute} from "@/rendererUtils.ts";

interface FilterWidgetI {
    title: string,
    expressionSet: {
        id: number,
        conditions: number[],
        expression: {
            conditions: {
                op: string,
                attribute: string,
                value: string
            }[],
            isAll: boolean | undefined
        }
    }[],
    expressionsComponents: number[],
    attributes: SEAttribute[],
}

export type FilterWidgetContextType = {
    queryWidget: FilterWidgetI,
    setTitle: (value: string) => void,
    setExpressionSet: (
        value: {
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
        }[]
    ) => void;
    setExpressionsComponents: (value: number[]) => void
    setAttributes: (value: SEAttribute[]) => void
    reset: () => void
    addAttributes: (atts: SEAttribute[]) => void
}

export const FilterWidgetContext = createContext<FilterWidgetContextType | null>(null)

interface ProviderProps {
    children: ReactNode
    attributes: SEAttribute[]
}

export function FilterWidgetContextProvider({children, attributes}: ProviderProps) {

    const initial: FilterWidgetI = {
        title: "",
        attributes: attributes,
        expressionSet: [
            {
                id: 0,
                conditions: [0],
                expression: {
                    conditions: [{ attribute: "", op: "", value: "" }],
                    isAll: undefined,
                },
            },
        ],
        expressionsComponents: [0],
    };

    const [queryWidget, setQueryWidget] = useState<FilterWidgetI>(initial);

    function setTitle(value: string) {
        setQueryWidget({...queryWidget, title: value})
    }

    function setExpressionSet(
        value: {
            id: number;
            conditions: number[];
            expression: { isAll: boolean |  undefined; conditions: { op: string; attribute: string; value: string }[] };
        }[]
    ) {
        setQueryWidget({...queryWidget, expressionSet: value})
    }

    function setExpressionsComponents(value: number[]) {
        setQueryWidget({...queryWidget, expressionsComponents: value})
    }

    function setAttributes(value: SEAttribute[]) {
        setQueryWidget({...queryWidget, attributes: value})
    }

    function reset() {
        let aux = initial
        // aux.layersAndAttributes = []
        setQueryWidget(aux)
    }

    function addAttributes(atts: SEAttribute[]) {
        let aux = queryWidget.attributes
        aux.push(...atts)
        setAttributes(aux)
    }


    return (
        <FilterWidgetContext.Provider
            value={{
                queryWidget,
                setTitle,
                setExpressionSet,
                setExpressionsComponents,
                reset,
                setAttributes,
                addAttributes
            }}>
            {children}
        </FilterWidgetContext.Provider>
    )
}
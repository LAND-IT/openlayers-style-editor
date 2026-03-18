import {Dialog} from "primereact/dialog";
import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {ScrollPanel} from "primereact/scrollpanel";
import {ExpressionOnFilter} from "./expressionOnFilter";
import styles from "./filterWidget.module.css";
import {InputText} from "primereact/inputtext";
import {FilterWidgetContext, FilterWidgetContextType} from "./filterWidgetContext";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {UniqueSymbolComponent} from "@/components/uniqueSymbolComponent";
import {Color} from "ol/color";
import {FilterRule, RenderType, singleColorStyle} from "@/rendererUtils";
import {RadioButton} from "primereact/radiobutton";
import {useTranslation} from "react-i18next";

interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    filter: FilterRule | undefined;
    setFilter: (filter: FilterRule) => void;
    canBeElse: boolean;
}

export const FilterWidget = (props: Props) => {
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const {visible, setVisible, filter, setFilter, canBeElse} = props;
    const {queryWidget, setTitle, setExpressionSet, setExpressionsComponents, reset} =
        useContext(FilterWidgetContext) as FilterWidgetContextType;

    const toast = useRef<Toast | null>(null);
    const {t} = useTranslation();

    const [color, setColor] = useState<Color>()
    const [borderColor, setBorderColor] = useState<Color>()
    const [borderThickness, setBorderThickness] = useState<number>()
    const [isElse, setIsElse] = useState<boolean>(false);

    function constructJsonString(operator: string, attribute: string, value: string): string {
        if (value === "") {
            return `{"==": [{"var": "${attribute}"}, null]}`;
        }
        return !isNaN(parseFloat(value))
            ? constructJsonStringNumerical(operator, attribute, parseFloat(value))
            : constructJsonStringText(operator, attribute, value);
    }

    function constructJsonStringNumerical(operator: string, attribute: string, value: number): string {
        return `{
                "${operator}": [{ "var": "${attribute}" }, ${value}]
            }`;
    }

    function constructJsonStringText(operator: string, attribute: string, value: string): string {
        switch (operator) {
            // Json-Logic does not have explicit "startsWith" or "endsWith" operators.
            // Instead, these are implemented using substring extraction and equality checks.
            case "startsWith":
                return `{
                "==": [
                    { "substr": [{ "var": ["${attribute}", ""] }, 0, ${value.length}] },
                    "${value}"
                ]
            }`;

            case "endsWith":
                return `{
                "==": [
                    { "substr": [{ "var": ["${attribute}", ""] }, -${value.length}] },
                    "${value}"
                ]
            }`;
            //Json-Logic does not have a "!in" operator. Instead, one must negate the "in" operator.
            case "!in":
                return `{
                "!": {
                    "in": [${JSON.stringify(value)}, { "var": ["${attribute}", ""] }]
                }
            }`;

            //no particular case
            default:
                return `{"${operator}": ["${value}", { "var": "${attribute}" }]}`;
        }
    }

    function buildJsonLogicRule(conditions: string[], isAll: boolean): string {
        if (conditions.length === 0) return "";
        const operator = isAll ? "and" : "or";
        return `{ "${operator}": [${conditions.join(", ")}] }`;
    }

    function generateRulesFromExpression(expression: any): string {
        const conditionGroups: string[] = []

        if (!expression || !Array.isArray(expression.conditions)) {
            return "";
        }

        expression.conditions.forEach((condition: any) => {
            const {type, op, attribute, value} = condition;
            const jsonString = constructJsonString(op, attribute, value);
            conditionGroups.push(jsonString);
        });

        return buildJsonLogicRule(conditionGroups, expression.isAll);
    }

    function deconstructRule(rule: string): any {
        const parsedRule = JSON.parse(rule);

        const isAll = parsedRule.hasOwnProperty("and");
        let conditions = parsedRule[isAll ? "and" : "or"];

        if (!conditions) {
            conditions = [parsedRule];
        }

        const deconstructedConditions = conditions.map((condition: any) => {
            const operator = Object.keys(condition)[0];
            const value = condition[operator];

            if (operator === "==" && value[0].hasOwnProperty("substr")) {
                const substr = value[0].substr;
                const valueString = value[1];
                const attributeName = Array.isArray(substr[0].var) ? substr[0].var[0] : substr[0].var;
                if (substr[1] < 0) {
                    return {
                        operator: "endsWith",
                        attribute: attributeName,
                        value: valueString,
                    };
                } else {
                    return {
                        operator: "startsWith",
                        attribute: attributeName,
                        value: valueString,
                    };
                }
            }

            if (operator === "!") {
                const innerOperator = Object.keys(value)[0];
                const innerCondition = value[innerOperator];
                const attributeName = Array.isArray(innerCondition[1].var) ? innerCondition[1].var[0] : innerCondition[1].var;
                return {
                    operator: "!in",
                    attribute: attributeName,
                    value: innerCondition[0],
                };
            }

            if (operator === "==") {
                const max = value[0];
                if (max === null) {
                    const attributeName = Array.isArray(value[1].var) ? value[1].var[0] : value[1].var;
                    return {
                        operator: "null",
                        attribute: attributeName
                    };
                }
            }

            const max = value[0];
            if (max.hasOwnProperty("var")) {
                const attributeName = Array.isArray(max.var) ? max.var[0] : max.var;
                return {
                    operator: operator,
                    attribute: attributeName,
                    value: value[1],
                };
            }
            const attributeName = Array.isArray(value[1].var) ? value[1].var[0] : value[1].var;
            return {
                operator: operator,
                attribute: attributeName,
                value: max,
            };
        });

        return {
            isAll: isAll,
            conditions: deconstructedConditions,
        };
    }

    useEffect(() => {
        if (!filter) {
            setIsDataLoaded(true);
            return;
        }

        setTitle(filter.name);
        setIsElse(filter.isElse)
        queryWidget.title = filter.name;

        if (filter && !filter.isElse) {
            const allConditions: any[] = [];

            const deconstructed = deconstructRule(filter.filterJson!);
            deconstructed.conditions.forEach((condition: any) => {
                allConditions.push({
                    attribute: condition.attribute || "",
                    op: condition.operator || "==",
                    value: condition.value,
                });
            });


            const unifiedExpression = {
                id: 0,
                conditions: allConditions.map((_, index) => index),
                expression: {
                    conditions: allConditions,
                    isAll: filter.isAll,
                }
            };
            setExpressionSet([unifiedExpression]);
        }

        if (queryWidget.title === filter.name && queryWidget.expressionSet.length > 0) {
            setIsDataLoaded(true);
        }
    }, [filter]);


    useEffect(() => {
        setExpressionsComponents(queryWidget.expressionSet.map(exp => exp.id));
    }, [queryWidget.expressionSet]);

    function addPolygons() {
        if (queryWidget.title === '') {
            toast.current?.show({
                severity: 'info',
                summary: 'Info',
                detail: t('filters.title_empty_error' as any)
            });
            return
        }

        let hasToStop = false

        if (!isElse) {
            const exps = queryWidget.expressionSet
            if (exps.length === 0) {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: t('filters.min_one_expression_error' as any)
                });
                return;
            }

            exps.forEach((tuple, expIndex) => {
                if (tuple.expression.isAll == undefined) {
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: t('filters.select_and_or_error' as any, {id: tuple.id})
                    });
                    hasToStop = true
                    return
                }
                tuple.expression.conditions?.forEach((cond, index) => {
                    if (cond.attribute == "") {
                        toast.current?.show({
                            severity: 'info',
                            summary: 'Info',
                            detail: t('filters.select_attribute_error' as any, {id: expIndex + '.' + index})
                        });
                        hasToStop = true
                        return
                    }

                    if (cond.op == "") {
                        toast.current?.show({
                            severity: 'info',
                            summary: 'Info',
                            detail: t('filters.select_function_error' as any, {id: expIndex + '.' + index})
                        });
                        hasToStop = true
                        return
                    }

                    let aux = cond.op == 'null' ||
                        (cond.op == 'true' || cond.op == 'false')

                    if (cond.value == undefined && !aux) {
                        toast.current?.show({
                            severity: 'info',
                            summary: 'Info',
                            detail: t('filters.select_value_error' as any, {id: expIndex + '.' + index})
                        });
                        hasToStop = true
                        return
                    }
                });
            });
        }

        if (!hasToStop) {
            let dto: FilterRule
            if (isElse)
                dto = {
                    name: queryWidget.title,
                    isElse: isElse,
                    symbol: {
                        type: RenderType.Unique,
                        rendererOL: singleColorStyle(color!, borderColor, borderThickness!)
                    }
                }
            else {
                let res2 = queryWidget.expressionSet.map((tuple) => tuple.expression);
                let rule = generateRulesFromExpression(res2[0]);
                dto = {
                    name: queryWidget.title,
                    filterJson: rule,
                    isAll: queryWidget.expressionSet[0].expression.isAll!,
                    isElse: isElse,
                    symbol: {
                        type: RenderType.Unique,
                        rendererOL: singleColorStyle(color!, borderColor, borderThickness!)
                    }
                }
            }
            setFilter(dto);
            close();
        }
    }

    function close() {
        reset();
        setIsElse(false);
        setVisible(false);
    }

    return isDataLoaded ? (<>
            <Dialog header={t('filters.add_filter' as any)}
                    visible={visible}
                    className={styles.dialogDimensions}
                    onHide={() => close()}>
                <div className={styles.text}>{/* style={{marginTop: "25px", alignItems: "center"}}>*/}
                    <span className="p-float-label">
                        <InputText id="title" value={queryWidget.title}
                                   maxLength={100}
                                   onChange={(e) => setTitle(e.target.value)}/>
                        <label htmlFor="title">{t('filters.name' as any)}</label>
                    </span>
                    <div className="flex align-items-center">
                        <RadioButton inputId="filter1" name="filterType" value={t('filters.filter' as any)}
                                     onChange={(e) => setIsElse(false)} checked={!isElse}/>
                        <label htmlFor="filter1">{t('filters.filter' as any)}</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="filter2" name="filterType" value={t('filters.all_other_geometries' as any)}
                                     disabled={!canBeElse}
                                     onChange={(e) => setIsElse(true)}
                                     checked={isElse}/>
                        <label htmlFor="filter2">{t('filters.all_other_geometries' as any)}</label>
                    </div>
                </div>
                <div className={"bor-radio-buttons"}>

                </div>
                <UniqueSymbolComponent color={color} setColor={setColor} borderColor={borderColor}
                                       setBorderColor={setBorderColor} currentStyle={filter?.symbol.rendererOL}
                                       borderThickness={borderThickness} setBorderThickness={setBorderThickness}/>
                {!isElse && <ScrollPanel>
                    <ul className={styles.expressions} style={{paddingLeft: "0"}}>
                        {queryWidget.expressionsComponents.map((item, index) =>
                            <li key={index}><ExpressionOnFilter
                                id={item}/>
                            </li>
                        )}
                    </ul>
                </ScrollPanel>}
                <div className={styles.conclude}>
                    <Button label={t('common.conclude' as any)} onClick={addPolygons}/>
                </div>
            </Dialog>
            <Toast ref={toast}/>
        </>
    ) : null
}
import {Dialog} from "primereact/dialog";
import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {ScrollPanel} from "primereact/scrollpanel";
import {ExpressionOnFilter} from "./expressionOnFilter";
import styles from "./filterWidget.module.css";
import {InputText} from "primereact/inputtext";
import {FilterWidgetContext, FilterWidgetContextType} from "./filterWidgetContext";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {FilterRule} from "@/components/basedOnRules.tsx";
import {UniqueSymbolComponent} from "@/components/uniqueSymbolComponent";
import {Color} from "ol/color";
import {RenderType, singleColorStyle} from "@/rendererUtils";
import {RadioButton} from "primereact/radiobutton";

interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    filter: FilterRule | undefined;
    setFilter: Dispatch<SetStateAction<FilterRule | undefined>>;
}

export const FilterWidget = (props: Props) => {
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const {visible, setVisible, filter, setFilter} = props;
    const {queryWidget, setTitle, setExpressionSet, setExpressionsComponents, reset} =
        useContext(FilterWidgetContext) as FilterWidgetContextType;

    const toast = useRef<Toast | null>(null);

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
        const min = value - 0.001;
        const max = value + 0.001;

        // It seems there is an issue concerning equality checks with Json-Logic Java: https://github.com/jamsesso/json-logic-java/issues/38
        // Therefore, a workaround is used by creating a range with a small tolerance (±0.001) to handle equality and inequality comparisons.

        switch (operator) {
            case "==":
                return `{
                "and": [
                    { "<=": [{ "var": "${attribute}" }, ${max}] },
                    { ">=": [{ "var": "${attribute}" }, ${min}] }
                ]
            }`;

            case "!=":
                return `{
                "!": {
                    "and": [
                        { "<=": [{ "var": "${attribute}" }, ${max}] },
                        { ">=": [{ "var": "${attribute}" }, ${min}] }
                    ]
                }
            }`;

            case "<":
                return `{
                "<": [{ "var": "${attribute}" }, ${max}]
            }`;

            case ">":
                return `{
                ">": [{ "var": "${attribute}" }, ${min}]
            }`;

            default:
                return `{
                "${operator}": [{ "var": "${attribute}" }, ${value}]
            }`;
        }
    }

    function constructJsonStringText(operator: string, attribute: string, value: string): string {
        switch (operator) {
            // Json-Logic does not have explicit "startsWith" or "endsWith" operators.
            // Instead, these are implemented using substring extraction and equality checks.
            case "startsWith":
                return `{
                "==": [
                    { "substr": [{ "var": "${attribute}" }, 0, ${value.length}] },
                    "${value}"
                ]
            }`;

            case "endsWith":
                return `{
                "==": [
                    { "substr": [{ "var": "${attribute}" }, -${value.length}] },
                    "${value}"
                ]
            }`;
            //Json-Logic does not have a "!in" operator. Instead, one must negate the "in" operator.
            case "!in":
                return `{
                "!": {
                    "in": [${JSON.stringify(value)}, { "var": "${attribute}" }]
                }
            }`;
            //no particular case
            default:
                return `{
                "${operator}": [{ "var": "${attribute}" }, "${value}"]
            }`;
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
        const conditions = parsedRule[isAll ? "and" : "or"];

        const deconstructedConditions = conditions.map((condition: any) => {
            const operator = Object.keys(condition)[0];
            const value = condition[operator];

            if (operator === "==" && value[0].hasOwnProperty("substr")) {
                const substr = value[0].substr;
                const valueString = value[1];
                if (substr[1] < 0) {
                    return {
                        operator: "endsWith",
                        attribute: substr[0].var,
                        value: valueString,
                    };
                } else {
                    return {
                        operator: "startsWith",
                        attribute: substr[0].var,
                        value: valueString,
                    };
                }
            }

            if (operator === "!in") {
                return {
                    operator: "!in",
                    attribute: value[0].var,
                    value: value[1].toString(),
                };
            }

            if (operator === "!") {
                const innerOperator = Object.keys(value)[0];
                const innerCondition = value[innerOperator];

                if (innerOperator === "and") {
                    const subConditions = innerCondition;

                    const firstCondition = subConditions[0];
                    const secondCondition = subConditions[1];

                    const firstOperator = Object.keys(firstCondition)[0];
                    const secondOperator = Object.keys(secondCondition)[0];

                    if (firstOperator === "<=" && secondOperator === ">=") {
                        const firstValue = firstCondition[firstOperator][1];
                        const secondValue = secondCondition[secondOperator][1];

                        const adjustedValue = !isNaN(parseFloat(firstValue)) ? firstValue - 0.001 : firstValue;

                        return {
                            operator: "!=",
                            attribute: firstCondition[firstOperator][0].var,
                            value: adjustedValue,
                        };
                    }
                } else if (innerOperator === "in") {
                    return {
                        operator: "!in",
                        attribute: innerCondition[1].var,
                        value: innerCondition[0],
                    };
                }
            }
            if (operator === "and") {
                const subConditions = value;
                if (subConditions.length === 2) {
                    const firstCondition = subConditions[0];
                    const secondCondition = subConditions[1];
                    const firstOperator = Object.keys(firstCondition)[0];
                    const secondOperator = Object.keys(secondCondition)[0];
                    if (firstOperator === "<=" && secondOperator === ">=") {
                        const firstValue = firstCondition[firstOperator][1];
                        const adjustedValue = !isNaN(parseFloat(firstValue)) ? firstValue - 0.001 : firstValue;
                        return {
                            operator: "==",
                            attribute: firstCondition[firstOperator][0].var,
                            value: adjustedValue,
                        };
                    }
                }
            }
            if (operator === "==") {
                const max = value[1];
                if (max === null) {
                    return {
                        operator: "null",
                        attribute: value[0].var
                    };
                }
                return {
                    operator: "==",
                    attribute: value[0].var,
                    value: !isNaN(parseFloat(max)) ? max - 0.001 : max,
                };
            }

            if (operator === "!=") {
                return {
                    operator: "!=",
                    attribute: value[0].var,
                    value: value[1].toString(),
                };
            }

            if (operator === "in") {
                return {
                    operator: "in",
                    attribute: value[0].var,
                    value: value[1].toString(),
                };
            }

            if (operator === ">=") {
                const max = value[1];
                return {
                    operator: ">=",
                    attribute: value[0].var,
                    value: max,
                };
            }

            if (operator === "<=") {
                const max = value[1];
                return {
                    operator: "<=",
                    attribute: value[0].var,
                    value: max,
                };
            }

            if (operator === "<") {
                const max = value[1];
                return {
                    operator: "<",
                    attribute: value[0].var,
                    value: max + 0.001,
                };
            }
            if (operator === ">") {
                const max = value[1];
                return {
                    operator: ">",
                    attribute: value[0].var,
                    value: max + 0.001,
                };
            }


            return {};
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
        queryWidget.title = filter.name;

        if (filter) {
            const allConditions: any[] = [];

            const deconstructed = deconstructRule(filter.filterJson);
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
                detail: 'Título não pode ser vazio!'
            });
            return
        }

        const exps = queryWidget.expressionSet
        if (exps.length === 0) {
            toast.current?.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Tenha pelo menos uma expressão!'
            });
            return;
        }

        let hasToStop = false
        exps.forEach((tuple, expIndex) => {
            if (tuple.expression.isAll == undefined) {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Selecione se a expressão ' + tuple.id + ' é "E" ou "OU"'
                });
                hasToStop = true
                return
            }
            tuple.expression.conditions?.forEach((cond, index) => {
                if (cond.attribute == "") {
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Selecione um atributo para a condição ' + expIndex + '.' + index
                    });
                    hasToStop = true
                    return
                }

                if (cond.op == "") {
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Selecione uma função para a condição ' + expIndex + '.' + index
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
                        detail: 'Selecione um valor para a condição ' + expIndex + '.' + index
                    });
                    hasToStop = true
                    return
                }
            });
        });

        if (!hasToStop) {
            let res2 = queryWidget.expressionSet.map((tuple) => tuple.expression);
            let rule = generateRulesFromExpression(res2[0]);
            const dto: FilterRule = {
                name: queryWidget.title,
                filterJson: rule,
                isAll: queryWidget.expressionSet[0].expression.isAll!,
                isElse: isElse,
                symbol: {
                    type: RenderType.Unique,
                    rendererOL: singleColorStyle(color!, borderColor, borderThickness!)
                }
            }
            setFilter(dto);
            close();
        }
    }

    function close() {
        reset();
        setVisible(false);
    }

    return isDataLoaded ? (<>
            <Dialog header={"Adicionar Filtro"}
                    visible={visible}
                    className={styles.dialogDimensions}
                    onHide={() => close()}>
                <div className={styles.text}>{/* style={{marginTop: "25px", alignItems: "center"}}>*/}
                    <span className="p-float-label">
                        <InputText id="title" value={queryWidget.title}
                                   onChange={(e) => setTitle(e.target.value)}/>
                        <label htmlFor="title">Nome</label>
                    </span>
                    <div className="flex align-items-center">
                        <RadioButton inputId="filter1" name="filterType" value="Filtro" onChange={(e) => setIsElse(false)} checked={!isElse} />
                        <label htmlFor="filter1">Filtro</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="filter2" name="filterType" value="Todas as restantes geometrias" onChange={(e) => setIsElse(true)} checked={isElse} />
                        <label htmlFor="filter2">Todas as restantes geometrias</label>
                    </div>
                </div>
                <div className={"bor-radio-buttons"}>

                </div>
                <UniqueSymbolComponent color={color} setColor={setColor} borderColor={borderColor}
                                       setBorderColor={setBorderColor} currentStyle={filter?.symbol.rendererOL}
                                       borderThickness={borderThickness} setBorderThickness={setBorderThickness}/>
                <ScrollPanel>
                    <ul className={styles.expressions} style={{paddingLeft: "0"}}>
                        {queryWidget.expressionsComponents.map((item, index) =>
                            <li key={index}><ExpressionOnFilter
                                id={item}/>
                            </li>
                        )}
                    </ul>
                </ScrollPanel>
                <div className={styles.addExpression}>
                    <Button label="Concluir" onClick={addPolygons}/>
                </div>
            </Dialog>
            <Toast ref={toast}/>
        </>
    ) : null
}
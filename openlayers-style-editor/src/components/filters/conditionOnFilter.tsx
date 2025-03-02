import {Dropdown} from "primereact/dropdown";
import {Fieldset} from "primereact/fieldset";
import {useContext, useEffect, useRef, useState} from "react";
import {FilterWidgetContext, FilterWidgetContextType} from "./filterWidgetContext"
import {RxCross1} from "react-icons/rx";
import {AttributeTypeEnum, SEAttribute} from "../../rendererUtils.ts";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

interface Props {
    parentID: number
    id: number
    deleteF: (id: number) => void
}

export const ConditionOnFilter = (props: Props) => {
    const {parentID, id, deleteF} = props;

    const {
        queryWidget,
        setExpressionSet
    } = useContext(FilterWidgetContext) as FilterWidgetContextType

    const toast = useRef<Toast | null>(null);

    const [selectedAttribute, setSelectedAttribute] =
        useState<SEAttribute>();

    const [selectedFunction, setSelectedFunction] =
        useState<{ name: string, logic: string }>();

    const functionsBooleans: { name: string, logic: string }[] = [
        {name: 'Sim', logic: "true"},
        {name: 'Não', logic: "false"},
    ]

    const functionsTexts = [
        {name: 'é', logic: "=="},
        {name: 'não é', logic: "!="},
        {name: 'começa com', logic: "startsWith"},
        {name: 'acaba com', logic: "endsWith"},
        {name: 'contém', logic: "in"},
        {name: 'não contém', logic: "!in"},
        {name: 'é nulo', logic: "null"}
    ];

    const functionsNumbers = [
        {name: 'é', logic: "=="},
        {name: 'não é', logic: "!="},
        {name: 'é pelo menos', logic: ">="},
        {name: 'é menor que', logic: "<"},
        {name: 'é no máximo', logic: "<="},
        {name: 'é maior que', logic: ">"},
        {name: 'é nulo', logic: "null"}
    ];


    const [selectedValue, setSelectedValue] =
        useState<string>();

    const [values, setValues] =
        useState<string[]>();


    useEffect(() => {
        if (selectedAttribute != undefined) {
            let aux = queryWidget.attributes.filter(feature =>
                feature.name == selectedAttribute.name!)[0]
            setValues(aux?.values!.filter(i => i != null))
        }
    }, [queryWidget.attributes, selectedAttribute])

    useEffect(() => {
        const fullExp = queryWidget.expressionSet.find(item => item.id === parentID);
        if (!fullExp) return;

        const conditionIndex = fullExp.conditions.findIndex(c => c === id);
        if (conditionIndex === -1) return;

        const condition = fullExp.expression.conditions[conditionIndex];

        const foundAttribute = queryWidget.attributes.find(a => a.name === condition.attribute);
        if (foundAttribute) {
            setSelectedAttribute(foundAttribute);
        }

        let functionSet;
        if (foundAttribute?.type === AttributeTypeEnum.STRING || foundAttribute?.type === AttributeTypeEnum.JSON) {
            functionSet = functionsTexts;
        } else if (foundAttribute?.type === AttributeTypeEnum.BOOLEAN) {
            functionSet = functionsBooleans;
        } else {
            functionSet = functionsNumbers;
        }

        const foundFunction = functionSet.find(f => f.logic === condition.op);
        if (foundFunction) {
            setSelectedFunction(foundFunction);
        }

        if (condition.value) {
            setSelectedValue(condition.value);
        }
    }, [queryWidget.expressionSet, queryWidget.attributes, id]);


    function update(funct?: { name: string, logic: string },
                    value?: string, attribute?: SEAttribute) {

        let fullExp = queryWidget.expressionSet.find(item => item.id === parentID)!
        let expression = fullExp.expression!
        let condition = expression.conditions.at(fullExp.conditions?.findIndex(c => c == id)!)!;

        if (funct) {
            condition.op = funct.logic;
        }
        if (value) {
            if (value.includes("'") || value.includes('"'))
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'A condição ' + parentID + "." + id + " contém caracteres inválidos."
                });
            else {
                condition.value = value
            }
        }
        if (attribute) {
            if (attribute.name != null)
                condition.attribute = attribute.name;

            else
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'A condição tem um atributo inválido'
                });
        }

        queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex(item => item.id === parentID),
            1, {id: parentID, conditions: fullExp.conditions, expression: expression})
        setExpressionSet(queryWidget.expressionSet)
    }

    return <>
        <div style={{position: "relative", paddingBottom: "5px"}}>
            <div style={{position: "absolute", right: 0}}>
                <Button icon={'pi pi-times'} onClick={() => {
                    return deleteF(id)
                }}/>
            </div>
            <Fieldset legend={"Condição " + parentID + "." + id}>
                <div>
                    <Dropdown value={selectedAttribute}
                              onChange={(e) => {
                                  setSelectedFunction(undefined)
                                  setSelectedAttribute(e.value);
                                  update(undefined, undefined, e.value)
                              }}
                              options={queryWidget.attributes} optionLabel="name"
                              placeholder="Selecione o atributo" className="w-full md:w-14rem"/>
                    <Dropdown value={selectedFunction}
                              onChange={(e) => {
                                  setSelectedFunction(e.value);
                                  update(e.value, undefined, undefined)
                              }}
                              options={(selectedAttribute?.type == AttributeTypeEnum.STRING ||
                                  selectedAttribute?.type == AttributeTypeEnum.JSON) ?
                                  functionsTexts : selectedAttribute?.type == AttributeTypeEnum.BOOLEAN ?
                                      functionsBooleans : functionsNumbers}

                              disabled={selectedAttribute == undefined}
                              optionLabel="name"
                              placeholder="Selecione o operador"/>
                    {((selectedAttribute?.type != AttributeTypeEnum.BOOLEAN) && selectedFunction?.name != "é nulo") &&
                        <Dropdown value={selectedValue} editable onChange={(e) => {
                            setSelectedValue(e.value);
                            update(undefined, e.value, undefined)
                        }}
                                  options={values?.length! < 200 ? values : values?.slice(0, 200)}
                                  filter placeholder="Selecione um valor"
                                  disabled={selectedFunction == undefined}
                                  className="w-full md:w-14rem"/>}
                </div>
            </Fieldset>
        </div>
        <Toast ref={toast}/>
    </>

}
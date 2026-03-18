import {Dropdown} from "primereact/dropdown";
import {Fieldset} from "primereact/fieldset";
import {useContext, useEffect, useRef, useState} from "react";
import {FilterWidgetContext, FilterWidgetContextType} from "./filterWidgetContext"
import {AttributeTypeEnum, SEAttribute} from "@/rendererUtils.ts";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {useTranslation} from "react-i18next";

interface Props {
    parentID: number
    id: number
    deleteF: (id: number) => void
}

export const ConditionOnFilter = (props: Props) => {
    const {parentID, id, deleteF} = props;

    const {
        queryWidget,
        setExpressionSet,
        idFieldName
    } = useContext(FilterWidgetContext) as FilterWidgetContextType

    const toast = useRef<Toast | null>(null);
    const {t} = useTranslation();

    const [selectedAttribute, setSelectedAttribute] =
        useState<SEAttribute>();

    const [selectedFunction, setSelectedFunction] =
        useState<{ name: string, logic: string }>();

    const functionsBooleans: { name: string, logic: string }[] = [
        {name: t('filters.yes' as any), logic: "true"},
        {name: t('filters.no' as any), logic: "false"},
    ]

    const functionsTexts = [
        {name: t('filters.is' as any), logic: "=="},
        {name: t('filters.is_not' as any), logic: "!="},
        ...(idFieldName ? [
            {name: t('filters.starts_with' as any), logic: "startsWith"},
            {name: t('filters.ends_with' as any), logic: "endsWith"},
            {name: t('filters.contains' as any), logic: "in"},
            {name: t('filters.does_not_contain' as any), logic: "!in"}
        ] : []),
        {name: t('filters.is_null' as any), logic: "null"}
    ];

    const functionsNumbers = [
        {name: t('filters.is' as any), logic: "=="},
        {name: t('filters.is_not' as any), logic: "!="},
        {name: t('filters.is_at_least' as any), logic: ">="},
        {name: t('filters.is_less_than' as any), logic: "<"},
        {name: t('filters.is_at_most' as any), logic: "<="},
        {name: t('filters.is_greater_than' as any), logic: ">"},
        {name: t('filters.is_null' as any), logic: "null"}
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
                    detail: t('filters.invalid_chars_error' as any, {id: parentID + "." + id})
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
                    detail: t('filters.invalid_attribute_error' as any)
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
            <Fieldset legend={t('filters.condition' as any) + (id + 1)}>
                <div>
                    <Dropdown value={selectedAttribute}
                              onChange={(e) => {
                                  setSelectedFunction(undefined)
                                  setSelectedAttribute(e.value);
                                  setSelectedValue(undefined)
                                  update(undefined, undefined, e.value)
                              }}
                              options={queryWidget.attributes} optionLabel="name"
                              placeholder={t('filters.select_attribute' as any)} className="w-full md:w-14rem"/>
                    <Dropdown value={selectedFunction}
                              onChange={(e) => {
                                  setSelectedFunction(e.value);
                                  if (e.value.logic == "null")
                                      setSelectedValue(undefined)
                                  update(e.value, undefined, undefined)
                              }}
                              options={(selectedAttribute?.type == AttributeTypeEnum.STRING ||
                                  selectedAttribute?.type == AttributeTypeEnum.JSON) ?
                                  functionsTexts : selectedAttribute?.type == AttributeTypeEnum.BOOLEAN ?
                                      functionsBooleans : functionsNumbers}

                              disabled={selectedAttribute == undefined}
                              optionLabel="name"
                              placeholder={t('filters.select_operator' as any)}/>
                    {((selectedAttribute?.type != AttributeTypeEnum.BOOLEAN) && selectedFunction?.name != t('filters.is_null' as any)) &&
                        <Dropdown value={selectedValue} editable
                                  maxLength={150}
                                  onChange={(e) => {
                                      setSelectedValue(e.value);
                                      update(undefined, e.value, undefined)
                                  }}
                                  options={values?.length! < 200 ? values : values?.slice(0, 200)}
                                  filter placeholder={t('filters.select_value' as any)}
                                  disabled={selectedFunction == undefined}
                                  className="w-full md:w-14rem"/>}
                </div>
            </Fieldset>
        </div>
        <Toast ref={toast}/>
    </>

}
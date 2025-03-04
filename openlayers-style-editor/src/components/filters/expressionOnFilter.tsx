import {Panel} from "primereact/panel";
import {Dropdown} from "primereact/dropdown";
import {useContext, useEffect, useState} from "react";
import {ScrollPanel} from "primereact/scrollpanel";
import {FilterWidgetContext, FilterWidgetContextType} from "./filterWidgetContext";
import {ConditionOnFilter} from "./conditionOnFilter";
import {Button} from "primereact/button";

interface Props {
    id: number
}

export const ExpressionOnFilter = (props: Props) => {
    const {id} = props;

    const {
        queryWidget,
        setExpressionSet
    } = useContext(FilterWidgetContext) as FilterWidgetContextType

    const [selectedOp, setSelectedOp] = useState(null);
    const ops = [
        {name: 'Todas verdadeiras'},
        {name: 'Pelo menos uma verdadeira'}
    ];

    useEffect(() => {
        const currentExp = queryWidget.expressionSet.find(item => item.id === id);

        if (currentExp?.expression.isAll !== undefined) {
            setSelectedOp(currentExp.expression.isAll ? ops[0] : ops[1] as any);
        }
    }, [queryWidget.expressionSet, id]);


    const currentExp = queryWidget.expressionSet.find(item => item.id === id)!

    function addCondition() {
        if (currentExp.conditions.length < 10) {
            let expression = queryWidget.expressionSet.find(item => item.id === id)?.expression!

            expression.conditions?.push({
                attribute: "",
                op: "",
                value: ""
            })
            queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex(item => item.id === id),
                1, {
                    id: id,
                    conditions: [...currentExp.conditions, currentExp.conditions.at(currentExp.conditions.length - 1)! + 1],
                    expression: expression
                })
            setExpressionSet(queryWidget.expressionSet)
        }
    }

    function deleteCondition(idCond: number) {
        if (currentExp.conditions.length > 1) {
            let index = currentExp.conditions.findIndex(item => item === idCond)

            let expression = queryWidget.expressionSet.find(item => item.id === id)?.expression!

            expression.conditions?.splice(index, 1)
            queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex(item => item.id === id),
                1, {
                    id: id,
                    conditions: currentExp.conditions.filter(item => item !== idCond),  expression:expression
                })
            setExpressionSet(queryWidget.expressionSet)
        }
    }

    function update(op: string) {
        let expression = queryWidget.expressionSet.find(item => item.id === id)?.expression!
        expression.isAll = op === 'Todas verdadeiras'
        queryWidget.expressionSet.splice(queryWidget.expressionSet.findIndex(item => item.id === id), 1, {
            id: id,
            conditions: currentExp.conditions,
            expression: expression
        })
        setExpressionSet(queryWidget.expressionSet)
    }

    return <>
        <div style={{position: "relative", paddingBottom: "5px"}}>
            <Panel header={"Expressão"}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <ScrollPanel style={{width: '100%', height: '90%'}}>
                        <ul style={{paddingLeft: "0"}}>
                            {currentExp.conditions.map((item, index) =>
                                <li key={index}><ConditionOnFilter
                                                                  id={item} parentID={id}
                                                                  deleteF={deleteCondition}/></li>
                            )}
                        </ul>
                    </ScrollPanel>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "230px",
                        gap: "5px"
                    }}>
                        <Button label="Adicionar Condição" outlined={true} onClick={addCondition}/>
                        <Dropdown style={{paddingBottom: "5px"}} value={selectedOp}
                                  onChange={(e) => {
                                      setSelectedOp(e.value);
                                      update(e.value.name)
                                  }} options={ops}
                                  optionLabel="name"
                                  placeholder="Selecione o operador" className="w-full md:w-14rem"/>
                    </div>
                </div>
            </Panel>
        </div>
    </>
}
import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {UniqueSymbol} from "./uniqueSymbol"
import {Categorized} from "./categorized"
import {Dropdown} from "primereact/dropdown";
import {SEAttribute, PreDefinedRenderer, Render, RenderType} from "../RendererObjects.ts";
import {ColorRamp} from "./rampColors.ts";
import {Button} from "primereact/button";
import {Graduated} from "./graduated.tsx";

interface Props {
    attributes: SEAttribute[]
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    showPreDefinedRamps: boolean,
    moreRamps: ColorRamp[]
    preDefinedStyles: PreDefinedRenderer[]
}

export const GeometryEditor: React.FC<Props> = (props: Props) => {

    const {
        layerCurrentRenderer,
        layerDefaultRenderer,
        moreRamps,
        preDefinedStyles,
        showPreDefinedRamps,
        applyRenderer,
        setVisible
    } = props;

    const [attr, setAttr] = useState<SEAttribute[]>(props.attributes)

    const [currentRenderer, setCurrentRenderer] = useState<Render>(layerCurrentRenderer)

    const options = [
        {label: "Simbolo único", code: 0},
        {label: "Categorizado", code: 1},
        {label: "Graduado", code: 2}
    ]

    const [activeIndex, setActiveIndex] = useState<{
        label: string,
        code: number
    }>(layerCurrentRenderer.type == RenderType.Categorized ?
        options[1] : layerCurrentRenderer.type == RenderType.Graduated ? options[2] : options[0])

    useEffect(() => {
        setActiveIndex(currentRenderer.type == RenderType.Categorized ?
            options[1] : currentRenderer.type == RenderType.Graduated ? options[2] : options[0])
    }, [currentRenderer]);

    return (
        <>
            <div style={{
                height: "95%",
                display: "flex", gap: "15px",
                flexDirection: "column", marginTop: "10px"
            }}>
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    flexDirection: "row"
                }}>
                    <Dropdown options={options} placeholder={"Selecione o tipo de estilo"}
                              optionLabel={"label"} value={activeIndex}
                              onChange={(e) => setActiveIndex(e.value)}/>
                    <Button label={"Resetar estilo"}
                            disabled={currentRenderer == layerDefaultRenderer}
                            onClick={() => {
                                applyRenderer(layerDefaultRenderer)
                                setCurrentRenderer(layerDefaultRenderer)
                            }}
                    />
                </div>
                {activeIndex?.code == 0 && <UniqueSymbol layerCurrentRenderer={currentRenderer}
                                                         layerDefaultRenderer={layerDefaultRenderer}
                                                         applyRenderer={applyRenderer}
                                                         setVisible={setVisible}/>}
                {activeIndex?.code == 1 &&
                    <Categorized attr={attr} layerCurrentRenderer={currentRenderer}
                                 layerDefaultRenderer={layerDefaultRenderer}
                                 applyRenderer={applyRenderer} setVisible={setVisible} moreRamps={moreRamps}
                                 preDefinedStyles={preDefinedStyles}
                                 showPreDefinedRamps={showPreDefinedRamps}/>}
                {activeIndex?.code == 2 &&
                    <Graduated
                        attr={attr}
                        setAttr={setAttr}
                        applyRenderer={applyRenderer} moreRamps={moreRamps} setVisible={setVisible}
                        showPreDefinedRamps={showPreDefinedRamps} layerCurrentRenderer={layerCurrentRenderer}/>}
            </div>
        </>
    )
}

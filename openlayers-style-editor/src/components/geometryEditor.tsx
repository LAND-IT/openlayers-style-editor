import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {UniqueSymbol} from "./uniqueSymbol"
import {Categorized} from "./categorized"
import {Dropdown} from "primereact/dropdown";
import {SEAttribute, PredefinedRenderer, Render, RenderType} from "../rendererUtils";
import {ColorRamp} from "./rampColors.ts";
import {Button} from "primereact/button";
import {Graduated} from "./graduated.tsx";
import {useTranslation} from "react-i18next";
import "./geometryEditor.css"

interface Props {
    attributes: SEAttribute[]
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    showPreDefinedRamps: boolean,
    moreRamps?: ColorRamp[]
    predefinedStyles: PredefinedRenderer[],
    numbersLocale: string
}

export const GeometryEditor: React.FC<Props> = (props: Props) => {

    const {
        layerCurrentRenderer,
        layerDefaultRenderer,
        moreRamps,
        predefinedStyles,
        showPreDefinedRamps,
        applyRenderer,
        setVisible,
        numbersLocale
    } = props;

    const {t} = useTranslation();
    const uniqueSymbol: string = t("common.unique_symbol" as any)
    const categorized: string = t("common.categorized" as any)
    const graduated: string = t("common.graduated" as any)
    const resetStyle: string = t("common.reset_style" as any)
    const selectStyle: string = t("common.select_type" as any)
    const styleType: string = t("common.style_type" as any)

    const [attr, setAttr] = useState<SEAttribute[]>(props.attributes)

    const [currentRenderer, setCurrentRenderer] = useState<Render>(layerCurrentRenderer)

    const options = [
        {label: uniqueSymbol, code: 0},
        {label: categorized, code: 1},
        {label: graduated, code: 2}
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
            <div className={"geometry-editor"}>
                <div className={"dropdown"}>
                    <div className={"style-type"}>
                        <span><b>{styleType}:</b></span>
                        <Dropdown options={options} placeholder={selectStyle}
                                  optionLabel={"label"} value={activeIndex}
                                  onChange={(e) => setActiveIndex(e.value)}/>
                    </div>
                    <Button label={resetStyle}
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
                                 predefinedStyles={predefinedStyles}
                                 showPreDefinedRamps={showPreDefinedRamps}/>}
                {activeIndex?.code == 2 &&
                    <Graduated
                        attr={attr}
                        setAttr={setAttr}
                        applyRenderer={applyRenderer} moreRamps={moreRamps} setVisible={setVisible}
                        showPreDefinedRamps={showPreDefinedRamps}
                        layerCurrentRenderer={layerCurrentRenderer} numbersLocale={numbersLocale}/>}
            </div>
        </>
    )
}

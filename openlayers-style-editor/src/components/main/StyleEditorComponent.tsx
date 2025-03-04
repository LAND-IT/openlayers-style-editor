'use client'
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Dialog} from "primereact/dialog";
import {PredefinedRenderer, Render, SEAttribute} from "@/rendererUtils.ts";
import {ColorRamp} from "../rampColors.ts";
import {GeometryEditor} from "../geometryEditor.tsx";
import {Feature} from "ol";
import {mapFeaturesToSEAttributes} from "../utills.ts";
import {useTranslation} from "react-i18next";


interface Props {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    features: Feature[]
    showPreDefinedRamps: boolean,
    moreRamps?: ColorRamp[]
    predefinedStyles?: PredefinedRenderer[]
    numbersLocale: string
    addingToHeader?: string
}

const StyleEditorComponent: React.FC<Props> = (props: Props) => {

    const {
        layerDefaultRenderer, layerCurrentRenderer, applyRenderer,
        showPreDefinedRamps, moreRamps, predefinedStyles, addingToHeader,
        features, visible, setVisible, numbersLocale
    } = props;

    const { t } = useTranslation();
    const titleHeader: string = t("common.style_editor" as any)

    const [activeIndex] = useState(1);

    const [attributesAndValues, setAttributesAndValues] = useState<SEAttribute[]>([])

    // const items: MenuItem[] = [
    //     {
    //         label: "Texto",
    //         icon: <RxText/>
    //     },
    //     {
    //         label: "Geometrias",
    //         icon: <HiOutlineColorSwatch/>
    //     }]

    useEffect(() => {
        setAttributesAndValues(mapFeaturesToSEAttributes(features))
    }, [features]);

    return <>
        <Dialog visible={props.visible}
                header={titleHeader + (addingToHeader ? " - " + addingToHeader : "")}
                style={{height: "90%", width: "80%"}}
                onHide={() => {
                    props.setVisible(false)
                }}>
            {/*<TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}/>*/}
            {/*{activeIndex === 0 && <TextEditor layer={layer} setVisible={setVisible}/>}*/}
            {activeIndex === 1 && attributesAndValues &&
                <GeometryEditor attributes={attributesAndValues} visible={visible}
                                layerCurrentRenderer={layerCurrentRenderer} applyRenderer={applyRenderer}
                                setVisible={setVisible} layerDefaultRenderer={layerDefaultRenderer}
                                moreRamps={moreRamps} numbersLocale={numbersLocale}
                                features={features}
                                predefinedStyles={predefinedStyles ? predefinedStyles : []} showPreDefinedRamps={showPreDefinedRamps}/>}
        </Dialog>
    </>

}

export default StyleEditorComponent;
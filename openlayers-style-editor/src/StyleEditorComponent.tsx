import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Dialog} from "primereact/dialog";
import {SEAttribute, PreDefinedRenderer, Render} from "./RendererObjects.ts";
import {ColorRamp} from "./components/rampColors.ts";
import {GeometryEditor} from "./components/geometryEditor.tsx";
import {Feature} from "ol";
import {mapFeaturesToSEAttributes} from "./components/utills.ts";
import {useTranslation} from "react-i18next";


interface Props {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    features: Feature[]
    showPreDefinedRamps: boolean,
    moreRamps: ColorRamp[]
    preDefinedStyles: PreDefinedRenderer[]
    numbersLocale: string
    addingToHeader?: string
}

const StyleEditorComponent: React.FC<Props> = (props: Props) => {

    const {
        layerDefaultRenderer, layerCurrentRenderer, applyRenderer,
        showPreDefinedRamps, moreRamps, preDefinedStyles, addingToHeader,
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
                                preDefinedStyles={preDefinedStyles} showPreDefinedRamps={showPreDefinedRamps}/>}
        </Dialog>
    </>

}

export default StyleEditorComponent;
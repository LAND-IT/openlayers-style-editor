import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Dialog} from "primereact/dialog";
import {SEAttribute, PreDefinedRenderer, Render} from "./RendererObjects.ts";
import {ColorRamp} from "./components/rampColors.ts";
import {GeometryEditor} from "./components/geometryEditor.tsx";
import VectorSource from "ol/source/Vector";
import {Feature} from "ol";
import {mapFeaturesToSEAttributes} from "./components/utills.ts";


interface Props {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    vectorSource: VectorSource | Feature[]
    showPreDefinedRamps: boolean,
    moreRamps: ColorRamp[]
    preDefinedStyles: PreDefinedRenderer[]
    addingToHeader?: string
}

const StyleEditorComponent: React.FC<Props> = (props: Props) => {

    const {
        layerDefaultRenderer, layerCurrentRenderer, applyRenderer,
        showPreDefinedRamps, moreRamps, preDefinedStyles, addingToHeader,
        vectorSource, visible, setVisible
    } = props;

    const [activeIndex] = useState(1);

    const [features, setFeatures] = useState<Feature[]>([])
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

    if (vectorSource instanceof VectorSource) {
        if (vectorSource.getUrl()) {
            vectorSource.on('featuresloadend', function () {
                const features = vectorSource.getFeatures();
                setFeatures(features)
            });
        } else {
            if (vectorSource.getFeatures().length > 0) {
                setFeatures(vectorSource.getFeatures())
            }
        }
    }

    useEffect(() => {
        setAttributesAndValues(mapFeaturesToSEAttributes(features))
    }, [features]);

    return <>
        <Dialog visible={props.visible}
                header={"Edição de Estilos" + (addingToHeader ? " - " + addingToHeader : "")}
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
                                moreRamps={moreRamps}
                                preDefinedStyles={preDefinedStyles} showPreDefinedRamps={showPreDefinedRamps}/>}
        </Dialog>
    </>

}

export default StyleEditorComponent;
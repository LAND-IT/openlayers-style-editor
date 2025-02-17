import React, {Dispatch, SetStateAction, useState} from "react";
import {Dialog} from "primereact/dialog";
import {SEAttribute, PreDefinedRenderer, Render} from "./components/rendererObjects.ts";
import {ColorRamp} from "./components/rampColors.ts";
import {GeometryEditor} from "./components/geometryEditor.tsx";

interface Props {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    attributesAndValues: SEAttribute[]
    showPreDefinedRamps: boolean,
    moreRamps: ColorRamp[]
    preDefinedStyles: PreDefinedRenderer[]
    addingToHeader?: string
}

export const StyleEditor: React.FC<Props> = (props: Props) => {

    const {layerDefaultRenderer, layerCurrentRenderer, applyRenderer,
        showPreDefinedRamps,moreRamps, preDefinedStyles, addingToHeader,
        attributesAndValues, visible, setVisible} = props;

    const [activeIndex] = useState(1);

    // const items: MenuItem[] = [
    //     {
    //         label: "Texto",
    //         icon: <RxText/>
    //     },
    //     {
    //         label: "Geometrias",
    //         icon: <HiOutlineColorSwatch/>
    //     }]

    return <>
        <Dialog visible={props.visible} header={"Edição de Estilos" + (addingToHeader ? " - " + addingToHeader : "")}
                style={{height: "90%", width: "80%"}}
                onHide={() => {
                    props.setVisible(false)
                }}>
            {/*<TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}/>*/}
            {/*{activeIndex === 0 && <TextEditor layer={layer} setVisible={setVisible}/>}*/}
            {activeIndex === 1 && attributesAndValues &&
                <GeometryEditor attributes={attributesAndValues} visible={visible}
                                layerCurrentRenderer={layerCurrentRenderer} applyRenderer={applyRenderer}
                                setVisible={setVisible} layerDefaultRenderer={layerDefaultRenderer} moreRamps={moreRamps}
                                preDefinedStyles={preDefinedStyles} showPreDefinedRamps={showPreDefinedRamps}/>}
        </Dialog>
    </>

}
import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import {asString, Color} from "ol/color";
import ColorPicker from "react-best-gradient-color-picker";

interface Props {
    color: Color
    onChange: (e: string) => void
    hideAlpha?: boolean
}

export const MyColorPicker: React.FC<Props> = (props: Props) => {
    const {color, onChange, hideAlpha} = props;

    const [visible, setVisible] = useState(false);

    return <>
        <div style={{
            width: "20px", height: "20px", borderRadius: "5px", borderStyle: "solid",
            borderWidth: "1px", borderColor: "black", backgroundColor: asString(color)
        }}
             onClick={() => setVisible(true)}
        />
        <Dialog header={"Selecione uma cor"} onHide={() => setVisible(false)} visible={visible}>
            <ColorPicker value={asString(color)} onChange={onChange} hideOpacity={hideAlpha} hideControls={true}/>
        </Dialog>

    </>
}
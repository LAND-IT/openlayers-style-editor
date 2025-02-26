import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import {asString, Color} from "ol/color";
import ColorPicker from "react-best-gradient-color-picker";
import {useTranslation} from "react-i18next";
import "./colorPicker.css";

interface Props {
    color: Color
    onChange: (e: string) => void
    hideAlpha?: boolean
}

export const MyColorPicker: React.FC<Props> = (props: Props) => {
    const {color, onChange, hideAlpha} = props;

    const [visible, setVisible] = useState(false);

    const { t } = useTranslation();
    const selectColor: string = t("color_picker.select_color" as any)

    return <>
        <div style={{backgroundColor: asString(color)}}
                className="color-picker"
             onClick={() => setVisible(true)}
        />
        <Dialog header={selectColor} onHide={() => setVisible(false)} visible={visible}>
            <ColorPicker value={asString(color)} onChange={onChange} hideOpacity={hideAlpha} hideControls={true}/>
        </Dialog>

    </>
}
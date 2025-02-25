import {CopyBlock, obsidian} from "react-code-blocks";
import './installation.css'

export function Installation() {
    return (
        <div className={"installation"}>
            <CopyBlock
                theme={obsidian}
                text={"\nnpm i openlayers-style-editor\n"}
                language={"bash"}
                showLineNumbers={false}
            />

            <CopyBlock
                theme={obsidian}
                text={"\nyarn add openlayers-style-editor\n"}
                language={"bash"}
                showLineNumbers={false}
            />
        </div>)
}
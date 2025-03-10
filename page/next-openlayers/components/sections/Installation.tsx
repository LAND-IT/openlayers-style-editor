import './installation.css'
import {CopyBlock} from "react-code-blocks";
import {atomOneLight} from "react-code-blocks";

export function Installation() {
    return (
        <div>
            <span>Depending on the installed package provider, this package can be installed with one of the following commands.</span>
            <div className={"installation"}>
                <CopyBlock
                    text={"npm i openlayers-style-editor\n "}
                    language={"bash"}
                    showLineNumbers={false}
                    theme={atomOneLight}
                />

                <CopyBlock
                    text={"yarn add openlayers-style-editor\n "}
                    language={"bash"}
                    showLineNumbers={false}
                    theme={atomOneLight}
                />
            </div>
        </div>)
}
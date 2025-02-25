import './header.css'
import {NavLink} from "react-router-dom";
import { Icon } from "@iconify/react";

export function Header() {
    return (
        <>
            <div className="header">
                <div className="left">
                    <img className={"image"} src={'/openlayers-style-editor' + '/favicons/android-chrome-512x512.png'}
                         alt={"logo"}/>
                    <h2>OpenLayers Style Editor</h2>
                </div>
                <div className={"right"}>
                    <NavLink to={'/starting'}>
                        <h4>Getting Started</h4>
                    </NavLink>
                    <NavLink to={'/demo'}>
                        <h4>Demo</h4>
                    </NavLink>
                </div>
                <div className={"github"} onClick={() => window.open('https://github.com/LAND-IT/openlayers-style-editor', '_blank')}>
                    <Icon className={"github-icon"} icon="octicon:mark-github-16" />
                </div>
            </div>
        </>
    )
}
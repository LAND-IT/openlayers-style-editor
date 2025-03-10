
import './header.css'
import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";

export function Header() {
    return (
        <>
            <div className="header">
                <div className="left">
                    <Image 
                        className={"image"} 
                        src={'/favicons/android-chrome-512x512.png'}
                        alt={"logo"} 
                        width={55}
                        height={55}
                    />
                    <h2>OpenLayers Style Editor</h2>
                </div>
                <div className={"right"}>
                    <Link href="/starting">
                        <h4>Getting Started</h4>
                    </Link>
                    <Link href="/demo">
                        <h4>Demo</h4>
                    </Link>
                </div>
                <div className={"github"} onClick={() => window.open('https://github.com/LAND-IT/openlayers-style-editor', '_blank')}>
                    <Icon className={"github-icon"} icon="octicon:mark-github-16" />
                </div>
            </div>
        </>
    )
}
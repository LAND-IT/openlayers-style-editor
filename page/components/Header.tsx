"use client";

import styles from './header.module.css'
import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";

export function Header() {
    return (
        <>
            <div className={styles.header}>
                <div className={styles.left}>
                    <Link href="/">
                        <Image 
                            className={styles.image} 
                            src={'/favicons/android-chrome-512x512.png'}
                            alt={"logo"} 
                            width={55}
                            height={55}
                        />
                    </Link>
                    <h2>OpenLayers Style Editor</h2>
                </div>
                <div className={styles.right}>
                    <Link href="/#background">
                        <h4>Getting Started</h4>
                    </Link>
                    <Link href="/demo">
                        <h4>Demo</h4>
                    </Link>
                </div>
                <Link href="https://github.com/LAND-IT/openlayers-style-editor" target="_blank" rel="noopener noreferrer" className={styles.github}>
                    <Icon className={styles.githubIcon} icon="octicon:mark-github-16" />
                </Link>
            </div>
        </>
    )
}
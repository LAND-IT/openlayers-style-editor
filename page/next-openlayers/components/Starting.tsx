"use client"
import {Header} from "./Header";
import {useEffect, useState} from "react";
import {Card} from "primereact/card";
import {Background} from "./sections/Background";
import styles from './starting.module.css';
import {Presentation} from "./sections/Presentation";
import {Installation} from "./sections/Installation";
import {Usage} from "./sections/Usage";
import {InfoBoard} from "./InfoBoard";
import {PropsDetails} from "./sections/PropsDetails";

interface Props {
    section?: string
}

export function Starting(props: Props) {

    const {section} = props;

    const sections = [
        {id: "background", label: "Background", body: <Background/>},
        {id: "presentation", label: "Presentation", body: <Presentation/>},
        {id: "installation", label: "Installation", body: <Installation/>},
        {id: "usage", label: "Usage", body: <Usage/>},
        {id: "details", label: "Props Details", body: <PropsDetails/>},
    ];

    const [activeSection, setActiveSection] = useState<string>(section ? section : "background");

    useEffect(() => {
        const url = new URL(window.location.href);
        const findSection = sections.find((section) => url.hash.includes(section.id));
        if(findSection) {
            setActiveSection(findSection.id);
            document.getElementById(findSection.id)?.scrollIntoView();
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = activeSection;

            // Identificar a seção ativa
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= window.innerHeight) {
                        currentSection = section.id;
                        break;
                    }
                }
            }

            if (currentSection !== activeSection) {
                setActiveSection(currentSection);
            }
        };


        const content = document.getElementById("content")!;
        content.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => content.removeEventListener("scroll", handleScroll);
    }, [activeSection]);



    return (
        <div>
            <Header/>
            <div className={styles.starting}>

                <InfoBoard activeSection={activeSection} sections={sections} setActiveSection={setActiveSection}/>

                {/* Conteúdo principal */}
                <div id={"content"} className={styles.content}>
                    {sections.map((section) => (
                        <Card key={section.id} title={section.label} id={section.id} className={styles.section}>
                            {section.body}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Starting;
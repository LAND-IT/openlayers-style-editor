import {Header} from "./Header.tsx";
import {useEffect, useState} from "react";
import {Card} from "primereact/card";
import {Background} from "./sections/Background.tsx";
import './starting.css';
import {Presentation} from "./sections/Presentation.tsx";
import {Installation} from "./sections/Installation.tsx";
import {Usage} from "./sections/Usage.tsx";
import {InfoBoard} from "./InfoBoard.tsx";

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
    ];

    const [activeSection, setActiveSection] = useState<string>(section ? section : "background");

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = activeSection;

            // Identificar a seção ativa
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= window.innerHeight * 0.4) {
                        currentSection = section.id;
                        break;
                    }
                }
            }

            if (currentSection !== activeSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeSection]);



    return (
        <div>
            <Header/>
            <div className={"starting"}>

                <InfoBoard activeSection={activeSection} sections={sections} setActiveSection={setActiveSection}/>

                {/* Conteúdo principal */}
                <div className="content">
                    {sections.map((section) => (
                        <Card key={section.id} title={section.label} id={section.id} className="section">
                            {section.body}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Starting;
import {Header} from "./Header.tsx";
import {useEffect, useState} from "react";
import {Card} from "primereact/card";
import {Menu} from "primereact/menu";
import {MenuItem} from "primereact/menuitem";
import {Background} from "./sections/Background.tsx";
import './starting.css';
import {Presentation} from "./sections/Presentation.tsx";
import {Installation} from "./sections/Installation.tsx";
import {Usage} from "./sections/Usage.tsx";
import {ScrollPanel} from "primereact/scrollpanel";

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

    const items: MenuItem[] = sections.map(sec => ({
        label: sec.label,
        id: sec.id,
        template: () => <a
            href={`#${sec.id}`}
            className={activeSection === sec.id ? "active" : ""}
            // onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar
        >
            {sec.label}
        </a>,
        command: () => setActiveSection(sec.id)
    }));

    return (
        <div>
            <Header/>
            <div className={"starting"}>
                {/* Menu de navegação */}
                <div className={"menu"}>
                    <h2>Content</h2>
                    <Menu model={items} className={"menu"}>
                    </Menu>

                    <h2>Info</h2>
                    <p>Version: 0.1.0</p>
                    <p>Last Update: 24<sup>th</sup> Feb 2025</p>

                    <h2>Links</h2>

                    <h2>Contributors</h2>
                </div>

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
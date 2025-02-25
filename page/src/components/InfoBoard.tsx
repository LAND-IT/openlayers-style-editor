import {Menu} from "primereact/menu";
import React, {useEffect, useState} from "react";
import {getContributorsAndLatestVersion, RepoInfo} from "./requests.ts";
import {Avatar} from "primereact/avatar";

interface Props {
    sections: { id: string, label: string, body: React.ReactNode }[]
    activeSection: string
    setActiveSection: (section: string) => void
}

export function InfoBoard(props: Props) {

    const {sections, activeSection, setActiveSection} = props;

    const [repoData, setRepoData] = useState<RepoInfo | null>(null);

    const items = sections.map(sec => ({
        label: sec.label,
        template: () => <a
            href={`#${sec.id}`}
            className={activeSection == sec.id ? "active" : ""}
            onClick={() => setActiveSection(sec.id)}
        >
            {sec.label}
        </a>,
    }))

    useEffect(() => {
        if (repoData) return;
        getContributorsAndLatestVersion("LAND-IT", "openlayers-style-editor").then((res) => {
            setRepoData(res);
        })
    }, []);

    return (
        <div className={"menu"}>
            <h2>Content</h2>
            <Menu model={items} className={"menu"}>
            </Menu>

            <h2>Info</h2>
            {/*<p>Version: {repoData}</p>*/}
            <p>Stars: {repoData?.data?.stargazers_count}</p>
            <p>Forks: {repoData?.data?.forks_count}</p>
            <p>Last Update: {(repoData?.data?.updated_at as string).split("T")[0]}</p>
            <p>License: {repoData?.data?.license?.name}</p>
            <p>Opened Issues: {repoData?.data?.open_issues_count}</p>

            <h2>Links</h2>

            <h2>Contributors</h2>

            {repoData?.contributors?.map((contributor: any) => (
                <Avatar key={contributor.id} image={contributor.avatar_url}
                        onClick={() => window.open(contributor.html_url, "_blank")}
                        title={contributor.login} size="large" shape="circle"/>
            ))}
        </div>
    );
}
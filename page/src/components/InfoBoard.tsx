import {Menu} from "primereact/menu";
import React, {useEffect, useState} from "react";
import {getContributorsAndLatestVersion, RepoInfo} from "./requests.ts";
import {Avatar} from "primereact/avatar";
import {Icon} from "@iconify/react";
import "./infoBoard.css";

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
            if (res)
                setRepoData(res);
        })
    }, []);

    return (
        <div>
            <h2>Contents</h2>
            <Menu model={items}>
            </Menu>

            <h2>Info</h2>
            <p>Version: {repoData?.latestRelease?.name}</p>
            <div className={"icons"}>
                <div className={"icon"}> {repoData?.data?.stargazers_count} <Icon icon={"iconamoon:star"}></Icon></div>
                <div className={"icon"}> {repoData?.data?.forks_count} <Icon icon={"pajamas:fork"}></Icon></div>
                <div className={"icon"}>{repoData?.data?.open_issues_count} <Icon icon={"octicon:issue-opened-16"}></Icon></div>
            </div>
            <p>Last Update: {(repoData?.data?.updated_at as string)?.split("T")[0]}</p>
            <p>License: {repoData?.data?.license?.name}</p>


            <h2>Links</h2>
            <a href={"https://www.npmjs.com/package/openlayers-style-editor"} target={"_blank"}>NPM package</a>
            <br/>
            <a href={"https://github.com/LAND-IT/openlayers-style-editor/issues"} target={"_blank"}>Report an issue</a>
            <h2>Contributors</h2>

            {repoData?.contributors?.map((contributor: any) => (
                <Avatar key={contributor.id} image={contributor.avatar_url}
                        onClick={() => window.open(contributor.html_url, "_blank")}
                        title={contributor.login} size="large" shape="circle"/>
            ))}
        </div>
    );
}
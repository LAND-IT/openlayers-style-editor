import './header.css'

export function Header() {
    return (
        <>
            <div className="header">
                <div className="left">
                    <img className={"image"} src={'public/favicons/android-chrome-512x512.png'} alt={"logo"}/>
                    <h2>OpenLayers Style Editor</h2>
                </div>
                <div className={"right"}>
                    <h4>Getting Started</h4>
                    <h4>Demo</h4>
                </div>
                <div className={"github"}>

                </div>
            </div>
        </>
    )
}
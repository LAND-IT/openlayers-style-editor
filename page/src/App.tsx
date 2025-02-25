import './App.css'
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import {Starting} from "./components/Starting.tsx";
import {Test} from "./examples/Test.tsx";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <>
                        <Route
                            path="/"
                            element={<Starting />}
                        />
                        <Route
                            path="/starting"
                            element={<Starting/>}
                        />
                        <Route
                            path="/demo"
                            element={<Test/>}
                        />
                        <Route
                            path="/presentation"
                            element={<Starting section={"presentation"}/>}
                        />
                        <Route
                            path="/installation"
                            element={<Starting section={"installation"}/>}
                        />
                        <Route
                            path="/usage"
                            element={<Starting section={"usage"}/>}
                        />
                    </>
                </Routes>
            </Router>
        </div>
    );
}

export default App

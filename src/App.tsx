import { useEffect, useState } from "react";
import "./App.css";
import { keepTheme } from "./utils/theme";
import Toggle from "./components/Toggle";
import SortingVisualizer from "./components/SortingVisualizer";

function App() {
    useEffect(() => {
        keepTheme();
    }, []);

    return (
        <main className="relative">
            <SortingVisualizer />
            <div className="absolute right-0 top-0">
                <Toggle />
            </div>
        </main>
    );
}

export default App;

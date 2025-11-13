import { useEffect } from "react";
import "./App.css";
import { keepTheme } from "./utils/theme";
import SortingVisualizer from "./pages/SortingVisualizer";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PathVisualizer from "./pages/PathVisualizer";

function App() {
    useEffect(() => {
        keepTheme();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="/path" element={<PathVisualizer />} />
        </Routes>
    );
}

export default App;

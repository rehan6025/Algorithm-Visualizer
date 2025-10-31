import React, { useEffect, useState } from "react";
import { setTheme } from "../utils/theme";

const Toggle: React.FC = () => {
    const [togClass, setTogClass] = useState("light");

    let theme = localStorage.getItem("theme");

    const handleOnClick = () => {
        if (localStorage.getItem("theme") === "theme-dark") {
            setTheme("theme-light");
            setTogClass("light");
        } else {
            setTheme("theme-dark");
            setTogClass("dark");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("theme") === "theme-dark") {
            setTogClass("dark");
        } else if (localStorage.getItem("theme") === "theme-light") {
            setTogClass("light");
        }
    }, [theme]);

    return (
        <div className="container--toggle">
            <button onClick={handleOnClick}>
                {togClass === "light" ? "Dark" : "Light"}
            </button>
        </div>
    );
};

export default Toggle;

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
        <div className="  ">
            <button
                className="bg-gray-900 text-white px-4 py-2 font-bold cursor-pointer 
             shadow-[4px_4px_0_#000000] hover:shadow-[2px_2px_0_#000000] 
             hover:translate-x-[1px] hover:translate-y-[1px] 
             active:shadow-none transition"
                onClick={handleOnClick}
            >
                {togClass === "light" ? "Dark" : "Light"}
            </button>
        </div>
    );
};

export default Toggle;

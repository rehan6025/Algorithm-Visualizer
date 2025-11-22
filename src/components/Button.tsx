import React from "react";

const Button = ({ children }: { children: React.ReactNode }) => {
    return (
        <button
            className="bg-gray-900 text-white px-4 py-2 font-bold cursor-pointer 
             shadow-[4px_4px_0_#000000] hover:shadow-[2px_2px_0_#000000] 
             hover:translate-x-px hover:translate-y-px 
             active:shadow-none transition"
        >
            {children}
        </button>
    );
};

export default Button;

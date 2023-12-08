import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"; // Importando ícones do React Icons
import { Link } from "react-router-dom";

export function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav
      className={`text-white fixed top-0 left-0 bottom-0 z-50 overflow-y-auto ${
        isExpanded ? "bg-gray-800 overflow-y-auto w-64" : "overflow-hidden"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        <div className={`text-2xl font-bold ${isExpanded ? "" : "sr-only"}`}>
          Menu
        </div>
        <button
          className="text-white focus:outline-none focus:text-white"
          onClick={toggleMenu}
        >
          {isExpanded ? (
            <HiOutlineX className="h-6 w-6" />
          ) : (
            <HiOutlineMenu className="h-6 w-6" />
          )}
        </button>
      </div>
      <ul className={`p-4 ${isExpanded ? "" : "hidden"}`}>
        <li className={`my-2`}>
          {" "}
          <Link to="/">Classificar</Link>
        </li>
        <li className={`my-2`}>
          <Link to="/train">Treinar</Link>
        </li>
      </ul>
    </nav>
  );
}

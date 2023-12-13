import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"; // Importando ícones do React Icons
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "./menu.css";

export function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button
        className="text-white fixed top-0 left-0 p-4 focus:outline-none focus:text-white"
        onClick={toggleMenu}
      >
        {isExpanded ? (
          <HiOutlineX className="h-6 w-6" />
        ) : (
          <HiOutlineMenu className="h-6 w-6" />
        )}
      </button>
      <CSSTransition
        in={isExpanded}
        timeout={500}
        classNames="menu"
        unmountOnExit
      >
        <nav className="text-white fixed top-0 left-0 bottom-0 z-50 overflow-y-auto w-64 bg-gray-800">
          <div className="p-4 flex justify-between items-center">
            <div className="text-2xl font-bold">Menu</div>
            <button
              className="text-white focus:outline-none p-2"
              onClick={toggleMenu}
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
          </div>
          <ul className="p-4">
            <li className="my-2">
              <Link to="/">Classificar</Link>
            </li>
            <li className="my-2">
              <Link to="/train">Treinar</Link>
            </li>
          </ul>
        </nav>
      </CSSTransition>
    </>
  );
}
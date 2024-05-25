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
    <div className="flex">
      <button
        className="text-black fixed top-0 left-0 p-4 focus:outline-none focus:text-white hover:text-blue-300 transition"
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
        <nav className="text-black fixed top-0 left-0 bottom-0 z-50 overflow-y-auto w-64 bg-gray-50">
          <div className="p-4 flex justify-between items-center">
            <div className="text-2xl font-bold">Menu</div>
            <button
              className="text-black focus:outline-none p-2 hover:text-blue-300 transition"
              onClick={toggleMenu}
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
          </div>
          <ul className="p-4">
            <li className="my-2 hover:text-blue-300 transition">
              <Link to="/">Classificar</Link>
            </li>
            <li className="my-2 hover:text-blue-300 transition">
              <Link to="/train">Treinar</Link>
            </li>
            <li className="my-2 hover:text-blue-300 transition">
              <Link to="/about">Sobre</Link>
            </li>
            <li className="my-2 hover:text-blue-300 transition">
              <a href="https://forms.gle/Snud46RwuwT16Mrb9" target="_blank">
                Feedback
              </a>
            </li>
          </ul>
        </nav>
      </CSSTransition>
    </div>
  );
}

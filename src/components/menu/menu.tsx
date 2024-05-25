import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "./menu.css";

export function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const menuItems = [
    {
      path: "/",
      title: "Classificar",
      description: "Utilize modelos pré-treinados ou use os seus próprios modelos para classificar texto",
    },
    {
      path: "/train",
      title: "Treinar Classificador",
      description: "Faça upload dos seus dados e treine o seu próprio classificador textual",
    },
    {
      path: "/about",
      title: "Sobre",
      description: "Detalhes sobre o projeto",
    },
    {
      path: "https://forms.gle/Snud46RwuwT16Mrb9",
      title: "Feedback",
      description: "Envie sua opinião",
      external: true,
    },
  ];

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
        <nav className="text-black fixed top-0 left-0 bottom-0 z-50 overflow-y-auto w-80 bg-gray-50">
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
            {menuItems.map((item) => (
              <li key={item.path} className="my-4">
                {item.external ? (
                  <a
                    href={item.path}
                    target="_blank"
                    className={`block p-2 rounded transition ${location.pathname === item.path ? 'bg-blue-100' : 'bg-gray-200'} hover:bg-blue-200`}
                    rel="noopener noreferrer"
                  >
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`block p-2 rounded transition ${location.pathname === item.path ? 'bg-blue-100' : 'bg-gray-200'} hover:bg-blue-200`}
                  >
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </CSSTransition>
    </div>
  );
}

import React from "react";
import { Menu } from "../../components/menu/menu";
import logo from "../../assets/images/tailLogo.svg";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-center border-2 p-4">
      <Menu />
      <div className="flex items-center justify-center">
        <img src={logo} alt="Logo da LinguifAI" className="h-12 mr-3 mb-4" />
        <h1 className="text-3xl font-bold mb-5 mt-3">
          Linguif<span className="text-main-lighter">AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;

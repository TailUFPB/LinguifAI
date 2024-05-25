import React from "react";
import { Menu } from "../../components/menu/menu";
import logo from "../../assets/images/tailLogo.svg";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-center">
      <Menu />
      <header className="text-center flex items-center justify-center">
        <img src={logo} alt="Logo da LinguifAI" className="h-12 mr-2 pb-3" />
        <h1 className="text-2xl font-bold mb-6 mt-3">
          Linguif<span className="text-main-lighter">AI</span>
        </h1>
      </header>
    </header>
  );
};

export default Header;

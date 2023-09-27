import { Icon } from "@iconify/react";

export default function Home() {
  return (
    <div className="bg-main-darker text-white min-h-screen flex flex-col">
      <div className="p-8 text-center font-roboto">
        <h1 className="text-3xl font-bold mb-6 mt-6">
          Linguif<span className="text-main-light">AI</span>
        </h1>

        <div className="w-3/5 relative mx-auto mt-24">
          <textarea
            className="w-full bg-main-dark border-2 border-main-lighter text-white py-2 px-4 placeholder-gray-300 rounded-3xl h-48 resize-none"
            placeholder="Insira o texto aqui..."
          />
          <Icon icon="material-symbols:upload-rounded" />
        </div>

        <div className="w-1/3 relative mx-auto mt-24">
          <select className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14">
            <option value="" disabled selected className="placeholder-gray-300">
              Selecione um classificador
            </option>
          </select>
        </div>

        <div className="w-1/4 relative mx-auto mt-10">
          <button className="w-full bg-main-dark text-white py-2 px-4 hover:bg-main-darker focus:outline-none border-2 border-main-lighter rounded-3xl h-14">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

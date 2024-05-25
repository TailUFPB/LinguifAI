import { Menu } from "../components/menu/menu";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function About() {
  const teamMembers = [
    {
      name: "Jonas Gabriel",
      linkedin: "https://www.linkedin.com/in/jonas-gabriel-araujo/",
      github: "https://github.com/jonasgabriel18",
      photo: "../../../assets/jonas.jpg",
    },

    {
      name: "Luiz Gusttavo",
      linkedin:
        "https://www.linkedin.com/in/luiz-gusttavo-oliveira-de-souza-7538091b1/",
      github: "https://github.com/GusttavoOliveira",
      photo: "../../../assets/luiz.jpg",
    },

    {
      name: "Bertrand Lira",
      linkedin: "https://www.linkedin.com/in/bertrand-lira-veloso-52aa4926a/",
      github: "https://github.com/BertrandLira",
      photo: "../../../assets/bertrand.jpg",
    },

    {
      name: "Cameron Maloney",
      linkedin: "https://www.linkedin.com/in/cameronmal/",
      github: "https://github.com/cmaloney111",
      photo: "../../../assets/cameron.jpg",
    },

    {
      name: "Gisele Silva",
      linkedin: "https://www.linkedin.com/in/gisele-silva-6692941a4/",
      github: "https://github.com/GiseleBr678",
      photo: "../../../assets/LINDADEMAIS/gisele.jpg",
    },

    {
      name: "Thauã Magalhães",
      linkedin: "https://www.linkedin.com/in/thaua-lucas/",
      github: "https://github.com/tahaluh",
      photo: "../../../assets/thaua.jpg",
    },

    {
      name: "Thiago Rodrigues",
      linkedin: "https://www.linkedin.com/in/thiago-rodrigues-b8a328249/",
      github: "https://github.com/tahaluh",
      photo: "../../../assets/thiago.jpg",
    },
  ];

  return (
    <div className="bg-main-darker text-white min-h-screen flex flex-col">
      <Menu />

      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-10 mt-6">
          Linguif<span className="text-main-light">AI</span>
        </h1>

        <p className="text-md mb-10">
          O LinguifAI é uma aplicação inovadora desenvolvida pela diretoria de
          NLP da TAIL, projetada para simplificar e agilizar o treinamento e a
          classificação de modelos de Machine Learning em texto. Com essa
          ferramenta, é possível experimentar diversos algoritmos e ajustar
          parâmetros de forma intuitiva, tornando o processo de desenvolvimento
          de modelos NLP mais acessível e eficiente.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Tecnologias Utilizadas:</h2>

        <div className="flex justify-center space-x-4 mb-10">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
            alt="React"
            className="w-16 h-16"
          />

          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg"
            alt="Electron"
            className="w-16 h-16"
          />

          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
            alt="Python"
            className="w-16 h-16"
          />

          <div style={{ backgroundColor: "white" }}>
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg"
              alt="Flask"
              className="w-16 h-16"
            />
          </div>

          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg"
            alt="tensorFlow"
            className="w-16 h-16"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Conheça a Equipe:</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 limit:grid-cols-7 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.photo}
                alt={member.name}
                className="rounded-full w-32 h-32 mx-auto mb-2"
              />
              <p className="font-medium mb-1">{member.name}</p>
              <div className="flex justify-center space-x-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

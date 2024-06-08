import React from "react";
import { Menu } from "../../components/menu/menu";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function AboutView() {
    const teamMembers = [
        {
            name: "Jonas Gabriel",
            linkedin: "https://www.linkedin.com/in/jonas-gabriel-araujo/",
            github: "https://github.com/jonasgabriel18",
            photo: "../../../assets/jonas.jpg",
        },
        {
            name: "Luiz Gusttavo",
            linkedin: "https://www.linkedin.com/in/luiz-gusttavo-oliveira-de-souza-7538091b1/",
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
        <div className="bg-dark-gray text-black min-h-screen flex flex-col m-auto lg:w-1/2 md:w-2/3 xs:w-full
        ">
            <Menu />

            <div className="p-8 text-center">
                <p className="text-lg leading-relaxed mb-10">
                    O LinguifAI é uma aplicação inovadora desenvolvida pela diretoria de NLP da TAIL, projetada para simplificar e agilizar o treinamento e a classificação de modelos de Machine Learning em texto. Com essa ferramenta, é possível experimentar diversos algoritmos e ajustar parâmetros de forma intuitiva, tornando o processo de desenvolvimento de modelos NLP mais acessível e eficiente.
                </p>

                <h2 className="text-3xl font-bold mb-6">Tecnologias Utilizadas:</h2>

                <div className="flex justify-center space-x-8 mb-12">
                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
                        alt="React"
                        className="w-16 h-16 transition-transform transform hover:scale-110"
                    />
                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg"
                        alt="Electron"
                        className="w-16 h-16 transition-transform transform hover:scale-110"
                    />
                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
                        alt="Python"
                        className="w-16 h-16 transition-transform transform hover:scale-110"
                    />
                    <div className="bg-white p-2 rounded-full transition-transform transform hover:scale-110">
                        <img
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg"
                            alt="Flask"
                            className="w-16 h-16"
                        />
                    </div>
                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg"
                        alt="TensorFlow"
                        className="w-16 h-16 transition-transform transform hover:scale-110"
                    />
                </div>

                <h2 className="text-3xl font-bold mb-6">Conheça nossa equipe:</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="text-center bg-gray-200 p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                            <img
                                src={member.photo}
                                alt={member.name}
                                className="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-gray-600"
                            />
                            <p className="font-semibold mb-2">{member.name}</p>
                            <div className="flex justify-center space-x-4">
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-500"
                                >
                                    <FaLinkedin className="w-6 h-6" />
                                </a>
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-700 hover:text-gray-500"
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

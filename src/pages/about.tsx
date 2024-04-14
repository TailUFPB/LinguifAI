import { Menu } from "../components/menu/menu";
import { FaLinkedin, FaGithub } from 'react-icons/fa';

export default function About() {
  const teamMembers = [
    {
        name: 'Jonas Gabriel',
        linkedin: 'https://www.linkedin.com/in/jonas-gabriel-araujo/',
        github: 'https://github.com/jonasgabriel18',
        photo: '/assets/jonas.jpg',
    },

    {
        name: 'Luiz Gusttavo',
        linkedin: 'https://www.linkedin.com/in/luiz-gusttavo-oliveira-de-souza-7538091b1/',
        github: 'https://github.com/GusttavoOliveira',
        photo: '/assets/luiz.jpg',
    },

    {
        name: 'Bertrand Lira',
        linkedin: 'https://www.linkedin.com/in/bertrand-lira-veloso-52aa4926a/',
        github: 'https://github.com/BertrandLira',
        photo: '/assets/bertrand.jpg',
    },

    {
        name: 'Cameron Maloney',
        linkedin: 'https://www.linkedin.com/in/cameronmal/',
        github: 'https://github.com/cmaloney111',
        photo: '/assets/cameron.jpg',
    },

    {
        name: 'Gisele Silva',
        linkedin: 'https://www.linkedin.com/in/gisele-silva-6692941a4/',
        github: 'https://github.com/GiseleBr678',
        photo: '/assets/gisele.jpg',
    },

    {
        name: 'Thauã Magalhães',
        linkedin: 'https://www.linkedin.com/in/thaua-lucas/',
        github: 'https://github.com/tahaluh',
        photo: '/assets/thaua.jpg',
    },

    {
        name: 'Thiago Rodrigues',
        linkedin: 'https://www.linkedin.com/in/thiago-rodrigues-b8a328249/',
        github: 'https://github.com/tahaluh',
        photo: '/assets/thiago.jpg',
    },
  ];

  return (
    <div className="bg-main-darker text-white min-h-screen flex flex-col">
      <Menu />

      <div className="p-8 text-center font-roboto">
        <h1 className="text-3xl font-bold mb-6 mt-6">
          Linguif<span className="text-main-light">AI</span>
        </h1>

        <h2 className="text-2xl font-semibold mb-4">Conheça a Equipe</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.photo}
                alt={member.name}
                className="rounded-full w-32 h-32 mx-auto mb-2"
              />
              <p className="text-lg font-medium mb-1">{member.name}</p>
              <div className="flex justify-center space-x-4">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer">
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

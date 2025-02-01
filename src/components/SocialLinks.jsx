import {
  Linkedin,
  Github,
  Instagram,
  ExternalLink
} from "lucide-react";

const socialLinks = [
  {
    name: "LinkedIn",
    displayName: "Let's Connect",
    subText: "on LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/kelvin-fameyeh-9479941a9/",
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#0077B5]",
    isPrimary: true
  },
  {
    name: "Instagram",
    displayName: "Instagram",
    subText: "@_codegeas",
    icon: Instagram,
    url: "https://www.instagram.com/_codegeas/",
    color: "#E4405F",
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]"
  },
  {
    name: "Contact",
    displayName: "Contact",
    subText: "+233 548511391",
    icon: () => (
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 0C5.373 0 0 5.373 0 12c0 2.03.483 3.948 1.337 5.644l-1.258 4.541a1 1 0 0 0 1.236 1.236l4.541-1.258A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0ZM8.742 6.742a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM17 17h-10a1 1 0 0 1-1-1c0-3 4-4.5 6-4.5s6 1.5 6 4.5a1 1 0 0 1-1 1Z"
          fill="#000000"
        />
      </svg>
    ),
    url: "tel:+233548511391",
    color: "#25D366",
    gradient: "from-[#25D366] to-[#128C7E]"
  },
  {
    name: "GitHub",
    displayName: "Github",
    subText: "@Wrttnspknbrkn",
    icon: Github,
    url: "https://github.com/Wrttnspknbrkn",
    color: "#ffffff",
    gradient: "from-[#333] to-[#24292e]"
  },
  {
    name: "X",
    displayName: "X (Twitter)",
    subText: "@Fameyeh_chale",
    icon: () => (
      <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406L10.123 14.71 3.095 22.846H0l8.616-9.835L0 1.153h7.594l5.742 7.6 6.565-7.6Zm-1.306 19.644h2.036L5.564 3.262H3.383L17.595 20.797Z" fill="#000000" />
      </svg>
    ),
    url: "https://x.com/@Fameyeh_chale",
    color: "black",
    gradient: "from-[#000000] via-[#1DA1F2] to-[#000000]"
  }
];

const SocialLinks = () => {
  const linkedIn = socialLinks.find(link => link.isPrimary);
  const otherLinks = socialLinks.filter(link => !link.isPrimary);
  return (
    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 py-8 backdrop-blur-xl">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
        Connect With Me
      </h3>

      <div className="flex flex-col gap-4">
        {/* LinkedIn - Primary Row */}
        <a
          href={linkedIn.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-4 rounded-lg 
             bg-white/5 border border-white/10 overflow-hidden
             hover:border-white/20 transition-all duration-500"
        >
          {/* Hover Gradient Background */}
          <div 
            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
               bg-gradient-to-r ${linkedIn.gradient}`}
          />
          
          <div className="relative flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div 
                className="absolute inset-0 opacity-20 rounded-md transition-all duration-500
                   group-hover:scale-110 group-hover:opacity-30"
                style={{ backgroundColor: linkedIn.color }}
              />
              <div className="relative p-2 rounded-md">
                <linkedIn.icon
                  className="w-6 h-6 transition-all duration-500 group-hover:scale-105"
                  style={{ color: linkedIn.color }}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold pt-[0.2rem] text-gray-200 tracking-tight leading-none group-hover:text-white transition-colors duration-300">
                {linkedIn.displayName}
              </span>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {linkedIn.subText}
              </span>
            </div>
          </div>

          <ExternalLink 
            className="relative w-5 h-5 text-gray-500 group-hover:text-white
               opacity-0 group-hover:opacity-100 transition-all duration-300
               transform group-hover:translate-x-0 -translate-x-1"
          />
        </a>

        {/* Other Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 p-4 rounded-xl 
                       bg-white/5 border border-white/10 overflow-hidden
                       hover:border-white/20 transition-all duration-500"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                             bg-gradient-to-r ${link.gradient}`} />
              
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                               group-hover:scale-125 group-hover:opacity-30"
                     style={{ backgroundColor: link.color }} />
                <div className="relative p-2 rounded-lg">
                  <link.icon
                    className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
                    style={{ color: link.color }}
                  />
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                  {link.displayName}
                </span>
                <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                  {link.subText}
                </span>
              </div>

              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                                     opacity-0 group-hover:opacity-100 transition-all duration-300
                                     transform group-hover:translate-x-0 -translate-x-2" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
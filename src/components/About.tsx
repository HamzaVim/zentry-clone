import AnimatedSmallText from "./AnimatedSmallText";
import AnimatedHeader from "./AnimatedHeader";

function About() {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden mt-36">
      <div className="w-screen flex flex-col items-center">
        <AnimatedSmallText text="Welcome to Zentry" />
        <AnimatedHeader text="Disc<b>o</b>ver the world's <br />largest shared <b>a</b>dventure" />
        <div className="w-full h-dvh relative">
          <img
            src="../../public/img/about.webp"
            alt="about image"
            className="w-full h-full"
          />
          <div className="w-full text-center font-robert-medium font-bold text-xl leading-[1.2em] absolute bottom-32 -z-10">
            <p>The Game of Games begins—your life, now an epic MMORPG</p>
            <p className="text-black/40">
              Zentry unites the every players from countless games and
              platforms,
              <br /> both digital and physical, into a unified Play Economy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

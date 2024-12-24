import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef, useState } from "react";
import AnimatedSmallText from "./AnimatedSmallText";
import AnimatedHeader from "./AnimatedHeader";
import { useGSAP } from "@gsap/react";

function About() {
  // NOTE: States & Refs: ---------------------------------------------------

  // State when the user is in view
  const [inView, setInView] = useState<boolean | null>(null);

  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);

  // NOTE: Functions: ---------------------------------------------------

  // When the user scrolls to the About section
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    if (!containerRef.current) return;
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom top",
      onEnter: () => {
        // If the user scrolls to the About section then set the state to true
        setInView(true);
      },
      onLeaveBack: () => {
        // If the user scrolls out of the About section to the top (not bottom) then set the state to false
        setInView(false);
      },
    });
  }, []);
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden mt-36">
      <div ref={containerRef} className="w-screen flex flex-col items-center">
        <AnimatedSmallText text="Welcome to Zentry" containerViewed={inView} />
        <AnimatedHeader
          text="Disc<b>o</b>ver the world's <br />largest shared <b>a</b>dventure"
          containerViewed={inView}
        />
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

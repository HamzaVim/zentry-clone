import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useCallback, useRef, useState } from "react";
import AnimatedSmallText from "./AnimatedSmallText";
import AnimatedHeader from "./AnimatedHeader";
import { useGSAP } from "@gsap/react";

function About() {
  // NOTE: States & Refs: ---------------------------------------------------

  // State when the user is in view
  const [inView, setInView] = useState<boolean | null>(null);

  // State when image is in view
  const [imageInView, setImageInView] = useState<boolean | null>(null);

  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref for the image
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // NOTE: Functions: ---------------------------------------------------

  // When the user scrolls to the About section ---------------------------------------------------
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    if (!containerRef.current || !imageContainerRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom top",
      onEnter: () => {
        // If the user scrolls to the About section then set the state to true & the image state to true
        setInView(true);
        setImageInView(true);
      },
      onLeaveBack: () => {
        // If the user scrolls out of the About section to the top (not bottom) then set the state to false
        setInView(false);
      },
    });
  }, []);

  // When the image is in view it will add scroll trigger so it can animate ---------------------------------------------------
  useGSAP(
    () => {
      if (!imageContainerRef.current || !imageInView) return;
      gsap.timeline().to("#mask, #mask-border", {
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: "top top",
          end: "+=300",
          toggleActions: "play pause reverse reset",
          scrub: true,
          pin: true,
          pinSpacing: true,
          onLeave: () => {
            // If the user scrolls out of the About section to the bottom then set the state to false
            setInView(false);
          },
          onEnterBack: () => {
            // If the user scrolls to the About section then set the state to true
            setInView(true);
          },
        },
        ease: "none",
        "--translate-w": "0vw",
        "--translate-h": "0vh",
        "--full-screan-w": "100vw",
        "--full-screan-h": "100dvh",
      });
    },
    { dependencies: [imageInView], scope: imageContainerRef },
  );

  // Tilt Effect for the image ---------------------------------------------------
  const { contextSafe } = useGSAP();

  const handleMouseMove = useCallback(
    contextSafe((e: MouseEvent) => {
      // Get the mouse position
      const x = e.clientX;
      const y = e.clientY;

      // Get the middle of the screen / object
      const middleX = window.innerWidth / 2;
      const middleY = window.innerHeight / 2;

      // Get offset from middle
      const offsetX = x - middleX;
      const offsetY = y - middleY;

      // For mouse movement
      const mouseX = offsetX * 0.03;
      const mouseY = offsetY * 0.03;

      // For parallax effect
      const parallaxY = (offsetX / middleX) * 25;
      const parallaxX = (offsetY / middleY) * 25;

      gsap.to("#mask, #mask-border", {
        overwrite: "auto",
        ease: "none",
        "--mouse-x": mouseX,
        "--mouse-y": mouseY,
        "--rotate-x": `${-1 * parallaxX}deg`,
        "--rotate-y": `${parallaxY}deg`,
        "--rotate-z": `${(offsetX / middleX) * 3 - 9}deg`,
        "--skew": `${(offsetX / middleX) * 3 - 9}deg`,
      });
      gsap.to("[alt='stones image']", {
        overwrite: "auto",
        ease: "none",
        "--mouse-x": mouseX,
        "--mouse-y": mouseY,
      });
    }),
    [],
  );

  useGSAP(
    () => {
      if (inView) {
        window.addEventListener("mousemove", handleMouseMove);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    },
    { dependencies: [inView], scope: containerRef },
  );

  // Set initial values ---------------------------------------------------
  useGSAP(
    () => {
      gsap.set("#mask, #mask-border", {
        ease: "none",
        "--mouse-x": "0px",
        "--mouse-y": "0px",
        "--rotate-x": `0deg`,
        "--rotate-y": `0deg`,
        "--rotate-z": `-9deg`,
        "--skew": `-9deg`,

        /* NOTE: initial value for translations & sizes */
        "--full-screan-h": "0dvh",
        "--full-screan-w": "0vw",
        "--translate-w": "50vw",
        "--translate-h": "45vh",
      });

      gsap.set("[alt='stones image']", {
        ease: "none",
        "--mouse-x": "0px",
        "--mouse-y": "0px",

        /* NOTE: initial value for translations & sizes */
        "--full-screan-h": "0dvh",
        "--full-screan-w": "0vw",
        "--translate-w": "50vw",
        "--translate-h": "45vh",
      });
    },
    { scope: containerRef },
  );
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden mt-36">
      <div ref={containerRef} className="w-screen flex flex-col items-center">
        <AnimatedSmallText text="Welcome to Zentry" containerViewed={inView} />
        <AnimatedHeader
          text="Disc<b>o</b>ver the world's <br />largest shared <b>a</b>dventure"
          containerViewed={inView}
        />
        <div
          ref={imageContainerRef}
          className="w-full h-dvh relative overflow-hidden"
        >
          {/* NOTE: Mask container */}
          <div
            style={{
              width: "35rem",
              height: "45rem",
              borderRadius: "0.4rem",
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50`}
          >
            {/* NOTE: Border for the image mask */}
            <div
              style={{
                width: "calc(30rem - 2px + var(--full-screan-w))",
                height: "calc(40rem - 2px + var(--full-screan-h))",
                borderRadius: "calc(0.4rem - 2px)",
                transform:
                  "translate(calc(var(--translate-w) - 15rem + var(--mouse-x) - 50vw),calc(var(--translate-h) - 20rem + var(--mouse-y) - 50vh)) rotateX(calc(var(--rotate-x))) rotateY(calc(var(--rotate-y))) rotateZ(var(--rotate-z)) skew(var(--skew))",
                transformBox: "border-box",
                outlineWidth: "2px",
              }}
              className="outline outline-black absolute top-1/2 left-1/2 z-20"
              id="mask-border"
            ></div>
            {/* NOTE: SVG for image mask */}
            <svg
              viewBox="0 0 300 300"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute w-full h-full z-20"
            >
              <mask id="mask" maskUnits="objectBoundingBox">
                <rect
                  rx="0.4rem"
                  fill="white"
                  y={0}
                  x={0}
                  style={{
                    width: "calc(30rem + var(--full-screan-w))",
                    height: "calc(40rem + var(--full-screan-h))",
                    transform:
                      "translate(calc(var(--translate-w) - 15rem + var(--mouse-x)), calc(var(--translate-h) - 20rem + var(--mouse-y))) rotateX(calc(var(--rotate-x))) rotateY(calc(var(--rotate-y))) rotateZ(var(--rotate-z)) skew(var(--skew))",
                    transformOrigin: "50% 50%",
                    transformBox: "border-box",
                  }}
                />
              </mask>
            </svg>
          </div>
          {/* NOTE: Image of about */}
          <img
            src="../../public/img/about.webp"
            alt="about image"
            style={{
              mask: "url(#mask)",
            }}
            className="w-full h-full object-cover"
          />
          {/* NOTE: Image of stones */}
          <img
            src="../../public/img/stones.webp"
            alt="stones image"
            style={{
              transform: `translate(calc(-50% + var(--mouse-x)), calc(-50% + var(--mouse-y)))`,
            }}
            className="w-full h-full object-cover absolute top-1/2 left-1/2 z-[100]"
          />
          <div className="w-full text-center font-robert-medium font-bold md:text-xl text-base leading-[1.2em] absolute bottom-16 md:bottom-24 px-6 -z-10">
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

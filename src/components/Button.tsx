import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useRef, useState } from "react";
import { useGlobalContext } from "../context/useGlobalContext";

function Button({
  title,
  LeftIcon,
  RightIcon,
  bgClass,
  containerClass,
  comeingSoon,
  scrolled,
  arrowClass,
}: CustomButtonProps) {
  // NOTE: States & Refs: ---------------------------------------------------

  // Hover state for button
  const [buttonHovered, setButtonHovered] = useState(false);

  // Background button ref
  const bgButtonRef = useRef<HTMLDivElement>(null);

  // Button ref
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Timeline ref & adding gsap.timeline to it
  const timelineRef = useRef<GSAPTimeline>();
  useGSAP(() => {
    timelineRef.current = gsap.timeline();
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const { isMuted } = useGlobalContext();

  // NOTE: Animation: ---------------------------------------------------

  const { contextSafe } = useGSAP();

  // For mouse movement
  const handleMouseMove = useCallback(
    contextSafe((e: MouseEvent) => {
      if (!buttonRef.current) return;

      // Get the mouse position
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;

      // For parallax effect
      const parallaxY = x * 0.15;
      gsap.to(bgButtonRef.current, {
        rotateY: parallaxY,
        rotateX: 15,
        duration: 0.7,
      });
    }),
    [],
  );

  useGSAP(
    () => {
      if (
        !bgButtonRef.current ||
        !buttonRef.current ||
        !timelineRef.current ||
        comeingSoon
      )
        return;

      timelineRef.current.clear();
      const staggerFrom = LeftIcon ? "end" : "start";

      if (buttonHovered && !scrolled) {
        timelineRef.current
          .to(bgButtonRef.current, {
            ease: "back.out",
            borderRadius: "0.3rem",
            height: "120%",
            duration: 0.5,
          })
          .set(
            ".animation",
            {
              translateY: "1rem",
              opacity: 0,
            },
            "<",
          )
          .to(
            ".animation",
            {
              translateY: "0rem",
              opacity: 1,
              stagger: {
                ease: "power4.out",
                from: staggerFrom,
                each: 0.1,
              },
              duration: 0.5,
            },
            "<",
          );

        buttonRef.current.addEventListener("mousemove", handleMouseMove);
      } else {
        if (scrolled) {
          timelineRef.current
            .to(bgButtonRef.current, {
              ease: "power4.out",
              overwrite: true,
              borderRadius: "2rem",
              height: "100%",
              transform: `rotateY(0deg) rotateX(0deg)`,
              duration: 0.5,
            })
            .to(
              ".animation",
              {
                translateY: "0rem",
                opacity: 1,
                stagger: {
                  ease: "power4.out",
                  from: staggerFrom,
                  each: 0.1,
                },
                duration: 0.5,
              },
              "<",
            );
        } else {
          timelineRef.current
            .to(bgButtonRef.current, {
              ease: "power4.out",
              overwrite: true,
              borderRadius: "2rem",
              height: "100%",
              transform: `rotateY(0deg) rotateX(0deg)`,
              duration: 0.5,
            })
            .set(
              ".animation",
              {
                translateY: "-1rem",
                opacity: 0,
              },
              "<",
            )
            .to(
              ".animation",
              {
                translateY: "0rem",
                opacity: 1,
                stagger: {
                  ease: "power4.out",
                  from: staggerFrom,
                  each: 0.1,
                },
                duration: 0.5,
              },
              "<",
            );
        }
        buttonRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      return () => {
        buttonRef.current?.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { dependencies: [buttonHovered, scrolled], scope: buttonRef },
  );

  if (comeingSoon) {
    return (
      <button
        className={`relative z-50 flex justify-center items-center gap-2 pointer-events-auto ${containerClass}`}
      >
        <div
          className={`w-full h-full absolute z-0 rounded-[2rem] bg-black border border-bgColor/30`}
        />
        {LeftIcon && <LeftIcon className={arrowClass} />}
        <span className=" font-roboto-mono font-bold uppercase relative block z-10 ">
          {title}
        </span>
      </button>
    );
  }
  return (
    <button
      onMouseEnter={() => {
        setButtonHovered(true);
        if (audioRef.current && !scrolled) {
          if (!audioRef.current.paused) audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }}
      onMouseLeave={() => {
        setButtonHovered(false);
      }}
      ref={buttonRef}
      className={`relative z-50 flex justify-center items-center gap-2 pointer-events-auto text-black  ${containerClass}`}
    >
      <div
        ref={bgButtonRef}
        className={`w-full h-full absolute z-0 rounded-[2rem] ${bgClass}`}
      />
      {LeftIcon && <LeftIcon className={arrowClass} />}
      <span className=" font-roboto-mono font-bold uppercase relative block z-10 animation">
        {title}
      </span>
      {RightIcon && <RightIcon className={arrowClass} />}
      <audio
        ref={audioRef}
        className="hidden"
        src="/audio/button-audio.mp3"
        muted={isMuted}
      />
    </button>
  );
}

export default Button;

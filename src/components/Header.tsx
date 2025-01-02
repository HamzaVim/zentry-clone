import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DownArrow from "./svgs/DownArrow";
import { useGlobalContext } from "../context/useGlobalContext";

function Header({ showHeader }: { showHeader: "show" | "float" | "hide" }) {
  // NOTE: Constants: ---------------------------------------------------

  // Navigation items
  const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

  // NOTE: States & Refs: ---------------------------------------------------

  // Refs for the navigation items
  const navItemsRef = useRef<HTMLLIElement[]>([]);

  // State for the navigation items width
  const [navItemsWidth, setNavItemsWidth] = useState<number[]>([]);

  // State for the container 'nav' if it's hovered
  const [navHover, setNavHover] = useState(false);

  // State for the navigation item if it's hovered
  const [navItemHover, setNavItemHover] = useState<number | null>(null);

  // Ref for the item that is used for the animation
  const navItemSlectRef = useRef<HTMLLIElement>(null);

  // State when the navigation item is selected
  const [selected, setSelected] = useState(false);

  // Ref for navbar hover audio
  const navAudioRef = useRef<HTMLAudioElement[]>([]);

  // State for the interval
  const intervalRef = useRef<number | null>(null); // Use number instead of NodeJS.Timeout

  // Ref for the music
  const musicRef = useRef<HTMLAudioElement>(null);

  const {
    isMuted,
    setIsMuted,
    isLoading,
    musicActive,
    setMusicActive,
    musicRuns,
    setMusicRuns,
  } = useGlobalContext();

  // NOTE: Functions: ---------------------------------------------------

  // Get the width of the navigation items
  useEffect(() => {
    if (isLoading) return;
    setNavItemsWidth(
      navItemsRef.current.map((item) => {
        return item.offsetWidth;
      }),
    );
  }, [isLoading]);

  const getX = (index: number) => {
    const fromTo = navItemsWidth.slice(0, index);

    const total = fromTo.reduce((acc, curr) => acc + curr, 0);
    return total;
  };

  // Toggle the music
  useEffect(() => {
    if (!musicRef.current) return;

    // clear the intervalRef if it's exist
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // if 'musicActive' is true: it will play the music and start the interval to increase the volume.
    if (musicActive) {
      musicRef.current.play();
      if (!musicRuns) setMusicRuns(true);

      intervalRef.current = setInterval(() => {
        if (!musicRef.current) return;

        const currentVolume = musicRef.current.volume;

        // If volume reaches 0.5, stop the interval
        if (currentVolume >= 0.5) {
          musicRef.current.volume = 0.5;

          if (intervalRef.current !== null) clearInterval(intervalRef.current);
        } else {
          // Increment volume in steps of 0.05
          musicRef.current.volume = Math.min(currentVolume + 0.05, 0.5);
        }
      }, 150);
    } else if (musicActive === null) {
      musicRef.current.currentTime = 0;
      musicRef.current.volume = 0.0;
    } else {
      // if 'musicActive' is false: it will start the interval to decrease the volume and after that it will pause the music.
      intervalRef.current = setInterval(() => {
        if (!musicRef.current) return;

        const currentVolume = musicRef.current.volume;

        // If volume reaches 0.0, stop the interval
        if (currentVolume <= 0.0) {
          musicRef.current.volume = 0.0;

          if (intervalRef.current !== null) clearInterval(intervalRef.current);
        } else {
          // Decrement volume in steps of 0.05
          musicRef.current.volume = Math.max(currentVolume - 0.05, 0.0);
        }
      }, 50);
    }
  }, [musicActive]);

  // NOTE: Animation: ---------------------------------------------------

  useGSAP(() => {
    if (!navItemSlectRef.current || !navItemsRef.current) return;

    if (navHover) {
      // Play the audio if the navigation item is hovered and if the audio is not paused (is playing) set the current time to 0.
      if (!navAudioRef.current[0]) return;
      if (!isMuted) {
        if (!navAudioRef.current[navItemHover!].paused)
          navAudioRef.current[navItemHover!].currentTime = 0;
        navAudioRef.current[navItemHover!].play();
      }

      // Animate the navigation item
      gsap.to(navItemSlectRef.current, {
        overwrite: "auto",
        duration: 0,
        visibility: "visible",
        width: navItemsWidth[navItemHover!],
        height: "100%",
        x: getX(navItemHover!),
        onComplete: () => {
          setSelected(true);
        },
      });
      gsap.to(navItemsRef.current[navItemHover!], {
        overwrite: "auto",
        duration: 0,
        color: "black",
      });
    } else {
      setSelected(false);
      if (navItemHover === null) {
        gsap.to(navItemSlectRef.current, {
          overwrite: "auto",
          duration: 0,
          visibility: "hidden",
          width: 0,
          height: 0,
          x: 0,
        });
      } else {
        gsap.to(navItemSlectRef.current, {
          overwrite: "auto",
          duration: 0,
          visibility: "hidden",
          width: 0,
          height: 0,
          x: 0,
        });

        navItemsRef.current.forEach((item) => {
          gsap.to(item, {
            overwrite: true,
            duration: 0,
            ease: "power4.in",
            color: "#DFDFF2",
          });
        });
      }
    }
  }, [navHover]);

  useGSAP(() => {
    if (!navItemSlectRef.current || !navItemsRef.current || !selected) return;

    gsap.to(navItemSlectRef.current, {
      x: getX(navItemHover!),
      width: navItemsWidth[navItemHover!],
      duration: 0.4,
      onStart: () => {
        // Play the audio if the navigation item is hovered and if the audio is not paused (is playing) set the current time to 0.
        if (!navAudioRef.current[0]) return;
        if (!isMuted) {
          if (!navAudioRef.current[navItemHover!].paused)
            navAudioRef.current[navItemHover!].currentTime = 0;
          navAudioRef.current[navItemHover!].play();
        }
      },
    });
    gsap.to(navItemsRef.current[navItemHover!], {
      duration: 0.1,
      delay: 0.1,
      ease: "none",
      color: "black",
    });
    navItemsRef.current.forEach((item, index) => {
      if (index !== navItemHover) {
        gsap.to(item, {
          duration: 0.1,
          delay: 0.1,
          ease: "none",
          color: "#DFDFF2",
        });
      }
    });
  }, [navItemHover]);

  useGSAP(
    () => {
      if (showHeader === "show") {
        gsap.to("#header", {
          overwrite: "auto",
          duration: 0.4,
          ease: "power4.in",
          background: "rgba(0,0,0,0)",
          top: "0.75rem",
          y: "0%",
          borderColor: "transparent",
        });
      } else if (showHeader === "hide") {
        gsap.to("#header", {
          overwrite: "auto",
          duration: 0.3,
          ease: "none",
          top: "0rem",
          y: "-100%",
        });

        gsap.set("#header", {
          overwrite: "auto",
          delay: 0.3,
          background: "rgba(0,0,0,1)",
          borderColor: "rgb(255,255,255,0.20)",
        });
      } else {
        gsap.to("#header", {
          overwrite: "auto",
          duration: 0.3,
          ease: "none",
          top: "0.75rem",
          y: "0%",
        });
      }
    },
    { dependencies: [showHeader] },
  );

  // Animate music button
  useGSAP(
    () => {
      if (!musicRef.current) return;

      if (musicActive) {
        gsap.fromTo(
          ".musicAnimation",
          {
            height: 8,
          },
          {
            height: 18,
            duration: 0.5,
            stagger: {
              each: 0.15,
              repeat: -1,
              yoyo: true,
              from: "edges",
            },
          },
        );
      } else {
        gsap.to(".musicAnimation", {
          overwrite: true,
          duration: 0.4,
          height: 8,
          stagger: {
            repeat: 0,
            yoyo: false,
          },
        });
      }
    },
    { dependencies: [musicActive] },
  );

  return (
    <header
      id="header"
      className="py-5 rounded-xl border text-textColor fixed left-6 right-6 z-[10000]"
    >
      <div className="flex justify-between items-center ">
        <div className="flex gap-7">
          <button>
            <img src="/img/logo.png" alt="logo" className="w-10 h-10 ml-6" />
          </button>
          <div className="flex gap-3">
            <Button
              title="Products"
              bgClass="bg-bgColor"
              containerClass="w-fit px-6 py-1 text-xs"
              RightIcon={DownArrow}
              arrowClass="z-30 animation "
            />
            <Button
              title="Whitepaper"
              bgClass="bg-bgColor"
              containerClass="w-fit px-6 py-1 text-xs"
              arrowClass="z-30 animation "
            />
          </div>
        </div>
        <div className="relative hidden lg:flex items-center">
          <nav
            onMouseEnter={() => {
              setNavHover(true);
            }}
            onMouseLeave={() => {
              setNavHover(false);
            }}
          >
            <ul className="flex relative z-20">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  ref={(el) => {
                    if (!el) return;
                    navItemsRef.current[index] = el;
                  }}
                  onMouseEnter={() => {
                    setNavItemHover(index);
                  }}
                  className="text-textColor text-sm z-[100]"
                >
                  <a
                    className={`px-6 py-3 font-bold flex gap-1.5 items-center uppercase`}
                    href={`#${item}`}
                  >
                    {item}
                    {index === 0 || index === 1 ? <TiLocationArrow /> : null}
                  </a>

                  <audio
                    ref={(el) => (navAudioRef.current[index] = el!)}
                    className="hidden"
                    src="/audio/navbar.mp3"
                    muted={isMuted}
                  />
                </li>
              ))}
              <li
                ref={navItemSlectRef}
                className={`block absolute top-0 left-0 h-full bg-bgColor rounded-full`}
              />
            </ul>
          </nav>
          <button
            onClick={() => {
              if (musicActive === null) {
                setMusicActive(true);
              } else {
                setMusicActive((prev) => !prev);
              }
              setIsMuted(false);
            }}
            className="flex gap-1 items-center z-[100] px-6 py-3 h-[20px]"
          >
            <div className="w-[1px] bg-bgColor musicAnimation" />
            <div className="w-[1px] bg-bgColor musicAnimation" />
            <div className="w-[1px] bg-bgColor musicAnimation" />
            <div className="w-[1px] bg-bgColor musicAnimation" />
            <div className="w-[1px] bg-bgColor musicAnimation" />
            <audio
              ref={musicRef}
              className="hidden"
              src="/audio/loop.mp3"
              loop
              muted={isMuted}
            />
          </button>
        </div>
        <button className="flex flex-col gap-1 items-center bg-bgColor px-3 py-4 rounded-full mr-6 lg:hidden">
          <div className="w-8 h-1 bg-black rounded-full" />
          <div className="w-8 h-1 bg-black rounded-full" />
          <div className="w-8 h-1 bg-black rounded-full" />
        </button>
      </div>
    </header>
  );
}

export default Header;

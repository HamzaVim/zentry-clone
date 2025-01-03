import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useInterval } from "usehooks-ts";
import Button from "./Button";
import HeroArrow from "./svgs/HeroArrow";
import { ScrollTrigger } from "gsap/all";
import { useGlobalContext } from "../context/useGlobalContext";
import AnimatedHeader from "./AnimatedHeader";
import AnimatedSmallText from "./AnimatedSmallText";

function Hero() {
  // NOTE: The total number of videos
  const totalVideos = 4;

  // NOTE: States & Refs: ---------------------------------------------------

  // For mouse movement
  const [mouseActive, setMouseActive] = useState(false);
  const [mouseActiveTime, setMouseActiveTime] = useState(0);

  // Hover state for the `mask-container`
  const [maskHover, setMaskHover] = useState(false);

  // When the mini video (mask) clicked all animation stops.
  const [miniVidChangeAnimation, setMiniVidChangeAnimation] = useState(false);

  // For how many videos are loaded
  const [videoLoaded, setVideoLoaded] = useState(0);

  // For the current video
  const [currentIndex, setCurrentIndex] = useState(0);

  // For the video ref
  const videosRef = useRef<HTMLVideoElement[]>([]);

  // For the hero ref
  const heroRef = useRef<HTMLDivElement>(null);

  // When the user scroll
  const [scrolled, setScrolled] = useState(false);

  // When the user scrolled did it animated?
  const [scrolledAnimated, setScrolledAnimated] = useState(false);

  const whooshRef = useRef<HTMLAudioElement>(null);

  const {
    isMuted,
    setIsMuted,
    isLoading,
    setIsLoading,
    setMusicActive,
    musicRuns,
    setMusicRuns,
  } = useGlobalContext();

  // NOTE: Functions: ---------------------------------------------------

  // Every 300ms check if mouse is active more than the time now.
  // When the mouse is moving `mouseActive` is set to true, and `mouseActiveTime` is set to the current time
  // When `mouseActive` is false (not active), `useInterval` is cleared
  useInterval(
    () => {
      if (mouseActiveTime <= Date.now() - 100) {
        setMouseActive(false);
        return;
      }
      setMouseActive(true);
    },
    mouseActive ? 300 : null,
  );

  // Get the video url
  const getVideoUrl = (index: number) => `videos/hero-${index + 1}.mp4`;

  // When the video is loaded, `videoLoaded` is incremented
  const handleLoadedData = () => setVideoLoaded((perv) => perv + 1);

  // Get the next index of the current index
  const getNextCurrentIndex = (index = currentIndex) =>
    (index + 1) % totalVideos;

  // Get the next index of the current index
  const getPrevCurrentIndex = (index = currentIndex) =>
    (index + 3) % totalVideos;

  // Get the next & prev index of the current index
  const getPrevNextCurrentIndex = () => {
    return {
      nextCurrentIndex: getNextCurrentIndex(),
      prevCurrentIndex: getPrevCurrentIndex(),
    };
  };

  // Handle the click of the mini video to change the current video. Increase the index by 1
  const handleMiniVidChange = () => {
    if (miniVidChangeAnimation || scrolled) return;
    setMiniVidChangeAnimation(true);
    setCurrentIndex(getNextCurrentIndex());
  };

  // If the site is loading then set the 'isLoading' to true
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
    // TODO: Implement an additional timeout to detect if the site is still loading, accounting for potential slow connections or poor Wi-Fi.
  }, []);

  // NOTE: Animations: ---------------------------------------------------

  // Timeline declarations: ---------------------------------------------------
  const timelineHoverRef = useRef<GSAPTimeline>();
  const timelineMouseActiveRef = useRef<GSAPTimeline>();
  const timelineMiniVidChangeRef = useRef<GSAPTimeline>();
  useGSAP(() => {
    timelineMouseActiveRef.current = gsap.timeline();
    timelineHoverRef.current = gsap.timeline();
    timelineMiniVidChangeRef.current = gsap.timeline({
      defaults: {
        duration: 0,
        ease: "none",
      },
    });
  });

  // When the `mask-container` is hovered ---------------------------------------------------
  useGSAP(
    () => {
      if (
        !timelineHoverRef.current ||
        !timelineMouseActiveRef.current ||
        !timelineMiniVidChangeRef.current ||
        miniVidChangeAnimation ||
        scrolledAnimated
      )
        return;
      timelineMouseActiveRef.current.clear();
      timelineHoverRef.current.clear();
      timelineMiniVidChangeRef.current.clear();

      const { nextCurrentIndex } = getPrevNextCurrentIndex();

      if (maskHover && !scrolled) {
        timelineHoverRef.current
          .set(
            `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
            {
              outlineWidth: 2,
            },
          )
          .to(
            `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
            {
              duration: 0.5,
              ease: "none",
              "--full-size": "18rem",
              "--half-size": "9rem",
              "--rx": "0.4rem",
            },
          )
          .to(
            `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
            {
              duration: 0.7,
              ease: "power1.inOut",
              "--full-size": "20rem",
              "--half-size": "10rem",
              yoyo: true,
              repeat: -1,
            },
          );
      } else {
        timelineHoverRef.current.to(
          `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
          {
            overwrite: true,
            duration: 0.7,
            ease: "none",
            "--full-size": "18rem",
            "--half-size": "9rem",
            yoyo: false,
            repeat: 0,
          },
        );
      }
    },
    { dependencies: [maskHover, miniVidChangeAnimation, scrolled] },
  );

  // Tilt Effect for `mask-rect` & `mask-border` ---------------------------------------------------
  const { contextSafe } = useGSAP();

  const handleMouseMove = useCallback(
    contextSafe((e: MouseEvent) => {
      const { nextCurrentIndex } = getPrevNextCurrentIndex();

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
      const mouseX = offsetX * 0.2;
      const mouseY = offsetY * 0.2;

      // For parallax effect
      const parallaxY = (offsetX / middleX) * 45;
      const parallaxX = (offsetY / middleY) * 45;

      gsap.to(
        `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
        {
          overwrite: "auto",
          duration: 0.5,
          ease: "none",
          "--mouse-x": mouseX,
          "--mouse-y": mouseY,
          "--rotate-x": `${-1 * parallaxX}deg`,
          "--rotate-y": `${parallaxY}deg`,
        },
      );
    }),
    [currentIndex],
  );

  useEffect(() => {
    if (!heroRef.current) return;
    const heroRefCurrent = heroRef.current;

    if (!miniVidChangeAnimation && !scrolled) {
      heroRefCurrent.addEventListener("mousemove", handleMouseMove);
    } else {
      heroRefCurrent.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      heroRefCurrent.removeEventListener("mousemove", handleMouseMove);
    };
  }, [miniVidChangeAnimation, handleMouseMove, scrolled]);

  // When the mouse is active/not active ---------------------------------------------------
  useGSAP(
    () => {
      if (
        !timelineMouseActiveRef.current ||
        !timelineHoverRef.current ||
        (maskHover && !scrolled) ||
        miniVidChangeAnimation ||
        scrolledAnimated
      )
        return;

      timelineHoverRef.current.clear();

      const { nextCurrentIndex } = getPrevNextCurrentIndex();

      if (mouseActive && !scrolled) {
        const active = timelineMouseActiveRef.current.isActive();
        timelineMouseActiveRef.current.clear();
        if (active) {
          timelineMouseActiveRef.current.to(
            `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
            {
              duration: 1,
              ease: "none",
              "--full-size": "18rem",
              "--half-size": "9rem",
              "--rx": "0.4rem",
              outlineWidth: 2,
            },
          );
        } else {
          timelineMouseActiveRef.current
            .to(`#mask-border-${nextCurrentIndex}`, {
              overwrite: true,
              duration: 0,
              ease: "none",
              outlineWidth: 2,
            })
            .to(
              `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
              {
                duration: 0,
                ease: "none",
                "--rx": "0.1rem",
              },
            )
            .to(
              `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
              {
                duration: 1,
                ease: "none",
                "--full-size": "18rem",
                "--half-size": "9rem",
                "--rx": "0.4rem",
              },
            );
        }
      } else {
        timelineMouseActiveRef.current.clear();
        timelineMouseActiveRef.current
          .to(
            `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
            {
              overwrite: true,
              duration: 1,
              ease: "power1.out",
              "--full-size": "6rem",
              "--half-size": "3rem",
              "--rx": "0.4rem",
              outlineWidth: 2,
              onStart: () => {
                if (!scrolled) return;
                setScrolledAnimated(true);
              },
            },
          )
          .to(
            `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
            {
              duration: 1,
              ease: "none",
              "--full-size": "0rem",
              "--half-size": "0rem",
              "--rx": "0.1rem",
            },
            "-=0.2",
          )
          .to(
            `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
            {
              duration: 0,
              ease: "none",
              outlineWidth: 0,
              "--rx": "0rem",
            },
          );
      }
    },
    { dependencies: [mouseActive, miniVidChangeAnimation, scrolled] },
  );

  // Mini video when change it will increase the size of the mask to fill the screen ---------------------------------------------------
  useGSAP(
    () => {
      if (
        !timelineHoverRef.current ||
        !timelineMouseActiveRef.current ||
        !timelineMiniVidChangeRef.current ||
        !miniVidChangeAnimation
      )
        return;
      timelineMouseActiveRef.current.clear();
      timelineHoverRef.current.clear();
      timelineMiniVidChangeRef.current.clear();

      const { nextCurrentIndex, prevCurrentIndex } = getPrevNextCurrentIndex();

      timelineMiniVidChangeRef.current
        .set(`#mask-border-${currentIndex}`, {
          outlineWidth: 2,
        })
        .to(`#mask-rect-${currentIndex}, #mask-border-${currentIndex}`, {
          overwrite: true,
          duration: 0.2,
          ease: "power1.out",
          "--mouse-x": 0,
          "--mouse-y": 0,
          "--rotate-x": "0deg",
          "--rotate-y": "0deg",
          "--half-size": "9rem",
          "--full-size": "18rem",
          "--rx": "0.4rem",
          yoyo: false,
          repeat: 0,
        })
        .to(`#mask-rect-${currentIndex}, #mask-border-${currentIndex}`, {
          duration: 1,
          ease: "power1.out",
          "--full-screan-h": "101dvh",
          "--full-screan-w": "102vw",
          "--half-size": "0rem",
          "--full-size": "0rem",
          "--translate-w": "-1vw",
          "--translate-h": "-1vh",
          onStart: () => {
            videosRef.current[currentIndex].play();
            if (!whooshRef.current) return;
            if (isMuted) setIsMuted(false);
            if (!musicRuns) {
              setMusicRuns(true);
              setMusicActive(true);
            }
            const times = [0, 3, 5.9];
            whooshRef.current.currentTime =
              times[Math.floor(Math.random() * times.length)];

            whooshRef.current.play().then(() => {
              setTimeout(() => {
                if (!whooshRef.current) return;

                whooshRef.current.pause();
                whooshRef.current.currentTime = 0;
              }, 1000);
            });
          },
        })
        .set(
          `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
          {
            "--full-screan-h": "0dvh",
            "--full-screan-w": "0vw",
            "--half-size": "0rem",
            "--full-size": "0rem",
            "--translate-w": "50vw",
            "--translate-h": "50vh",
            "--rx": "0.2rem",
          },
          "<",
        )
        .set(
          `#mask-border-${nextCurrentIndex}`,
          {
            outlineWidth: 2,
          },
          "<",
        )
        .to(
          `#mask-rect-${nextCurrentIndex}, #mask-border-${nextCurrentIndex}`,
          {
            duration: 1,
            "--half-size": "9rem",
            "--full-size": "18rem",
            "--rx": "0.4rem",
          },
          "<",
        )
        .set(
          `#mask-rect-${prevCurrentIndex}, #mask-border-${prevCurrentIndex}`,
          {
            "--full-screan-h": "0dvh",
            "--full-screan-w": "0vw",
            "--half-size": "0rem",
            "--full-size": "0rem",
            "--translate-w": "50vw",
            "--translate-h": "50vh",
            onComplete: () => {
              videosRef.current[prevCurrentIndex].pause();
              videosRef.current[prevCurrentIndex].currentTime = 0;
            },
          },
        )
        .to(`#mask-border-${prevCurrentIndex}`, {
          outlineWidth: 0,
          onComplete: () => {
            setMiniVidChangeAnimation(false);
          },
        });
    },
    { dependencies: [miniVidChangeAnimation] },
  );

  // Video order ---------------------------------------------------
  useGSAP(
    () => {
      const { nextCurrentIndex, prevCurrentIndex } = getPrevNextCurrentIndex();

      Array.from({ length: totalVideos }, (_, i) => {
        if (i === nextCurrentIndex) {
          gsap.set(`#video-frame-${i}`, {
            zIndex: 30,
            display: "block",
          });
        } else if (i === currentIndex) {
          gsap.set(`#video-frame-${i}`, {
            zIndex: 20,
            display: "block",
          });
        } else if (i === prevCurrentIndex) {
          gsap.set(`#video-frame-${i}`, {
            zIndex: 10,
            display: "block",
          });
        } else {
          gsap.set(`#video-frame-${i}`, {
            delay: 1.2,
            zIndex: 0,
            display: "none",
          });
          gsap.to(`#video-frame-${prevCurrentIndex}`, {
            duration: 0,
            delay: 1.2,
            zIndex: 0,
            display: "none",
          });
        }
      });
    },
    { dependencies: [currentIndex] },
  );

  // Initial video state ---------------------------------------------------
  useGSAP(
    () => {
      if (!videosRef.current) return;

      Array.from({ length: totalVideos }, (_, i) => {
        if (i === currentIndex) {
          gsap.set(`#mask-rect-${i}, #mask-border-${i}`, {
            /* NOTE: For animation when start */
            "--full-size": "0rem",
            "--half-size": "0rem",
            "--rx": "0rem",

            /* NOTE: rect and border position and rotation for mouse movement, 0px and 0deg initial value */
            "--mouse-x": "0px",
            "--mouse-y": "0px",
            "--rotate-x": "0deg",
            "--rotate-y": "0deg",

            /* NOTE: When miniVideo initial value */
            "--full-screan-h": "101dvh",
            "--full-screan-w": "102vw",
            "--translate-w": "-1vw",
            "--translate-h": "-1vh",
            "--border-translate": "50%",
          });
          gsap.set(`#mask-container-${i}`, {
            /* NOTE: For the svg and border container */
            "--container-full-size": "20rem",
            "--container-rx": "0.4rem",
          });
        } else {
          gsap.set(`#mask-rect-${i}, #mask-border-${i}`, {
            /* NOTE: For animation when start */
            "--full-size": "0rem",
            "--half-size": "0rem",
            "--rx": "0rem",

            /* NOTE: rect and border position and rotation for mouse movement, 0px and 0deg initial value */
            "--mouse-x": "0px",
            "--mouse-y": "0px",
            "--rotate-x": "0deg",
            "--rotate-y": "0deg",

            /* NOTE: When miniVideo initial value */
            "--full-screan-h": "0dvh",
            "--full-screan-w": "0vw",
            "--border-translate": "50%",
            "--translate-w": "50vw",
            "--translate-h": "50vh",
          });

          gsap.set(`#mask-container-${i}`, {
            /* NOTE: For the svg and border container */
            "--container-full-size": "20rem",
            "--container-rx": "0.4rem",
          });
        }
      });
    },
    { scope: heroRef },
  );

  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.set(heroRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, -4% 100%)",
      borderRadius: "0.4rem",
    });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          toggleActions: "play pause reverse reset",
          scrub: true,
          onEnter: () => {
            setScrolled(true);
          },
          onLeaveBack: () => {
            setScrolled(false);
            setScrolledAnimated(false);
          },
        },
      })
      .to(heroRef.current, {
        clipPath: "polygon(20% 0, 75% 0, 90% 90%, -4% 100%)",
      })
      .to(heroRef.current, {
        clipPath: "polygon(20% 0, 75% 0, 85% 85%, -4% 75%)",
      });
  }, []);

  // Loader animation ---------------------------------------------------
  useEffect(() => {
    if (videoLoaded === totalVideos) {
      const threeDots = gsap.utils.toArray(".three-body__dot");
      setTimeout(() => {
        setIsLoading(false);
        videosRef.current[currentIndex].play();
      }, 5000);

      setTimeout(() => {
        gsap.to(threeDots, {
          duration: 1.5,
          opacity: 0,
        });
        gsap.to(threeDots, {
          delay: 1,
          animation: "",
        });
        gsap.to("#loader", {
          opacity: 0,
          duration: 1,
          display: "none",
          delay: 1.5,
          onComplete: () => {
            document.body.style.overflow = "";
          },
        });
      }, 6000);
    }
  }, [videoLoaded]);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div
        id="loader"
        className="flex flex-col items-center justify-center fixed h-dvh w-screen bg-bgColor z-[100000] overflow-hidden"
      >
        <div className="w-fit h-fit absolute top-36 left-0 pl-6 xl:pl-12 select-none pointer-events-none">
          <div className="px-6">
            <AnimatedSmallText
              text="welcome to my"
              containerViewed={isLoading}
            />
          </div>
          <AnimatedHeader
            text="ze<b>n</b>try clone website"
            containerViewed={isLoading}
          />
        </div>
        <div className="w-[23rem] h-fit text-center absolute bottom-14 right-0 pr-6 xl:pr-12 select-none pointer-events-none">
          <div className="px-6">
            <AnimatedSmallText
              text="it's a clone website from zentry.com an awward winning website"
              containerViewed={isLoading}
            />
          </div>
        </div>
        <div className="three-body">
          <div className="three-body__dot" />
          <div className="three-body__dot" />
          <div className="three-body__dot" />
        </div>
      </div>
      {/* NOTE: the container of all the videos. */}
      <div
        className="h-dvh w-screen absolute"
        onMouseMove={() => {
          if (scrolled) return;
          setMouseActiveTime(Date.now());
          setMouseActive(true);
        }}
        ref={heroRef}
      >
        <div className="w-fit absolute top-36 flex flex-col gap-8 pl-6 xl:pl-12 z-40 select-none pointer-events-none">
          <h1 className="hero-heading special-font">
            redefi<b>n</b>e
          </h1>
          <p className="paragraph text-textColor">
            Enter the Metagame
            <br />
            Unleash the Play Economy
          </p>
          <Button
            title={"watch trailer"}
            bgClass={"bg-accentColor"}
            containerClass={
              "w-52 h-12 text-sm lg:w-60 lg:h-14 lg:text-base tracking-widest "
            }
            LeftIcon={HeroArrow}
            scrolled={scrolled}
            arrowClass="z-30 animation "
          />
        </div>
        <div className="w-fit absolute bottom-14 right-0 pr-6 xl:pr-12 z-40 select-none pointer-events-none">
          <h1 className="hero-heading special-font">
            g<b>a</b>ming
          </h1>
        </div>
        {/* NOTE: An array of video frames */}
        {Array.from({ length: totalVideos }, (_, i) => (
          <div
            className={`h-full w-full absolute top-0 left-0 rouded-lg`}
            id={`video-frame-${i}`}
            key={i}
          >
            {/* NOTE: Div container that has svg for video mask and border */}
            <div
              id={`mask-container-${i}`}
              style={{
                width: "var(--container-full-size)",
                height: "var(--container-full-size)",
                borderRadius: "var(--container-rx)",
              }}
              className={`${scrolled ? "" : "cursor-pointer"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50`}
              onClick={handleMiniVidChange}
              onMouseEnter={() => {
                setMaskHover(true);
              }}
              onMouseLeave={() => {
                setMaskHover(false);
              }}
            >
              {/* NOTE: Div container that has svg for video mask and border */}
              <div
                id={`mask-border-${i}`}
                style={{
                  width: "calc(var(--full-size) - 2px + var(--full-screan-w))",
                  height: "calc(var(--full-size) - 2px + var(--full-screan-h))",
                  borderRadius: "calc(var(--rx) - 2px)",
                  transform: `translate(calc(var(--translate-w) - var(--half-size) + var(--mouse-x) - 50vw),calc(var(--translate-h) - var(--half-size) + var(--mouse-y) - 50vh)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))`,
                  transformBox: "border-box",
                  outlineWidth: "0px",
                }}
                className="outline outline-black absolute top-1/2 left-1/2 z-[60]"
              ></div>
              <svg
                viewBox="0 0 300 300"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute w-full h-full"
              >
                <mask id={`mask-${i}`} maskUnits="objectBoundingBox">
                  <rect
                    id={`mask-rect-${i}`}
                    rx="var(--rx)"
                    fill="white"
                    y={0}
                    x={0}
                    style={{
                      width: "calc(var(--full-size) + var(--full-screan-w))",
                      height: "calc(var(--full-size) + var(--full-screan-h))",
                      transform: `translate(calc(var(--translate-w) - var(--half-size) + var(--mouse-x)), calc(var(--translate-h) - var(--half-size) + var(--mouse-y))) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))`,
                      transformOrigin: "50% 50%",
                      transformBox: "border-box",
                    }}
                  />
                </mask>
              </svg>
            </div>
            <video
              id={`current-video-${i}`}
              style={{
                mask: `url(#mask-${i})`,
              }}
              src={getVideoUrl(i)}
              ref={(el) => (videosRef.current[i] = el!)}
              className={`absolute top-0 left-0 w-full h-full object-cover object-center origin-center`}
              muted
              loop
              onLoadedData={handleLoadedData}
            />
          </div>
        ))}
      </div>
      <div className="w-fit absolute bottom-14 right-0 pr-6 xl:pr-12 -z-10 select-none pointer-events-none">
        <h1 className="hero-heading special-font text-textColorInverted">
          g<b>a</b>ming
        </h1>
      </div>
      <audio
        ref={whooshRef}
        className="hidden"
        src="/audio/whoosh.mp3"
        loop
        muted={isMuted}
      />
    </div>
  );
}

export default Hero;

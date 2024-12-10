import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { useInterval } from "usehooks-ts";

function Hero() {
  // NOTE: The total number of videos

  // NOTE: States: ---------------------------------------------------

  // For mouse movement
  const [mouseActive, setMouseActive] = useState(false);
  const [mouseActiveTime, setMouseActiveTime] = useState(0);

  // Hover state for the `mask-container`
  const [maskHover, setMaskHover] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);

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

  // NOTE: Animations: ---------------------------------------------------

  // Timeline declarations: ---------------------------------------------------
  const timelineHoverRef = useRef<GSAPTimeline>();
  const timelineMouseActive = useRef<GSAPTimeline>();
  useGSAP(() => {
    timelineMouseActive.current = gsap.timeline();
    timelineHoverRef.current = gsap.timeline();
  });

  // When the `mask-container` is hovered ---------------------------------------------------
  useGSAP(
    () => {
      if (
        !timelineHoverRef.current ||
        !timelineMouseActive.current ||
        !animationLoaded
      )
        return;
      timelineMouseActive.current.clear();
      timelineHoverRef.current.clear();
      if (maskHover) {
        timelineHoverRef.current
          .to("#mask-rect, #mask-border", {
            duration: 0.5,
            ease: "none",
            "--full-size": "18rem",
            "--half-size": "9rem",
            "--rx": "0.4rem",
          })
          .to("#mask-rect, #mask-border", {
            duration: 0.7,
            ease: "power1.inOut",
            "--full-size": "19.5rem",
            "--half-size": "9.75rem",
            yoyo: true,
            repeat: -1,
          });
      } else {
        timelineHoverRef.current.to("#mask-rect, #mask-border", {
          overwrite: true,
          duration: 0.7,
          ease: "none",
          "--full-size": "18rem",
          "--half-size": "9rem",
          yoyo: false,
          repeat: 0,
        });
      }
    },
    { dependencies: [maskHover] },
  );

  // Parallax Effect for `mask-rect` & `mask-border` ---------------------------------------------------
  const heroRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!heroRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
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

      gsap.to("#mask-rect, #mask-border", {
        overwrite: "auto",
        duration: 0,
        ease: "none",
        "--mouse-x": mouseX,
        "--mouse-y": mouseY,
        "--rotate-x": `${-1 * parallaxX}deg`,
        "--rotate-y": `${parallaxY}deg`,
      });
    };
    heroRef.current.addEventListener("mousemove", handleMouseMove);

    return () => {
      heroRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  });

  // When the mouse is active/not active ---------------------------------------------------
  useGSAP(
    () => {
      if (!timelineMouseActive.current || maskHover || !animationLoaded) return;

      if (mouseActive) {
        const active = timelineMouseActive.current.isActive();
        timelineMouseActive.current.clear();
        if (active) {
          timelineMouseActive.current.to("#mask-rect, #mask-border", {
            duration: 1,
            ease: "none",
            "--full-size": "18rem",
            "--half-size": "9rem",
            "--rx": "0.4rem",
            outlineWidth: 2,
          });
        } else {
          timelineMouseActive.current
            .to("#mask-border", {
              overwrite: true,
              duration: 0,
              ease: "none",
              outlineWidth: 2,
            })
            .to("#mask-rect, #mask-border", {
              duration: 0,
              ease: "none",
              "--rx": "0.1rem",
            })
            .to("#mask-rect, #mask-border", {
              duration: 1,
              ease: "none",
              "--full-size": "18rem",
              "--half-size": "9rem",
              "--rx": "0.4rem",
            });
        }
      } else {
        timelineMouseActive.current.clear();
        timelineMouseActive.current
          .to("#mask-rect, #mask-border", {
            overwrite: true,
            duration: 1,
            ease: "power1.out",
            "--full-size": "6rem",
            "--half-size": "3rem",
            "--rx": "0.4rem",
            outlineWidth: 2,
          })
          .to(
            "#mask-rect, #mask-border",
            {
              duration: 1,
              ease: "none",
              "--full-size": "0rem",
              "--half-size": "0rem",
              "--rx": "0.1rem",
            },
            "-=0.2",
          )
          .to("#mask-rect, #mask-border", {
            duration: 0,
            ease: "none",
            outlineWidth: 0,
            "--rx": "0rem",
          });
      }
    },
    { dependencies: [mouseActive] },
  );

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      {/* NOTE: the container of all the videos. */}
      <div
        ref={heroRef}
        className="h-dvh w-screen absolute top-0 left-0"
        onMouseMove={() => {
          if (!animationLoaded) setAnimationLoaded(true);
          setMouseActiveTime(Date.now());
          setMouseActive(true);
        }}
      >
        {/* NOTE: An array of video frames */}
        <div
          className={`h-full w-full absolute top-0 left-0 rouded-lg`}
          id={`video-frame`}
        >
          {/* NOTE: Div container that has svg for video mask and border */}
          <div
            id="mask-container"
            style={{
              width: "var(--container-full-size)",
              height: "var(--container-full-size)",
              borderRadius: "var(--rx)",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
            onMouseEnter={() => {
              setMaskHover(true);
            }}
            onMouseLeave={() => {
              setMaskHover(false);
            }}
          >
            <div
              id="mask-border"
              style={{
                width: "calc(var(--full-size) - 2px)",
                height: "calc(var(--full-size) - 2px)",
                borderRadius: "calc(var(--rx) - 2px)",
                transform: `translate(calc(50% - var(--full-size) + 2px + var(--mouse-x)),calc(50% - var(--full-size) + 2px + var(--mouse-y))) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))`,
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
              <mask id="mask" maskUnits="objectBoundingBox">
                <rect
                  id="mask-rect"
                  rx="var(--rx)"
                  fill="white"
                  y={0}
                  x={0}
                  style={{
                    width: "var(--full-size)",
                    height: "var(--full-size)",
                    transform: `translate(calc(50vw - var(--half-size) + var(--mouse-x)), calc(50vh - var(--half-size) + var(--mouse-y))) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))`,
                    transformOrigin: "50% 50%",
                    transformBox: "border-box",
                  }}
                />
              </mask>
            </svg>
          </div>
          <video
            style={{
              mask: "url(#mask)",
            }}
            id="current-video"
            src="/videos/hero-1.mp4"
            className={`absolute top-0 left-0 w-full h-full object-cover object-center origin-center`}
            muted
            loop
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;

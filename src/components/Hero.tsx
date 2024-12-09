import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { useInterval } from "usehooks-ts";

function Hero() {
  // NOTE: The total number of videos

  // NOTE: State for mouse movement
  const [mouseActive, setMouseActive] = useState(false);
  const [mouseActiveTime, setMouseActiveTime] = useState(0);

  // NOTE: Hover state for the `mask-container`
  const [maskHover, setMaskHover] = useState(false);

  // NOTE: Every 500ms check if mouse is active more than the time now.
  // When the mouse is moving `mouseActive` is set to true, and `mouseActiveTime` is set to the current time
  // When `mouseActive` is false (not active), `useInterval` is cleared
  useInterval(
    () => {
      if (mouseActiveTime <= Date.now() - 300) {
        setMouseActive(false);
        return;
      }
      setMouseActive(true);
    },
    mouseActive ? 300 : null,
  );

  // NOTE: Animation when the `mask-container` is hovered ---------------------------------------------------
  useGSAP(
    () => {
      if (maskHover) {
        gsap.to("#mask-rect, #mask-border", {
          overwrite: true,
          duration: 0.7,
          ease: "power1.inOut",
          "--full-size": "22rem",
          "--half-size": "11rem",
          yoyo: true,
          repeat: -1,
        });
      } else {
        gsap.to("#mask-rect, #mask-border", {
          overwrite: true,
          duration: 0.5,
          ease: "none",
          "--full-size": "20rem",
          "--half-size": "10rem",
          yoyo: false,
          repeat: 0,
        });
      }
    },
    { dependencies: [maskHover] },
  );
  // NOTE: ---------------------------------------------------

  // NOTE: Parallax Effect for `mask-rect` & `mask-border` ---------------------------------------------------
  const heroRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!heroRef.current) return;

    heroRef.current.addEventListener("mousemove", (e) => {
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
    });
  });
  // NOTE: ---------------------------------------------------

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      {/* NOTE: the container of all the videos. */}
      <div
        ref={heroRef}
        className="h-dvh w-screen absolute top-0 left-0"
        onMouseMove={() => {
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
              }}
              className="border-[2px] border-black absolute top-1/2 left-1/2 z-[60]"
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

import { useState } from "react";
import { useInterval } from "usehooks-ts";

function Hero() {
  // NOTE: The total number of videos

  // NOTE: State for mouse movement
  const [mouseActive, setMouseActive] = useState(false);
  const [mouseActiveTime, setMouseActiveTime] = useState(0);

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

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      {/* NOTE: the container of all the videos. */}
      <div
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
            style={{
              width: "var(--container-full-size)",
              height: "var(--container-full-size)",
              borderRadius: "var(--rx)",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div
              id="mask-border"
              style={{
                width: "calc(var(--full-size) - 2px)",
                height: "calc(var(--full-size) - 2px)",
                borderRadius: "calc(var(--rx) - 2px)",
              }}
              className="outline outline-black outline-[2px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-[60]"
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
                    transform: `translate(calc(50vw - var(--half-size)), calc(50vh - var(--half-size)))`,
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

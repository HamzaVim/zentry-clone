import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";

function Hero() {
  // NOTE: The total number of videos
  const totalVideos = 4;

  // NOTE: States: ---------------------------------------------------

  // For mouse movement
  const [mouseActive, setMouseActive] = useState(false);
  const [mouseActiveTime, setMouseActiveTime] = useState(0);

  // Hover state for the `mask-container`
  const [maskHover, setMaskHover] = useState(false);

  // Stop all animation mouse isn't moving at the first place.
  const [animationLoaded, setAnimationLoaded] = useState(false);

  // When the mini video (mask) clicked all animation stops.
  const [miniVidChangeAnimation, setMiniVidChangeAnimation] = useState(false);

  // For how many videos are loaded
  const [videoLoaded, setVideoLoaded] = useState(0);

  // For the current video
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // NOTE: Animations: ---------------------------------------------------

  // Timeline declarations: ---------------------------------------------------
  const timelineHoverRef = useRef<GSAPTimeline>();
  const timelineMouseActiveRef = useRef<GSAPTimeline>();
  const timelineMiniVidChangeRef = useRef<GSAPTimeline>();
  useGSAP(() => {
    timelineMouseActiveRef.current = gsap.timeline();
    timelineHoverRef.current = gsap.timeline();
    timelineMiniVidChangeRef.current = gsap.timeline();
  });

  // When the `mask-container` is hovered ---------------------------------------------------
  // useGSAP(
  //   () => {
  //     if (
  //       !timelineHoverRef.current ||
  //       !timelineMouseActiveRef.current ||
  //       !animationLoaded ||
  //       !timelineMiniVidChangeRef.current
  //     )
  //       return;
  //     timelineMouseActiveRef.current.clear();
  //     timelineHoverRef.current.clear();
  //     timelineMiniVidChangeRef.current.clear();
  //
  //     if (maskHover) {
  //       timelineHoverRef.current
  //         .to("#mask-rect, #mask-border", {
  //           duration: 0.5,
  //           ease: "none",
  //           "--full-size": "18rem",
  //           "--half-size": "9rem",
  //           "--rx": "0.4rem",
  //         })
  //         .to("#mask-rect, #mask-border", {
  //           duration: 0.7,
  //           ease: "power1.inOut",
  //           "--full-size": "19.5rem",
  //           "--half-size": "9.75rem",
  //           yoyo: true,
  //           repeat: -1,
  //         });
  //     } else {
  //       timelineHoverRef.current.to("#mask-rect, #mask-border", {
  //         overwrite: true,
  //         duration: 0.7,
  //         ease: "none",
  //         "--full-size": "18rem",
  //         "--half-size": "9rem",
  //         yoyo: false,
  //         repeat: 0,
  //       });
  //     }
  //   },
  //   { dependencies: [maskHover] },
  // );

  // Parallax Effect for `mask-rect` & `mask-border` ---------------------------------------------------
  const heroRef = useRef<HTMLDivElement>(null);
  // const { contextSafe } = useGSAP();
  //
  // const handleMouseMove = useCallback(
  //   contextSafe((e: MouseEvent) => {
  //     // Get the mouse position
  //     const x = e.clientX;
  //     const y = e.clientY;
  //
  //     // Get the middle of the screen / object
  //     const middleX = window.innerWidth / 2;
  //     const middleY = window.innerHeight / 2;
  //
  //     // Get offset from middle
  //     const offsetX = x - middleX;
  //     const offsetY = y - middleY;
  //
  //     // For mouse movement
  //     const mouseX = offsetX * 0.2;
  //     const mouseY = offsetY * 0.2;
  //
  //     // For parallax effect
  //     const parallaxY = (offsetX / middleX) * 45;
  //     const parallaxX = (offsetY / middleY) * 45;
  //
  //     gsap.to("#mask-rect, #mask-border", {
  //       overwrite: "auto",
  //       duration: 0,
  //       ease: "none",
  //       "--mouse-x": mouseX,
  //       "--mouse-y": mouseY,
  //       "--rotate-x": `${-1 * parallaxX}deg`,
  //       "--rotate-y": `${parallaxY}deg`,
  //     });
  //   }),
  //   [],
  // );
  // useGSAP(
  //   () => {
  //     if (!heroRef.current) return;
  //
  //     if (!miniVidChangeAnimation) {
  //       heroRef.current.addEventListener("mousemove", handleMouseMove);
  //     } else {
  //       heroRef.current.removeEventListener("mousemove", handleMouseMove);
  //     }
  //
  //     return () => {
  //       heroRef.current?.removeEventListener("mousemove", handleMouseMove);
  //     };
  //   },
  //   { dependencies: [miniVidChangeAnimation] },
  // );

  // When the mouse is active/not active ---------------------------------------------------
  // useGSAP(
  //   () => {
  //     if (
  //       !timelineMouseActiveRef.current ||
  //       !timelineHoverRef.current ||
  //       maskHover ||
  //       !animationLoaded ||
  //       miniVidChangeAnimation
  //     )
  //       return;
  //
  //     timelineHoverRef.current.clear();
  //
  //     if (mouseActive) {
  //       const active = timelineMouseActiveRef.current.isActive();
  //       timelineMouseActiveRef.current.clear();
  //       if (active) {
  //         timelineMouseActiveRef.current.to("#mask-rect, #mask-border", {
  //           duration: 1,
  //           ease: "none",
  //           "--full-size": "18rem",
  //           "--half-size": "9rem",
  //           "--rx": "0.4rem",
  //           outlineWidth: 2,
  //         });
  //       } else {
  //         timelineMouseActiveRef.current
  //           .to("#mask-border", {
  //             overwrite: true,
  //             duration: 0,
  //             ease: "none",
  //             outlineWidth: 2,
  //           })
  //           .to("#mask-rect, #mask-border", {
  //             duration: 0,
  //             ease: "none",
  //             "--rx": "0.1rem",
  //           })
  //           .to("#mask-rect, #mask-border", {
  //             duration: 1,
  //             ease: "none",
  //             "--full-size": "18rem",
  //             "--half-size": "9rem",
  //             "--rx": "0.4rem",
  //           });
  //       }
  //     } else {
  //       timelineMouseActiveRef.current.clear();
  //       timelineMouseActiveRef.current
  //         .to("#mask-rect, #mask-border", {
  //           overwrite: true,
  //           duration: 1,
  //           ease: "power1.out",
  //           "--full-size": "6rem",
  //           "--half-size": "3rem",
  //           "--rx": "0.4rem",
  //           outlineWidth: 2,
  //         })
  //         .to(
  //           "#mask-rect, #mask-border",
  //           {
  //             duration: 1,
  //             ease: "none",
  //             "--full-size": "0rem",
  //             "--half-size": "0rem",
  //             "--rx": "0.1rem",
  //           },
  //           "-=0.2",
  //         )
  //         .to("#mask-rect, #mask-border", {
  //           duration: 0,
  //           ease: "none",
  //           outlineWidth: 0,
  //           "--rx": "0rem",
  //         });
  //     }
  //   },
  //   { dependencies: [mouseActive] },
  // );

  // Mini video when change it will increase the size of the mask to fill the screen ---------------------------------------------------
  // useGSAP(
  //   () => {
  //     if (
  //       !timelineHoverRef.current ||
  //       !timelineMouseActiveRef.current ||
  //       !animationLoaded ||
  //       !timelineMiniVidChangeRef.current
  //     )
  //       return;
  //     timelineMouseActiveRef.current.clear();
  //     timelineHoverRef.current.clear();
  //     timelineMiniVidChangeRef.current.clear();
  //
  //     if (miniVidChangeAnimation) {
  //       timelineMiniVidChangeRef.current
  //         .to("#mask-rect, #mask-border", {
  //           overwrite: true,
  //           duration: 0.2,
  //           ease: "power1.out",
  //           "--mouse-x": 0,
  //           "--mouse-y": 0,
  //           "--rotate-x": "0deg",
  //           "--rotate-y": "0deg",
  //           yoyo: false,
  //           repeat: 0,
  //         })
  //         .to("#mask-rect, #mask-border", {
  //           duration: 1,
  //           ease: "power1.out",
  //           "--full-screan-h": "101dvh",
  //           "--full-screan-w": "102vw",
  //           "--half-size": "0rem",
  //           "--full-size": "0rem",
  //           "--translate-w": "-1vw",
  //           "--translate-h": "-1vh",
  //         });
  //     }
  //   },
  //   { dependencies: [miniVidChangeAnimation] },
  // );

  // Video order ---------------------------------------------------
  useGSAP(
    () => {
      const nextCurrentIndex = getNextCurrentIndex();
      const prevCurrentIndex = getPrevCurrentIndex();
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
            delay: animationLoaded ? 1.2 : 0,
            zIndex: 0,
            display: "none",
          });
          gsap.to(`#video-frame-${prevCurrentIndex}`, {
            duration: 0,
            delay: animationLoaded ? 1.2 : 0,
            zIndex: 0,
            display: "none",
          });
        }
      });
    },
    { dependencies: [currentIndex] },
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
        {Array.from({ length: totalVideos }, (_, i) => (
          <div
            className={`h-full w-full absolute top-0 left-0 rouded-lg`}
            id={`video-frame-${i}`}
            key={i}
          >
            {/* NOTE: Div container that has svg for video mask and border */}
            <video
              id={`current-video-${i}`}
              src={getVideoUrl(i)}
              className={`absolute top-0 left-0 w-full h-full object-cover object-center origin-center`}
              muted
              loop
              onLoadedData={handleLoadedData}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;

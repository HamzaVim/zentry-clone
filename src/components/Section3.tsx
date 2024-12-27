import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Button from "./Button";
import CommingSoonArrow from "./svgs/CommingSoonArrow";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

const BentoCard = forwardRef<HTMLVideoElement, BentoCardProps>(
  ({ title, src, desc, buttonsTitle, position, setVideoLoaded }, ref) => {
    return (
      <div className="relative size-full">
        <video
          src={src}
          ref={ref}
          loop
          muted
          onLoadStart={() => {
            setVideoLoaded((prev) => prev + 1);
          }}
          className={`absolute top-0 right-0 h-full ${position === "center" && "w-full"} object-cover object-${position}`}
        />
        <div className="absolute top-7 left-7 z-10 flex flex-col items-start justify-center gap-4 pointer-events-none">
          <h1 className="text-7xl text-textColor font-bold font-zentry tracking-[0.015em] special-font">
            {title}
          </h1>
          <p className="text-textColor opacity-70 font-robert-medium font-bold leading-[1.2em]">
            {desc}
          </p>
        </div>
        <div className="absolute bottom-7 left-7 z-10 flex flex-row items-start justify-center gap-4">
          {buttonsTitle.map((item, index) => {
            if (item.match(/soon/i)) {
              return (
                <div key={index}>
                  <Button
                    title={item}
                    containerClass="text-textColor text-opacity-40  text-[0.8rem]  px-6 py-2.5"
                    LeftIcon={CommingSoonArrow}
                    arrowClass="w-5 h-3 mt-0.5 text-hsl"
                    comeingSoon
                  />
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <Button
                    title={item}
                    containerClass="!text-accentColor text-[0.8rem]  px-6 py-2.5"
                    bgClass="bg-black border border-accentColor border-opacity-70"
                    RightIcon={CommingSoonArrow}
                    arrowClass="w-5 h-3 mt-0.5 fill-accentColor animation"
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  },
);
function Section3() {
  // NOTE: States & Refs: ---------------------------------------------------

  // Ref for every bento card container
  const bentoCardContainerRef = useRef<HTMLDivElement[]>([]);

  // Ref for every bento card first child for animation
  const bentoCardAnimationRef = useRef<HTMLDivElement[]>([]);

  // Ref for every bento card video
  const videoRef = useRef<HTMLVideoElement[]>([]);

  // When the video is loaded, `videoLoaded` is incremented
  const [videoLoaded, setVideoLoaded] = useState(0);

  // NOTE: Functions: ---------------------------------------------------
  const { contextSafe } = useGSAP();
  gsap.registerPlugin(ScrollTrigger);

  // When the mouse enter the bento card
  const handleMouseEnter = useCallback(
    contextSafe((e: MouseEvent) => {
      bentoCardContainerRef.current.map((item, i) => {
        if (item === e.target) {
          videoRef.current[i].play();
          gsap.to(item.firstChild, {
            duration: 0.5,
            scale: 0.9,
          });
        }
      });
    }),
    [],
  );

  const handleMouseMove = useCallback(
    contextSafe((e: Event) => {
      const ev = e as MouseEvent;

      bentoCardContainerRef.current.map((item, i) => {
        if (item === e.target) {
          const rect = item.getBoundingClientRect();
          const x = ev.clientX - rect.left - rect.width / 2;
          const y = ev.clientY - rect.top - rect.height / 2;

          const parallaxY = x * -0.008;
          const parallaxX = y * 0.008;

          gsap.to(bentoCardAnimationRef.current[i], {
            duration: 1,
            rotateX: parallaxX,
            rotateY: parallaxY,
          });
        }
      });
    }),
    [],
  );

  // When the mouse leave the bento card
  const handleMouseLeave = useCallback(
    contextSafe((e: MouseEvent) => {
      bentoCardContainerRef.current.map((item, i) => {
        if (item === e.target) {
          videoRef.current[i].pause();
          videoRef.current[i].currentTime = 0;
          gsap.to(item.firstChild, {
            duration: 0.5,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
          });
        }
      });
    }),
    [],
  );

  // NOTE: Animation: ---------------------------------------------------

  // When the mouse enter or leave the bento card
  useEffect(() => {
    if (!bentoCardContainerRef.current[0] || !videoRef.current[0]) return;

    const bentoCardContainer = bentoCardContainerRef.current;

    const handleMouseEnterWithMove = (e: MouseEvent) => {
      if (!e.target) return;

      const eTarget = e.target as HTMLElement;

      const target = bentoCardAnimationRef.current.find(
        (item) => item === eTarget.firstElementChild,
      ) as HTMLDivElement;

      gsap.set(target, {
        duration: 0,
        transformOrigin: "center center",
      });

      handleMouseEnter(e);
      e.target.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseLeaveWithMove = (e: MouseEvent) => {
      if (!e.target) return;

      const eTarget = e.target as HTMLElement;

      const target = bentoCardAnimationRef.current.find(
        (item) => item === eTarget.firstElementChild,
      ) as HTMLDivElement;

      gsap.set(target, {
        overwrite: true,
        delay: 0.5,
        duration: 0,
        transformOrigin: "center top",
        rotateX: 0,
        rotateY: 0,
      });

      handleMouseLeave(e);
      e.target.removeEventListener("mousemove", handleMouseMove);
    };

    bentoCardContainer.forEach((item) => {
      item.addEventListener("mouseenter", handleMouseEnterWithMove);
      item.addEventListener("mouseleave", handleMouseLeaveWithMove);
    });
    return () => {
      bentoCardContainer.forEach((item) => {
        item.removeEventListener("mouseenter", handleMouseEnterWithMove);
        item.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove]);

  // When the user scrolls to every bento card.
  useGSAP(
    () => {
      if (
        !bentoCardContainerRef.current[0] ||
        !bentoCardAnimationRef.current[0]
      )
        return;

      // NOTE: When the video is loaded all scroll triggers are initialized because the DOM is updated and the size of the video is changed
      // Clear existing ScrollTriggers before reinitializing
      ScrollTrigger.getAll().forEach((trigger) => {
        bentoCardContainerRef.current.forEach((item) => {
          if (item === trigger.trigger) {
            trigger.kill();
          }
        });
      });
      // Refresh ScrollTrigger to measure updated DOM
      ScrollTrigger.refresh();

      gsap.set(bentoCardContainerRef.current, {
        perspective: 1000,
      });
      gsap.set(bentoCardAnimationRef.current, {
        rotateX: "-40deg",
        y: "200px",
        transformOrigin: "center top",
      });
      bentoCardAnimationRef.current.map(
        contextSafe((item, i) => {
          gsap.to(item, {
            scrollTrigger: {
              trigger: bentoCardContainerRef.current[i],
              start: "top 85%",
              end: "top 85%",
              toggleActions: "play none reverse none",
            },
            duration: 0.5,
            rotateX: "0deg",
            y: "0px",
          });
        }),
      );
    },
    { dependencies: [videoLoaded] },
  );

  return (
    <section className="min-h-screen w-screen overflow-hidden bg-black lg:px-48 px-24">
      <p className="w-full text-textColor font-robert-medium font-bold md:text-[1.35rem] md:leading-[1.2em] text-base py-44">
        Dive into the 'Game of Games' Universe
        <span className="block opacity-40">
          Immerse yourself in a rich and ever-expanding
          <br /> ecosystem where a vibrant array of products converge
          <br /> into an interconnected universe.
        </span>
      </p>
      <div
        ref={(el) => (bentoCardContainerRef.current[0] = el!)}
        className="h-96 md:h-[73vh] w-full rounded-lg"
      >
        <div
          ref={(el) => (bentoCardAnimationRef.current[0] = el!)}
          className="border border-hsl w-full h-full rounded-lg overflow-hidden pointer-events-none"
        >
          <BentoCard
            title={
              <>
                Radia<b>n</b>t
              </>
            }
            desc={
              <>
                A cross-platform metagame app,
                <br /> turning your activities across
                <br /> Web2 and Web3 games into a<br /> rewarding adventure.
              </>
            }
            ref={(el) => (videoRef.current[0] = el!)}
            src={"/videos/feature-1.mp4"}
            buttonsTitle={["comming soon"]}
            position="center"
            setVideoLoaded={setVideoLoaded}
          />
        </div>
      </div>
      <div className="h-[100vh] w-full rounded-lg grid xl:grid-cols-2 grid-cols-1 xl:grid-rows-2 grid-rows-3 gap-8 mt-8">
        <div
          className="xl:row-span-2"
          ref={(el) => (bentoCardContainerRef.current[1] = el!)}
        >
          <div
            ref={(el) => (bentoCardAnimationRef.current[1] = el!)}
            className="border border-hsl size-full rounded-lg overflow-hidden pointer-events-none"
          >
            <BentoCard
              title={
                <>
                  Zig<b>m</b>a
                </>
              }
              desc={
                <>
                  An anime and gaming-inspired
                  <br /> NFT collection - the IP primed for
                  <br /> expansion.
                </>
              }
              ref={(el) => (videoRef.current[1] = el!)}
              src={"/videos/feature-2.mp4"}
              buttonsTitle={["comming soon"]}
              position="center"
              setVideoLoaded={setVideoLoaded}
            />
          </div>
        </div>
        <div ref={(el) => (bentoCardContainerRef.current[2] = el!)}>
          <div
            ref={(el) => (bentoCardAnimationRef.current[2] = el!)}
            className="border border-hsl w-full h-full overflow-hidden rounded-lg pointer-events-none"
          >
            <BentoCard
              title={
                <>
                  N<b>e</b>xus
                </>
              }
              desc={
                <>
                  A gamified social hub, adding a<br /> new dimension of play to
                  your
                  <br /> identity, Web3 engagement and
                  <br /> social interaction
                </>
              }
              ref={(el) => (videoRef.current[2] = el!)}
              src={"/videos/feature-3.mp4"}
              buttonsTitle={["comming soon", "launch site"]}
              position="left"
              setVideoLoaded={setVideoLoaded}
            />
          </div>
        </div>
        <div ref={(el) => (bentoCardContainerRef.current[3] = el!)}>
          <div
            ref={(el) => (bentoCardAnimationRef.current[3] = el!)}
            className="border border-hsl w-full h-full overflow-hidden rounded-lg pointer-events-none"
          >
            <BentoCard
              title={
                <>
                  Az<b>u</b>l
                </>
              }
              desc={
                <>
                  A cross-world AI Agent - elevating
                  <br /> your gameplay to be more fun and
                  <br /> productive.
                </>
              }
              ref={(el) => (videoRef.current[3] = el!)}
              src={"/videos/feature-4.mp4"}
              buttonsTitle={["comming soon"]}
              position="right"
              setVideoLoaded={setVideoLoaded}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section3;

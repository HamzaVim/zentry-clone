import { useRef } from "react";
import Button from "./Button";
import CommingSoonArrow from "./svgs/CommingSoonArrow";

const BentoCard = ({
  title,
  src,
  desc,
  buttonsTitle,
  position,
}: BentoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        if (!videoRef.current) return;
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }}
      className="relative size-full"
    >
      <video
        src={src}
        ref={videoRef}
        loop
        muted
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
};
function Section3() {
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
      <div>
        <div className="border border-hsl h-96 md:h-[73vh] w-full overflow-hidden rounded-lg">
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
            src={"/videos/feature-1.mp4"}
            buttonsTitle={["comming soon"]}
            position="center"
          />
        </div>
      </div>
      <div className="h-[100vh] w-full overflow-hidden rounded-lg grid grid-cols-2 grid-rows-2 gap-8 mt-8">
        <div>
          <div className="border border-hsl row-span-2 overflow-hidden rounded-lg">
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
              src={"/videos/feature-2.mp4"}
              buttonsTitle={["comming soon"]}
              position="center"
            />
          </div>
        </div>
        <div>
          <div className="border border-hsl overflow-hidden rounded-lg">
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
              src={"/videos/feature-3.mp4"}
              buttonsTitle={["comming soon", "launch site"]}
              position="left"
            />
          </div>
          <div className="border border-hsl overflow-hidden rounded-lg">
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
              src={"/videos/feature-4.mp4"}
              buttonsTitle={["comming soon"]}
              position="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section3;

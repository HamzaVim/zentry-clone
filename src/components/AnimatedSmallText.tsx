import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

function AnimatedSmallText({
  text,
  containerViewed,
}: {
  text: string;
  containerViewed: boolean | null;
}) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const tl = useRef<GSAPTimeline>();

  useGSAP(() => {
    tl.current = gsap.timeline({
      defaults: {
        duration: 0,
      },
    });
  });

  useGSAP(
    () => {
      if (!pRef.current || !tl.current) return;

      tl.current.clear();

      if (containerViewed === null) {
        tl.current.set(".animation", {
          autoAlpha: 0,
        });
      } else if (containerViewed) {
        tl.current.from(".animation", {
          autoAlpha: 0,
        });
        tl.current.to(
          ".animation",
          {
            autoAlpha: 1,
            stagger: 0.2,
          },
          "<",
        );
      } else {
        tl.current.from(".animation", {
          autoAlpha: 1,
        });
        tl.current.to(
          ".animation",
          {
            autoAlpha: 0,
            stagger: 0.2,
          },
          "<",
        );
      }
    },
    {
      dependencies: [containerViewed],
      scope: pRef,
    },
  );
  return (
    <p ref={pRef} className="w-fit text-xs font-medium uppercase mb-10">
      {text.split(" ").map((word, i) => (
        <span key={i} className="animation">
          {word}
          {i === text.length - 1 ? "" : " "}
        </span>
      ))}
    </p>
  );
}

export default AnimatedSmallText;

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

function AnimatedHeader({
  text,
  containerViewed,
}: {
  text: string;
  containerViewed: boolean | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement[]>([]);
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
      if (!containerRef.current || !wordRef.current || !tl.current) return;
      tl.current.clear();
      if (containerViewed === null) {
        tl.current
          .set(containerRef.current.children.item(0), {
            rotateX: "-30deg",
            rotateY: "-50deg",
            x: "-20%",
            y: "40%",
          })
          .set(wordRef.current, { autoAlpha: 0 });
      } else if (containerViewed) {
        tl.current
          .set(containerRef.current.children.item(0), {
            overwrite: true,
            rotateX: "-30deg",
            rotateY: "-50deg",
            x: "-20%",
            y: "60%",
          })
          .to(
            containerRef.current.children.item(0),
            {
              rotateX: "0deg",
              rotateY: "0deg",
              x: "0%",
              y: "0%",
              duration: 0.2 * wordRef.current.length,
            },
            "<",
          )
          .set(
            wordRef.current,
            {
              overwrite: true,
              autoAlpha: 0,
            },
            "<",
          )
          .to(
            wordRef.current,
            {
              autoAlpha: 1,
              stagger: 0.2,
            },
            "<",
          );
      } else {
        tl.current
          .set(containerRef.current.children.item(0), {
            overwrite: true,
            rotateX: "0deg",
            rotateY: "0deg",
            x: "0%",
            y: "0%",
          })
          .to(
            containerRef.current.children.item(0),
            {
              rotateX: "-30deg",
              rotateY: "50deg",
              x: "20%",
              y: "60%",
              duration: 0.2 * wordRef.current.length,
            },
            "<",
          )
          .set(
            wordRef.current,
            {
              overwrite: true,
              autoAlpha: 1,
            },
            "<",
          )
          .to(
            wordRef.current,
            {
              autoAlpha: 0,
              stagger: 0.2,
            },
            "<",
          );
      }
    },
    { dependencies: [containerViewed], scope: containerRef },
  );
  return (
    <div ref={containerRef} style={{ perspective: "1000px" }}>
      <h2 className="sub-heading special-font text-black flex flex-col">
        {text.split("<br />").map((line, i) => (
          <span key={i}>
            {line.split(" ").map((word, j) => (
              <span
                key={j}
                ref={(el) =>
                  (wordRef.current[
                    i == 0 ? 0 + j : line.split(" ").length + j
                  ] = el!)
                }
                dangerouslySetInnerHTML={{
                  __html: word + (j === line.length - 1 ? "" : " "),
                }}
              />
            ))}
          </span>
        ))}
      </h2>
    </div>
  );
}

export default AnimatedHeader;

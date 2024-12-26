import { useLayoutEffect, useState } from "react";
import About from "./components/About";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Section3 from "./components/Section3";

function App() {
  // NOTE: States & Refs: ---------------------------------------------------

  // For the scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  // For the header
  const [showHeader, setShowHeader] = useState<HeaderState>("show");

  // NOTE: Functions: ---------------------------------------------------

  // When the user scrolls
  useLayoutEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setScrollPosition(0);
        setShowHeader("show");
      } else if (window.scrollY < scrollPosition) {
        setScrollPosition(window.scrollY);
        setShowHeader("float");
      } else {
        setScrollPosition(window.scrollY);
        setShowHeader("hide");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  return (
    <>
      <Header showHeader={showHeader} />
      <main>
        <Hero />
        <About />
        <Section3 />
        <div className="w-full h-screen bg-black text-textColor flex justify-center items-center">
          TO BE CONTINUED
        </div>
      </main>
    </>
  );
}

export default App;

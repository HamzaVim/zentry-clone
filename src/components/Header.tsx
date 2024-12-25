import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import DownArrow from "./svgs/DownArrow";

function Header({ showHeader }: { showHeader: "show" | "float" | "hide" }) {
  // NOTE: Constants: ---------------------------------------------------

  // Navigation items
  const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

  // NOTE: States & Refs: ---------------------------------------------------

  // Refs for the navigation items
  const navItemsRef = useRef<HTMLLIElement[]>([]);

  // State for the navigation items width
  const [navItemsWidth, setNavItemsWidth] = useState<number[]>([]);

  // State for the container 'nav' if it's hovered
  const [navHover, setNavHover] = useState(false);

  // State for the navigation item if it's hovered
  const [navItemHover, setNavItemHover] = useState<number | null>(null);

  // Ref for the item that is used for the animation
  const navItemSlectRef = useRef<HTMLLIElement>(null);

  // NOTE: Functions: ---------------------------------------------------

  // Get the width of the navigation items
  useEffect(() => {
    if (navItemsRef.current.length > 0) {
      setNavItemsWidth(navItemsRef.current.map((item) => item.offsetWidth));
    }
  }, []);

  // NOTE: Animation: ---------------------------------------------------

  return (
    <header
      id="header"
      className="py-5 rounded-xl border border-none text-textColor fixed left-6 right-6 z-[10000]"
    >
      <div className="flex justify-between items-center ">
        <div className="flex gap-7">
          <button>
            <img src="/img/logo.png" alt="logo" className="w-10 h-10 ml-6" />
          </button>
          <div className="flex gap-3">
            <Button
              title="Products"
              bgClass="bg-bgColor"
              containerClass="w-fit px-6 py-1 text-xs"
              RightIcon={DownArrow}
            />
            <Button
              title="Whitepaper"
              bgClass="bg-bgColor"
              containerClass="w-fit px-6 py-1 text-xs"
            />
          </div>
        </div>
        <nav
          className="relative"
          onMouseEnter={() => {
            setNavHover(true);
          }}
          onMouseLeave={() => {
            setNavHover(false);
          }}
        >
          <ul className="flex relative z-20">
            {navItems.map((item, index) => (
              <li
                key={item}
                ref={(el) => {
                  if (!el) return;
                  navItemsRef.current[index] = el;
                }}
                onMouseEnter={() => {
                  setNavItemHover(index);
                }}
                className="text-textColor text-sm z-[100]"
              >
                <a
                  className={`px-6 py-3 font-bold flex gap-1.5 items-center uppercase`}
                  href={`#${item}`}
                >
                  {item}
                  {index === 0 || index === 1 ? <TiLocationArrow /> : null}
                </a>
              </li>
            ))}
            {/*
            <li>
              <a href="#">Toggle sound</a>
            </li>
            */}
            <li
              ref={navItemSlectRef}
              className={`block absolute top-0 left-0 h-full bg-bgColor rounded-full`}
            />
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

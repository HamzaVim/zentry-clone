import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

function Header() {
  const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];
  const navItemsRef = useRef<HTMLLIElement[]>([]);
  const [navItemsWidth, setNavItemsWidth] = useState<number[]>([]);
  const [navHover, setNavHover] = useState(false);
  const [navItemHover, setNavItemHover] = useState(0);

  useEffect(() => {
    if (navItemsRef.current.length > 0) {
      setNavItemsWidth(navItemsRef.current.map((item) => item.offsetWidth));
      console.log(navItemsRef.current[0]);
    }
  }, []);
  return (
    <header className="h-28 bg-black text-textColor absolute top-4 left-6 right-6 flex justify-between items-center">
      <div className="flex gap-7">
        <div>logo</div>
        <div className="flex gap-10">
          <button>ProductsProducts</button>
          <button>Whitepaper</button>
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
              className={`px-[2.4rem] font-bold ${index === 0 || index === 1 ? "flex gap-1.5 items-center" : ""} ${index === navItemHover && navHover ? "text-black" : "text-textColor"}`}
            >
              {item}
              {index === 0 || index === 1 ? (
                <TiLocationArrow
                  className={`${index === navItemHover && navHover ? "text-black" : ""}`}
                />
              ) : (
                ""
              )}
            </li>
          ))}
          {/*
            <li>
              <a href="#">Toggle sound</a>
            </li>
            */}
        </ul>
        <a
          href={`#${navItems[navItemHover]}`}
          style={{
            width: `${navItemsWidth[navItemHover]}px`,
            transform: `${navHover ? `translateX(${navItemsWidth.slice(0, navItemHover).reduce((a, b) => a + b, 0)}px)` : ""}`,
            visibility: `${navHover ? "visible" : "hidden"}`,
          }}
          className={`absolute z-10 left-0 top-0 h-full bg-bgColor rounded-full transition-transform duration-300 ease-in-out`}
        />
      </nav>
    </header>
  );
}

export default Header;

/// <reference types="vite/client" />

interface CustomButtonProps {
  title: string;
  LeftIcon?: (props: { className?: string }) => JSX.Element;
  RightIcon?: (props: { className?: string }) => JSX.Element;
  bgClass?: string;
  containerClass: string;
  comeingSoon?: boolean;
  scrolled?: boolean;
  arrowClass: string;
}
type HeaderState = "show" | "float" | "hide";
interface BentoCardProps {
  title: JSX.Element;
  src: string;
  desc: JSX.Element;
  buttonsTitle: string[];
  position: string;
}

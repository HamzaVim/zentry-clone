/// <reference types="vite/client" />

interface CustomButtonProps {
  title: string;
  LeftIcon?: () => JSX.Element;
  RightIcon?: () => JSX.Element;
  bgClass: string;
  containerClass: string;
  comeingSoon?: boolean;
  scrolled?: boolean;
}
type HeaderState = "show" | "float" | "hide";

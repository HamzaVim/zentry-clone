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
  ref: (el: HTMLVideoElement) => void;
  setVideoLoaded: (value: React.SetStateAction<number>) => void;
}

type GlobalProviderProps = {
  children: React.ReactNode;
};

interface GlobalContextType {
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | null>>;
  musicActive: boolean | null;
  setMusicActive: React.Dispatch<React.SetStateAction<boolean | null>>;
  musicRuns: boolean;
  setMusicRuns: React.Dispatch<React.SetStateAction<boolean>>;
}

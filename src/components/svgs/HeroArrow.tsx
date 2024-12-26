const HeroArrow = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24" // Adjust width as needed
      height="24" // Adjust height as needed
      viewBox="0 0 20 20" // Adjust viewBox based on path's coordinate system
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.5 10.0013L2.5 18.3346L6.9697 10.0013L2.5 1.66797L17.5 10.0013Z"
        fill="currentColor" // Set fill color; replace "currentColor" with a specific color if needed
      ></path>
    </svg>
  );
};

export default HeroArrow;

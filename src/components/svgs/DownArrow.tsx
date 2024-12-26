function DownArrow({ className }: { className?: string }) {
  return (
    <svg
      width="14" // Adjust width as needed
      height="14" // Adjust height as needed
      viewBox="0 0 8 8" // Adjust viewBox based on path's coordinate system
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="m3.75,6.75L0,0l3.75,2.01L7.5,0l-3.75,6.75Z" fill="black"></path>
    </svg>
  );
}

export default DownArrow;

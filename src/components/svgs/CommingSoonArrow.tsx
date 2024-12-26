function CommingSoonArrow({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 11 7" // Adjust viewBox dimensions based on actual SVG size
      width="50" // Adjust width
      height="50" // Adjust height
      fill="rgba(223,223,242,.4)" // Default fill color, can be customized
      className={`z-10 ${className}`}
    >
      <path d="m10.07,0h.04c-1.35,2.09-2.69,4.18-4.03,6.27-.17-.91-.35-1.82-.53-2.73,0-.03-.02-.04-.04-.05-1.84,0-3.67,0-5.51,0,1.83-.64,3.66-1.27,5.49-1.9,1.53-.52,3.05-1.06,4.58-1.59Z" />
    </svg>
  );
}

export default CommingSoonArrow;

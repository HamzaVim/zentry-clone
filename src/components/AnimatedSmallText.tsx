function AnimatedSmallText({ text }: { text: string }) {
  return (
    <p className="w-fit text-xs font-medium uppercase mb-10">
      {text.split(" ").map((word, i) => (
        <span key={i} className="animation">
          {word}
          {i === text.length - 1 ? "" : " "}
        </span>
      ))}
    </p>
  );
}

export default AnimatedSmallText;

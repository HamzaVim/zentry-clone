function AnimatedHeader({ text }: { text: string }) {
  return (
    <h2 className="sub-heading special-font text-black flex flex-col">
      {text.split("<br />").map((line, i) => (
        <span key={i}>
          {line.split(" ").map((word, j) => (
            <span
              key={j}
              dangerouslySetInnerHTML={{
                __html: word + (j === line.length - 1 ? "" : " "),
              }}
            />
          ))}
        </span>
      ))}
    </h2>
  );
}

export default AnimatedHeader;

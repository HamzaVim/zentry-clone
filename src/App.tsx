import About from "./components/About";
import Hero from "./components/Hero";

function App() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <div className="w-full h-screen bg-black" />
      </main>
    </>
  );
}

export default App;

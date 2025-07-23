import "./index.css";
import RippleGrid from "./components/custom/ripple-grid";

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full -z-10">
        <RippleGrid />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
      </div>
    </div>
  );
}

export default App;

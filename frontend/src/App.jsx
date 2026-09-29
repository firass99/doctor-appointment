import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
//import "./App.css";
import TestPage from "./pages/test";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;

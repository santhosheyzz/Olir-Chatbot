import React, { useState } from "react";
import Routes from "./Routes";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) return <LoadingScreen onLoadingComplete={() => setLoading(false)} />;
  return <Routes />;
}

export default App;

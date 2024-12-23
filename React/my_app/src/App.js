import { useRoutes } from "react-router-dom";
import Router from "./routes/routes";

function App() {
  const routing = useRoutes(Router);

  return routing;
}

export default App;

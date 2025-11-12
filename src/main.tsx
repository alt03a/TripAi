import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./lib/serviceWorker";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA capabilities
if (import.meta.env.PROD) {
  registerServiceWorker().then((registration) => {
    if (registration) {
      console.log('[TripTuner] PWA ready with offline support');
    }
  });
}

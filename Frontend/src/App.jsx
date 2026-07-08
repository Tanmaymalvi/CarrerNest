import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AIAssistant from "./components/AIAssistant/AIAssistant";
import AppRoutes from "./routes/AppRoutes";
import { fetchCurrentUser } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className="page-shell min-h-screen text-slate-900 dark:text-slate-100">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <AIAssistant />
      <Toaster position="top-right" toastOptions={{ duration: 2800 }} />
    </div>
  );
}

export default App;

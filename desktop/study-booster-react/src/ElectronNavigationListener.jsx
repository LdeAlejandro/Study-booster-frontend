// ElectronNavigationListener.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ElectronNavigationListener() {
  const navigate = useNavigate();

  useEffect(() => {
    window.electron?.onNavigateTo((url) => {
      navigate(url);
    });
  }, [navigate]);

  return null; // do not redender anything visible
}

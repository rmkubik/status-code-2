import { useEffect } from "react";

const useGlobalClickOnce = (handler) => {
  useEffect(() => {
    const clickHandler = () => {
      handler();
      document.removeEventListener("click", clickHandler);
    };

    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  }, []);
};

export default useGlobalClickOnce;

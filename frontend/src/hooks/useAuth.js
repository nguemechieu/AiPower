import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider.js";


const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.username ? "Logged In" : "Logged Out"));
  return useContext(AuthContext);
};

export default useAuth;

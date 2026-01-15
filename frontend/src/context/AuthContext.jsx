import { createContext, useEffect, useState, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        setIsAuth(true);
      } catch (error) {
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);


  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    setIsAuth(true);
  };


  const signup = async (email, password, name, phoneNumber) => {
    const res = await api.post("/auth/signup", {
      email,
      password,
      name,
      phoneNumber,
    });
    setUser(res.data.user);
    setIsAuth(true);
  };


  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setIsAuth(false);
  };

  const updateUserProfile = async (data) => {
    const res = await api.patch("/auth/updateProfile", data);
    if (res.data.user) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuth, loading, login, logout, signup, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

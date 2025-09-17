// src/context/AuthUtils.js
import { useContext } from "react";
import { AuthContext } from "./AuthContextExport";

export const useAuth = () => useContext(AuthContext);

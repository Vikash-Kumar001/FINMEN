import { useAuth as useAuthContext } from "../context/AuthContext";

/**
 * Custom hook to access the authenticated user context.
 * Automatically throws an error if used outside AuthProvider.
 */
export const useAuth = () => {
  const context = useAuthContext();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

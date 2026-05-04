import { useAuthContext } from "../context/AuthContext";

export function useAuthUser() {
  return useAuthContext();
}

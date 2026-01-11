import { createContext, useContext } from "react";
import type { User } from "@prisma/client";

interface UserContextType {
  user: User | null;
  filesCount: number;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
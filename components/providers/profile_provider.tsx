"use client";

import { getProfile } from "@/services/user_services";
import { createClient } from "@/utils/supabase/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ProfileProviderProps {
  children: ReactNode;
}

interface ProfileContextType {
  isLoading: boolean;
  error: string | null;
  profile: Profile | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const supabase = createClient();
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: sessionUser, error: authError } =
          await supabase.auth.getUser();

        if (authError) {
          throw new Error(authError.message);
        }

        if (sessionUser) {
          const { data: profile } = await getProfile(
            supabase,
            sessionUser.user.id
          );

          setUser({
            ...sessionUser,
            ...profile,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, []);

  return (
    <ProfileContext.Provider value={{ profile: user, isLoading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within an AuthProvider");
  }
  return context;
};

export default ProfileProvider;

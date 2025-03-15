import { useEffect, createContext, ReactNode } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { checkAuth, signin, signout } from "../redux/slices/api/authSlice";
import { usePathname, useRouter } from "expo-router";
import { COLORS } from "@/costants/colors";

interface AuthContextProps {
  user: any | null;
  session: any | null;
  signin: (data: { email: string; password: string }) => void;
  signout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.user);
  const { session, loading } = useSelector((state: RootState) => state.auth);

  // ✅ Check authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // ✅ Redirect logic
  useEffect(() => {
    if (!loading) {
      if (!session) {
        if (pathname !== "/sign-up") {
          router.replace("/sign-in");
        }
      } else if (session) {
        // ✅ Only redirect if session contains a valid user

        router.replace("/(root)/(tabs)");
      }
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </SafeAreaView>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signin: (data: { email: string; password: string }) =>
          dispatch(signin(data)),
        signout: () => dispatch(signout()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

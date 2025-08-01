import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, refreshUserFromBackend } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [refreshingUser, setRefreshingUser] = useState(false);

  const params = new URLSearchParams(location.search);
  const cameFromOnboarding = params.get("onboardingComplete") === "true";

  // 👇 Handle onboarding redirection and refresh logic
  useEffect(() => {
    if (!loading && user) {
      if (cameFromOnboarding && !hasRefreshed) {
        setRefreshingUser(true);

        refreshUserFromBackend?.()
          .then(() => {
            console.log("User refreshed.");
          })
          .catch((err) => {
            console.error(" Failed to refresh user:", err);
          })
          .finally(() => {
            setHasRefreshed(true);
            setRefreshingUser(false);
          });

        return;
      }

      if (user.isOnboarded && location.pathname === "/onboarding") {
        console.log("Already onboarded, redirecting to dashboard...");
        navigate("/dashboard", { replace: true });
        return;
      }

      if (!user.isOnboarded && location.pathname !== "/onboarding") {
        const redirectParams = new URLSearchParams({
          userId: user.id,
          from: "quizapp",
          redirect: `${window.location.origin}/dashboard?onboardingComplete=true`,
        });

        const onboardingURL = `${import.meta.env.VITE_ONBAORDING_APP_URL}/?${redirectParams.toString()}`;
        window.location.href = onboardingURL;
        return;
      }
    }
  }, [user, loading, location.pathname, hasRefreshed, cameFromOnboarding, navigate]);

  if (loading || refreshingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 👇 Block rendering until refreshed, if came from onboarding
  if (cameFromOnboarding && !hasRefreshed) {
    return null;
  }

  // 👇 Still not onboarded, redirect will already be handled above
  if (!user.isOnboarded && location.pathname !== "/onboarding") {
    return null;
  }

  return <>{children}</>;
}

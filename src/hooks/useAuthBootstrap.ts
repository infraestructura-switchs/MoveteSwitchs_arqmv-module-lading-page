import { useEffect, useMemo, useState } from "react";
import {
  storeUrlParams,
  getStoredUrlParam,
  getAllStoredParams,
} from "../utils/urlParams";

export type TemplateLandingType = "EcommerceLanding" | "RestaurantLanding";

export function useAuthBootstrap() {
  const initialUrlParams = useMemo(() => getAllStoredParams(), []);
  const [urlParams, setUrlParams] = useState<Record<string, string>>(initialUrlParams);

  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [companyId, setCompanyId] = useState<number | null>(null);

  const templateLanding: TemplateLandingType =
    urlParams.templateLanding === "EcommerceLanding"
      ? "EcommerceLanding"
      : "RestaurantLanding";

  useEffect(() => {
    setUrlParams(initialUrlParams);
    storeUrlParams(initialUrlParams);
  }, [initialUrlParams]);

  useEffect(() => {
    const freshParams = getAllStoredParams();
    const token = freshParams.token ?? getStoredUrlParam("token") ?? "";
    const externalCompanyIdParam =
      freshParams.externalCompanyId ?? getStoredUrlParam("externalCompanyId") ?? "";

    if (!token) {
      setHasToken(false);
      setIsAuthResolved(true);
      return;
    }

    const parsedCompanyId = Number(externalCompanyIdParam);
    if (!Number.isFinite(parsedCompanyId) || parsedCompanyId <= 0) {
      setHasToken(false);
      setIsAuthResolved(true);
      return;
    }

    setAuthToken(token);
    setCompanyId(parsedCompanyId);
    setHasToken(true);
    setIsAuthResolved(true);
  }, []);

  return {
    initialUrlParams,
    templateLanding,
    hasToken,
    authToken,
    companyId,
    isAuthResolved,
  };
}

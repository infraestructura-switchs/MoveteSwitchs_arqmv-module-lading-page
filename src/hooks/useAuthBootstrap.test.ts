import { renderHook, waitFor } from "@testing-library/react";
import { useAuthBootstrap } from "./useAuthBootstrap";
import * as urlParams from "../utils/urlParams";

vi.mock("../utils/urlParams", () => ({
  storeUrlParams: vi.fn(),
  getStoredUrlParam: vi.fn(),
  getAllStoredParams: vi.fn(),
}));

describe("useAuthBootstrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("resolves auth and template when url params include valid token and externalCompanyId", async () => {
    vi.mocked(urlParams.getAllStoredParams).mockReturnValue({
      token: "abc-123",
      externalCompanyId: "77",
      templateLanding: "EcommerceLanding",
      productNameCompany: "Demo",
    });
    vi.mocked(urlParams.getStoredUrlParam).mockReturnValue(null);

    const { result } = renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(result.current.isAuthResolved).toBe(true);
    });

    expect(result.current.hasToken).toBe(true);
    expect(result.current.authToken).toBe("abc-123");
    expect(result.current.companyId).toBe(77);
    expect(result.current.templateLanding).toBe("EcommerceLanding");
    expect(urlParams.storeUrlParams).toHaveBeenCalledWith(
      expect.objectContaining({ token: "abc-123", externalCompanyId: "77" })
    );
  });

  test("marks auth resolved without token", async () => {
    vi.mocked(urlParams.getAllStoredParams).mockReturnValue({
      templateLanding: "RestaurantLanding",
    });
    vi.mocked(urlParams.getStoredUrlParam).mockReturnValue(null);

    const { result } = renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(result.current.isAuthResolved).toBe(true);
    });

    expect(result.current.hasToken).toBe(false);
    expect(result.current.authToken).toBe("");
    expect(result.current.companyId).toBeNull();
    expect(result.current.templateLanding).toBe("RestaurantLanding");
  });

  test("marks auth resolved without token when externalCompanyId is invalid", async () => {
    vi.mocked(urlParams.getAllStoredParams).mockReturnValue({
      token: "abc-123",
      externalCompanyId: "0",
    });
    vi.mocked(urlParams.getStoredUrlParam).mockReturnValue(null);

    const { result } = renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(result.current.isAuthResolved).toBe(true);
    });

    expect(result.current.hasToken).toBe(false);
    expect(result.current.companyId).toBeNull();
  });
});

import axios from "axios";
import { getCategoriesByExternalCompany } from "./categoriesApi";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("categoriesApi.getCategoriesByExternalCompany", () => {
  test("calls endpoint and maps category names from object payload", async () => {
    const getMock = vi.mocked(axios.get);
    getMock.mockResolvedValueOnce({
      data: {
        categories: [
          { categoryName: "HAMBURGUESAS" },
          { name: "Bebidas" },
          { category: "Postres" },
        ],
      },
    });

    const categories = await getCategoriesByExternalCompany(101, "token-1");

    expect(getMock).toHaveBeenCalledWith(
      expect.stringContaining("/categories/external-company/101"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-1",
        }),
      })
    );

    expect(categories).toEqual(["HAMBURGUESAS", "Bebidas", "Postres"]);
  });

  test("accepts plain array payload and deduplicates values case-insensitively", async () => {
    const getMock = vi.mocked(axios.get);
    getMock.mockResolvedValueOnce({
      data: ["Combos", "combos", "  COMBOS  ", { categoryName: "Bebidas" }],
    });

    const categories = await getCategoriesByExternalCompany(55);

    expect(getMock).toHaveBeenCalledWith(
      expect.stringContaining("/categories/external-company/55"),
      undefined
    );

    expect(categories).toEqual(["Combos", "Bebidas"]);
  });
});

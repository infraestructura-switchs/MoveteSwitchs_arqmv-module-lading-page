import axios from "axios";
import { getProductsByCompanyPaged } from "./productsApi";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
  isAxiosError: vi.fn(() => false),
}));

describe("productsApi.getProductsByCompanyPaged", () => {
  test("maps paged backend response into items and pagination metadata", async () => {
    const getMock = vi.mocked(axios.get);
    getMock.mockResolvedValueOnce({
      data: {
        content: [
          {
            id: 10,
            name: "Hamburguesa",
            price: 19000,
            category: "HAMBURGUESAS",
            comments: [],
          },
        ],
        number: 0,
        size: 5,
        totalPages: 3,
        totalElements: 13,
      },
    });

    const result = await getProductsByCompanyPaged({
      token: "test-token",
      externalCompanyId: 42,
      page: 0,
      size: 5,
      orders: "ASC",
      sortBy: "productId",
      category: "HAMBURGUESAS",
      name: "hamb",
    });

    expect(getMock).toHaveBeenCalledWith(
      expect.stringContaining("/product/getProductByCompany/42/paged"),
      expect.objectContaining({
        params: {
          page: 0,
          size: 5,
          orders: "ASC",
          sortBy: "productId",
          category: "HAMBURGUESAS",
          name: "hamb",
        },
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );

    expect(result).toEqual({
      items: [
        expect.objectContaining({
          id: 10,
          productName: "Hamburguesa",
          price: 19000,
          category: "HAMBURGUESAS",
        }),
      ],
      page: 0,
      size: 5,
      totalPages: 3,
      totalElements: 13,
    });
  });

  test("falls back to requested paging values when metadata is missing", async () => {
    const getMock = vi.mocked(axios.get);
    getMock.mockResolvedValueOnce({
      data: {
        content: [],
      },
    });

    const result = await getProductsByCompanyPaged({
      token: "test-token",
      externalCompanyId: 42,
      page: 2,
      size: 10,
    });

    expect(result).toEqual({
      items: [],
      page: 2,
      size: 10,
      totalPages: 0,
      totalElements: 0,
    });
  });
});

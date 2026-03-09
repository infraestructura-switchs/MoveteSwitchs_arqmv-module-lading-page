import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ProductDetail } from "../ProductDetail";
import { ProductType } from "../../types/productsType";

describe("ProductDetail component", () => {
  const product: ProductType = {
    id: 1,
    productName: "Test product",
    price: 1000,
    category: "test",
    image: "https://example.com/image.png",
    description: "Some description",
    stock: 5,
  };

  it("renders basic info and calls onBack after animation", () => {
    vi.useFakeTimers();
    const onBack = vi.fn();
    const onAddToCart = vi.fn();

    render(
      <ProductDetail
        product={product}
        onBack={onBack}
        onAddToCart={onAddToCart}
      />
    );

    expect(screen.getByText("Test product")).toBeInTheDocument();
    expect(screen.getByText("Some description")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/volver/i));
    // not called immediately because of animation delay
    expect(onBack).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(onBack).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
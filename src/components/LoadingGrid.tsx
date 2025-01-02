import ProductComponent from "./ProductComponent";
import { SimpleProduct } from "../lib/shopify";

interface LoadingGridProps {
  count?: number;
}

const emptyProduct: SimpleProduct = {
  id: "",
  title: "",
  handle: "",
  variantId: "",
  price: 0,
  vendor: "Ada Studios",
  availableForSale: true,
  quantityAvailable: 0,
  tags: [],
  media: { edges: [] },
};

export function LoadingGrid({ count = 4 }: LoadingGridProps) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <ProductComponent
          key={index}
          product={emptyProduct}
          isLoading={true}
        />
      ))}
    </>
  );
}

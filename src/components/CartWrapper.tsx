// components/CartWrapper.tsx
"use client";

import { useCart } from "./CartProvider";
import Cart from "./Cart";

export default function CartWrapper() {
  const { isCartOpen, closeCart } = useCart();

  return (
    <>
      {isCartOpen && <div onClick={closeCart}></div>}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}

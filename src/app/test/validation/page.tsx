import React from "react";

import { Dish } from "@/lib/zod";

export default async function DishPage() {
  const data = { name: "塩けんぴ", price: 300 };

  const response = await fetch(
    "/test/validation/dishes?amount=たくさん&price=20000&quality=まずい"
  );
  const response = await fetch("/test/validation/dishes/1234alshfak");

  const resBody: Dish[] = await response.json();

  return (
    <div>
      <p></p>
    </div>
  );
}

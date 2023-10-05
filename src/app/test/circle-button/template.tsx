"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CircleButton } from "@/components/buttons/CircleButton";
import { SelectionStack } from "@/components/widgets/SelectionStack";

import { selections, SelectionType } from "./constants";

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<SelectionType>();

  useEffect(() => {
    /** ex. [["quantity", "low"], ["price", "medium"], ["taste", "medium"]] */
    const currentParams = Array.from(searchParams.entries());

    currentParams.map((param) => {
      const key = param[0]; // ex. quantity, price, taste
      const value = param[1]; // ex. low, medium, high
      /** ex. selections[quantity].find(item => item.value === "low") */
      const target = selections[key as keyof typeof selections].find(
        (item) => item.value === value
      );
      setSelected((prev) => ({ ...prev, [key as keyof typeof selections]: target }));
    });
  }, [pathname, searchParams]);

  return (
    <>
      {children}
      {/* selection stack */}
      <SelectionStack>
        {/* quantity */}
        {selected?.quantity && (
          <CircleButton
            title={selected.quantity.title}
            value={selected.quantity.value}
            position="relative"
            gradient={selected.quantity.gradient}
            animation={{ delay: 0, stiffness: 200, damping: 20 }}
            onClick={() =>
              router.push(
                `quantity?${new URLSearchParams(Array.from(searchParams.entries())).toString()}`
              )
            }
          />
        )}
        {/* price */}
        {selected?.price && (
          <CircleButton
            title={selected.price.title}
            value={selected.price.value}
            position="relative"
            gradient={selected.price.gradient}
            animation={{ delay: 0.1, stiffness: 200, damping: 20 }}
            onClick={() =>
              router.push(
                `price?${new URLSearchParams(Array.from(searchParams.entries())).toString()}`
              )
            }
          />
        )}
        {/* taste */}
        {selected?.taste && (
          <CircleButton
            title={selected.taste.title}
            value={selected.taste.value}
            position="relative"
            gradient={selected.taste.gradient}
            animation={{ delay: 0.2, stiffness: 200, damping: 20 }}
            onClick={() =>
              router.push(
                `taste?${new URLSearchParams(Array.from(searchParams.entries())).toString()}`
              )
            }
          />
        )}
      </SelectionStack>
    </>
  );
}
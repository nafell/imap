import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";

export const _TestValidationSchema = z.object({
  name: z.string().min(1).max(100),
  createdAt: z.coerce.date(),
});

export type _TestValidationType = z.infer<typeof _TestValidationSchema>;

export async function GET(request: Request) {
  const data = await prisma.dish.findMany({
    where: {
      amount: "多い",
      price: { lte: 700 },
    },
  });

  if (data.length <= 5) {
    return NextResponse.json(data);
  }

  return NextResponse.json(data);
}

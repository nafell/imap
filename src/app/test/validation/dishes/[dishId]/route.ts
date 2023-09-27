import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { dishId: string } }) {
  //auth
  //validation

  //const body = await request.json();
  const id = params.dishId;

  const data = await prisma.dish.findUnique({
    where: {
      id: id,
    },
  });

  if (!data) {
    return Response.error();
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {}

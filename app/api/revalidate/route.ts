import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

function isAuthorized(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;

  const header = request.headers.get("x-revalidate-secret");
  const query = request.nextUrl.searchParams.get("secret");
  return header === secret || query === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: { tags?: string[]; paths?: string[] } = {};
  try {
    body = (await request.json()) as { tags?: string[]; paths?: string[] };
  } catch {
    body = {};
  }

  const tags = body.tags?.length
    ? body.tags
    : ["products", "collections"];
  const paths = body.paths ?? [];

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: { tags, paths },
    now: Date.now(),
  });
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("products", "max");
  revalidateTag("collections", "max");
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    revalidated: { tags: ["products", "collections"], paths: ["/"] },
    now: Date.now(),
  });
}

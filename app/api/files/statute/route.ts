import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) return new NextResponse("No database configured", { status: 404 });
  const settings = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!settings) return new NextResponse("Not found", { status: 404 });

  if (settings.statutePdfBytes) {
    return new NextResponse(settings.statutePdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${settings.statutePdfName || "statuti-shoqata-rainca.pdf"}"`
      }
    });
  }

  if (settings.statutePdfUrl) {
    return NextResponse.redirect(settings.statutePdfUrl);
  }

  return new NextResponse("No PDF", { status: 404 });
}

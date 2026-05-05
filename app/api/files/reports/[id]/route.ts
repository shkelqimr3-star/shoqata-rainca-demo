import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.DATABASE_URL) return new NextResponse("No database configured", { status: 404 });
  const { id } = await params;
  const report = await prisma.financialReport.findUnique({ where: { id } });
  if (!report) return new NextResponse("Not found", { status: 404 });

  if (report.pdfBytes) {
    return new NextResponse(report.pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${report.pdfName || `report-${report.year}.pdf`}"`
      }
    });
  }

  if (report.pdfUrl) {
    return NextResponse.redirect(report.pdfUrl);
  }

  return new NextResponse("No PDF", { status: 404 });
}

import { NextRequest, NextResponse } from "next/server";
import { dbStore, ReservationItem } from "@/lib/db";
import { sendReservationConfirmationEmail } from "@/lib/email/resend-service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const { status, occasion, specialRequests, reservationDate, reservationTime } = body;

    const existing = dbStore.getReservations().find((r) => r.id === resolvedParams.id);
    if (!existing) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    const updated = dbStore.updateReservation(resolvedParams.id, {
      ...(status && { status }),
      ...(occasion !== undefined && { occasion }),
      ...(specialRequests !== undefined && { specialRequests }),
      ...(reservationDate && { reservationDate }),
      ...(reservationTime && { reservationTime }),
    });

    if (status === "Confirmed" && existing.status !== "Confirmed") {
      const table = dbStore.getTables().find((t) => t.id === existing.tableId);
      await sendReservationConfirmationEmail({
        reservation: updated || existing,
        tableName: table?.tableNumber || "VIP Assigned Table",
      });
    }

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const success = dbStore.deleteReservation(resolvedParams.id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
  }
}

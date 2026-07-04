import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/db";
import { sendReservationConfirmationEmail } from "@/lib/email/resend-service";

export async function POST(req: NextRequest) {
  try {
    const { reservationId, razorpayPaymentId, razorpayOrderId, paymentMethod = "UPI" } = await req.json();

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const reservation = dbStore.getReservations().find((r) => r.id === reservationId);
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Update reservation status to Confirmed
    const updatedRes = dbStore.updateReservation(reservationId, {
      status: "Confirmed",
    });

    // Update payment record
    const payment = dbStore.getPayments().find((p) => p.reservationId === reservationId);
    if (payment) {
      payment.status = "Paid";
      payment.paymentId = razorpayPaymentId || `pay_RzpSim_${Date.now()}`;
      payment.orderId = razorpayOrderId || payment.orderId;
      payment.paymentMethod = paymentMethod;
      payment.transactionDate = new Date().toISOString();
    }

    const table = dbStore.getTables().find((t) => t.id === reservation.tableId);

    // Dispatch confirmation email
    await sendReservationConfirmationEmail({
      reservation: updatedRes || reservation,
      tableName: table?.tableNumber || "Assigned Table",
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      reservation: updatedRes,
      payment,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}

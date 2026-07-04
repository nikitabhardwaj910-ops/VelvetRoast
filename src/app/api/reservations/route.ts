import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore, ReservationItem, PaymentItem } from "@/lib/db";
import { assignBestTable } from "@/lib/reservations/availability";
import { sendReservationConfirmationEmail } from "@/lib/email/resend-service";

const reservationSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  guests: z.number().int().min(1).max(10),
  seatingType: z.enum(["Indoor", "Outdoor"]).default("Indoor"),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  occasion: z.string().optional().nullable(),
  specialRequests: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const cfg = dbStore.getConfig();

    // Assign table automatically based on exact capacity matching and availability
    const assignedTable = assignBestTable(data.reservationDate, data.reservationTime, data.guests, data.seatingType);

    if (!assignedTable) {
      return NextResponse.json(
        { error: "No tables available for the selected date and time slot matching your party size." },
        { status: 409 }
      );
    }

    // Calculate deposit
    let depositAmount = 0;
    if (cfg.depositType === "FIXED_PER_TABLE") {
      depositAmount = cfg.fixedDepositAmount;
    } else if (cfg.depositType === "PER_GUEST") {
      depositAmount = cfg.perGuestDepositAmount * data.guests;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const resId = `res-${Date.now()}`;
    const reservationNumber = `VR-${randomNum}`;

    const newRes: ReservationItem = {
      id: resId,
      reservationNumber,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      seatingType: data.seatingType,
      tableId: assignedTable.id,
      reservationDate: data.reservationDate,
      reservationTime: data.reservationTime,
      duration: 90,
      occasion: data.occasion || null,
      specialRequests: data.specialRequests || null,
      status: depositAmount > 0 ? "PendingPayment" : "Confirmed",
      depositAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.addReservation(newRes);

    // Create pending payment if deposit > 0
    let payment: PaymentItem | null = null;
    if (depositAmount > 0) {
      const gstAmount = Math.round(depositAmount * (cfg.gstRate / 100));
      const totalAmount = depositAmount + gstAmount;

      payment = {
        id: `pay-${Date.now()}`,
        reservationId: resId,
        paymentId: null,
        orderId: `order_Rzp${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        amount: totalAmount,
        currency: "INR",
        paymentMethod: null,
        gateway: "Razorpay",
        status: "Pending",
        transactionDate: null,
        refundAmount: 0,
      };
      dbStore.addPayment(payment);
    } else {
      // If no deposit required, send confirmation email right away
      await sendReservationConfirmationEmail({
        reservation: newRes,
        tableName: assignedTable.tableNumber,
      });
    }

    return NextResponse.json({
      success: true,
      reservation: newRes,
      table: assignedTable,
      payment,
    });
  } catch (error) {
    console.error("Reservation creation error:", error);
    return NextResponse.json(
      { error: "Failed to process reservation request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const reservations = dbStore.getReservations();
    const tables = dbStore.getTables();
    const config = dbStore.getConfig();
    const payments = dbStore.getPayments();

    return NextResponse.json({
      reservations,
      tables,
      config,
      payments,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve administrative reservation data" },
      { status: 500 }
    );
  }
}

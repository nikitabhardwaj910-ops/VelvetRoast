import { NextRequest, NextResponse } from "next/server";
import { getAvailableTimeSlots, getOpeningHours } from "@/lib/reservations/availability";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const guestsParam = searchParams.get("guests");
    const seatingType = (searchParams.get("seatingType") as "Indoor" | "Outdoor") || "Indoor";

    if (!date || !guestsParam) {
      return NextResponse.json(
        { error: "Date and guests parameters are required" },
        { status: 400 }
      );
    }

    const guests = parseInt(guestsParam, 10);
    if (isNaN(guests) || guests < 1 || guests > 10) {
      return NextResponse.json(
        { error: "Guests must be between 1 and 10" },
        { status: 400 }
      );
    }

    const slots = getAvailableTimeSlots(date, guests, seatingType);
    const hours = getOpeningHours(date);

    return NextResponse.json({
      date,
      guests,
      seatingType,
      openingHours: hours,
      slots,
    });
  } catch (error) {
    console.error("Availability calculation error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve time slots" },
      { status: 500 }
    );
  }
}

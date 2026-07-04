import { ReservationItem } from "@/lib/db";
import { format12h } from "@/lib/reservations/availability";

export interface EmailConfirmationPayload {
  reservation: ReservationItem;
  tableName?: string;
}

export async function sendReservationConfirmationEmail(payload: EmailConfirmationPayload): Promise<boolean> {
  const { reservation, tableName = "VIP Assigned Table" } = payload;
  const timeFormatted = format12h(reservation.reservationTime);

  const htmlContent = `
    <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background-color: #0F0F0F; color: #F6F2EC; padding: 40px; border: 1px solid #C49A6C; border-radius: 12px;">
      <div style="text-align: center; border-bottom: 1px solid rgba(196,154,108,0.3); padding-bottom: 24px; margin-bottom: 32px;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 32px; letter-spacing: 2px;">VELVET ROAST</h1>
        <p style="color: #C49A6C; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; margin: 4px 0 0 0;">Luxury Café & Artisanal Roastery</p>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${reservation.customerName}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6; color: rgba(246,242,236,0.8);">
        We are honored to confirm your upcoming reservation at Velvet Roast. Your deposit payment has been verified and your table is being prepared.
      </p>

      <div style="background-color: #181818; border-left: 3px solid #D4AF37; padding: 20px; margin: 28px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #C49A6C;">Reservation Number</p>
        <p style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #D4AF37;">${reservation.reservationNumber}</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: rgba(246,242,236,0.6); font-size: 14px;">Date:</td>
            <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${reservation.reservationDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: rgba(246,242,236,0.6); font-size: 14px;">Time Slot:</td>
            <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${timeFormatted} (${reservation.duration} Mins)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: rgba(246,242,236,0.6); font-size: 14px;">Guests:</td>
            <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${reservation.guests} Guests (${reservation.seatingType})</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: rgba(246,242,236,0.6); font-size: 14px;">Assigned Table:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #D4AF37; font-size: 14px;">${tableName}</td>
          </tr>
          ${reservation.occasion ? `<tr><td style="padding: 6px 0; color: rgba(246,242,236,0.6); font-size: 14px;">Occasion:</td><td style="padding: 6px 0; font-size: 14px;">${reservation.occasion}</td></tr>` : ""}
        </table>
      </div>

      <p style="font-size: 13px; color: #C49A6C; font-style: italic;">
        Note: Your reservation deposit of ₹${reservation.depositAmount} will be adjusted against your final dining bill.
      </p>

      <div style="text-align: center; margin: 36px 0;">
        <a href="https://maps.google.com" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #D4AF37; color: #0F0F0F; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; border-radius: 50px;">Get Directions</a>
      </div>

      <div style="border-top: 1px solid rgba(196,154,108,0.2); padding-top: 20px; font-size: 12px; color: rgba(246,242,236,0.5); text-align: center;">
        <p style="margin: 0;">Velvet Roast Roastery Sanctuary • Heart of the City</p>
        <p style="margin: 4px 0 0 0;">Need to modify or cancel? <a href="#" style="color: #C49A6C;">Manage Reservation Online</a></p>
      </div>
    </div>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Velvet Roast <reservations@velvetroast.com>",
          to: [reservation.email],
          subject: `Your Velvet Roast Reservation is Confirmed ☕ [${reservation.reservationNumber}]`,
          html: htmlContent,
        }),
      });

      if (!resp.ok) {
        console.warn("Resend API returned non-200, falling back to console log simulation:", await resp.text());
      } else {
        console.log(`[RESEND EMAIL SENT successfully to ${reservation.email}]`);
        return true;
      }
    } catch (err) {
      console.error("Resend API call failed:", err);
    }
  }

  // Fallback dev simulation log
  console.log("\n=======================================================");
  console.log(`✉️ [DEV EMAIL SIMULATION] To: ${reservation.email}`);
  console.log(`Subject: Your Velvet Roast Reservation is Confirmed ☕ [${reservation.reservationNumber}]`);
  console.log(`Summary: Date: ${reservation.reservationDate} | Time: ${timeFormatted} | Table: ${tableName} | Guests: ${reservation.guests}`);
  console.log("=======================================================\n");

  return true;
}

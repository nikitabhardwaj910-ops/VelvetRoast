import { ReservationItem } from "@/lib/db";
import { timeToMinutes } from "@/lib/reservations/availability";

export const generateIcsContent = (reservation: ReservationItem, tableName: string = "Assigned Table"): string => {
  const [year, month, day] = reservation.reservationDate.split("-").map(Number);
  const [startHour, startMin] = reservation.reservationTime.split(":").map(Number);

  const startDate = new Date(Date.UTC(year, month - 1, day, startHour, startMin));
  const endMinutes = timeToMinutes(reservation.reservationTime) + reservation.duration;
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;
  const endDate = new Date(Date.UTC(year, month - 1, day, endHour, endMin));

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Velvet Roast//Artisanal Reservation//EN",
    "BEGIN:VEVENT",
    `UID:${reservation.reservationNumber}-${Date.now()}@velvetroast.com`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:Velvet Roast Dining Reservation [${reservation.reservationNumber}]`,
    `DESCRIPTION:Table Reservation at Velvet Roast for ${reservation.guests} Guests.\\nTable: ${tableName}\\nOccasion: ${reservation.occasion || "General Dining"}\\nSpecial Requests: ${reservation.specialRequests || "None"}`,
    "LOCATION:Velvet Roast Roastery Sanctuary, Heart of the City",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

import { dbStore, TableItem, ReservationItem } from "@/lib/db";

// Parse HH:MM to minutes from midnight
export const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
};

// Convert minutes to HH:MM (24h)
export const minutesToTime = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

// Format 24h HH:MM to 12h AM/PM
export const format12h = (time24: string): string => {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
};

export interface TimeSlotAvailability {
  time: string; // 24h HH:MM
  time12: string; // 12h AM/PM
  available: boolean;
  tableId?: string;
  tableName?: string;
}

// Check opening hours for given day of week (0=Sun, 1=Mon...6=Sat)
export const getOpeningHours = (dateStr: string): { open: number; close: number } => {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 is Sunday, 6 is Saturday
  if (day === 0) {
    // Sunday: 8 AM - 9 PM
    return { open: 8 * 60, close: 21 * 60 };
  } else if (day === 6) {
    // Saturday: 8 AM - 11 PM
    return { open: 8 * 60, close: 23 * 60 };
  } else {
    // Mon-Fri: 9 AM - 10 PM
    return { open: 9 * 60, close: 22 * 60 };
  }
};

// Check if two time intervals overlap (including 15 min buffer)
export const isOverlapping = (
  startA: number,
  durationA: number,
  startB: number,
  durationB: number
): boolean => {
  const endA = startA + durationA + 15; // include 15 min cleaning buffer
  const endB = startB + durationB + 15;
  return Math.max(startA, startB) < Math.min(endA, endB);
};

// Get available time slots for a specific date, guests count, and seating preference
export const getAvailableTimeSlots = (
  dateStr: string,
  guests: number,
  seatingType: "Indoor" | "Outdoor" = "Indoor"
): TimeSlotAvailability[] => {
  const { open, close } = getOpeningHours(dateStr);
  const diningDuration = 90; // 90 min reservation
  const lastStart = close - diningDuration;

  const allTables = dbStore.getTables().filter(
    (t) => t.status === "Available" && t.capacity >= guests && (seatingType ? t.location === seatingType : true)
  );

  // Sort tables ascending by capacity so smallest suitable table is preferred
  allTables.sort((a, b) => a.capacity - b.capacity);

  const existingRes = dbStore.getReservations().filter(
    (r) =>
      r.reservationDate === dateStr &&
      ["Confirmed", "PendingPayment", "Completed"].includes(r.status)
  );

  // Also check if slot is in the past for today
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: TimeSlotAvailability[] = [];

  for (let mins = open; mins <= lastStart; mins += 30) {
    const timeStr = minutesToTime(mins);

    // If booking for today and slot is in the past (plus 30m grace), unavailable
    if (dateStr === todayStr && mins <= currentMinutes + 15) {
      slots.push({
        time: timeStr,
        time12: format12h(timeStr),
        available: false,
      });
      continue;
    }

    // Find the first table that has no overlapping reservations at this time
    let assignedTable: TableItem | undefined = undefined;

    for (const table of allTables) {
      const tableReservations = existingRes.filter((r) => r.tableId === table.id);
      const hasConflict = tableReservations.some((r) =>
        isOverlapping(mins, diningDuration, timeToMinutes(r.reservationTime), r.duration)
      );

      if (!hasConflict) {
        assignedTable = table;
        break;
      }
    }

    slots.push({
      time: timeStr,
      time12: format12h(timeStr),
      available: !!assignedTable,
      tableId: assignedTable?.id,
      tableName: assignedTable?.tableNumber,
    });
  }

  return slots;
};

// Automatic table assignment function when finalizing a booking
export const assignBestTable = (
  dateStr: string,
  timeStr: string,
  guests: number,
  seatingType: "Indoor" | "Outdoor" = "Indoor"
): TableItem | null => {
  const mins = timeToMinutes(timeStr);
  const diningDuration = 90;

  const allTables = dbStore.getTables().filter(
    (t) => t.status === "Available" && t.capacity >= guests && (seatingType ? t.location === seatingType : true)
  );

  allTables.sort((a, b) => a.capacity - b.capacity);

  const existingRes = dbStore.getReservations().filter(
    (r) =>
      r.reservationDate === dateStr &&
      ["Confirmed", "PendingPayment", "Completed"].includes(r.status)
  );

  for (const table of allTables) {
    const tableReservations = existingRes.filter((r) => r.tableId === table.id);
    const hasConflict = tableReservations.some((r) =>
      isOverlapping(mins, diningDuration, timeToMinutes(r.reservationTime), r.duration)
    );

    if (!hasConflict) {
      return table;
    }
  }

  return null;
};

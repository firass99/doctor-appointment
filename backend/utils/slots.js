import Appointment from "../models/appointment.js";

export const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const toTime = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

// day must be a Date at midnight UTC
export const getFreeSlots = async (profile, day) => {
  const isDayOff = profile.daysOff.some((d) => d.getTime() === day.getTime());
  if (isDayOff) return [];

  const hours = profile.workingHours.find((w) => w.day === day.getUTCDay());
  if (!hours) return [];

  const step = profile.slotDuration;
  const start = toMinutes(hours.start);
  const end = toMinutes(hours.end);
  const hasBreak = hours.breakStart && hours.breakEnd;
  const bStart = hasBreak ? toMinutes(hours.breakStart) : null;
  const bEnd = hasBreak ? toMinutes(hours.breakEnd) : null;

  // 1. all possible slots, skipping the break
  const all = [];
  for (let t = start; t + step <= end; t += step) {
    const overlapsBreak = hasBreak && t < bEnd && t + step > bStart;
    if (!overlapsBreak) {
      all.push({ startTime: toTime(t), endTime: toTime(t + step) });
    }
  }

  // 2. remove the ones already booked
  const booked = await Appointment.find({
    doctor: profile.user,
    date: day,
    status: { $ne: "CANCELLED" },
  }).select("startTime endTime");

  return all.filter(
    (slot) =>
      !booked.some(
        (b) => b.startTime < slot.endTime && b.endTime > slot.startTime,
      ),
  );
};

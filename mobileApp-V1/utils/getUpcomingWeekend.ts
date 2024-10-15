import moment from "moment";

export const getUpcomingWeekend = () => {
  const today = moment();
  const dayOfWeek = today.day(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const nextFriday = today.clone().day(5); // Next Friday
  const nextSunday = today.clone().day(7); // Next Sunday

  // If today is Friday, keep it as checkInDate
  const checkInDate =
    dayOfWeek === 5
      ? today.format("YYYY-MM-DD")
      : nextFriday.format("YYYY-MM-DD");
  const checkOutDate =
    dayOfWeek === 6
      ? nextSunday.add(1, "day").format("YYYY-MM-DD")
      : nextSunday.format("YYYY-MM-DD");

  return { checkInDate, checkOutDate };
};

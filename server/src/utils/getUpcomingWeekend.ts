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

// export const getUpcomingWeekend = () => {
//   const today = new Date();
//   const dayOfWeek = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

//   const daysUntilFriday = 5 - dayOfWeek;
//   const daysUntilSunday = 7 - dayOfWeek;

//   const friday = new Date(today);
//   friday.setDate(today.getDate() + daysUntilFriday);

//   const sunday = new Date(today);
//   sunday.setDate(today.getDate() + daysUntilSunday);

//   // const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
//   const checkInDate = friday.toLocaleDateString("fr-FR");
//   const checkOutDate = sunday.toLocaleDateString("fr-FR");

//   return { checkInDate, checkOutDate };
// };

// const getUpcomingWeekendDates = () => {
//   const today = new Date();
//   const dayOfWeek = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

//   const daysUntilFriday = 5 - dayOfWeek;
//   const daysUntilSunday = 7 - dayOfWeek;

//   const friday = new Date(today);
//   friday.setDate(today.getDate() + daysUntilFriday);

//   const sunday = new Date(today);
//   sunday.setDate(today.getDate() + daysUntilSunday);

//   const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
//   const checkInDate = friday.toLocaleDateString("fr-FR", options);
//   const checkOutDate = sunday.toLocaleDateString("fr-FR", options);

//   return { checkInDate, checkOutDate };
// };

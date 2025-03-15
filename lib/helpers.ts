import { format, differenceInMinutes, parseISO } from "date-fns";
import { FormattedTimeData } from "./types";

export const formatTripTime = (
  start_date_time: string,
  end_date_time: string
): FormattedTimeData => {
  const startDate = parseISO(start_date_time);
  const endDate = parseISO(end_date_time);

  // Format time as 6:50 AM
  const formattedStartTime = format(startDate, "h:mm a");
  const formattedEndTime = format(endDate, "h:mm a");

  // Format date as 22 Feb, 2025
  const formattedStartDate = format(startDate, "dd MMM, yyyy");
  const formattedEndDate = format(endDate, "dd MMM, yyyy");

  // Calculate duration in minutes
  const totalMinutes = differenceInMinutes(endDate, startDate);
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;

  const duration =
    totalMinutes >= 0
      ? hours > 0
        ? `${hours}hr${hours > 1 ? "s" : ""} ${minutes}m`
        : `${minutes}m`
      : "Invalid Time Range";

  return {
    formattedStartTime,
    formattedStartDate,
    formattedEndTime,
    formattedEndDate,
    duration,
  };
};

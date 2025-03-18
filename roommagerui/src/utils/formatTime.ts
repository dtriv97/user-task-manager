export const formatTime = (
  dateString: string | null | undefined,
  onlyDay: boolean = false
): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (onlyDay) {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Pacific/Auckland",
  });
};

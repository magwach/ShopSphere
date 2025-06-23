export function getTimeOfDayGreeting() {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 15) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

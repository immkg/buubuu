const KEY = "completedDays";

export function getCompletedDays() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function markDayCompleted(dayIndex) {
  const completed = getCompletedDays();
  if (!completed.includes(dayIndex)) {
    completed.push(dayIndex);
    localStorage.setItem(KEY, JSON.stringify(completed));
  }
}

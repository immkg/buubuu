export function getTodayValentineIndex() {
    const today = new Date();
    const start = new Date(today.getFullYear(), 1, 7); // Feb 7
  
    const diff = Math.floor(
      (today.setHours(0,0,0,0) - start.setHours(0,0,0,0)) /
      (1000 * 60 * 60 * 24)
    );
  
    // Clamp between 0 and 6
    return Math.max(0, Math.min(diff, 7));
  }
  
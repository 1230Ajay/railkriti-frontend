export const isTimePassed = (time: number | null, minutes: number): boolean => {
    if (!time || isNaN(time)) {
      return true;
    }
    const givenTime = new Date(time);
    const currentTime = new Date();
    const timeDiff = (currentTime.getTime() - givenTime.getTime()) / 60000; // Convert ms to minutes
    return timeDiff >= minutes;
  };
  
export enum Times {
  MILLISECOND = 1,
  SECOND = 1000 * Times.MILLISECOND,
  MINUTE = 60 * Times.SECOND,
  HOUR = 60 * Times.MINUTE,
  DAY = 24 * Times.HOUR,
  WEEK = 7 * Times.DAY
}

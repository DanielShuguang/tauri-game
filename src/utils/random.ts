/**
 * 生成指定范围内的随机整数
 * @param max
 * @param min
 */
export function randomInteger(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min) + min)
}

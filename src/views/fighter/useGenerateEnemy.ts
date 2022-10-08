import { D3Dom, Vector2d } from '@/types/d3'
import { Times } from '@/utils/const'
import { randomInteger } from '@/utils/random'
import { onUnmounted, Ref, ref, unref, watch } from 'vue'
import { Enemy, EnemyType } from './enemy'

export function useGenerateEnemy(
  isRunning: Ref<boolean>,
  parent: Ref<D3Dom<SVGSVGElement> | null>,
  range: Ref<[Vector2d, Vector2d]>
) {
  const enemies = ref<Enemy[]>([])
  const enemyCount = ref(0)
  const timer = ref<NodeJS.Timeout | null>(null)

  function generateEnemy(position?: Vector2d) {
    if (!parent.value) return

    enemyCount.value += 1
    timer.value && clearTimeout(timer.value)
    if (!position) {
      const r = unref(range)
      position = {
        x: randomInteger(r[1].x - 50, r[0].x + 50),
        y: randomInteger(r[1].y / 2, r[0].y)
      }
    }

    let type: EnemyType = 'normal'
    if (enemyCount.value >= 5) {
      if (enemyCount.value % 10 === 0) {
        type = 'giant'
      } else if (enemyCount.value % 5 === 0) {
        type = 'advanced'
      }
    }
    const offset = type === 'giant' ? 30 : type === 'advanced' ? 20 : 15
    enemies.value.push(
      new Enemy(parent.value, position, type, { x: offset, y: offset })
    )
    timer.value = setTimeout(() => {
      generateEnemy()
    }, 5 * Times.SECOND)
  }

  watch(isRunning, () => {
    if (isRunning.value) {
      generateEnemy()
    } else {
      timer.value && clearTimeout(timer.value)
    }
  })

  watch(range, () => {
    Enemy.moveRange = unref(range)
  })

  onUnmounted(() => {
    enemies.value.forEach(el => el.destroy())
    enemies.value.length = 0
    timer.value && clearTimeout(timer.value)
  })

  return { enemies, generateEnemy }
}

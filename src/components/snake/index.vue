<script lang="ts" setup>
import { Direction } from '@/types/base'
import { D3Dom } from '@/types/d3'
import { Times } from '@/utils/const'
import { useEventListener } from '@vueuse/core'
import * as d3 from 'd3'
import { cloneDeep } from 'lodash-es'
import { onMounted, ref, shallowRef } from 'vue'
import { SvgInstance } from '../fighter/d3-instance'

const root = shallowRef<D3Dom<HTMLDivElement> | null>(null)
const svg = shallowRef<D3Dom<SVGSVGElement> | null>(null)
const map = shallowRef<SvgInstance<'rect'>[]>([])
const missions = shallowRef<Map<string, () => void>>(new Map())
const maxSize = ref({ width: 0, height: 0 })
const direction = ref<Direction>('right')
const mapSteps = ref({ x: 0, y: 0 })
// 坐标偏转距离
const deflection = ref({ x: 0, y: 0 })
const snakesBody = shallowRef<SvgInstance<'circle'>[]>([])
const intervalTime = ref(Times.SECOND * 1)
const isHighSpeed = ref(false)
const operations = ['w', 'a', 's', 'd', ' ']
const step = 50

function initGame() {
  root.value = d3.select('.snake')
  svg.value = root.value.append('svg').style('background', '#f0f0f0')
  const width = parseInt(svg.value.style('width')) || 0
  const height = parseInt(svg.value.style('height')) || 0
  maxSize.value = { width, height }

  initMap()
  initSnakeBody()
  operationWatcher()
}

/**
 * 初始化地图
 */
function initMap() {
  if (!svg.value) return

  const { width, height } = maxSize.value
  const xCount = Math.floor(width / step)
  const yCount = Math.floor(height / step)
  const remainingWidth = width - xCount * step
  const remainingHeight = height - yCount * step
  deflection.value = { x: remainingWidth / 2, y: remainingHeight / 2 }
  let count = 0
  mapSteps.value = { x: xCount, y: yCount }
  for (let i = 0; i < yCount; i++) {
    count++
    for (let j = 0; j < xCount; j++) {
      const shouldAdd = count % 2 === 0 ? j % 2 === 0 : j % 2 !== 0
      if (shouldAdd) {
        const mapIns = new SvgInstance('rect', svg.value, {
          x: j * step + deflection.value.x,
          y: i * step + deflection.value.y
        })
        mapIns.setAttrs({ width: step, height: step, fill: '#bfbfbf' })
        map.value.push(mapIns)
      }
    }
  }
}

/**
 * 初始化蛇身
 */
function initSnakeBody() {
  if (!svg.value) return

  const { x: offsetX, y: offsetY } = deflection.value
  for (let i = 0; i < 3; i++) {
    const body = new SvgInstance('circle', svg.value, {
      x: 25 + offsetX + step * i,
      y: 25 + offsetY
    })
    body.setAttrs({ r: 20, fill: 'red' })
    snakesBody.value.unshift(body)
  }
  bodyMovement()
}

/**
 * 蛇身运动
 */
function bodyMovement() {
  missions.value.set('snake-running', () => {
    const len = snakesBody.value.length
    const maxX = mapSteps.value.x * step + deflection.value.x
    const maxY = mapSteps.value.y * step + deflection.value.y
    let lastPos = { x: 0, y: 0 }
    for (let i = 0; i < len; i++) {
      const snake = snakesBody.value[i]
      snake.originalFn(el => {
        el.style('transition', `all ${intervalTime.value / Times.SECOND}s ease`)
      })
      let pos = { x: 0, y: 0 }
      if (i === 0) {
        switch (direction.value) {
          case 'right':
            pos.x = step
            break
          case 'left':
            pos.x = -step
            break
          case 'up':
            pos.y = -step
            break
          case 'down':
            pos.y = step
            break
          default:
            break
        }
        const nextX = pos.x + snake.currentPosition.x
        const nextY = pos.y + snake.currentPosition.y
        if (nextX > maxX || nextX < deflection.value.x) {
          break
        }
        if (nextY > maxY || nextY < deflection.value.y) {
          break
        }
      } else {
        pos = cloneDeep({
          x: lastPos.x - snake.currentPosition.x,
          y: lastPos.y - snake.currentPosition.y
        })
      }
      lastPos = cloneDeep(snake.currentPosition)
      snake.moving(pos)
    }
  })
}

/**
 * 键盘操作监听
 */
function operationWatcher() {
  useEventListener('keydown', ev => {
    if (!operations.includes(ev.key)) {
      return
    }
    if (ev.key === ' ' && !isHighSpeed.value) {
      // 按住空格键加速运动
      isHighSpeed.value = true
      intervalTime.value /= 5
    } else {
      const directionMap: Record<string, Direction | undefined> = {
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right'
      }
      const direct = directionMap[ev.key]
      direct && (direction.value = direct)
    }
  })
  useEventListener('keyup', ev => {
    if (ev.key === ' ') {
      // 松开空格回到原速
      isHighSpeed.value = false
      intervalTime.value *= 5
    }
  })
}

/**
 * 游戏执行
 */
function running() {
  missions.value.forEach(fn => fn())
  setTimeout(running, intervalTime.value)
}

onMounted(() => {
  initGame()
  setTimeout(running, intervalTime.value)
})
</script>

<template>
  <div class="snake"></div>
</template>

<style scoped lang="scss">
.snake {
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  :deep() svg {
    width: 100%;
    height: 100%;
  }
}
</style>

<script lang="ts" setup>
import { D3Dom, Vector2d } from '@/types/d3'
import { fpsKey } from '@/types/uniqueKeys'
import { Times } from '@/utils/const'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import * as d3 from 'd3'
import { throttle } from 'lodash-es'
import { inject, onMounted, ref, watch, computed } from 'vue'
import { Bullet } from './bullet'
import { SvgInstance } from './d3-instance'
import { useFrameRender } from './useFrameRender'
import { useGenerateEnemy } from './useGenerateEnemy'

let root: D3Dom<HTMLDivElement> | null = null
let svg = ref<D3Dom<SVGSVGElement> | null>(null)
let fighterGroup: SvgInstance<'g'> | null = null
let fighter: SvgInstance<'path'> | null = null
const operations = ['w', 'a', 's', 'd']

const maxSize = ref({ width: 0, height: 0 })
const step = ref(0)
const isRunning = ref(false)

const { changeRenderStatus, pushMission, removeMission } = useFrameRender()
const fps = inject(fpsKey, ref(0))
useResizeObserver(
  document.body,
  () => {
    if (!svg.value) return
    const width = parseInt(svg.value.style('width')) || 0
    const height = parseInt(svg.value.style('height')) || 0
    maxSize.value = { width, height }
  },
  { box: 'border-box' }
)
const { enemies } = useGenerateEnemy(
  isRunning,
  svg,
  computed(() => [
    { x: 0, y: 0 },
    { x: maxSize.value.width, y: maxSize.value.height }
  ])
)
pushMission(
  throttle(() => {
    enemies.value.forEach(el => el.autoMove())
  }, 20)
)
useEventListener('keydown', ev => {
  if (!operations.includes(ev.key) || !fighterGroup) {
    return
  }
  const newPosition: Vector2d = { x: 0, y: 0 }
  switch (ev.key) {
    case 'w':
      newPosition.y = -step.value
      break
    case 's':
      newPosition.y = step.value
      break
    case 'a':
      newPosition.x = -step.value
      break
    case 'd':
      newPosition.x = step.value
      break
    default:
      return
  }
  pushMission(() => {
    if (!fighterGroup) return
    const { width, height } = maxSize.value
    const maxX = width - 30
    const maxY = height - 30
    const nextX = newPosition.x + fighterGroup.currentPosition.x
    const nextY = newPosition.y + fighterGroup.currentPosition.y
    if (nextX < 0 || nextX > maxX || nextY < 0 || nextY > maxY) {
      return
    }
    fighterGroup.moving(newPosition)
  }, ev.key)
})
useEventListener('keyup', ev => {
  if (!operations.includes(ev.key)) {
    return
  }
  removeMission(ev.key)
})

function initGame() {
  root = d3.select('.flighter')
  svg.value = root.append('svg').style('background', '#f0f0f0')
  const width = parseInt(svg.value.style('width')) || 0
  const height = parseInt(svg.value.style('height')) || 0
  maxSize.value = { width, height }
  fighterGroup = new SvgInstance('g', svg.value, {
    x: width / 2,
    y: height - 40
  })
  fighter = new SvgInstance('path', fighterGroup)
}

function initPlayer() {
  const p = d3.path()
  p.moveTo(15, 0)
  p.lineTo(30, 30)
  p.lineTo(0, 30)
  p.closePath()
  fighter?.setAttrs({
    d: p.toString(),
    fill: 'skyblue',
    stroke: '#000',
    'stroke-width': 1
  })

  generateBulletForFighter()
}

function generateBulletForFighter() {
  if (!fighterGroup || !svg.value) return
  const position = fighterGroup.currentPosition
  const bullet = new Bullet(
    svg.value,
    { x: position.x + 13, y: position.y - 10 },
    { x: 0, y: -(step.value || 10) * 1.5 }
  )
  pushMission(() => {
    bullet.shootting()
    if (bullet.currentPosition.y <= 0) {
      removeMission(bullet.bulletUniqueKey)
      bullet.destroy()
    }
  }, bullet.bulletUniqueKey)

  if (!isRunning.value) return

  setTimeout(() => {
    generateBulletForFighter()
  }, 200)
}

watch(fps, throttle(setStepByFps, Times.SECOND * 1))

function setStepByFps() {
  if (!fps.value) return

  if (fps.value >= 300) {
    step.value = 0.5
  } else if (fps.value >= 200) {
    step.value = 1
  } else if (fps.value >= 120) {
    step.value = 3
  } else {
    step.value = 5
  }
}

onMounted(() => {
  isRunning.value = true
  initGame()
  initPlayer()
  changeRenderStatus(true)
})
</script>

<template>
  <div class="flighter"></div>
</template>

<style scoped lang="scss">
.flighter {
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  :deep() svg {
    width: 100%;
    height: 100%;
  }

  :deep() * {
    box-sizing: border-box;
  }
}
</style>

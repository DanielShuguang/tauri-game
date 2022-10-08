import { generateUUID } from '@/utils/uuid'
import { ref, watch } from 'vue'

export function useFrameRender() {
  const missions = ref(new Map<string | symbol, () => void>())
  const onceMissions = ref(new Map<string | symbol, () => void>())
  const frameRef = ref<number | null>(null)
  const isRender = ref(false)

  function pushMission(fn: () => void, key?: string | symbol) {
    const mapKey = key || generateUUID()
    missions.value.set(mapKey, fn)
    return mapKey
  }
  function pushOnceMission(fn: () => void, key?: string | symbol) {
    const mapKey = key || generateUUID()
    onceMissions.value.set(mapKey, fn)
    return mapKey
  }

  function removeMission(key: string | symbol) {
    missions.value.delete(key)
  }

  function clearMissions(includeOnce = false) {
    missions.value.clear()
    if (includeOnce) {
      onceMissions.value.clear()
    }
  }

  function rendering() {
    missions.value.forEach(fn => fn())
    onceMissions.value.forEach(fn => fn())
    onceMissions.value.clear()
    frameRef.value = requestAnimationFrame(rendering)
  }

  /**
   * 修改渲染状态
   * @param val true 为开始渲染，false 为停止渲染
   */
  function changeRenderStatus(val: boolean) {
    isRender.value = val
  }

  watch(isRender, val => {
    if (val) {
      frameRef.value = requestAnimationFrame(rendering)
    } else if (frameRef.value) {
      cancelAnimationFrame(frameRef.value)
    }
  })

  return {
    pushMission,
    removeMission,
    pushOnceMission,
    clearMissions,
    changeRenderStatus
  }
}

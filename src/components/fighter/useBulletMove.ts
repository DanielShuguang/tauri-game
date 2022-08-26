import { Nullable } from '@/types/base'
import { MaybeRef } from '@vueuse/core'
import { ref, unref } from 'vue'
import { Bullet } from './bullet'
import { SvgInstance } from './d3-instance'

export function useBulletMove(shooter?: MaybeRef<SvgInstance<'svg'>>) {
  const bullet = ref<Nullable<Bullet>>(null)

  function generateBullet() {
    if (!shooter) return

    bullet.value = new Bullet(unref(shooter), { x: 0, y: 0 }, { x: 1, y: 0 })
    bullet.value.shootting()
  }
}

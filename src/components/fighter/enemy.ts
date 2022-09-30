import { Vector2d, D3Dom } from '@/types/d3'
import { randomInteger } from '@/utils/random'
import { generateUUID } from '@/utils/uuid'
import { SvgInstance } from './d3-instance'

export type EnemyType = 'normal' | 'advanced' | 'giant'

function enemyHp(type: EnemyType) {
  const hpList: Record<EnemyType, number> = {
    normal: 1,
    advanced: 5,
    giant: randomInteger(20, 10)
  }
  return hpList[type]
}
const enemySizes: Record<EnemyType, number> = {
  normal: 30,
  advanced: 40,
  giant: 60
}
const enemyColors: Record<EnemyType, string> = {
  normal: 'purple',
  advanced: 'green',
  giant: 'orange'
}

export class Enemy {
  static moveRange: [Vector2d, Vector2d] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]

  static enemyDeathScore = (enemy: Enemy) => {
    const { type } = enemy
    const enemyScores: Record<EnemyType, number> = {
      normal: 5,
      advanced: 10,
      giant: 20
    }

    return enemyScores[type] ?? 0
  }

  private group: SvgInstance<'g'>
  private rect: SvgInstance<'rect'>
  private position: Vector2d
  private key: string
  private hp: number
  private type: EnemyType
  private ownRangeOffset?: Vector2d

  constructor(
    parentDom: SvgInstance<'svg'> | D3Dom<SVGSVGElement>,
    initialPosition: Vector2d,
    type: EnemyType,
    rangeOffset?: Vector2d
  ) {
    this.position = initialPosition
    this.key = 'enemy-' + generateUUID()
    this.type = type
    this.hp = enemyHp(type)
    this.ownRangeOffset = rangeOffset

    this.group = new SvgInstance('g', parentDom, initialPosition)
    this.rect = new SvgInstance('rect', this.group)
    this.rect.setAttrs({
      fill: enemyColors[type],
      width: enemySizes[type],
      height: enemySizes[type]
    })
    this.rect.setAttrs({ id: this.key })
  }

  get currentPosition() {
    return this.position
  }

  get enemyUniqueKey() {
    return this.key
  }

  get currentDom() {
    return this.rect.instanceDom
  }

  autoMove = () => {
    const shouldMoving = randomInteger(100) % 2 === 0
    if (!shouldMoving) return

    const direction = randomInteger(100) % 2 === 0 ? 'x' : 'y'
    const distance = randomInteger(5, -5)
    if (direction === 'x') {
      const nextX = this.position.x + distance + (this.ownRangeOffset?.x || 0)
      const outOfRange =
        Enemy.moveRange[0].x >= nextX || Enemy.moveRange[1].x <= nextX
      if (outOfRange) return
    } else {
      const nextY = this.position.y + distance + (this.ownRangeOffset?.y || 0)
      const outOfRange =
        Enemy.moveRange[0].y >= nextY || Enemy.moveRange[1].y <= nextY
      if (outOfRange) return
    }

    this.group.moving({ [direction]: distance })
    this.position = { ...this.group.currentPosition }
    return this
  }

  destroy = () => {
    this.rect.originalFn(el => el.remove())
    this.group.originalFn(el => el.remove())
  }
}

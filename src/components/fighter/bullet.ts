import { D3Dom, Vector2d } from '@/types/d3'
import { SvgInstance } from './d3-instance'

export class Bullet {
  private group: SvgInstance<'g'>
  private rect: SvgInstance<'rect'>
  private position: Vector2d
  private offset: Vector2d

  static destroyBullet = (bullet: Bullet) => {
    bullet.destroy()
  }

  constructor(
    parentDom: SvgInstance<'svg'> | D3Dom<SVGSVGElement>,
    initialPosition: Vector2d,
    offset: Vector2d
  ) {
    this.position = initialPosition
    this.offset = offset

    this.group = new SvgInstance('g', parentDom, initialPosition)
    this.rect = new SvgInstance('rect', this.group)
    this.rect.setAttrs({ fill: 'red', width: 5, height: 10 })
  }

  get currentPosition() {
    return this.position
  }

  shootting = () => {
    this.group.moving({ ...this.offset })
    this.position = { ...this.group.currentPosition }
    return this
  }

  private destroy = () => {
    this.rect.originalFn(el => el.remove())
    this.group.originalFn(el => el.remove())
  }
}

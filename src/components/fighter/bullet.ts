import { D3Dom, Vector2d } from '@/types/d3'
import { generateUUID } from '@/utils/uuid'
import { SvgInstance } from './d3-instance'

export class Bullet {
  private group: SvgInstance<'g'>
  private rect: SvgInstance<'rect'>
  private position: Vector2d
  private offset: Vector2d
  private key: string

  constructor(
    parentDom: SvgInstance<'svg'> | D3Dom<SVGSVGElement>,
    initialPosition: Vector2d,
    offset: Vector2d
  ) {
    this.position = initialPosition
    this.offset = offset
    this.key = 'bullet-' + generateUUID()

    this.group = new SvgInstance('g', parentDom, initialPosition)
    this.rect = new SvgInstance('rect', this.group)
    this.rect.setAttrs({ fill: 'red', width: 5, height: 10 })
    this.rect.setAttrs({ id: this.key })
  }

  get currentPosition() {
    return this.position
  }

  get bulletUniqueKey() {
    return this.key
  }

  get currentDom() {
    return this.rect.instanceDom
  }

  shootting = () => {
    this.group.moving({ ...this.offset })
    this.position = { ...this.group.currentPosition }
    return this
  }

  destroy = () => {
    this.rect.originalFn(el => el.remove())
    this.group.originalFn(el => el.remove())
  }
}

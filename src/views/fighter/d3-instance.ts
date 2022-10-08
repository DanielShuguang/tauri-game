import { AttrValue, D3Dom, Elements, Vector2d } from '@/types/d3'

export class SvgInstance<K extends keyof Elements> {
  private position: Vector2d
  private initialPosition: Vector2d
  private dom: D3Dom<Elements[K]>

  constructor(
    domType: K,
    parentDom: SvgInstance<any> | D3Dom<any>,
    intialPosition: Vector2d = { x: 0, y: 0 }
  ) {
    this.position = intialPosition
    this.initialPosition = { ...this.position }
    if (parentDom instanceof SvgInstance) {
      this.dom = parentDom.instanceDom.append(domType)
    } else {
      this.dom = parentDom.append(domType)
    }
    this.changePosition()
  }

  get instanceDom() {
    return this.dom
  }

  get currentPosition() {
    return this.position
  }

  originalFn = (callback: (el: D3Dom<Elements[K]>) => void) => {
    callback(this.instanceDom)
  }

  resetPosition = () => {
    this.position = { ...this.initialPosition }
    this.changePosition()
    return this
  }

  moving = (offset: Partial<Vector2d>) => {
    const { x = 0, y = 0 } = offset
    this.position = { x: this.position.x + x, y: this.position.y + y }
    this.changePosition()
    return this
  }

  setAttrs = (attrs: Record<string, AttrValue<K>>) => {
    Object.keys(attrs).forEach(key => {
      this.dom.attr(key, attrs[key])
    })
    return this
  }

  private changePosition = () => {
    const { x, y } = this.position
    this.dom.style('transform', `translate(${x}px, ${y}px)`)
  }
}

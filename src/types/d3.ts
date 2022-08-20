import { BaseType, Selection, ValueFn } from 'd3'

export type D3Dom<T extends BaseType> = Selection<T, unknown, HTMLElement, any>

export interface Vector2d {
  x: number
  y: number
}

export type Elements = HTMLElementTagNameMap &
  Pick<
    SVGElementTagNameMap,
    Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
  >

export type AttrValue<K extends keyof Elements> =
  | null
  | string
  | number
  | boolean
  | ReadonlyArray<string | number>
  | ValueFn<
      Elements[K],
      any,
      null | string | number | boolean | ReadonlyArray<string | number>
    >

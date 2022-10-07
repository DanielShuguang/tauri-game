import { InjectionKey, Ref } from 'vue'

export const fpsKey: InjectionKey<Ref<number>> = Symbol('fps')

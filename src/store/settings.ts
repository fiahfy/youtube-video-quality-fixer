import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Quality } from '~/models'

@Module({ name: 'settings' })
export default class SettingsModule extends VuexModule {
  quality: Quality = 1080

  @Mutation
  setQuality({ quality }: { quality: Quality }): void {
    this.quality = quality
  }
}

<template>
  <v-app>
    <v-main class="fill-height">
      <v-container fluid>
        <div class="d-flex">
          <div class="mr-3 text-no-wrap">Highest quality:</div>
          <select
            v-model="quality"
            style="-webkit-appearance: menulist; border-style: solid;"
          >
            <option
              v-for="option of qualities"
              :key="option.value"
              :value="option.value"
              v-text="option.text"
            />
          </select>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { settingsStore } from '~/store'

const qualities = [
  { value: 'auto', text: 'Auto' },
  { value: 144, text: '144' },
  { value: 240, text: '240' },
  { value: 360, text: '360' },
  { value: 480, text: '480' },
  { value: 720, text: '720p60' },
  { value: 1080, text: '1080p60 (HD)' },
  { value: 1440, text: '1440p60 (HD)' },
  { value: 2160, text: '2160p60 (4K)' },
  { value: 4320, text: '4320p60 (8K)' },
]

export default defineComponent({
  setup() {
    const quality = computed({
      get: () => {
        return settingsStore.quality
      },
      set: (value) => {
        settingsStore.setQuality({ quality: value })
      },
    })

    return {
      qualities,
      quality,
    }
  },
})
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
html {
  overflow-y: hidden;
}
</style>

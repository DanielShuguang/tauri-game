<script setup lang="ts">
import { useFps } from '@vueuse/core'
import { provide } from 'vue'
import { useRouter } from 'vue-router'
import { fpsKey } from './types/uniqueKeys'

const router = useRouter()
const fps = useFps()

provide(fpsKey, fps)
</script>

<template>
  <div class="app-content">
    <nav class="left-nav">
      <ul class="nav-list">
        <li
          class="nav-list-item"
          v-for="item in router.getRoutes()"
          :key="item.path"
        >
          <router-link
            :to="item.path"
            class="link"
            exact-active-class="active-router"
          >
            {{ item.meta?.title }}
          </router-link>
        </li>
      </ul>
    </nav>
    <router-view class="view-content" />
    <span class="fps-watcher">FPS: {{ fps }}</span>
  </div>
</template>

<style lang="scss" scoped>
.app-content {
  display: flex;
  width: 100%;
  height: 100%;
  .view-content {
    flex: 1;
  }
}

.fps-watcher {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.left-nav {
  height: 100%;
  width: 165px;
  border-right: 1px solid skyblue;
  box-sizing: border-box;

  .nav-list {
    &-item {
      width: 100%;
      .link {
        display: block;
        padding: 20px;
        color: #000;
        text-decoration: none;
        text-align: center;
        transition: background 0.3s ease-in-out;
        cursor: pointer;

        &:hover {
          background: rgb(242, 243, 153);
        }

        &.active-router {
          color: skyblue;
        }
      }
    }
  }
}
</style>

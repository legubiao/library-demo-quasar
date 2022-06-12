<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title @click="router.push('main')">
          {{$route.name}}
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item v-ripple>
          <q-item-section>
            <q-item-label header class="text-grey-8 text-h6" style="width: 5rem">
              功能列表
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center content-center">
              <q-btn
                flat round
                color="grey"
                @click="$q.fullscreen.toggle()"
                :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
              />
              <q-btn flat round color="grey" icon="settings" @click="router.push('Setting'); leftDrawerOpen = false"/>
              <q-btn flat round color="grey" icon="autorenew" @click="router.go(0)"/>
            </div>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-scroll-area style="height: calc(100vh - 6.1rem)">
          <div>
            <q-item-label header>基础功能</q-item-label>
            <router-item
              v-for="link in basicFunction"
              :key="link.title"
              v-bind="link"
              @close-drawer="leftDrawerOpen = false"
            />
            <q-separator/>
            <q-item-label header>进阶功能</q-item-label>
            <router-item
              v-for="link in advancedFunction"
              :key="link.title"
              v-bind="link"
              @close-drawer="leftDrawerOpen = false"
            />
          </div>
          <q-separator/>
          <q-item-label header>主页与登录</q-item-label>
          <router-item
            v-for="link in loginLinks"
            :key="link.title"
            v-bind="link"
            @close-drawer = "leftDrawerOpen = false"
          />
        </q-scroll-area>
      </q-list>
    </q-drawer>

    <q-page-container  @click="leftDrawerOpen=false">
      <router-view v-slot="{ Component }" style="height: calc(100vh - 50px)">
        <transition-fade>
          <component :is="Component" />
        </transition-fade>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import TransitionFade from 'components/universal/Fade.vue'
import RouterItem from 'layouts/RouterItem.vue'
import routerLinks from 'layouts/routerLinks.js'

export default defineComponent({
  name: 'MainLayout',

  components: {
    RouterItem,
    TransitionFade
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      router: useRouter(),
      advancedFunction: routerLinks('advanced'),
      basicFunction: routerLinks('basic'),
      loginLinks: routerLinks('login'),
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

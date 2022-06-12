<template>
  <div class="row justify-center items-center">
    <!--背景-->
    <q-img src="bg/xz2p_5.jpg" class="background"/>
    <!--内容-->
    <q-card class="front q-pa-md text-primary bg-white">
      <q-card-section class="row content-center justify-center items-center">
        <q-icon name="auto_stories" class="q-pa-md" size="10rem"/>
        <div class="q-gutter-sm">
          <div class="text-h4 text-bold">欢迎使用</div>
          <div class="justify-center row q-gutter-sm items-center content-center">
            <div class="text-h3 text-bold">图书馆系统</div>
            <q-badge color="primary" v-if="$q.screen.gt.xs" class="text-h5" label="PC端"/>
          </div>
        </div>
      </q-card-section>
      <div class="flex justify-center">
        <div class="q-gutter-y-md text-center q-pa-sm" style="max-width: 20rem">
          <q-input filled clearable class="text-h6" v-model="username" placeholder="请输入用户名"/>
          <q-input clearable class="text-h6" filled v-model="password" placeholder="请输入密码" type="password"/>
        </div>
      </div>
      <q-card-section class="q-pa-sm">
        <q-btn-dropdown padding="0.5rem 4rem" class="text-bold text-h6"
                        content-class="blur" size="lg" color="primary"
                        :menu-offset="[0,8]" split label="登录系统" @click="login">
          <q-btn color="secondary" size="lg" stretch class="full-width" label="注册新用户" @click="registerUser.show()"/>
        </q-btn-dropdown>
      </q-card-section>
      <q-inner-loading
        :showing="loading"
        label="正在登录"
        label-class="text-primary text-h5"
      />
    </q-card>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { defineComponent, inject, ref } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'loginPage',
  setup () {
    const $q = useQuasar()
    const showLogin = ref(true)
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const api = inject('api')
    const loading = ref(false)

    return {
      showLogin,
      username,
      password,
      loading,
      login () {
        loading.value = true
        api.value = axios.create({
          baseURL: 'http://localhost:8080',
          auth: {
            username: username.value,
            password: password.value
          }
        })
        api.value.get('user/login').then(rs => {
          sessionStorage.setItem('role', rs.data)
          loading.value = false
          router.push('main')
        }).catch(e => {
          loading.value = false
          $q.notify({ type: 'negative', message: '用户名或密码无效' })
        })
      },
      registerUser: ref()
    }
  }
})
</script>

<style scoped>

.background {
  z-index: -1;
  filter: blur(10px);
  height: 100vh;
  width: 100vw;
  opacity: 0.2;
}

.front {
  z-index: 1;
  vertical-align: middle;
  text-align: center;
  position: absolute;
  border-radius: 2rem;
  max-width: 80vw;
  min-width: 60vw;
}
</style>

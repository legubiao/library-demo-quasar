<template>
  <div class="items-center content-center justify-center flex q-gutter-md">
    <q-card>
      <q-card-section class="q-pa-none">
        <q-input outlined v-model="keyword" :placeholder="placeholder">
          <template v-slot:append>
            <q-icon v-if="keyword !== ''" name="close" @click="clear" class="cursor-pointer" />
            <q-btn-dropdown color="primary" :disable="keyword === ''" icon="search" :label="searchMode" split @click="search">
              <q-list>
                <q-item clickable v-close-popup @click="switchMode('索书号搜索')">
                  <q-item-section>
                    <q-item-label>索书号搜索</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchMode('条码号搜索')">
                  <q-item-section>
                    <q-item-label>条码号搜索</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator spaced="true"/>
                <q-item-label header>标题搜索</q-item-label>
                <q-item clickable v-close-popup @click="switchMode('精确搜索')">
                  <q-item-section>
                    <q-item-label>精确搜素</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchMode('首字搜索')">
                  <q-item-section>
                    <q-item-label>首字搜索</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="switchMode('模糊搜索')">
                  <q-item-section>
                    <q-item-label>模糊搜索</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
        </q-input>
      </q-card-section>
    </q-card>
    <q-slide-transition>
      <div v-show="books.length !== 0">
        <q-table
          :rows="books"
          :columns="bookColumns"
          :pagination="{ rowsPerPage: 10 }"
          row-key="bookID"
          class="sticky-header-table"
          :style="$q.screen.lt.sm?'height: calc(100vh - 13.3rem)':'height: calc(100vh - 9.5rem)'"
        >
          <template v-slot:body="props">
            <q-tr :props="props" @click="bookInfo.show(props.row)">
              <q-td key="title" :props="props" class="text-bold">{{ props.row.title }}</q-td>
              <q-td key="callNumber" :props="props">{{ props.row.callNumber }}</q-td>
              <q-td key="bookID" :props="props">{{ props.row.bookID }}</q-td>
              <q-td key="shelfDescribe" :props="props">{{ props.row.shelfDescribe }}</q-td>
            </q-tr>
          </template>
        </q-table>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import { useQuasar } from 'quasar'

const bookColumns = [
  { name: 'title', label: '题名', align: 'left', field: 'title', sortable: true },
  { name: 'callNumber', label: '索书号', align: 'left', field: 'callNumber', sortable: true },
  { name: 'bookID', label: '条码号', align: 'left', field: 'bookID' },
  { name: 'shelfDescribe', label: '当前架', align: 'left', field: 'shelfDescribe' }
]

export default {
  name: 'BookSearch',
  setup () {
    const $q = useQuasar()
    const api = inject('api').value
    const visible = ref(false)
    const loading = ref(false)
    const books = ref([])
    const keyword = ref('')
    const placeholder = ref('在此输入图书标题')
    const searchMode = ref('首字搜索')

    function clear () {
      keyword.value = ''
      books.value = []
    }

    function show () {
      visible.value = true
    }

    function switchMode (mode) {
      searchMode.value = mode
      switch (mode) {
        case '索书号搜索':
          placeholder.value = '在此输入完整的索书号'
          break
        case '条码号搜索':
          placeholder.value = '在此输入完整的条码号'
          break
        default:
          placeholder.value = '在此输入图书标题'
          break
      }
    }

    function search () {
      loading.value = true
      switch (searchMode.value) {
        case '索书号搜索':
          searchByCallNumber()
          break
        case '条码号搜索':
          searchByID()
          break
        default:
          searchByTitle()
          break
      }
    }

    function searchByTitle () {
      const params = {
        title: keyword.value,
        mode: ''
      }
      switch (searchMode.value) {
        case '精确搜索':
          break
        case '首字搜索':
          params.mode = 'prefixMatch'
          break
        case '模糊搜索':
          params.mode = 'fuzzySearch'
          break
      }
      api.get('book/title', { params }).then(rs => {
        books.value = rs.data
        $q.notify({ message: '共搜索到' + books.value.length + '条记录', type: 'info' })
      }).finally(() => {
        loading.value = false
      })
    }

    function searchByCallNumber () {
      const params = { callNumber: keyword.value }
      api.get('book/callNumber', { params })
        .then((response) => {
          if (response.data !== '') {
            books.value = response.data
            $q.notify({ message: '共搜索到' + books.value.length + '条记录', type: 'info' })
          }
        }).finally(() => {
          loading.value = false
        })
    }

    function searchByID () {
      api.get('book/id/' + keyword.value)
        .then((response) => {
          if (response.data !== '') {
            books.value.push(response.data)
          }
        }).finally(() => {
          loading.value = false
        })
    }

    return {
      bookColumns,
      bookInfo: ref(),
      visible,
      loading,
      books,
      keyword,
      placeholder,
      searchMode,
      show,
      switchMode,
      search,
      clear
    }
  }
}
</script>

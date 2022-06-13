<template>
  <q-dialog v-model="visible">
    <q-card style="min-width: 15rem; max-width: 80vw; max-height: calc(100vh - 2rem)">
      <q-tab-panels v-model="tab" animated style="max-height: calc(100vh - 7rem); overflow-y: auto">
        <q-tab-panel class="q-pa-none" name="info">
          <q-card-section class="text-h6">图书信息</q-card-section>
          <q-separator/>
          <q-list>
            <q-item dense v-for="item in bookItem" v-bind:key="item.name" clickable v-ripple>
              <q-item-section>{{ item.label }}</q-item-section>
              <q-item-section side>{{ origin[item.name] }}</q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
        <q-tab-panel name="copy">
          <q-table
            :rows="copyList"
            :columns="columns"
            :pagination="{rowsPerPage: 7}"
            selection="single"
            :selected="selected"
            row-key="id"
          />
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" name="modify">
          <q-card-section class="text-h6">图书修改</q-card-section>
          <q-separator/>
          <q-card-section class="q-gutter-y-sm">
            <q-input v-model="book.title" outlined label="标题"/>
            <q-input v-model="book.author" outlined label="作者"/>
            <q-input v-model="book.publisher" outlined label="出版社"/>
            <q-input v-model="book.isbn" outlined label="ISBN"/>
            <q-input v-model="book.callNumber" outlined label="索书号"/>
          </q-card-section>
          <q-separator/>
          <q-slide-transition>
            <q-card-section class="row" v-if="modified">
              <q-btn stretch color="primary" class="col" label="修改图书" @click="update"/>
              <q-btn stretch color="secondary" class="col" label="还原修改" @click="reset"/>
            </q-card-section>
            <q-card-section class="row" v-else>
              <q-btn stretch color="negative" class="col" label="删除图书" @click="remove"/>
            </q-card-section>
          </q-slide-transition>
        </q-tab-panel>
      </q-tab-panels>
      <q-separator/>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="info" icon="book" label="图书信息" />
        <q-tab name="copy" icon="bookmarks" label="图书副本" v-if="copyList.length !== 0"/>
        <q-tab name="modify" icon="edit" label="修改图书" v-if="role === 'admin'" />
      </q-tabs>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, inject, computed } from 'vue'
import { useQuasar } from 'quasar'

const bookItem = [
  { name: 'id', label: '条码号' },
  { name: 'title', label: '标题' },
  { name: 'author', label: '作者' },
  { name: 'publisher', label: '出版社' },
  { name: 'callNumber', label: '索书号' },
  { name: 'isbn', label: 'ISBN' }
]

const columns = [
  { name: 'id', label: '图书副本ID', align: 'left', field: 'id' },
  { name: 'shelfID', label: '所属书架', align: 'left', field: 'shelfID', sortable: true },
  { name: 'dueDate', label: '预计归还时间', align: 'left', field: 'dueDate', sortable: true }
]

export default {
  name: 'BookDialog',
  setup (props, context) {
    const $q = useQuasar()
    const visible = ref(false)
    const book = ref({})
    const origin = ref({})
    const copyList = ref([])
    const selected = ref([])
    const api = inject('api').value

    function getCopies () {
      api.get('copy/bookID/' + book.value.id).then(rs => {
        copyList.value = rs.data
        console.log(rs.data)
      })
    }

    return {
      tab: ref('info'),
      role: sessionStorage.getItem('role'),
      columns,
      bookItem,
      visible,
      book,
      origin,
      copyList,
      selected,
      show (data) {
        origin.value = data
        book.value = JSON.parse(JSON.stringify(data))
        visible.value = true
        getCopies()
      },
      modified: computed(() => (JSON.stringify(book.value) !== JSON.stringify(origin.value))),
      reset () {
        book.value = JSON.parse(JSON.stringify(origin.value))
      },
      update () {
        api.put('book', book.value).then(rs => {
          $q.notify({ message: '修改图书信息成功', type: 'positive' })
          visible.value = false
          context.emit('refresh')
        })
      },
      remove () {
        $q.dialog({
          title: '删除动作',
          message: '是否要删除该图书？',
          cancel: true,
          persistent: true
        }).onOk(() => {
          api.delete('book/' + book.value.id).then(rs => {
            $q.notify({ message: '图书删除成功', type: 'positive' })
            visible.value = false
            context.emit('refresh')
          })
        })
      }
    }
  }
}
</script>

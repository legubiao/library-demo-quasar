<template>
  <div class="q-pa-md">
    <q-table
      :rows="bookData"
      :columns="columns"
      title="图书基本信息管理"
      title-class="text-bold"
      class="sticky-header-table full-height"
      row-key="tid"
      selection="multiple"
      v-model:selected="selected"
      :pagination="{rowsPerPage: 15}"
    >
      <template v-slot:top-right>
        <book-uploader ref="bookUploader" @load="load"/>
        <q-space />
        <div class="q-gutter-x-md row">
          <transition-flip>
            <q-btn v-if="hasSelected && hasBook" flat icon="remove" color="negative" round @click="removeBook"/>
          </transition-flip>
          <transition-group mode="out-in"
                            enter-active-class="animated flipInX"
                            leave-active-class="animated flipOutX">
            <template v-if="hasBook">
              <q-btn flat icon="clear" round @click="clearBook"/>
              <q-btn icon="move_up" color="secondary" label="创建图书副本" @click="createCopy"/>
              <q-btn icon="sync" color="secondary" label="更新图书数据" @click="updateAll"/>
            </template>
          </transition-group>
          <transition-flip>
            <q-btn v-if="hasBook" icon="archive" color="primary" label="下载Excel" @click="exportExcel"/>
            <q-btn v-else outline padding="sm" icon="unarchive" color="primary" label="上传Excel" @click="bookUploader.show()"/>
          </transition-flip>
        </div>
      </template>
      <template v-slot:body-cell-title="props">
        <q-td class="bookTitle">
          <b @click="bookDialog.show(props.row)">{{props.value}}</b>
        </q-td>
      </template>
    </q-table>
    <book-dialog ref="bookDialog"/>
  </div>
</template>

<script>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { computed, provide, ref, defineComponent, inject } from 'vue'
import * as XLSX from 'xlsx'

import TransitionFlip from 'components/universal/Flip.vue'
import BookUploader from 'components/book/BookUploader.vue'
import BookDialog from 'components/book/BookDialog.vue'

const columns = [
  { name: 'id', label: '条码号', align: 'left', field: 'id' },
  { name: 'title', label: '标题', align: 'left', field: 'title', sortable: true },
  { name: 'author', label: '作者', align: 'left', field: 'author', sortable: true },
  { name: 'publisher', label: '出版社', align: 'left', field: 'publisher', sortable: true },
  { name: 'callNumber', label: '索书号', align: 'left', field: 'callNumber', sortable: true },
  { name: 'isbn', label: 'ISBN', align: 'left', field: 'isbn', sortable: true }
]

export default defineComponent({
  name: 'BookManage',
  components: { BookDialog, BookUploader, TransitionFlip },
  setup () {
    const $q = useQuasar()
    const api = inject('api').value

    const bookData = ref([])
    const selected = ref([])
    const addBookVisible = ref(false)
    provide('selectedBook', selected)
    provide('addBookVisible', addBookVisible)

    function clearBook () {
      bookData.value = []
      selected.value = []
    }

    function removeBook () {
      if (selected.value.length !== bookData.value.length) {
        selected.value.forEach(rfidItem => {
          bookData.value.splice(bookData.value.indexOf(rfidItem), 1)
        })
        selected.value = []
      } else {
        clearBook()
      }
    }

    return {
      columns,
      bookData,
      selected,
      hasBook: computed(() => bookData.value.length !== 0),
      hasSelected: computed(() => selected.value.length !== 0),
      addBookVisible,
      bookDialog: ref(),
      bookUploader: ref(),
      removeBook,
      clearBook,
      exportExcel () {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerSize: 200,
          message: '正在生成图书信息表，请稍后...'
        })
        const workSheet = XLSX.utils.json_to_sheet(bookData.value)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, 'book')
        $q.loading.hide()
        XLSX.writeFile(workBook, '图书信息.xlsx')
      },
      load (data) {
        bookData.value = data
      },
      updateAll () {
        api.post('book/list', selected.value.length === 0 ? bookData.value : selected.value).then(rs => {
          $q.notify({ message: '已成功更新' + rs.data + '条图书信息', type: 'positive' })
        })
      },
      createCopy () {
        api.post('copy/list', selected.value.length === 0 ? bookData.value : selected.value).then(rs => {
          $q.notify({ message: '已成功创建' + rs.data + '条图书副本', type: 'positive' })
        })
      }
    }
  }
})
</script>

<style scoped>
.bookTitle{
  max-width: 10rem;
  overflow: hidden;
  text-decoration: underline;
}
</style>

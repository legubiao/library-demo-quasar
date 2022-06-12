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
      v-model:selected="selectedBook"
      :pagination="{rowsPerPage: 15}"
    >
      <template v-slot:top-right>
        <book-uploader ref="bookUploader"/>
        <q-space />
        <div class="q-gutter-x-md row">
          <transition-flip>
            <q-btn v-if="hasSelected && hasBook" flat icon="remove" color="negative" round @click="removeBook"/>
          </transition-flip>
          <transition-flip>
            <q-btn v-if="hasBook" flat icon="clear" style="margin-left:1rem" round @click="clearBook"/>
          </transition-flip>
          <transition-flip>
            <q-btn v-if="hasBook" icon="archive" color="primary" label="上传Excel" @click="exportExcel"/>
            <q-btn v-else outline icon="unarchive" color="primary" label="上传Excel" @click="bookUploader.show()"/>
          </transition-flip>
        </div>
      </template>
      <template v-slot:body-cell-title="props">
        <q-td class="bookTitle">
          <b @click="bookDetail.show(props.row)">{{props.value}}</b>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { computed, provide, ref, defineComponent } from 'vue'
import * as XLSX from 'xlsx'

import TransitionFlip from 'components/universal/Flip.vue'
import BookUploader from 'components/book/BookUploader.vue'

const columns = [
  { name: 'title', label: '题名', align: 'left', field: 'title', sortable: true },
  { name: 'callNumber', label: '索书号', align: 'left', field: 'callNumber', sortable: true },
  { name: 'bookID', label: '条码号', align: 'left', field: 'bookID' },
  { name: 'location', label: '馆藏地', align: 'left', field: 'location' },
  { name: 'shelfID', label: '书架ID', align: 'left', field: 'shelfID' },
  { name: 'rssi', label: 'RSSI', align: 'left', field: 'rssi' }
]

export default defineComponent({
  name: 'BookManage',
  components: { BookUploader, TransitionFlip },
  setup () {
    const $q = useQuasar()
    const rfidList = ref([])
    const bookData = ref([])
    const selectedBook = ref([])
    const addBookVisible = ref(false)
    provide('rfidList', rfidList)
    provide('selectedBook', selectedBook)
    provide('addBookVisible', addBookVisible)

    function exportExcel () {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerSize: 200,
        message: '正在生成图书信息表，请稍后...'
      })
      const workSheet = XLSX.utils.json_to_sheet(rfidList.value)
      const workBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workBook, workSheet, 'book')
      $q.loading.hide()
      XLSX.writeFile(workBook, '图书信息.xlsx')
    }

    function clearBook () {
      bookData.value = []
      selectedBook.value = []
    }

    function removeBook () {
      if (selectedBook.value.length !== bookData.value.length) {
        selectedBook.value.forEach(rfidItem => {
          bookData.value.splice(bookData.value.indexOf(rfidItem), 1)
        })
        selectedBook.value = []
      } else {
        clearBook()
      }
    }

    return {
      columns,
      rfidList,
      bookData,
      selectedBook,
      hasBook: computed(() => bookData.value.length !== 0),
      hasSelected: computed(() => selectedBook.value.length !== 0),
      addBookVisible,
      bookDetail: ref(),
      bookUploader: ref(),
      removeBook,
      clearBook,
      exportExcel
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

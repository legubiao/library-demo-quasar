<template>
  <q-dialog v-model="visible">
    <q-card style="min-width: 22rem" class="q-pa-sm">
      <q-card-section class="q-pa-sm">
        <q-file outlined v-model="excel" label="上传图书Excel表">
          <template v-slot:before>
            <div class="text-h6">图书上传</div>
          </template>

          <template v-slot:append>
            <q-icon v-if="excel !== null" name="close" @click="clear" class="cursor-pointer" />
            <q-icon name="create_new_folder" @click.stop />
          </template>
        </q-file>
      </q-card-section>
      <q-slide-transition >
        <div v-show="books.length !== 0">
          <q-separator class="q-ma-sm"/>
          <q-card-section class="q-pa-sm">
            <q-table
              :rows="books"
              :columns="bookColumns"
              :pagination="{rowsPerPage: 7}"
              selection="multiple"
              v-model:selected="selected"
              row-key="bookID"
            />
            <q-inner-loading :showing="loading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card-section>
          <q-card-section class="row q-pa-sm justify-end q-gutter-x-md">
            <transition-flip>
              <q-btn v-show="selected.length !== 0" color="primary" outline @click="loadSelected">
                录入选中的{{selected.length}}本书
              </q-btn>
            </transition-flip>
            <q-btn color="primary" @click="loadAll" label="全部录入"/>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </q-dialog>
</template>

<script>

import TransitionFlip from 'components/universal/Flip.vue'
import { ref, watch, inject } from 'vue'
import * as XLSX from 'xlsx'

const bookColumns = [
  { name: 'bookID', label: '条码号', align: 'left', field: 'bookID' },
  { name: 'callNumber', label: '索书号', align: 'left', field: 'callNumber', sortable: true },
  { name: 'title', label: '题名', align: 'left', field: 'title', sortable: true }
]

export default {
  name: 'BookUploader',
  components: { TransitionFlip },
  setup (prop, context) {
    const api = inject('api').value
    const visible = ref(false)
    const loading = ref(false)
    const books = ref([])
    const selected = ref([])
    const excel = ref(null)
    watch(excel, value => {
      if (value !== null) {
        const reader = new FileReader()
        reader.onload = function (e) {
          loading.value = true
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const table = workbook.Sheets[workbook.SheetNames[0]]
          XLSX.utils.sheet_to_json(table).forEach(data => {
            getBook(data.bookID)
          })
          loading.value = false
        }
        reader.readAsBinaryString(value)
      }
    })

    function getBook (val) {
      api.get('book/id/' + val).then((rs) => {
        if (rs.data !== '') {
          books.value.push(rs.data)
        }
      })
    }

    function loadSelected () {
      context.emits('load', selected.value)
      visible.value = false
      books.value = []
      selected.value = []
    }

    function loadAll () {
      context.emits('load', books.value)
      visible.value = false
      books.value = []
      selected.value = []
    }

    function clear () {
      excel.value = null
      books.value = []
      selected.value = []
    }

    function show () {
      clear()
      visible.value = true
    }

    return {
      bookColumns,
      visible,
      loading,
      books,
      selected,
      excel,
      clear,
      loadAll,
      loadSelected,
      show
    }
  }
}
</script>

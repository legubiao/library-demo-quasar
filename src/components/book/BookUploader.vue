<template>
  <q-dialog v-model="visible">
    <q-card style="min-width: 22rem; max-width: 80vw" class="q-pa-sm">
      <q-card-section class="q-pa-sm row items-center">
        <q-file outlined v-model="excel" label="上传图书Excel表">
          <template v-slot:before>
            <div class="text-h6">图书上传</div>
          </template>

          <template v-slot:append>
            <q-icon v-if="excel !== null" name="close" @click="clear" class="cursor-pointer" />
            <q-icon name="create_new_folder" @click.stop />
          </template>
        </q-file>
        <template v-if="books.length !== 0  && $q.screen.gt.xs">
          <q-space/>
          <transition-flip class="text-subtitle1">
            <q-btn v-if="selected.length !== 0" color="primary" outline @click="loadSelected">
              录入选中的{{selected.length}}本书
            </q-btn>
            <q-btn v-else color="primary" @click="loadAll" label="全部录入"/>
          </transition-flip>
        </template>
      </q-card-section>
      <q-slide-transition >
        <div v-show="books.length !== 0">
          <q-separator class="q-ma-sm"/>
          <q-card-section class="q-pa-sm">
            <q-table
              :rows="books"
              :columns="columns"
              :pagination="{rowsPerPage: 7}"
              selection="multiple"
              v-model:selected="selected"
              row-key="bookID"
            />
            <q-inner-loading :showing="loading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card-section>
          <q-card-section v-if="$q.screen.lt.sm" class="row q-pa-sm justify-end q-gutter-x-md text-subtitle1">
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
import { ref, watch } from 'vue'
import * as XLSX from 'xlsx'

const columns = [
  { name: 'id', label: '条码号', align: 'left', field: 'id' },
  { name: 'title', label: '标题', align: 'left', field: 'title', sortable: true },
  { name: 'author', label: '作者', align: 'left', field: 'author', sortable: true },
  { name: 'publisher', label: '出版社', align: 'left', field: 'publisher', sortable: true },
  { name: 'callNumber', label: '索书号', align: 'left', field: 'callNumber', sortable: true },
  { name: 'isbn', label: 'ISBN', align: 'left', field: 'isbn', sortable: true }
]

export default {
  name: 'BookUploader',
  components: { TransitionFlip },
  setup (prop, context) {
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
            books.value.push(data)
          })
          loading.value = false
        }
        reader.readAsBinaryString(value)
      }
    })

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
      columns,
      visible,
      loading,
      books,
      selected,
      excel,
      clear,
      loadAll () {
        context.emit('load', books.value)
        visible.value = false
        books.value = []
        selected.value = []
      },
      loadSelected () {
        context.emit('load', selected.value)
        visible.value = false
        books.value = []
        selected.value = []
      },
      show
    }
  }
}
</script>

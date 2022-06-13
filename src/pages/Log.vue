<template>
  <q-table
    class="no-border-radius sticky-header-table"
    :rows="logList"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 100 }"
  >
    <template v-slot:top v-if="$q.screen.gt.sm">
      <div class="row full-width">
        <div class="flex items-center q-gutter-x-sm">
          <time-date-picker dense outlined label="开始时间" v-model="param.startTime"/>
          <time-date-picker dense outlined label="结束时间" v-model="param.endTime"/>
        </div>
        <q-space/>
        <q-btn color="secondary" label="导出excel日志" @click="exportLog" icon="archive"/>
      </div>
    </template>
    <template v-slot:bottom>
      <div class="full-width flex flex-center">
        <q-pagination
          v-model="param.page"
          :max="page"
          input
        />
        <q-btn-dropdown class="q-ml-sm" v-if="$q.screen.lt.md" color="primary" label="范围筛选" :menu-offset="[50,8]">
          <q-card-section class="q-gutter-y-sm q-pa-sm">
            <time-date-picker dense outlined label="开始时间" v-model="param.startTime"/>
            <time-date-picker dense outlined label="结束时间" v-model="param.endTime"/>
            <q-btn color="secondary" class="full-width" @click="exportLog" label="导出excel日志" icon="archive"/>
          </q-card-section>
        </q-btn-dropdown>
      </div>
    </template>
    <q-inner-loading :showing="loading">
      <q-spinner-ios size="10rem" color="primary" />
    </q-inner-loading>
  </q-table>
</template>

<script>
import { inject, onMounted, ref, watch } from 'vue'
import TimeDatePicker from 'components/universal/TimeDatePicker.vue'
import { utils, writeFile } from 'xlsx'

const columns = [
  { label: '日志ID', name: 'id', field: 'id' },
  { label: '操作日期', name: 'date', field: 'date' },
  { label: '操作用户', name: 'username', field: 'username' },
  { label: '日志类型', name: 'type', field: 'type' },
  { label: '详细描述', name: 'description', field: 'description' }
]

export default {
  name: 'LibraryLog',
  components: { TimeDatePicker },
  setup () {
    const api = inject('api').value
    const loading = ref(false)
    const param = ref({
      page: 1,
      username: null,
      startTime: null,
      endTime: null
    })
    const logList = ref([])
    const page = ref(1)

    function getLog () {
      api.get('log', { params: param.value }).then(rs => {
        logList.value = rs.data
      })
      api.get('log/page', { params: param.value }).then(rs => {
        page.value = rs.data
      })
    }
    watch(param, getLog, { deep: true })

    onMounted(getLog)

    return {
      loading,
      columns,
      param,
      page,
      logList,
      async exportLog () {
        const workBook = utils.book_new()
        loading.value = true
        const title = [{
          id: '日志ID',
          type: '日志类型',
          username: '操作用户',
          date: '日志日期'
        }]
        for (let i = 0; i < page.value; i++) {
          const params = {
            page: i + 1,
            user: param.value.username,
            startTime: param.value.startTime,
            endTime: param.value.endTime
          }
          const res = await api.get('log', { params })
          const sheet = utils.json_to_sheet(title.concat(res.data), { skipHeader: true })
          utils.book_append_sheet(workBook, sheet, 'Sheet' + (i + 1))
        }
        writeFile(workBook, '设备日志.xlsx')
        loading.value = false
      }
    }
  }
}
</script>

<template>
  <div class="mod-admin-delivery">
    <avue-crud ref="crud"
               :page="page"
               :data="dataList"
               :table-loading="dataListLoading"
               :option="tableOption"
               @search-change="searchChange"
               @on-load="getDataList"
               @refresh-change="refreshChange">
      <template slot-scope="scope"
                slot="menuLeft">
        <el-button v-if="isAuth('admin:delivery:save')"
                   icon="el-icon-plus"
                   type="primary"
                   size="small"
                   @click="addOrUpdateHandle()">新增</el-button>
      </template>
      <template slot-scope="scope"
                slot="menu">
        <el-button v-if="isAuth('admin:delivery:update')"
                   icon="el-icon-edit"
                   size="small"
                   type="primary"
                   @click="addOrUpdateHandle(scope.row.dvyId)">修改</el-button>
        <el-button v-if="isAuth('admin:delivery:delete')"
                   type="danger"
                   icon="el-icon-delete"
                   size="small"
                   @click="deleteHandle(scope.row.dvyId)">删除</el-button>
      </template>
    </avue-crud>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import { tableOption } from '@/crud/admin/delivery'
import AddOrUpdate from './delivery-add-or-update'
export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}, // 搜索
      dataListLoading: false,
      tableOption: tableOption,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
  },
  mounted () {
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/delivery/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (params) {
      this.searchForm = params
      this.getDataList(this.page)
    }
  }
}
</script>
<style lang="scss">
.mod-admin-delivery {
}
</style>

<template>
  <div class="mod-prod">
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @on-load="getDataList"
      @refresh-change="refreshChange"
    >
      <template slot="menuLeft">
        <el-button
          v-if="isAuth('score:prod:save')"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addOrUpdateHandle()"
        >新增</el-button>
      </template>
      <!-- 0:商家下架 1:正常 2:平台下架 3:待平台审核 4:审核失败 -1表示删除 -->
      <template slot-scope="scope" slot="status">
        <el-tag v-if="scope.row.status === 1" type="success" size="small">上架</el-tag>
        <el-tag v-else-if="scope.row.status === 0" size="small">平台下架</el-tag>
        <el-tag v-else-if="scope.row.status === 2" size="small" type="danger">违规商品</el-tag>
        <el-tag v-else-if="scope.row.status === 3" type="warning" size="small">待审核</el-tag>
        <el-tag v-else-if="scope.row.status === 4" type="danger" size="small">拒绝通过</el-tag>
        <el-tag v-else size="small">其他</el-tag>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="isAuth('score:prod:update')"
          type="primary"
          icon="el-icon-edit"
          size="small"
          class="operate-btn"
          @click="addOrUpdateHandle(scope.row.prodId)"
        >修改</el-button>
        <el-button
          type="primary"
          icon="el-icon-top"
          size="small"
          class="operate-btn"
          v-if="scope.row.status === 0"
          @click="changeProdStatus(scope.row.prodId, 1)"
        >上架</el-button>
        <el-button
          type="primary"
          icon="el-icon-bottom"
          size="small"
          class="operate-btn"
          v-if="scope.row.status === 1"
          @click="changeProdStatus(scope.row.prodId, 0)"
        >下架</el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document-checked"
          v-if="scope.row.status > 1"
          @click="applyAuditHandle(scope.row.prodId)"
        >下线管理</el-button>
        <el-button
          v-if="isAuth('score:prod:delete')"
          type="danger"
          icon="el-icon-delete"
          size="small"
          class="operate-btn"
          @click="deleteHandle(scope.row.prodId)"
        >删除</el-button>
      </template>
    </avue-crud>
    <!-- 下线管理弹窗-->
    <ProdOfflineHandleEvent
      v-if="prodOfflineHandleEventVisible"
      selectUrl="/prod/prod/getOfflineHandleEventByProdId"
      applyUrl="/prod/prod/auditApply"
      ref="prodOfflineHandleEvent"
      @refreshDataList="refreshChange"
    ></ProdOfflineHandleEvent>
  </div>
</template>

<script>
import { tableOption } from '@/crud/score/scoreProdList'
import ProdOfflineHandleEvent from '@/components/offline-event-handle'
export default {
  data () {
    return {
      dataForm: {
        prodName: ''
      },
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      dataListSelections: [],
      dataListLoading: false,
      prodOfflineHandleEventVisible: false,
      tableOption: tableOption,
      resourcesUrl: window.SITE_CONFIG.resourcesUrl
    }
  },
  components: {
    ProdOfflineHandleEvent
  },
  methods: {
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      var urls = ''
      // if (this.searchForm.type === 0) {
      //   urls = '/score/page'
      // } else {
      //   urls = '/platform/coupon/scorePage'
      // }
      console.log(urls)
      this.$http({
        url: this.$http.adornUrl('/admin/scoreProduct/page'),
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
        for (const key in this.dataList) {
          if (this.dataList.hasOwnProperty(key)) {
            const element = this.dataList[key]
            element.imgs = element.imgs.split(',')[0]
          }
        }
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({
        path: '/scoreProdInfo',
        query: { prodId: id }
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/admin/scoreProduct/${id}`),
            method: 'delete',
            data: this.$http.adornData({})
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          })
        })
        .catch(() => { })
    },
    changeProdStatus (id, status) {
      this.$confirm(`确定进行[${status ? '上架' : '下架'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/admin/scoreProduct/prodStatus`),
            method: 'put',
            data: this.$http.adornData({
              status: status,
              prodId: id
            })
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          })
        })
    },
    // 条件查询
    searchChange (params) {
      console.log(params)
      this.searchForm = params
      this.getDataList(this.page)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 申请审核
    applyAuditHandle (id) {
      this.prodOfflineHandleEventVisible = true
      this.$nextTick(() => {
        this.$refs.prodOfflineHandleEvent.init(id)
      })
    },
    // 回调刷新
    refreshChange () {
      this.getDataList()
    }
  }
}
</script>

<style >
.operate-btn {
  margin-left: 5px !important;
}
.operate-btn:first-child {
  margin-left: 0 !important;
}
</style>

<template>
  <div class="mod-distribution-prod">
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataList"
      v-model="dataForm"
      :table-loading="dataListLoading"
      :option="tableOption"
      @refresh-change="getDataList"
      @search-change="searchChange"
      @on-load="getDataList"
    >
      <template slot-scope="scope" slot="pic">
        <img :src="resourcesUrl + scope.row.pic" width="100" height="100" />
      </template>

      <template slot-scope="scope" slot="state">
        <el-tag v-if="scope.row.state === 0" size="small" type="info">待支付</el-tag>
        <el-tag v-if="scope.row.state === 1" size="small">待结算</el-tag>
        <el-tag v-else-if="scope.row.state ===2" size="small" type="success">已结算</el-tag>
        <el-tag v-else-if="scope.row.state ===-1" size="small" type="warning">订单失效</el-tag>
      </template>

      <!-- <template slot-scope="scope" slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click.stop="addOrUpdateHandle(scope.row)"
        >新增</el-button>

        <el-button
          type="danger"
          size="small"
          @click.stop="deleteHandle"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
      </template>-->
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from '@/crud/distribution/distributionProdLog'
export default {
  data () {
    return {
      dataForm: {
        prodName: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      dataList: [],
      searchForm: {}
    }
  },
  components: {
  },
  methods: {
    // 刷新回调
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionProd/getDistributionProdLogPage'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 20
        }, this.searchForm))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    searchChange (params) {
      this.searchForm = params
      this.getDataList(this.page)
    }
  }
}
</script>

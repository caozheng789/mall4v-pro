<template>
  <div class="mod-distribution-user">
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
      <template slot-scope="scope" slot="parentName">
        <div v-if="scope.row.parentDistributionUser === null">无</div>
        <div v-else>{{scope.row.parentDistributionUser.nickName}}</div>
      </template>

      <template
        slot-scope="scope"
        slot="boundCustomers"
      >{{scope.row.distributionUserAchievementDataDto.boundCustomers}}</template>

      <template
        slot-scope="scope"
        slot="invitedVeeker"
      >{{scope.row.distributionUserAchievementDataDto.invitedVeeker}}</template>

      <template
        slot-scope="scope"
        slot="addupAmount"
      >{{scope.row.distributionUserAchievementDataDto.distributionUserWallet.addupAmount}}</template>

      <template slot-scope="scope" slot="menu">
        <el-button
          type="success"
          size="small"
          icon="el-icon-view"
          @click="info(scope.row)"
          v-if="isAuth('distribution:distributionUser:info')"
        >查看</el-button>

        <el-button
          type="primary"
          size="small"
          icon="el-icon-edit"
          v-if="isAuth('distribution:distributionUser:update')"
          @click="addOrUpdateHandle(scope.row)"
        >修改状态</el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>

    <!-- 弹窗, 新增 / 修改 -->
    <Info v-if="infoVisible" ref="info"></Info>
  </div>
</template>
<script>
import { tableOption } from '@/crud/distribution/user/distributionUser'
import AddOrUpdate from './distribution-user-update'
import Info from './distribution-user-info'
export default {
  data () {
    return {
      dataForm: {
        // 分销员手机号
        mobile: null,
        // 邀请人手机号
        parentMobile: null,
        // 加入时间区间
        dateRange: []
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchForm: {},
      dataList: [],
      dataListLoading: false,
      tableOption: tableOption,
      addOrUpdateVisible: false,
      infoVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Info
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    // 新增 / 修改
    info (data) {
      this.infoVisible = true
      this.$nextTick(() => {
        this.$refs.info.init(data)
      })
    },
    // 点击查询
    searchChange (params) {
      this.page.currentPage = 1
      this.searchForm = params
      this.getDataList(this.page)
    },
    // 刷新回调
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page) {
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUser/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 20
        }, this.searchForm))
      }).then(({ data }) => {
        this.dataList = data.records
        this.dataListLoading = false
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
      })
    }
  }
}
</script>

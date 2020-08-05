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
      <template slot-scope="scope" slot="nickName">{{scope.row.nickName}}</template>

      <template slot-scope="scope" slot="userMobile">{{scope.row.userMobile}}</template>

      <template slot-scope="scope" slot="addupAmount">
        <div
          v-if="scope.row.distributionUserAchievementDataDto.distributionUserWallet.addupAmount === null"
        >0</div>
        <div
          v-else
        >{{scope.row.distributionUserAchievementDataDto.distributionUserWallet.addupAmount}}</div>
      </template>

      <template
        slot-scope="scope"
        slot="aGenerationCommission"
      >{{scope.row.distributionUserAchievementDataDto.distributionUserIncome.agenerationCommission}}</template>

      <template
        slot-scope="scope"
        slot="secondGenerationCommission"
      >{{scope.row.distributionUserAchievementDataDto.distributionUserIncome.secondGenerationCommission}}</template>

      <template
        slot-scope="scope"
        slot="invitationRewards"
      >{{scope.row.distributionUserAchievementDataDto.distributionUserIncome.invitationRewards}}</template>

      <template
        slot-scope="scope"
        slot="unsettledAmount"
      >{{scope.row.distributionUserAchievementDataDto.distributionUserWallet.unsettledAmount}}</template>

      <template
        slot-scope="scope"
        slot="settledAmount"
      >{{scope.row.distributionUserAchievementDataDto.distributionUserWallet.settledAmount}}</template>

      <template
        slot-scope="scope"
        slot="invalidAmount"
      >{{scope.row.distributionUserAchievementDataDto.distributionUserWallet.invalidAmount}}</template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from '@/crud/distribution/user/distributionAchievement'
export default {
  data () {
    return {
      createdateRange: [],
      dataForm: {
        userMobile: null
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchForm: {},
      dataList: [],
      tableOption: tableOption,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
  },
  methods: {
    // 点击查询
    searchChange (params) {
      this.page.currentPage = 1
      this.searchForm = params
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUser/page/achievement'),
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
    }
  }
}
</script>

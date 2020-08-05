<template>
  <div class="distribution-level-set gray-box bottom-redius">
    <el-form class="set-form" size="mini">
      <el-form-item>
        <!-- <el-checkbox v-model="dataForm.levelSetConditionsSwitch.boundCustomers">绑定客户数</el-checkbox>
        <el-checkbox v-model="dataForm.levelSetConditionsSwitch.invitedVeeker">邀请分销员数</el-checkbox>-->
        <el-button @click="addRow" style="margin-top:15px">添加等级</el-button>
        <el-button @click="updateUserLevel" style="margin-top:15px" v-if="isUpdateData">更新用户数据</el-button>
        <el-tag type="warning" v-if="isUpdateData">用户等级更新后仅对新用户有效，老用户未生效，请尽快更新</el-tag>

        <el-table :data="dataForm.userLevels" class="elTable">
          <el-table-column prop="level" fixed label="等级" align="center">
            <template slot-scope="scope">
              <div class="table-template">
                <div class="table-input-box">
                  <span>{{scope.row.level}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="levelName" fixed label="等级名称" align="center">
            <template slot-scope="scope">
              <div class="table-template">
                <div class="table-input-box">
                  <span>{{scope.row.levelName}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="img" fixed label="背景图片" align="center">
            <template slot-scope="scope">
              <img :src="resourcesUrl + scope.row.img" width="140" height="75" v-if="scope.row.img" />
              <span v-if="!scope.row.img">暂无图片</span>
            </template>
          </el-table-column>
          <el-table-column prop="presScore" fixed label="赠送积分" align="center">
            <template slot-scope="scope">
              <div class="table-template">
                <div class="table-input-box">
                  <span>{{scope.row.presScore}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="needGrowth" label="等级成长值范围" align="center">
            <template slot-scope="scope">
              <div class="table-template">
                <span>{{scope.row.needGrowth}}</span>
                <div v-if="scope.$index < dataForm.userLevels.length-1">~</div>
                <div
                  v-if="scope.$index < dataForm.userLevels.length-1"
                >{{dataForm.userLevels[scope.$index+1].needGrowth-1}}</div>
                <div v-if="scope.$index === dataForm.userLevels.length-1">~ ∞</div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="prodId" label="赠送优惠券" align="center" min-width="80px" fit>
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.couponList" :key="index">
                <span
                  v-if="index < 1"
                >{{item.couponName}} {{scope.row.couponList.length>1?'等优惠券':''}}</span>
              </div>
            </template>
          </el-table-column>-->
          <el-table-column prop="discountRange" fixed label="会员折扣" align="center">
            <template slot-scope="scope">
              <div class="table-template">
                <span>
                  <!-- {{scope.row.term}}
                  {{scope.row.termType === 1?'天':scope.row.termType === 2?'周':scope.row.termType === 3?'月':scope.row.termType === 4?'季度':'年'}}内-->
                  {{scope.row.discountRange === 1?'自营店':'全平台'}}
                  {{scope.row.discountType === 1?'部分商品':'全部商品'}}
                  {{scope.row.discount}}折
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="addOrUpdateHandle(scope.$index)"
                size="small"
              >{{scope.$index+1 > maxLength ? '保存':'编辑'}}</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index)"
                size="small"
                v-if="scope.$index === dataForm.userLevels.length -1 && scope.$index !== 0"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <!-- 商品选择弹窗-->
    <!-- <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      @refreshSelectProds="selectDistributionProds"
    ></prods-select>-->
    <!-- 优惠券选择弹窗-->
    <coupon-select
      v-if="couponSelectVisible"
      ref="couponSelect"
      @refreshSelectCouponList="selectDistributionCoupon"
    ></coupon-select>
    <user-level-update
      v-if="userLevelUpdateVisible"
      ref="userLevelUpdate"
      @refreshUserLevelUpdate="selectDistributionDiscount"
    ></user-level-update>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getData"></add-or-update>
  </div>
</template>

<script>
import CouponSelect from '@/components/coupon-select'
import AddOrUpdate from './userLevel-add-or-update'
export default {
  components: {
    CouponSelect,
    AddOrUpdate
  },
  created () {
    this.getData()
  },
  data () {
    return {
      index: 0,
      prodsSelectVisible: false,
      couponSelectVisible: false,
      userLevelUpdateVisible: false,
      addOrUpdateVisible: false,
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      dataForm: {
        parentId: null,
        id: null,
        levelType: 0,
        userLevels: []
      },
      maxLength: 0,
      isUpdateData: false,
      userLevel: [
        {
          id: null,
          level: 0,
          levelName: '',
          levelType: 0,
          needGrowth: 0,
          term: 1,
          termType: 3,
          img: '',
          discount: 10,
          discountRange: 0,
          discountType: 0,
          presScore: 0,
          rateScore: 1,
          isFreeFee: 0,
          couponList: [],
          userRightsIds: [],
          categorys: null
        }
      ]
    }
  },
  methods: {
    // 获取数据
    getData () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userLevel/list'),
        method: 'get',
        params: this.$http.adornParams({
          userLevelType: 0
        })
      }).then(({ data }) => {
        console.log('this.isUpdateData', this.isUpdateData)
        this.dataForm.userLevels = data
        this.maxLength = data.length
        this.dataForm.userLevels.forEach(item => {
          console.log('item.status', item.status)
          if (item.status === -1) {
            this.isUpdateData = true
          }
        })
        console.log('this.isUpdateData', this.isUpdateData)
      })
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    },
    // 新增 / 修改
    addOrUpdateHandle (index) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(this.dataForm.userLevels, index)
      })
    },
    // 删除列
    deleteRow (index) {
      // var bool = true
      // for (var i = 0; i < this.dataForm.userLevels.length; i++) {
      //   if (i === index && bool) {
      //     this.dataForm.userLevels.splice(index, 1)
      //     bool = false
      //     i--
      //   } else if (i < index) {
      //   } else {
      //     this.dataForm.userLevels[i].level = i + 1
      //   }
      // }
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // if (this.dataForm.userLevels.length === 2) {
        //   this.errorMsg('最后一个会员等级不能删除')
        // }
        this.dataForm.id = this.dataForm.userLevels[index].id
        // 删除列并更新数据
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/userLevel`),
            method: 'delete',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.isUpdateData = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.getData()
          }).catch(() => { })
        } else {
          this.getData()
        }
      }).catch(() => { })
    },
    // 增加列
    addRow: function () {
      if (this.dataForm.userLevels.length >= 50) {
        this.$message({
          message: '最多只能添加50个等级',
          type: 'warning'
        })
        return
      }
      if (this.dataForm.userLevels.length > this.maxLength) {
        this.$message({
          message: '先保存上个等级才能创建新的等级',
          type: 'warning'
        })
        return
      }
      var needGrowth = 0
      if (this.dataForm.userLevels.length > 0) {
        needGrowth = this.dataForm.id = this.dataForm.userLevels[this.maxLength - 1].needGrowth + 1
      }
      var level = JSON.parse(JSON.stringify(this.userLevel[0]))
      level.levelId = null
      level.level = this.dataForm.userLevels.length + 1
      // if (level.conditionData.commodity) {
      //   level.conditionData.commodity = []
      // }
      let levelNum = parseInt(this.dataForm.userLevels.length) + 1
      level.levelName = '会员等级' + levelNum
      this.dataForm.userLevels.push(level)
      this.dataForm.userLevels[this.maxLength].needGrowth = needGrowth
    },
    updateUserLevel () {
      this.$http({
        url: this.$http.adornUrl('/user/userLevel/updateUserLevel'),
        method: 'put',
        data: this.$http.adornData({
          levelType: 0
        })
      }).then(({ data }) => {
        location.reload()
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss">
.distribution-level-set {
  .el-input__inner {
    padding: 2px;
    border-radius: 3px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .award-box {
    input {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 10px;
    }
  }
}
.level-table-box {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px;
}
.elTable th {
  padding: 10px 0 !important;
}
.elTable td {
  padding: 2px 0 !important;
}
.table-input-box {
  margin-top: 20px;
  width: 75px !important;
}
.table-template {
  text-align: center;
}
.table-template > * {
  display: inline-block;
  margin: auto;
}
.card-prod-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

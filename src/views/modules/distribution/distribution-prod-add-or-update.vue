<template>
  <div class="mod-distribution-prod-add-or-update">
    <el-dialog
      :title="!dataForm.distributionProdId ? '新增分销商品' : '修改分销商品'"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit ()"
        label-width="90px"
      >
        <el-form-item label="关联商品">
          <div v-if="prodData[0]!=null">
            <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
              <img :src="prodData[0].pic" style="height:104px;width:100%" />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{prodData[0].prodName}}</span>
              </div>
            </el-card>
          </div>
          <el-button @click="addProd" v-if="prodData[0]==null" size="small">选择商品</el-button>
        </el-form-item>

        <el-form-item label="默认奖励" prop="defaultReward">
          <el-radio-group v-model="dataForm.defaultReward">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-if="dataForm.defaultReward === 0">
          <el-form-item label="奖励比例" prop="awardType">
            <el-radio-group v-model="dataForm.awardProportion">
              <el-radio :label="0">按比例奖励</el-radio>
              <el-radio :label="1">按固定数值奖励</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="奖励设置" prop="awardType">
            <el-radio-group v-model="dataForm.awardNumberSet" @change="awardNumberSetChange">
              <el-radio :label="0">不根据等级奖励</el-radio>
              <el-radio :label="1">根据等级奖励</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="邀请人奖励" prop="awardType">
            <el-radio-group v-model="dataForm.parentAwardSet">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="数额设置" prop="awardType">
            <div v-if="dataForm.awardNumberSet === 0">
              <el-input v-model="dataForm.awardNumbers" :precision="2" :min="0" style="width:200px">
                <template slot="append">
                  <span v-if="dataForm.awardProportion === 1">元</span>
                  <span v-else>%</span>
                </template>
              </el-input>

              <span v-if="dataForm.parentAwardSet === 1">&nbsp; 邀请人奖励数额:</span>
              <el-input
                v-model="dataForm.parentAwardNumbers"
                :precision="2"
                :min="0"
                v-if="dataForm.parentAwardSet === 1"
                style="width:200px"
              >
                <template slot="append">
                  <span v-if="dataForm.awardProportion === 1">元</span>
                  <span v-else>%</span>
                </template>
              </el-input>
            </div>
            <div v-if="dataForm.awardNumberSet === 1">
              <el-table :data="levelData" max-height="250">
                <el-table-column prop="name" label="名字" fit></el-table-column>

                <el-table-column label="奖励数额" width="300">
                  <template slot-scope="scope">
                    <el-input
                      v-model.number="levelData[scope.$index].awardNumber"
                      placeholder="请输入内容"
                    >
                      <template slot="append">
                        <span v-if="dataForm.awardProportion === 1">元</span>
                        <span v-else>%</span>
                      </template>
                    </el-input>
                  </template>
                </el-table-column>

                <el-table-column label="邀请人奖励数额" width="300" v-if="dataForm.parentAwardSet === 1">
                  <template slot-scope="scope">
                    <el-input
                      v-model.number="levelData[scope.$index].parentAwardNumber"
                      placeholder="请输入内容"
                    >
                      <template slot="append">
                        <span v-if="dataForm.awardProportion === 1">元</span>
                        <span v-else>%</span>
                      </template>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </div>

        <el-form-item label="状态:" prop="state">
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addProdVisible" ref="addProd" @refreshDiscountProds="selectDiscountProds"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from '../marketing/discountProd-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        'prodId': 0,
        'distributionAmount': 0,
        'awardId': 0,
        'state': 1,
        'defaultReward': 1,
        'awardProportion': 0,
        'awardNumberSet': 0,
        'awardNumbers': '',
        'parentAwardNumbers': '',
        'parentAwardSet': 0
      },
      isSubmit: false,
      levelData: [],
      prodData: [],
      addProdVisible: false,
      visible: false,
      dataRule: {

      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    init (data) {
      this.visible = true
      this.isSubmit = false
      if (data) {
        this.dataForm = Object.assign(this.dataForm, data)
        this.prodData[0] = this.dataForm.product
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.defaultReward = 1
          this.levelData = []
          this.prodData = []
          this.distributionProdId = null
        })
      }
      this.getLevelDataList(data)
    },

    // 获取等级数据列表
    getLevelDataList (isReadLevelData) {
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionLevel/info'),
        method: 'get'
      }).then(({ data }) => {
        this.levelData = data
        if (isReadLevelData) {
          // 如果是根据等级奖励
          if (this.dataForm.awardNumberSet === 1) {
            // 从奖励表获取奖励数额json
            let awardNumbers = JSON.parse(this.dataForm.awardNumbers)
            let parentAwardNumbers = JSON.parse(this.dataForm.parentAwardNumbers)
            // 从Map中匹配对应的数额
            this.levelData.forEach((item, index) => {
              this.levelData[index].awardNumber = awardNumbers[index]
              this.levelData[index].parentAwardNumber = parentAwardNumbers[index]
            })
          }
        }
      })
    },
    // 删除关联商品数据
    deleteRelation () {
      this.dataForm.prodId = null
      this.prodData = []
    },
    // 打开选择商品
    addProd () {
      this.addProdVisible = true
      this.$nextTick(() => {
        this.$refs.addProd.init(0, this.prodData)
      })
    },
    // 商品选择回调
    selectDiscountProds (prods) {
      if (prods) {
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/distribution/distributionProd/count'),
            method: 'get',
            params: this.$http.adornParams({
              prodId: prods[0].prodId
            })
          }).then(({ data }) => {
            if (data === 0) {
              this.dataForm.prodId = prods[0].prodId
              this.$set(this.prodData, 0, prods[0])
            } else {
              this.$message({
                message: '该商品已经在分销商品列表中',
                type: 'warning'
              })
            }
          })
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.awardNumberSet === 1) {
            // 创建json存入奖励表
            let awardNumberjson = []
            let parentAwardNumberjson = []
            this.levelData.forEach((item, index) => {
              awardNumberjson.push(Number.parseFloat(item.awardNumber).toFixed(2))
              parentAwardNumberjson.push(Number.parseFloat(item.parentAwardNumber).toFixed(2))
            })
            this.dataForm.awardNumbers = JSON.stringify(awardNumberjson)
            this.dataForm.parentAwardNumbers = JSON.stringify(parentAwardNumberjson)
          }
          let param = this.dataForm
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/distribution/distributionProd`),
            method: param.distributionProdId ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    },
    awardNumberSetChange (val) {
      if (val === 0) {
        this.dataForm.awardNumbers = 0
        this.dataForm.parentAwardNumbers = 0
      }
    }
  }
}
</script>
<style lang="scss">
</style>

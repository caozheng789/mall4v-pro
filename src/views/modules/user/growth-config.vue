<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">成长值获取设置</div>
    <el-form ref="dataForm"
             label-width="180px"
             size="mini"
             class="set-form"
             label-position="left"
             :rules="dataRule"
             :model="dataForm">
      <el-form-item label="购买商品每消费:"
                    style="width:440px"
                    prop="buyPrice">
        <el-input v-model="dataForm.buyPrice"><template slot="append">元获取一点成长值</template></el-input>
        <!-- <span class="tips">元可获取1积分</span> -->
      </el-form-item>
      <el-form-item label="每完成一笔订单获取:"
                    style="width:440px"
                    prop="buyOrder">
        <el-input v-model="dataForm.buyOrder"><template slot="append">成长值</template></el-input>
        <!-- <span class="tips">元可获取1积分</span> -->
      </el-form-item>
    </el-form>
    <el-button @click="dataFormSubmit()">保存</el-button>
  </div>
</template>

<script>
export default {
  created () {
    this.getData()
  },
  data () {
    return {
      addOrUpdateVisible: false,
      dataForm: {
        id: 0,
        buyPrice: 0.0,
        buyOrder: 0.0
      },
      dataRule: {
        buyPrice: [
          { required: true, message: '消费金额获取成长值不能为空', trigger: 'blur' }
        ],
        buyOrder: [
          { required: true, message: '订单获取不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取数据
    getData () {
      // if (this.dataForm.id) {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/GrowthConfig/info/' + 'GROWTH_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data.buyPrice) {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
      // }
    },
    // 设置数据
    setDate (data) {
      this.dataForm = data
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/user/GrowthConfig/`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          }).catch(() => {

          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.distribution-withdraw-cash-set {
  .input-tips {
    font-size: 12px;
  }
}
</style>

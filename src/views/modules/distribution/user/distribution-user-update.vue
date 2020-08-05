<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog :title="'状态修改'"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               @keyup.enter.native="dataFormSubmit()"
               label-width="80px">

        <el-form-item label="状态"
                      size="mini"
                      prop="state">
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">清退</el-radio>
            <el-radio :label="-1">封禁</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="原因"
                      prop="banReason"
                      v-if="dataForm.state != 0">
          <el-select v-model="dataForm.banReason">
            <el-option label="失去联系"
                       :value="0"></el-option>
            <el-option label="恶意刷单"
                       :value="1"></el-option>
            <el-option label="其他"
                       :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注"
                      prop="remarks">
          <el-input type="textarea"
                    placeholder="备注"
                    v-model="dataForm.remarks"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary"
                   @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        distributionUserId: null,
        state: 0,
        banReason: 0,
        remarks: ''
      },
      addProdVisible: false,
      visible: false,
      dataRule: {
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        banReason: [
          { required: true, message: '请选择不通过原因', trigger: 'blur' }
        ],
        remarks: [
          { max: 255, message: '长度在 255 个字符内', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
  },
  methods: {
    init (data) {
      this.visible = true
      this.dataForm = Object.assign(this.dataForm, data)
    },
    // 表单提交
    dataFormSubmit (row, index, done, loading) {
      this.$http({
        url: this.$http.adornUrl(`/distribution/distributionUser/state`),
        method: 'put',
        data: this.$http.adornData({
          distributionUserId: this.dataForm.distributionUserId,
          state: this.dataForm.state,
          banReason: this.dataForm.banReason,
          remarks: this.dataForm.remarks
        })
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
      })
    }
  }

}
</script>

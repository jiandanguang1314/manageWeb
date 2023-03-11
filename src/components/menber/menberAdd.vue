<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="会员等级：" prop="menberLevel" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.menberLevel"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="等级名称：" prop="menberName" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.menberName"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="充值积分率："   prop="menberPoints" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.menberPoints"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
            <el-tooltip class="item" effect="dark" content="计算公式：充值积分=充值金额*消费积分率/100" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
           <el-form-item label="推荐人积分率："   prop="rewardPoints" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.rewardPoints"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
            <el-tooltip class="item" effect="dark" content="计算公式：推荐积分=推荐人充值金额*推荐积分率/100" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="享受折扣：" prop="discount" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.discount"
                auto-complete="off"
                :maxlength="50"
              >
              </el-input>
            </el-col>
            <el-tooltip class="item" effect="dark" content="示例：100就是不打折，90就是打九折" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="checkSure" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      formLabelWidth: '140px',
      showValue: false,
      rows: 3,
      registTime: '',
      rules: {
        menberLevel: [
          // eslint-disable-next-line standard/object-curly-even-spacing
          { required: true, message: '请输入会员等级', trigger: 'blur'}
        ],
        menberPoints: [
          { required: true, message: '请输入充值积分率', trigger: 'blur' }
        ],
        rewardPoints: [
          { required: true, message: '请输入推荐人积分率', trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '请输入享受折扣率', trigger: 'blur' }
          // eslint-disable-next-line standard/object-curly-even-spacing
        ]
      }
    }
  },
  props: {
    value: {
      default: false,
      type: Boolean
    },
    dialogType: {
      default: '',
      type: String
    },
    dataForm: {
      type: Object,
      default: {}
    }
  },
  methods: {
    closeDialog () {
      this.showValue = false
      this.$refs['rulesForm'].resetFields()
    },
    checkSure () {
      this.$refs['rulesForm'].validate(valid => {
        if (valid) {
          this.$emit('add-sure', this.dataForm)
          this.showValue = false
          this.$refs['rulesForm'].resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style scoped>
</style>

<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" @open="getViplist" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="手机号：" prop="mobile" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.mobile"
                auto-complete="off"
                :maxlength="11"
                :disabled="dataForm.flag"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="会员卡号:" prop="vipCard" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.vipCard"
                auto-complete="off"
                :maxlength="200"
                :disabled="dataForm.flag"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="姓名：" prop="name" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.name"
                auto-complete="off"
                :maxlength="5"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="积分：" prop="menberPoints" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.menberPoints"
                auto-complete="off"
                :maxlength="5"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="会员模板" prop="menberId" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-select v-model="dataForm.menberId" value-key="id" placeholder="请选择" @change="selectChange" style="width:100%;">
                <el-option
                  v-for="(item,key) in vipList"
                  :key="key"
                  :label="item.menberName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="会员等级" prop="menberLevel" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.menberLevel"
                auto-complete="off"
                :maxlength="50"
                disabled
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="消费积分" prop="menberPoints" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.menberPoints"
                auto-complete="off"
                :maxlength="50"
                disabled
              >
              </el-input>
            </el-col>
          </el-form-item> -->
          <el-form-item label="享受折扣" prop="discount" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.discount"
                auto-complete="off"
                :maxlength="50"
                disabled
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="推荐人手机号：" prop="recommenderMobile" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.recommenderMobile"
                auto-complete="off"
                :maxlength="11"
                :disabled="dataForm.flag"
              >
              </el-input>
            </el-col>
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
      registTime: '',
      vipList: [],
      rules: {
        mobile: [
          // eslint-disable-next-line standard/object-curly-even-spacing
          { required: true, message: '请输入手机号', trigger: 'blur'},
          { min: 11, max: 11, message: '请正确输入手机号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        menberPoints: [
          { required: true, message: '请输入积分', trigger: 'blur' }
        ],
        menberId: [
          { required: true, message: '请选择会员模板', trigger: 'change' }
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
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  methods: {
    getViplist () {
      this.common.httpGet('/vip/getAllMenberByShopId?shopId=' + this.common.getShopId())
        .then(res => {
          if (res.data.meta.code === 0) {
            this.vipList = res.data.data
          } else {
            this.vipList = []
          }
          this.selectChange(this.dataForm.menberId)
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectChange (val) {
      let obj = {}
      this.vipList.map(vip => {
        if (vip.id == val) {
          obj = Object.assign({}, vip)
        }
      })
      this.dataForm.menberId = val
      this.dataForm.menberLevel = obj.menberLevel
      // this.dataForm.menberPoints = obj.menberPoints;
      this.dataForm.discount = obj.discount
    },
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

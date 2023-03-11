<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="手机号：" prop="mobile" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="dataForm.mobile"  auto-complete="off"  :maxlength="11" disabled > </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="会员卡号：" prop="vipCard" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="dataForm.vipCard"  auto-complete="off"  :maxlength="200" disabled > </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="姓名：" prop="name" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="dataForm.name" auto-complete="off" :maxlength="5" disabled > </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="充值金额" prop="amount" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model.number="dataForm.amount" auto-complete="off" :maxlength="6"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="dataForm.remark" auto-complete="off" :maxlength="50"></el-input>
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
  data() {
    return {
      formLabelWidth: '140px',
      showValue: false,
      rows: 3,
      registTime:'',
      rules: {
        mobile: [
          // eslint-disable-next-line standard/object-curly-even-spacing
          { required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数字'}
        ],

      }
    };
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
      default: {},
    },
  },
  methods: {
    closeDialog() {
      this.showValue = false;
      this.$refs['rulesForm'].resetFields();
    },
    checkSure() {
      this.$refs['rulesForm'].validate(valid => {
        if (valid) {
          this.$emit('add-sure', this.dataForm);
          this.showValue = false;
          this.$refs['rulesForm'].resetFields();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  watch: {
    value(val) {
      this.showValue = val;
    },
    showValue(val) {
      this.$emit('input', val);
    }
  }
};
</script>

<style scoped>
</style>
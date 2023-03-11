<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="商品名称：" prop="name" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input  v-model="dataForm.name" auto-complete="off" :maxlength="20" ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="价钱" prop="price" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="dataForm.price" auto-complete="off" :maxlength="20"  ></el-input>
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
      formLabelWidth: "140px",
      showValue: false,
      rows: 3,
      registTime:'',
      rules: {
        name: [
          { required: true, message: "请输入商品名称",  trigger: "blur"}
        ],
        price: [
          { required: true, message: "请输入价钱", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    value: {
      default: false,
      type: Boolean
    },
    dialogType: {
      default: "",
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
      this.$refs["rulesForm"].resetFields();
    },
    checkSure() {
      this.$refs["rulesForm"].validate(valid => {
        if (valid) {
          this.$emit("add-sure", this.dataForm);
          this.showValue = false;
          this.$refs["rulesForm"].resetFields();
        } else {
          console.log("error submit!!");
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
      this.$emit("input", val);
    }
  }
};
</script>
<style scoped>
</style>
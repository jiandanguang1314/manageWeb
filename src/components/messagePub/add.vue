<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="消息标题" prop="title" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.title"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="消息内容" prop="content" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.content"
                auto-complete="off"
                :maxlength="200"
                type="textarea"
                :rows="6"
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
  data() {
    return {
      formLabelWidth: "140px",
      showValue: false,
      rows: 3,
      registTime:'',
      rules: {
        title: [
          { required: true, message: "请输入消息标题",  trigger: "blur"}
        ],
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
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
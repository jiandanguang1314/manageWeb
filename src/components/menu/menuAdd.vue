<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="菜单名称：" prop="name" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.name"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="菜单地址：" prop="url" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.url"
                auto-complete="off"
                :maxlength="100"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="菜单状态" prop="state" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-select
                v-model="dataForm.state"
                clearable
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in authList"
                  :key="index"
                  :label="item.label"
                  :value="item.val">
                </el-option>
              </el-select>
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
      authList: [ {label: "启用", val: 1},{label: "禁用",val: 2}],
      rules: {
        shopName: [
          { required: true, message: "请输入菜单名称",  trigger: "blur"}
        ],
        bossName: [
          { required: true, message: "请输入菜单地址", trigger: "blur" }
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
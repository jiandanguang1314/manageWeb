<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="角色类型" prop="roleType" :label-width="formLabelWidth">
            <el-col :span="22">
              <div>
            <el-select
              v-model="dataForm.roleType"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in roleList"
                :key="index"
                :label="item.label"
                :value="item.val">
              </el-option>
            </el-select>
            </div>
          </el-col>
        </el-form-item>
          <el-form-item label=" 角色名称：" prop="roleName" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.roleName"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.remarks"
                auto-complete="off"
                :maxlength="50"
              >
              </el-input>
            </el-col>
          </el-form-item>
         
          <el-form-item label="状态" prop="state" :label-width="formLabelWidth">
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
      authList: [
        {
          label: "启用",
          val: 1
        },
        {
          label: "禁用",
          val: 0
        }
      ],roleList: [
        {
           label: "店管理员",
          val: 4
        },
        {
           label: "店老板",
          val: 3
        },
        {
          label: "业务管理员",
          val: 2
        },
        {
          label: "超级管理员",
          val: 1
        }
      ],
      registTime:'',
      rules: {
        roleName: [
          { required: true, message: "请输入商店名称",  trigger: "blur"}
        ],
        roleType: [
          { required: true, message: "请输入经营人", trigger: "blur" }
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
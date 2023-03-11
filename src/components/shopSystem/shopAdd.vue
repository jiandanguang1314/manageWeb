<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="店名：" prop="shopName" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.shopName"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="经营人：" prop="bossName" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.bossName"
                auto-complete="off"
                :maxlength="5"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="联系电话：" prop="shopMobile" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.shopMobile"
                auto-complete="off"
                :maxlength="11"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="经营范畴" prop="category" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.category"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="营业执照号" prop="businessLicense" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.businessLicense"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.address"
                auto-complete="off"
                :maxlength="50"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="会员到期日期" prop="expiryTime" :label-width="formLabelWidth">
            <el-col :span="11">
              <el-form-item prop="date">
                <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.expiryTime"  style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="是否连锁" prop="isMultiple" :label-width="formLabelWidth">
            <el-col :span="22">
            <el-select
              v-model="dataForm.isMultiple"
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
          label: "是",
          val: 1
        },
        {
          label: "否",
          val: 2
        }
      ],
      expiryTime:'',
      rules: {
        shopName: [
          { required: true, message: "请输入商店名称",  trigger: "blur"}
        ],
        bossName: [
          { required: true, message: "请输入经营人", trigger: "blur" }
        ],
        shopMobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { min: 11, max: 11, message: '请正确输入手机号', trigger: 'blur' }
        ],
        category: [
          { required: true, message: "请输入经营范畴", trigger: "blur" }
        ],
        businessLicense: [
          { required: true, message: "请输入营业执照号", trigger: "blur" }
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
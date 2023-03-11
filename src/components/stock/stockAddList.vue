<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" fullscreen style="min-width:980px;">
        <div class="search-box">
          <span></span><el-input  v-model="barcode" class="search-ipt"  placeholder="请扫描条形码"></el-input>
          <el-button type="success" @click="getProductInfo()" >查询</el-button> 
          <el-button type="success" @click="addEvent" >自定义</el-button>
          <el-button type="success" @click="checkSure()" >保存</el-button>
          <el-form :model="dataForm" border  :rules="rules" ref="rulesForm"  style="min-width:980px;">
            <el-form-item label="条形码：" prop="barcode" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input  v-model="dataForm.barcode" id='barcode' auto-complete="off" :maxlength="20"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="商品名称：" prop="brand" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input  v-model="dataForm.brand" auto-complete="off" :maxlength="20"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="价钱：" prop="price" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input v-model="dataForm.price"  auto-complete="off" :maxlength="20"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="数量：" prop="productNum" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input v-model="dataForm.productNum" auto-complete="off" value="0" :maxlength="20"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div>
            基本信息： 
            <table >
              <tr>
                <td>名称规格：</td><td> {{dataForm.name}}</td> 
              </tr>
              <tr> 
                 <td>类型：</td><td>{{dataForm.keyword}}</td>
              </tr> 
              <tr> 
                 <td>规格：</td><td>{{dataForm.type}}</td>
              </tr>
              <tr> 
                 <td>生产公司：</td><td>{{dataForm.company}}</td>
              </tr>
              <tr> 
                 <td>产地：</td><td>{{dataForm.origincountry}}-{{dataForm.originplace}}</td>
              </tr>
            </table>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import tip from "@/static/tip";
export default {
  data() {
    return {
      url: this.common.serverUrl + "/product/barcodeScanning",
      formLabelWidth: "140px",
      dataForm: {},
      barcode: "", 
      showValue: false,
      rows: 3,
      registTime:'',
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur"}],
        price: [{ required: true, message: "请输入价钱", trigger: "blur" }],
        productNum: [{ required: true, message: "请输入数量", trigger: "blur" }],
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
  },
  methods: {
    getProductInfo() { 
      let url = this.url + "?";
      if (this.barcode != "") {
        url += "barcode=" + this.barcode;
      }
      this.common.execServerCall(url, "GET", "", "").then(result => {
        this.dataForm = result.data.data;
      });
    },
    //新增弹窗
    addEvent() {
      this.dialogAdd = true;
      this.dialogName = "自定义商品";
      this.dataForm = {
      }
    }, 
    //添加
    sureAdd(form) {
      let params = Object.assign({}, form);
      this.common
        .httpPost("/system/addMenuInfo", params, "")
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pageNum = 1;
            this.getList(1);
            this.dataForm={};
            this.messageInfo("添加成功", "success");
          } else {
            this.messageInfo(res.data.meta.message, "warning");
          }
        })
        .catch(err => {
          console.log(err);
          this.messageInfo("添加失败", "warning");
        });
    },  
    //获取更新时间
    getUpdateTime(val) {
      if (isNaN(Number(val)) || val == 0) {
        return "";
      } else {
        return this.common.getUpdateTime(Number(val));
      }
    },
    //获取年月日
    getDateByLong(val) {
      if (isNaN(Number(val)) || val == 0) {
        return "";
      } else {
        return this.common.getDateByLong(Number(val));
      }
    }, 

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
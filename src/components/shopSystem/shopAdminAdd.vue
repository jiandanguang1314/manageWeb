<template>
  <div>
    <el-dialog :visible.sync="showValue" :title="dialogType" width="980px" @open="getAdminList" :before-close="closeDialog">
      <div class="flexBox">
        <div style="width:46%;">
          <!--全部列表-->
          <h3 style="text-align: center;">全部列表</h3>
          <div class="search-box">
            <el-input
              size="small"
              v-model.trim="phoneNum"
              @keyup.enter.native="searchList"
              placeholder="手机号"
              :maxlength="20"
              style="width: 120px"></el-input>
            <el-button size="small" type="primary" @click="searchList">搜索</el-button>
          </div>
          <el-table
            style="width:100%;"
            ref="multipleTable"
            :data="tableData"
            height="442"
            @selection-change="handleSelectionChange">
              <el-table-column
                type="selection">
              </el-table-column>
              <el-table-column
                prop="mobile"
                align="center"
                label="手机号">
              </el-table-column>
              <el-table-column
                prop="userName"
                align="center"
                label="姓名">
              </el-table-column>
          </el-table>
          
        </div>
        <div class="centerBox">
          <div>
              <el-button class="tree-btn" :disabled="isAdd" @click="addItem">
                添加 
                <i class="el-icon-arrow-right"></i>
              </el-button>
              <br><br>
              <el-button class="tree-btn" :disabled="isDelete" @click="deleteItem">
                移除 
                <i class="el-icon-arrow-left "></i>
              </el-button>
          </div>
        </div>
        <div style="width:46%;">
          <h3 style="text-align: center;">已选列表</h3>
          <div class="search-box">
              
          </div>
          <el-table
            style="width:100%;"
            fixed
            height="442"
            :data="tableData2"
            @selection-change="handleSelectionChange2">
              <el-table-column
                type="selection">
              </el-table-column>
              <el-table-column
                prop="userMobile"
                align="center"
                label="手机号">
              </el-table-column>
              <el-table-column
                prop="userName"
                align="center"
                label="姓名">
              </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="text-align: right;margin-top: 10px;">
          <el-button @click="closeDialog">取消</el-button>
          <el-button @click="checkSure" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tip from "@/static/tip";
export default {
  mixins: [tip],
  data() {
    return {
      data2: [],
      value2: [1, 2, 3],
      url: "/system/queryShopAdminPage",
      searchUrl: "/system/getUserInfoByMobile",
      tableData: [],
      tableData2: [],
      multipleSelection: [],
      selectedItem: [],
      showValue: false,
      phoneNum: ""
    };
  },
  computed: {
    isAdd() {
      if (this.multipleSelection.length <= 0) {
        return true;
      } else {
        return false;
      }
    },
    isDelete() {
      if (this.tableData2.length > 0) {
        return false;
      } else {
        return true;
      }
    }
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
    shopId: null,
    shopName: null
  },
  methods: {
    searchList() {
      let params = this.phoneNum ? "?mobile=" + this.phoneNum : "";
      this.common
        .httpGet(this.searchUrl + params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.tableData = [res.data.data];
          } else {
            this.tableData = [];
          }
          this.$nextTick(() => {
            this.toggleSelection();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAdminList() {
      let params = "?pageSize=100&pageNum=1&shopId="+this.shopId;
      this.common
        .httpGet(this.url + params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.tableData2 = res.data.data.rows;
          } else {
            this.tableData2 = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange2(val) {
      this.selectedItem = val;
    },
    toggleSelection() {
      let rows = [];
      this.tableData2.map(val => {
        this.tableData.map(item => {
          if (item.mobile === val.userMobile) {
            rows.push(item);
          }
        });
      });
      this.$refs.multipleTable.clearSelection();
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, true);
      });
    },
    addItem() {
      this.multipleSelection.map(val => {
        let status = 1;
        this.tableData2.map(label => {
          if (label.userMobile === val.mobile) {
            status = 2;
          }
        });
        
        if (status === 1) {
          let obj = {
            userId: val.id,
            userMobile: val.mobile,
            userName: val.userName
          }
          this.tableData2.push(obj);
        }
      });
      this.toggleSelection();
    },
    deleteItem() {
      this.selectedItem.map(val => {
        this.tableData2.map((label, index) => {
          if (label.userMobile === val.userMobile) {
            this.tableData2.splice(index, 1);
          }
        });
      });
      this.toggleSelection();
    },
    closeDialog() {
      this.showValue = false;
      this.phoneNum = '';
      this.tableData = [];
    },
    checkSure() {
      let params = {
        shopId: this.shopId,
        shopName: this.shopName,
        userInfoList: []
      };
      this.tableData2.map(val=>{
        let obj = {         
          userId: val.userId,
          userMobile: val.userMobile,
          userName: val.userName
        }
        params.userInfoList.push(obj)
      })
      this.common.httpPost('/system/addShopAdminBatch',params)
        .then(res=>{
          if(res.data.meta.code === 0) {
            this.messageInfo("保存成功", "success");
            this.closeDialog()
          }else{
            this.messageInfo(res.data.meta.message, "warning")
          }    
        })
        .catch(err=>{
          console.log(err)
          this.messageInfo("请求失败", "warning");
        })
      this.closeDialog();
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
.right {
  float: right;
}
.flexBox {
  display: -webkit-flex;
  display: flex;
}
.search-box {
  margin-bottom: 15px;
  height: 30px;
}
.centerBox {
  padding: 0 15px;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}
.btn-box {
  text-align: right;
  padding: 10px 0;
}
</style>

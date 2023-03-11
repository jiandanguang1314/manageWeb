<template>
<div>
  <div class="search-box">
    <span>店名：</span><el-input  v-model="shopName" class="search-ipt"  placeholder="请输入内容"></el-input>
    <span >经营人：</span><el-input v-model="bossName" class="search-ipt"  placeholder="请输入内容"></el-input>
    <span >联系电话：</span><el-input v-model="shopMobile" class="search-ipt"  placeholder="请输入内容"></el-input>
    <el-button type="success" @click="getList(1)" >查询</el-button>
    <el-button type="success" @click="addEvent" >新增</el-button> 
  </div>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      header-align="center"
      prop="shopName"
      label="店名"
      width="180">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="bossName"
      label="经营人"
      width="180">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="shopMobile"
      label="联系电话"
      width="180">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="expiryTime"
      label="会员到期日期">
      <template slot-scope="scope" >
        {{getDateByLong(scope.row.expiryTime)}}
      </template>
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="updateTime"
      label="操作时间">
      <template slot-scope="scope">
        {{getUpdateTime(scope.row.updateTime)}}
      </template>
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="updateTime"
      label="操作">
      <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(3,scope.row)">添加管理员</el-button>
          <el-button type="text" size="small" @click="handleEdit(1,scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleEdit(2,scope.row)">删除</el-button>
        </template>
    </el-table-column>
  </el-table>
  <!--分页-->
  <div class="block footer_nav">
      <span class="other-style">共{{totalRecords}}条记录</span>
      <el-pagination
        class="pagination-style"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="10"
        layout="prev, pager, next,  jumper"
        :total="totalRecords">
      </el-pagination>
  </div>
  <add-dialog
    v-model="dialogAdd"
    :dialog-type="dialogName"
    :data-form="dataForm"
    @add-sure="checkSure"
  >
  </add-dialog>
  <add-admin-dialog
    v-model="dialogAddAdmin"
    :shop-id="checkId"
    :shop-name="checkName"
    :dialog-type="dialogName"
    @add-sure="checkSure"
  >
  </add-admin-dialog>
</div>
</template>
<script>
import addDialog from "./shopAdd.vue";
import addAdminDialog from "./shopAdminAdd.vue";
import tip from "@/static/tip";

export default {
  mixins: [tip],
  data() {
    return {
      url: this.common.serverUrl + "/vip/queryShopPageAdmin",
      shopName: "",
      bossName: "",
      shopMobile: "",
      expiryTime: "",
      updateTime: "",
      dialogName: "",
      dialogForm: "",
      checkId: "",
      checkName: "",
      dataForm: {},
      pageNum: 1,
      dialogAdd: false,
      dialogAddAdmin: false,
      totalRecords: 0,
      tableData: [{}]
    };
  },
  created() {
    this.getList(1);
  },
  components: {
    addDialog,
    addAdminDialog,
  },
  methods: {

    handleCurrentChange(current) {
      this.pageNum = current;
      this.getList(current);
    },

    getList(current) {
      this.pageNum = current;
      let url = this.url + "?";
      if (this.shopName != "") {
        url += "shopName=" + this.shopName + "&";
      }
      if (this.bossName != "") {
        url += "bossName=" + this.bossName + "&";
      }
      if (this.shopMobile != "") {
        url += "shopMobile=" + this.shopMobile + "&";
      }
      url += "pageNum=" + this.pageNum + "&pageSize=10";
      this.common.execServerCall(url, "GET", "", "").then(list => {
        this.tableData = list.data.data.rows;
        this.totalRecords = list.data.data.totalRecords;
      });
    },
    //处理反馈
    handleEdit(ids, row) {
      switch (ids) {
        case 1:
          this.editEvt(row);
          break;
        case 2:
          this.delEvt(row.shopId);
          break;
        case 3:
          this.addAdminEvent(row);
          break;
      }
    },
    //新增弹窗
    addEvent() {
      this.dialogAdd = true;
      this.dialogName = "添加店铺信息";
    },
    //编辑弹窗
    editEvt(row) {
      this.dialogAdd = true;
      this.dialogName = '编辑店铺信息';
      this.dataForm = {
        shopName: row.shopName,
        bossName: row.bossName,
        shopMobile: row.shopMobile,
        category: row.category,
        businessLicense: row.businessLicense,
        address: row.address,
        expiryTime: row.expiryTime,
        isMultiple: row.isMultiple,
        shopId: row.shopId,
      }
    },
    //添加管理员弹窗
    addAdminEvent(row) {
      this.checkId = row.shopId;
      this.checkName = row.shopName;
      this.dialogAddAdmin = true;
      this.dialogName = "添加店铺管理员";
    },
    //弹窗确定
    checkSure(form) {
      if (this.dialogName === "添加店铺信息") {
        this.sureAdd(form);
      } else if (this.dialogName === "编辑店铺信息") {
        this.sureEdit(form);
      }else if (this.dialogName === "添加店铺管理员") {
        this.addAdminUser(form);
      }
    },
    //添加
    sureAdd(form) {
      let params = Object.assign({}, form);
      params.expiryTime= this.common.getTimeCode(params.expiryTime);
      this.common
        .httpPost("/vip/addShop", params, "")
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
    //编辑
    sureEdit(form) {
      let params = Object.assign({}, form);
      params.expiryTime= this.common.getTimeCode(params.expiryTime);
      this.common
        .httpPost("/vip/updateShop", params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pages = 1;
            this.getList(1);
            this.dataForm={};
            this.messageInfo("编辑成功", "success");
          } else {
            this.messageInfo(res.data.meta.message, "warning");
          }
        })
        .catch(err => {
          console.log(err);
          this.messageInfo("编辑失败", "warning");
        });
    },
    delEvt(shopId) {
      this.confirmBox("请确认是否删除该?", () => {
        let params = {
          shopId
        };
        this.common
          .httpPost("/vip/deleteShop", params)
          .then(res => {
            if (res.data.meta.code == 0) {
              this.pages = 1;
              this.getList(1);
              this.messageInfo("删除成功", "success");
            } else {
              this.messageInfo(res.data.meta.message, "warning");
            }
          })
          .catch(err => {
            console.log(err);
            this.messageInfo("删除失败", "warning");
          });
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
    //添加店铺管理员
    addAdminUser(form) {

    },

  }
};
</script>
<template>
  <div>
    <div class="search-box">
      <span>手机号：</span>
      <el-input v-model="mobile" class="search-ipt" placeholder="请输入内容"></el-input>
      <span>姓名：</span>
      <el-input v-model="userName" class="search-ipt" placeholder="请输入内容"></el-input>
      <span>状态：</span>
      <el-select v-model="state" clearable class="search-ipt" placeholder="请选择">
        <el-option v-for="(item,index) in authList" :key="index" :label="item.label" :value="item.val">
        </el-option>
      </el-select>
      <el-button type="success" @click="getList(1)">查询</el-button>
      <el-button type="success" @click="addEvent">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column header-align="center" prop="mobile" label="手机号" width="180">
      </el-table-column>
      <el-table-column header-align="center" prop="userName" label="姓名" width="180">
      </el-table-column>
      <el-table-column header-align="center" prop="userType" label="用户类型">
        <template slot-scope="scope">
          {{getUserType(scope.row.userType)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column header-align="center" prop="operatorName" label="操作人">
      </el-table-column>
      <el-table-column header-align="center" prop="state" label="状态">
        <template slot-scope="scope">
          {{getUserState(scope.row.state)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="updateTime" label="操作时间">
        <template slot-scope="scope">
          {{getUpdateTime(scope.row.updateTime)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="updateTime" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(1,scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleEdit(2,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block footer_nav">
      <span class="other-style">共{{totalRecords}}条记录</span>
      <el-pagination class="pagination-style" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="10" layout="prev, pager, next,  jumper" :total="totalRecords">
      </el-pagination>
    </div>
    <add-dialog v-model="dialogAdd" :dialog-type="dialogName" :data-form="dataForm" @add-sure="checkSure">
    </add-dialog>
  </div>
</template>
<script>
import addDialog from "./puserAdd.vue";
import tip from "@/static/tip";

export default {
  mixins: [tip],
  data() {
    return {
      authList: [
        {
          label: "禁用",
          val: 0
        },
        {
          label: "可用",
          val: 1
        }
      ],
      url: this.common.serverUrl + "/system/queryUserInfoPageByShop",
      id: "",
      userName: "",
      mobile: "",
      state: "",
      roleName: "",
      registTime: "",
      updateTime: "",
      dialogName: "",
      dialogForm: "",
      operatorId: 1,
      operatorName: "",
      createBy: 1,
      userTyope: "",
      dataForm: {
        roleIds: []
      },
      roleId: [],
      pageNum: 1,
      dialogAdd: false,
      totalRecords: 0,
      tableData: [{}]
    };
  },
  created() {
    this.getList(1);
  },
  components: {
    addDialog
  },
  methods: {
    handleCurrentChange(current) {
      this.pageNum = current;
      this.getList(current);
    },

    getList(current) {
      this.pageNum = current;
      let url = this.url + "?";
      if (this.mobile != "") {
        url += "mobile=" + this.mobile + "&";
      }
      if (this.userName != "") {
        url += "userName=" + this.userName + "&";
      }
      if (this.state !== "") {
        url += "state=" + this.state + "&";
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
          this.delEvt(row.id);
          break;
        case 3:
          this.showEvt(row);
          break;
      }
    },
    //新增弹窗
    addEvent() {
      this.dialogAdd = true;
      this.dialogName = "添加用户信息";
      this.dataForm = {
        userType: ""
      };
    },
    //编辑弹窗
    editEvt(row) {
      this.dialogAdd = true;
      this.dialogName = "编辑用户信息";
      console.log(row.id);
      this.dataForm = {
        mobile: row.mobile,
        userName: row.userName,
        userType: row.userType,
        roleIds: row.roleIds[0],
        id: row.id
      };
    },
    //弹窗确定
    checkSure(form) {
      if (this.dialogName === "添加用户信息") {
        this.sureAdd(form);
      } else if (this.dialogName === "编辑用户信息") {
        this.sureEdit(form);
      }
    },
    //添加
    sureAdd(form) {
      let params = Object.assign({}, form);
      this.roleId = [];
      this.roleId.push(params.roleIds);
      params.roleIds = this.roleId;
      this.common
        .httpPost("/system/addUserInfo", params, "")
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pageNum = 1;
            this.getList(1);
            this.dataForm = {};
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
      console.log(params);
      this.roleId = [];
      this.roleId.push(params.roleIds);
      params.roleIds = this.roleId;
      this.common
        .httpPost("/system/updateUserInfo", params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pages = 1;
            this.getList(1);
            this.dataForm = {};
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
    delEvt(id) {
      this.confirmBox("请确认是否删除该?", () => {
        let params = {
          id
        };
        this.common
          .httpPost("/system/deleteUserInfo", params)
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
    // 1超级管理员2业务管理员3普通用户
    getUserType(val) {
      if (val == 1) {
        return "超级管理员";
      } else if (val == 2) {
        return "业务管理员";
      } else if (val == 3) {
        return "普通用户";
      }
    },
    // 1可用 0禁用
    getUserState(val) {
      if (val == 0) {
        return "禁用";
      } else if (val == 1) {
        return "可用";
      }
    }
  }
};
</script>
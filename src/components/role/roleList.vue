<template>
  <div>
    <div class="search-box">
      <span>角色名称：</span>
      <el-input v-model="roleName" class="search-ipt" placeholder="角色名称"></el-input>
      <span>角色类型：</span>
      <el-select v-model="roleType" clearable class="search-ipt" placeholder="角色类型">
        <el-option v-for="(item,index) in roleTypeList" :key="index" :label="item.label" :value="item.val">
        </el-option>
      </el-select>
      <span>状态：</span>
      <el-select v-model="state" clearable class="search-ipt" placeholder="状态">
        <el-option v-for="(item,index) in authList" :key="index" :label="item.label" :value="item.val">
        </el-option>
      </el-select>
      <el-button type="success" @click="getList(1)">查询</el-button>
      <el-button type="success" @click="addEvent">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column header-align="center" prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column header-align="center" prop="roleType" label="角色类型">
        <template slot-scope="scope">
          {{getRoleType(scope.row.roleType)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="remarks" label="描述">
      </el-table-column>
      <el-table-column header-align="center" prop="state" label="状态">
        <template slot-scope="scope">
          {{getRoleState(scope.row.state)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="operatorName" label="操作人">
      </el-table-column>
      <el-table-column header-align="center" prop="updateTime" label="操作时间">
        <template slot-scope="scope">
          {{getUpdateTime(scope.row.updateTime)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="updateTime" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(4,scope.row)">设置菜单</el-button>
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
    <add-menu-dialog v-model="dialogAddMenu" :dialog-type="dialogName" :data-form="roleForm" @add-sure="checkSure">
    </add-menu-dialog>
  </div>
</template>
<script>
import addDialog from "./roleAdd.vue";
import tip from "@/static/tip";
import addMenuDialog from "./roleAddMenu.vue";
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
      roleTypeList: [
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
      url: this.common.serverUrl + "/system/queryRoleInfoPage",
      roleName: "",
      roleType: "",
      registTime: "",
      updateTime: "",
      dialogName: "",
      dialogForm: "",
      dataForm: {},
      roleForm: {},
      state: "",
      operatorName: "",
      operatorId: 1,
      ownerId: 1,
      createBy: 1,
      pageNum: 1,
      dialogAdd: false,
      dialogAddMenu: false,
      totalRecords: 0,
      tableData: [{}]
    };
  },
  created() {
    this.getList(1);
  },
  components: {
    addDialog,
    addMenuDialog
  },
  methods: {
    handleCurrentChange(current) {
      this.pageNum = current;
      this.getList(current);
    },

    getList(current) {
      this.pageNum = current;
      let url = this.url + "?";
      if (this.roleName != "") {
        url += "roleName=" + this.roleName + "&";
      }
      if (this.state !== "") {
        url += "state=" + this.state + "&";
      }
      if (this.roleType !== "") {
        url += "roleType=" + this.roleType + "&";
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
          this.delEvt(row.id, row.state);
          break;
        case 4:
          this.addRoleMenuEvent(row.id);
          break;
      }
    }, //增加角色菜单
    addRoleMenuEvent(id) {
      this.dialogAddMenu = true;
      this.dialogName = "添加角色菜单";
      this.roleForm = {
        id
      };
    },
    //新增弹窗
    addEvent() {
      this.dialogAdd = true;
      this.dialogName = "添加角色信息";
    },
    //编辑弹窗
    editEvt(row) {
      this.dialogAdd = true;
      this.dialogName = "编辑角色信息";
      this.dataForm = {
        roleName: row.roleName,
        state: row.state,
        roleType: row.roleType,
        remarks: row.remarks,
        id: row.id
      };
    },
    //添加管理员弹窗
    //addAdminEvent() {
    //  this.dialogAddAdmin = true;
    //    this.dialogName = "添加角色信息";
    //   },
    //弹窗确定
    checkSure(form) {
      if (this.dialogName === "添加角色信息") {
        this.sureAdd(form);
      } else if (this.dialogName === "编辑角色信息") {
        this.sureEdit(form);
      } else if (this.dialogName === "添加角色菜单") {
        this.sureAddMenu(form);
      }
    },
    //添加
    sureAdd(form) {
      let params = Object.assign({}, form);
      this.common
        .httpPost("/system/addRoleInfo", params, "")
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
      this.common
        .httpPost("/system/updateRoleInfo", params)
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
    sureAddMenu(form) {
      let list = Object.assign([], form);
      let params = {
        menuIdList: list,
        roleId: this.roleForm.id
      };
      this.common
        .httpPost("/system/addRoleMenu", params)
        .then(res => {
          if (res.data.meta.code == 0) {
            this.messageInfo("编辑成功", "success");
          } else {
            this.messageInfo(res.data.meta.message, "warning");
          }
        })
        .catch(err => {
          this.messageInfo("编辑失败", "warning");
        });
    },
    delEvt(id, state) {
      if (state === 0) {
        this.confirmBox("请确认是否删除该?", () => {
          let params = {
            id
          };
          this.common
            .httpPost("/system/deleteRoleInfo", params)
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
      } else {
        this.messageInfo("该角色不允许删除", "warning");
      }
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
    //待加方法
    getRoleType(val) {
      if (val == 1) {
        return "超级管理员";
      } else if (val == 2) {
        return "业务管理员";
      } else if (val == 3) {
        return "店老板";
      } else if (val == 4) {
        return "店管理员";
      }
    },
    // 1可用 0禁用
    getRoleState(val) {
      if (val == 0) {
        return "禁用";
      } else if (val == 1) {
        return "可用";
      }
    }
  }
};
</script>
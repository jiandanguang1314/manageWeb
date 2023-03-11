<template>
<div>
    <div class="search-box">
      <span></span><el-input  v-model="name" class="search-ipt" placeholder="菜单名称"></el-input>
      <el-button type="success" @click="getList(1)" >查询</el-button> 
      <el-button type="success" @click="addEvent" >新增</el-button>
    </div>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      header-align="center"
      prop="name"
      label="菜单名称"
      width="180">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="url"
      label="菜单地址"
      width="180">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="state"
      label="是否有效">
      <template slot-scope="scope" >
        {{getState(scope.row.state)}}
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
      prop="operatorName"
      label="操作人">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="updateTime"
      label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addSubMenu(scope.row)">添加子菜单</el-button>
          <el-button type="text" size="small" @click="editEvt(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delEvt(scope.row.id)">删除</el-button>
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
  </div>
</template>
<script>
import addDialog from "./menuAdd.vue";
import tip from "@/static/tip";

export default {
  mixins: [tip],
  data() {
    return {
      url: this.common.serverUrl + "/system/queryMenuInfoPage",
      name: "",
      state:"",
      dialogName: "",
      dialogForm: "",
      dataForm: {},
      pageNum: 1,
      dialogAdd: false,
      totalRecords: 0,
      authList: [ {label: "启用", val: 1},{label: "禁用",val: 2}],
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
      if (this.name != "") {
        url += "name=" + this.name + "&";
      }
      if (this.state != "") {
        url += "state=" + this.state + "&";
      }
      url += "pageNum=" + this.pageNum + "&pageSize=10";
      this.common.execServerCall(url, "GET", "", "").then(list => {
        this.tableData = list.data.data.rows;
        this.totalRecords = list.data.data.totalRecords;
      });
    },
    //新增弹窗
    addEvent() {
      this.dialogAdd = true;
      this.dialogName = "新增菜单";
      this.dataForm = {
        name: "",
        url: "",
        state: 1,
      }
    },
    //编辑弹窗
    editEvt(row) {
      this.dialogAdd = true;
      this.dialogName = '编辑菜单';
      this.dataForm = {
        id : row.id,
        name: row.name,
        url: row.url,
        state: row.state,
      }
    },
    //添加子菜单
    addSubMenu(row) {
      this.dialogAdd = true;
      this.dialogName = '添加子菜单';
      this.dataForm = {
        name: "",
        url: "",
        state: 1,
        parentId : row.id,
      }
    },
    //弹窗确定
    checkSure(form) {
      if (this.dialogName === "新增菜单" || this.dialogName === "添加子菜单" ) {
        this.sureAdd(form);
      } else if (this.dialogName === "编辑菜单") {
        this.sureEdit(form);
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
    //编辑
    sureEdit(form) {
      let params = Object.assign({}, form);
      params.registTime= this.common.getTimeCode(params.registTime);
      this.common
        .httpPost("/system/updateMenuInfo", params)
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
    delEvt(id) {
      this.confirmBox("请确认是否删除该?", () => {
        let params = {
          id
        };
        this.common
          .httpPost("/system/deleteMenuInfo", params)
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
    //是否启用状态
    getState(val) {
      if (val === 1) {
        return "启用";
      } else {
        return "禁用";
      }
    }
//待加方法




  }
};
</script>
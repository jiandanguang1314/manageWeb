<template>
<div>
    <div class="search-box">
       <!-- <span>店名：</span><el-input  v-model="shopName"  style="width:200px;margin-right:20px;margin-bottom:50px" placeholder="请输入内容"></el-input>
       <span >经营人：</span><el-input v-model="bossName" style="width:200px;" placeholder="请输入内容"></el-input>
      <el-button type="success" @click="getList" >查询</el-button> -->
      <el-button type="success" @click="addEvent" >新增</el-button>
    </div>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      header-align="center"
      prop="title"
      label="消息标题"
      width="180">
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="content"
      show-overflow-tooltip	= true
      label="消息内容"
      width="180">
    </el-table-column>
    <!-- <el-table-column
      header-align="center"
      prop="sendCount"
      label="会员人数"
      width="180">
    </el-table-column> -->
    <el-table-column
      header-align="center"
      prop="status"
      label="发送状态">
       <template slot-scope="scope">
          {{messageState(scope.row.status)}}
        </template>
    </el-table-column>
    <!-- <el-table-column
      header-align="center"
      prop="level"
      label="接收群体">
    </el-table-column> -->
    <el-table-column
      header-align="center"
      prop="sendTime"
      label="发送时间">
      <template slot-scope="scope">
        {{getUpdateTime(scope.row.sendTime)}}
      </template>
    </el-table-column>
    <!-- <el-table-column
      header-align="center"
      prop="operator"
      label="操作人">
    </el-table-column> -->
    <el-table-column
      header-align="center"
      prop="updateTime"
      label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(1,scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleEdit(2,scope.row)">删除</el-button>
         
          <el-button v-show = onShow(scope.row.status)  type="text" size="small" @click="handleEdit(3,scope.row)">发送消息</el-button>
      
        </template>
    </el-table-column>
    123
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
import addDialog from "./messageAdd.vue";
import tip from "@/static/tip";

export default {
  mixins: [tip],
  data() {
    return {
      url: this.common.serverUrl + "/vip/queryMessagePage",
      dialogName: "",
      dialogForm: "",
      dataForm: {},
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
      let url = this.url + "?shopId="+this.common.getShopId();
      url += "&pageNum=" + this.pageNum + "&pageSize=10";
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
          this.sendMessage(row.id);
          break;
      }
    },
    //新增弹窗
    addEvent() {
      this.dialogAdd = true;
      this.dialogName = "添加消息内容";
      this.dataForm = {
        title: "",
        content: "",
      }
    },
    //编辑弹窗
    editEvt(row) {
      this.dialogAdd = true;
      this.dialogName = '编辑消息内容';
      this.dataForm = {
        title: row.title,
        content: row.content,
        id: row.id,
      }
    },
    //弹窗确定
    checkSure(form) {
      if (this.dialogName === "添加消息内容") {
        this.sureAdd(form);
      } else if (this.dialogName === "编辑消息内容") {
        this.sureEdit(form);
      }
    },
    //添加
    sureAdd(form) {
      let params = Object.assign({}, form);
      params.shopId =  this.common.getShopId();
      this.common
        .httpPost("/vip/addMessage", params, "")
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
      this.common
        .httpPost("/vip/updateMessage", params)
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
    //删除
    delEvt(id) {
      this.confirmBox("请确认是否删除该?", () => {
        let params = {
          id
        };
        this.common
          .httpPost("/vip/deleteMessage", params)
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
    //发送消息
    sendMessage(id) {
      this.confirmBox("请确认是否发送该消息?", () => {
        let params = {
          id,
          shopId: this.common.getShopId()
        };
        this.common
          .httpPost("/vip/sendMessage", params)
          .then(res => {
            if (res.data.meta.code == 0) {
              this.pages = 1;
              this.getList(1);
              this.messageInfo("消息已发送，消息有延迟，收到信息会存在延迟，请耐心等待！", "success");
            } else {
              this.messageInfo(res.data.meta.message, "warning");
            }
          })
          .catch(err => {
            console.log(err);
            this.messageInfo("发送失败", "warning");
          });
      });
    },
    //获取更新时间
    getUpdateTime(val) {
      if (isNaN(Number(val)) || val == 0 || !val) {
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
  messageState(val) {
      if (val == 1) {
        return "已发送";
      } else if (val == 2) {
        return "未发送";
      } else{
        return "未发送";
      }
    },
    onShow(val){
      if(val == 1){
        return false;
      }else if(val == 2){
        return true;
      }else{
        return true;
      }
    }
  }
};
</script>
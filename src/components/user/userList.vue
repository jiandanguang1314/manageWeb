/* eslint-disable eqeqeq */
<template>
<div>
    <div class="search-box">
       <span>手机号：</span><el-input  v-model="mobile" class="search-ipt" placeholder="请输入内容"></el-input>
       <span>会员卡号：</span><el-input  v-model="vipCard" class="search-ipt" placeholder="请输入会员卡号"></el-input>
       <span style="width:100px">会员名：</span><el-input v-model="name" class="search-ipt" placeholder="请输入内容"></el-input>
      <el-button type="success" @click="getList(1)" >查询</el-button>
      <el-button type="success" @click="addEvent" >增加会员</el-button>
      <!-- <el-button type="success" @click="noCardEvent" >无卡消费</el-button> -->
    </div>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column header-align="center"  fixed="left"  prop="mobile" label="手机号" width="120"></el-table-column>
    <el-table-column header-align="center"  fixed="left"  prop="vipCard" label="会员卡号" width="180"></el-table-column>
    <el-table-column header-align="center" prop="name" label="会员名" width="120"></el-table-column>
    <el-table-column header-align="center" prop="balance" label="余额（元）"> <template slot-scope="scope">
        <span style="color:#F56C6C;">
          {{scope.row.balance}}
        </span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" prop="menberLevel" label="会员等级"></el-table-column>
    <el-table-column header-align="center" prop="menberName" label="等级名称"></el-table-column>
    <el-table-columnheader-align="center" prop="menberPoints" label="充值积分"></el-table-column>
    <el-table-column header-align="center" prop="rewardPoints" label="推荐积分"></el-table-column>
    <el-table-column header-align="center" prop="discount" label="享受折扣" width="80"></el-table-column>
    <el-table-column header-align="center" prop="operatorName" label="操作人" width="80"></el-table-column>
    <el-table-column header-align="center" prop="updateTime" label="操作时间" width="180">
      <template slot-scope="scope">
        {{getUpdateTime(scope.row.updateTime)}}
      </template>
    </el-table-column>
    <el-table-column header-align="center" label="操作" fixed="right" width="220" >
      <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(1,scope.row)" style="color:#67C23A;">充值</el-button>
          <el-button type="text" size="small" @click="handleEdit(2,scope.row)" style="color:#F56C6C;">消费</el-button>
          <el-button type="text" size="small" @click="handleEdit(3,scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="handleEdit(5,scope.row)">积分详情</el-button>
          <el-button type="text" size="small" @click="handleEdit(4,scope.row)">交易记录</el-button>
          <!-- <el-button type="text" size="small" @click="handleEdit(3,scope.row)">删除</el-button> -->
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
      <add-dialog v-model="dialogAdd" :dialog-type="dialogName" :data-form="dataForm" @add-sure="checkSure" > </add-dialog>
      <add-dialog v-model="dialogEditUser" :dialog-type="dialogName" :data-form="dataForm"  @add-sure="checkSure" > </add-dialog>
      <log-dialog  v-model="dialogLog" :dialog-type="dialogName" :user-id="dataUser"  > </log-dialog>
      <recharge-dialog v-model="dialogRecharge" :dialog-type="dialogName" :data-form="dataForm" @add-sure="checkSure" > </recharge-dialog>
      <payment-dialog v-model="dialogPayment" :dialog-type="dialogName" :data-form="dataForm" @add-sure="checkSure" > </payment-dialog>
      <no-card-dialog v-model="dialogNoCard" :dialog-type="dialogName" :data-form="dataForm" @add-sure="checkSure" > </no-card-dialog>
  </div>
</template>
<script>
import noCardDialog from './noCardPay.vue'
import addDialog from './userAdd.vue'
import rechargeDialog from './recharge.vue'
import paymentDialog from './payment.vue'
import logDialog from './paylog.vue'
import tip from '@/static/tip'

export default {
  mixins: [tip],
  data () {
    return {
      url: this.common.serverUrl + '/vip/queryAccountUserPage',
      mobile: '',
      name: '',
      vipCard: '',
      userId: '',
      dialogName: '',
      dataForm: {},
      dataUser: 0,
      pageNum: 1,
      flag: '',
      dialogNoCard: false,
      dialogAdd: false,
      dialogEditUser: false,
      dialogRecharge: false,
      dialogPayment: false,
      dialogLog: false,
      totalRecords: 0,
      tableData: [{}]
    }
  },
  created () {
    this.getList(1)
  },
  components: {
    noCardDialog,
    addDialog,
    rechargeDialog,
    logDialog,
    paymentDialog
  },
  methods: {

    handleCurrentChange (current) {
      this.pageNum = current
      this.getList(current)
    },

    getList (current) {
      this.pageNum = current
      let url = this.url + '?shopId=' + this.common.getShopId() + '&'
      // eslint-disable-next-line eqeqeq
      if (this.name != '') {
        url += 'name=' + this.name + '&'
      }
      // eslint-disable-next-line eqeqeq
      if (this.mobile != '') {
        url += 'mobile=' + this.mobile + '&'
      }
      if (this.vipCard != '') {
        url += 'vipCard=' + this.vipCard + '&'
      }
      url += 'pageNum=' + this.pageNum + '&pageSize=10'
      this.common.execServerCall(url, 'GET', '', '').then(list => {
        this.tableData = list.data.data.rows
        this.totalRecords = list.data.data.totalRecords
      })
    },
    // 处理反馈
    handleEdit (ids, row) {
      switch (ids) {
        case 1:
          this.rechargeEvt(row)
          break
        case 2:
          this.paymentEvt(row)
          break
        case 3:
          this.editUserEvt(row)
          break
        case 4:
          this.paylogEvt(row)
          break
        case 5:
          this.$router.push({
            path: '/userDetail',
            // eslint-disable-next-line standard/object-curly-even-spacing
            query: { accountId: row.accountId}
          })
          break
      }
    },
    // 无卡消费弹窗
    noCardEvent () {
      this.dialogNoCard = true
      this.dialogName = '无卡消费'
      this.dataForm = {
        name: '',
        mobile: '',
        menberId: ''
      }
    },
    // 新增弹窗
    addEvent () {
      this.dialogAdd = true
      this.dialogName = '添加会员信息'
      this.dataForm = {
        name: '',
        mobile: '',
        menberId: '',
        menberPoints: 0
      }
    },
    // 编辑弹窗
    editUserEvt (row) {
      this.dialogEditUser = true
      this.dialogName = '编辑用户信息'
      this.dataForm = {
        accountId: row.accountId,
        menberPoints: row.menberPoints,
        name: row.name,
        userId: row.userId,
        mobile: row.mobile,
        vipCard: row.vipCard,
        birthday: row.birthday,
        menberId: row.menberId,
        recommenderMobile: row.recommenderAccountId,
        flag: true
      }
    },
    // 充值弹窗
    rechargeEvt (row) {
      this.dialogRecharge = true
      this.dialogName = '充值'
      this.dataForm = {
        id: row.accountId,
        name: row.name,
        mobile: row.mobile,
        vipCard: row.vipCard,
        userId: row.userId,
        accountId: row.accountId,
        type: 1
      }
    },
    // 消费弹窗
    paymentEvt (row) {
      this.dialogPayment = true
      this.dialogName = '消费'
      this.dataForm = {
        id: row.accountId,
        name: row.name,
        mobile: row.mobile,
        vipCard: row.vipCard,
        userId: row.userId,
        accountId: row.accountId,
        type: 2
      }
    },
    // 日志弹窗
    paylogEvt (row) {
      this.dialogLog = true
      this.dialogName = row.name + '的交易记录'
      this.dataUser = row.userId
    },
    // 弹窗确定
    checkSure (form) {
      if (this.dialogName === '添加会员信息') {
        this.sureAdd(form)
      } else if (this.dialogName === '编辑用户信息') {
        this.sureEdit(form)
      } else if (this.dialogName === '充值') {
        this.rechargeAccount(form)
      } else if (this.dialogName === '消费') {
        this.paymentAccount(form)
      } else if (this.dialogName === '无卡消费') {
        this.noCardPay(form)
      }
    },
    // 添加
    sureAdd (form) {
      let params = Object.assign({}, form)
      params.shopId = this.common.getShopId()
      params.operatorName = this.common.operatorName
      params.operatorId = this.common.operatorId
      params.menberId = params.menberId
      params.vipCard = params.vipCard
      this.common
        .httpPost('/vip/openAccount', params, '')
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pageNum = 1
            this.getList(1)
            this.dataForm = {}
            this.messageInfo('添加成功', 'success')
          } else {
            this.messageInfo(res.data.meta.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
          this.messageInfo('添加失败', 'warning')
        })
    },
    // 编辑
    sureEdit (form) {
      let params = Object.assign({}, form)
      params.shopId = this.common.getShopId()
      params.operatorName = this.common.operatorName
      params.operatorId = this.common.operatorId
      this.common
        .httpPost('/vip/updateAccount', params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pages = 1
            this.getList(1)
            this.dataForm = {}
            this.messageInfo('编辑成功', 'success')
          } else {
            this.messageInfo(res.data.meta.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
          this.messageInfo('编辑失败', 'warning')
        })
    },
    // 充值
    rechargeAccount (form) {
      let params = Object.assign({}, form)
      params.shopId = this.common.getShopId()
      params.operatorName = this.common.operatorName
      params.operatorId = this.common.operatorId
      this.common
        .httpPost('/vip/tradeAccount', params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pages = 1
            this.getList(1)
            this.dataForm = {}
            this.messageInfo('充值成功', 'success')
          } else {
            this.messageInfo(res.data.meta.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
          this.messageInfo('充值失败', 'warning')
        })
    },
    // 消费
    paymentAccount (form) {
      let params = Object.assign({}, form)
      params.shopId = this.common.getShopId()
      params.operatorName = this.common.operatorName
      params.operatorId = this.common.operatorId
      this.common
        .httpPost('/vip/tradeAccount', params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pages = 1
            this.getList(1)
            this.dataForm = {}
            this.messageInfo('消费成功', 'success')
          } else {
            this.messageInfo(res.data.meta.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
          this.messageInfo('消费失败', 'warning')
        })
    },
    // 无卡消费
    noCardPay (form) {
      let params = Object.assign({}, form)
      params.shopId = this.common.getShopId()
      params.operatorName = this.common.operatorName
      params.operatorId = this.common.operatorId
      this.common
        .httpPost('/vip/addTradeLogByTmp', params)
        .then(res => {
          if (res.data.meta.code === 0) {
            this.pages = 1
            this.getList(1)
            this.dataForm = {}
            this.messageInfo('消费成功', 'success')
          } else {
            this.messageInfo(res.data.meta.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
          this.messageInfo('消费失败', 'warning')
        })
    },
    delEvt (shopId) {
      this.confirmBox('请确认是否删除该?', () => {
        let params = {
          shopId
        }
        this.common
          .httpPost('/vip/deleteShop', params)
          .then(res => {
            // eslint-disable-next-line eqeqeq
            if (res.data.meta.code == 0) {
              this.pages = 1
              this.getList(1)
              this.messageInfo('删除成功', 'success')
            } else {
              this.messageInfo(res.data.meta.message, 'warning')
            }
          })
          .catch(err => {
            console.log(err)
            this.messageInfo('删除失败', 'warning')
          })
      })
    },
    // 获取更新时间
    getUpdateTime (val) {
      // eslint-disable-next-line eqeqeq
      if (isNaN(Number(val)) || val == 0) {
        return ''
      } else {
        return this.common.getUpdateTime(Number(val))
      }
    },
    // 获取年月日
    getDateByLong (val) {
      // eslint-disable-next-line eqeqeq
      if (isNaN(Number(val)) || val == 0) {
        return ''
      } else {
        return this.common.getDateByLong(Number(val))
      }
    }
    // 待加方法

  }
}
</script>

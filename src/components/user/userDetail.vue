<template>
  <div>
    <div >
      <el-form  class="block" :inline="true" label-width='200px' label-position='right' style="text-align: left">
        <el-row>
          <el-form-item label="手机号:">{{userDetail.mobile}}</el-form-item>
          <el-form-item label="姓名:">{{userDetail.name}}</el-form-item>
          <el-form-item label="当前余额:">{{userDetail.balance}}</el-form-item>

        </el-row>
        <el-row>
          <el-form-item label="累计充值金额:">{{userDetail.historyBalance}}</el-form-item>
          <el-form-item label="充值积分:">{{userDetail.menberPoints}}</el-form-item>
          <el-form-item label="推荐获取积分:">{{userDetail.rewardPoints}}</el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-button type="primary" @click="dialogFormVisible = true">积分兑换</el-button>
        <el-button type="primary"  @click="back()">返回</el-button>
      </el-row>
    </div>
    <div style="text-align: left;margin:30px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="推荐人列表" name="first">
          <el-table :data="recommendList" style="width: 100%" label-position='left'>
            <el-table-column prop="recommenderName" label="推荐人姓名" width="180"></el-table-column>
            <el-table-column prop="recommenderMobile" label="手机号" width="180"></el-table-column>
            <el-table-column prop="recommenderHistoryBalance" label="累计充值金额" width="180"></el-table-column>
            <el-table-column prop="registDate" label="注册日期" :formatter="formatDate" width="180"></el-table-column>
            <el-table-column prop="recommenderPointsRate" label="推荐积分转化率%" width="180"></el-table-column>
            <el-table-column prop="recommenderPoints" label="获得推荐积分" width="180"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="积分兑换记录" name="second">
          <el-table :data="tradeLogList" style="width: 100%" label-position='left'>
            <el-table-column prop="userName" label="姓名" width="180"></el-table-column>
            <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
            <el-table-column prop="type" label="兑换积分类型" width="180">
                <template slot-scope="scope">
                  {{getType(scope.row.type)}}
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="兑换积分" width="180"></el-table-column>
            <el-table-column prop="createTime" label="兑换日期" :formatter="formatDate" width="180"></el-table-column>
            <el-table-column prop="remark" label="备注"  maxlength=100  width="180"></el-table-column>
          </el-table>
          </el-tab-pane>
      </el-tabs>
    </div>
    <!-- dialog 积分兑换 -->
    <el-dialog title="积分兑换" :visible.sync="dialogFormVisible" style="width:60%" destroy-on-close="true">
      <el-form :model="form">
        <el-form-item label="兑换类型" :label-width="formLabelWidth" >
          <el-select v-model="form.type" placeholder="请选择兑换积分类型"  @change="chosePoint">
            <el-option label="兑换充值积分" value="5"></el-option>
            <el-option label="兑换推荐积分" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换充值积分" :label-width="formLabelWidth" v-if="!isShow">
          <el-input v-model="form.menberPoints"  maxlength=6></el-input>
        </el-form-item>
        <el-form-item label="兑换推荐积分" :label-width="formLabelWidth" v-if="isShow" >
          <el-input v-model="form.rewardPoints" maxlength=6></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" ></el-input>
        </el-form-item>
      </el-form>
      <el-row style="text-align: left">
        <p style="color:red">可兑换充值积分：{{userDetail.menberPoints}}</p>
        <p style="color:red">可兑换推荐积分：{{userDetail.rewardPoints}}</p>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="payPoint()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tip from '@/static/tip'

export default {
  mixins: [tip],
  data () {
    return {
      accountId: this.$route.query.accountId,
      shopId: this.common.getShopId(),
      userDetail: {},
      recommendList: [],
      tradeLogList: [],
      activeName: 'first',
      dataForm: {},
      dialogFormVisible: false,
      form: {
        type: '5',
        rewardPoints: '',
        menberPoints: '',
        remark: ''
      },
      formLabelWidth: '100px',
      isShow: false
    }
  },
  created () {
    this.getUserDetail(this.accountId)
  },
  methods: {
    getUserDetail (accountId) {
      let url = this.common.serverUrl + '/vip/getUserDetail?accountId=' + accountId
      this.common.execServerCall(url, 'GET', '', '').then(data => {
        this.userDetail = data.data.data
        this.recommendList = data.data.data.recommendList
        this.tradeLogList = data.data.data.tradeLogList
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    payPoint () {
      this.dialogFormVisible = false
      this.form.accountId = this.accountId
      console.log(this.form)
      this.common.httpPost('/vip/tradeAccount', this.form, '')
        .then(res => {
          if (res.data.meta.code === 0) {
            this.messageInfo('兑换成功', 'success')
            this.getUserDetail(this.accountId)
          } else {
            this.messageInfo(res.data.meta.message, 'warning')
          }
        // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          this.messageInfo('兑换失败', 'warning')
        })
    },
    chosePoint (value) {
      this.isShow = !this.isShow
      this.form.menberPoints = ''
      this.form.rewardPoints = ''
    },
    back () {
      this.$router.go(-1)
    },
    formatDate (row, column) {
      // 获取单元格数据
      let data = row[column.property]
      if (data == null) {
        return null
      }
      let dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    // 获取交易类型
    getType (val) {
      if (val === 5) {
        return '充值积分'
      } else if (val === 6) {
        return '推荐积分'
      }
    }
  }
}
</script>

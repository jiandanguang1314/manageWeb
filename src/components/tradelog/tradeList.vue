<template>
  <div>
    <div class="search-box">
      <!-- <span>开始时间</span>
       <span>截止时间</span> -->
      <!-- <span>操作人：</span>
       <el-input v-model="operator" class="search-ipt" placeholder="操作人"></el-input> -->
      <!-- <span >交易方式：</span>
       <el-select v-model="payType" clearable class="search-ipt" placeholder="交易类型">
        <el-option v-for="(item,index) in payTypeList" :key="index" :label="item.label" :value="item.val">
        </el-option>
      </el-select> -->
      <span>查询日期：</span>
      <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" v-model="times" style="width: 240px;margin-right: 5px; margin-bottom: 10px;">
      </el-date-picker>
      <span>交易类型：</span>
      <el-select v-model="type" clearable class="search-ipt" placeholder="交易类型">
        <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.val">
        </el-option>
      </el-select>
      <el-button type="success" @click="searchEvt">查询</el-button>
      <el-button type="success" @click="getStatisticsData">统计查询</el-button>
      <span class="wordbreak" v-if="countStatus == 1">
        {{countText}}
      </span>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column header-align="center" prop="userName" label="会员名" width="180"></el-table-column>
      <el-table-column header-align="center" prop="mobile" label="会员电话" width="180"></el-table-column>
      <el-table-column header-align="center" prop="amount" label="金额" width="180"></el-table-column>
      <el-table-column header-align="center" prop="type" label="交易类型">
        <template slot-scope="scope">
          {{getType(scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="discount" label="交易时间">
        <template slot-scope="scope">
          {{getUpdateTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="remark" label="备注"></el-table-column>
      <!--    <el-table-column
      header-align="center"
      prop="updateTime"
      label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(1,scope.row)">查看详情</el-button>
        </template>
    </el-table-column> -->
    </el-table>
    <!--分页-->
    <div class="block footer_nav">
      <span class="other-style">共{{totalRecords}}条记录</span>
      <el-pagination class="pagination-style" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="10" layout="prev, pager, next,  jumper" :total="totalRecords">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import tip from '@/static/tip'

export default {
  mixins: [tip],
  data () {
    return {
      url: this.common.serverUrl + '/vip/queryTradeLogPage',
      dialogForm: '',
      times: '',
      type: '',
      countStatus: 0,
      countText: '',
      operator: '',
      payType: '',
      dataForm: {},
      pageNum: 1,
      dialogAdd: false,
      totalRecords: 0,
      tableData: [{}],
      typeList: [
        { label: '充值', val: 1 },
        { label: '消费', val: 2 },
        { label: '充值积分兑换', val: 5 },
        { label: '推荐积分兑换', val: 6 }
        /*   {label: "转账",val: 3},
        {label: "退款",val: 4} */
      ],
      payTypeList: [
        { label: '线上支付', val: 'online' },
        { label: '线下支付', val: 'underline' }
      ]
    }
  },
  created () {
    this.getList(1)
  },
  components: {},
  methods: {
    handleCurrentChange (current) {
      this.pageNum = current
      this.getList(current)
    },
    searchEvt () {
      this.countStatus = 0
      this.getList(1)
    },
    getList (current) {
      this.pageNum = current
      let url = this.url + '?shopId=' + this.common.getShopId()
      if (this.operator != '') {
        url += '&operator=' + this.operator
      }
      if (this.payType != '') {
        url += '&payType=' + this.payType
      }
      if (this.type != '') {
        url += '&type=' + this.type
      }
      if (this.times && this.times[0] && this.times[1]) {
        url += '&beginTime=' + new Date(this.times[0]).getTime() +
          '&endTime=' + (new Date(this.times[1]).getTime() + 3600 * 1000 * 24 - 1)
      }
      url += '&pageNum=' + this.pageNum + '&pageSize=10'
      this.common.execServerCall(url, 'GET', '', '').then(list => {
        console.log(list.data.data.rows)
        this.tableData = list.data.data.rows
        this.totalRecords = list.data.data.totalRecords
      })
    },
    getStatisticsData () {
      if (!this.type || !this.times[0] || !this.times[1]) {
        this.messageInfo('查询条件不完整，请填写完成后再查询', 'warning')
        this.countStatus = 0
        return
      }
      let params = {
        shopId: this.common.getShopId(),
        startTime: new Date(this.times[0]).getTime(),
        endTime: new Date(this.times[1]).getTime() + 3600 * 1000 * 24 - 1,
        type: this.type
      }
      this.common
        .httpGet('/vip/getTradeLogShow', params)
        .then(res => {
          if (res.data.meta.code == 0) {
            this.countStatus = 1
            this.countText = `${this.getDateByLong(params.startTime)} 到 ${this.getDateByLong(params.endTime)} 的${this.getType(params.type)}总额：${res.data.data}元`
            this.getList(1)
          } else {
            this.countStatus = 0
            this.messageInfo(res.data.meta.message, 'warning')
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {})
    },
    // 处理反馈
    handleEdit (ids, row) {
      switch (ids) {
        case 1:
          this.delEvt(row.id)
          break
      }
    },
    // 弹窗确定
    // 获取更新时间
    getUpdateTime (val) {
      if (isNaN(Number(val)) || val == 0) {
        return ''
      } else {
        return this.common.getUpdateTime(Number(val))
      }
    },
    // 获取年月日
    getDateByLong (val) {
      if (isNaN(Number(val)) || val == 0) {
        return ''
      } else {
        return this.common.getDateByLong(Number(val))
      }
    },
    // 获取交易类型--1充值-2消费-3转账-4退款
    getType (val) {
      if (val === 1) {
        return '充值'
      } else if (val === 2) {
        return '消费'
      } else if (val === 5) {
        return '兑换充值积分'
      } else if (val === 6) {
        return '兑换推荐积分'
      }
    },
    // 获取交易方式--online-线上支付,underline-线下支付
    getPayType (val) {
      if (val == 'underline') {
        return '店内支付'
      } else if (val == 'online') {
        return '扫码支付'
      }
    }
  }
}
</script>
<style scoped>
.wordbreak {
  word-wrap: break-word;
  word-break: break-all;
  display: block;
  text-align: left;
  font-size: 18px;
  line-height: 28px;
  font-weight: bold;
  padding-top: 10px;
}
</style>

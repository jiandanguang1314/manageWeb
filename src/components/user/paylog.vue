<template>
  <el-dialog :visible.sync="showValue" @open="getList" :title="dialogType" :before-close="closeDialog" fullscreen>
    <div class="search-box">
      <el-select v-model="type" clearable class="search-ipt" placeholder="交易类型">
        <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.val">
        </el-option>
      </el-select>
     <!--  <el-select v-model="way" clearable class="search-ipt" placeholder="交易方式">
        <el-option v-for="(item,index) in wayList" :key="index" :label="item.label" :value="item.val">
        </el-option>
      </el-select> -->
      <el-button type="success" @click="getList(1)">查询</el-button>
      <el-button type="success" @click="closeDialog()">返回</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <!-- <el-table-column header-align="center" prop="payType" label="交易方式">
        <template slot-scope="scope">
          {{scope.row.payType == 'underline' ? '线下交易' : '线上交易'}}
        </template>
      </el-table-column> -->
      <el-table-column header-align="center" prop="amount" label="交易金额">
        <template slot-scope="scope">
          <span style="color:#F56C6C;">
            {{scope.row.amount}}
          </span> 
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="type" label="交易类型">
        <template slot-scope="scope">
          {{getType(scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="remark" label="备注" >
      </el-table-column>
    <!--   <el-table-column header-align="center" prop="operator" label="操作人" >
      </el-table-column> -->
      <el-table-column header-align="center" prop="createTime" label="交易时间" >
        <template slot-scope="scope">
          {{getUpdateTime(scope.row.createTime)}}
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block footer_nav">
      <span class="other-style">共{{totalRecords}}条记录</span>
      <el-pagination class="pagination-style" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="10" layout="prev, pager, next,  jumper" :total="totalRecords">
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import tip from '@/static/tip'

export default {
  mixins: [tip],
  data () {
    return {
      typeList: [
        {
          label: '充值',
          val: 1
        },
        {
          label: '消费',
          val: 2
        },
        {
          label: '兑换充值积分',
          val: 5
        },
        {
          label: '兑换推荐积分',
          val: 6
        }
      ],
      wayList: [
        {
          label: '线上交易',
          val: 'online'
        },
        {
          label: '线下交易',
          val: 'underline'
        }
      ],
      url: this.common.serverUrl + '/vip/queryTradeLogPage',
      type: '',
      way: '',
      showValue: false,
      shopId: this.common.getShopId(),

      pageNum: 1,

      totalRecords: 0,
      tableData: [{}]
    }
  },
  created () {
  },
  props: {
    value: {
      default: false,
      type: Boolean
    },
    dialogType: {
      default: '',
      type: String
    },
    userId: {
      default: 0,
      type: Number
    }
  },
  methods: {
    closeDialog () {
      this.showValue = false
      this.pageNum = 1
    },

    handleCurrentChange (current) {
      this.pageNum = current
      this.getList(current)
    },

    getList (current) {
      this.pageNum = current?current:1
      let url = this.url + `?userId=${this.userId}&shopId=${this.shopId}&`
      if (this.type !== '') {
        url += 'type=' + this.type + '&'
      }
      if (this.way !== '') {
        url += 'payType=' + this.way + '&'
      }
      url += 'pageNum=' + this.pageNum + '&pageSize=10'
      this.common.execServerCall(url, 'GET', '', '').then(list => {
        this.tableData = list.data.data.rows
        this.totalRecords = list.data.data.totalRecords
      })
    },

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

    // 交易类型
    getType (val) {
      if (val == 1) {
        return '充值'
      } else if (val == 2) {
        return '消费'
      } else if (val == 3) {
        return '转账'
      } else if (val == 4) {
        return '退款'
      } else if (val == 5) {
        return '兑换充值积分'
      } else if (val == 6) {
        return '兑换推荐积分'
      }
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
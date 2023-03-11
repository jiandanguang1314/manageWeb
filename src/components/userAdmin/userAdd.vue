<template>
    <div>
      <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" @open="open()" style="min-width:980px;">
        <el-form :model="dataForm" :rules="rules" ref="rulesForm">
          <el-form-item label="手机号：" prop="mobile" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.mobile"
                auto-complete="off"
                :maxlength="11"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="用户名：" prop="userName" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input
                v-model="dataForm.userName"
                auto-complete="off"
                :maxlength="20"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色类型" prop="userType" :label-width="formLabelWidth">
            <el-col :span="22">
              <div>
            <el-select
              v-model="dataForm.userType"
              @change="getRoleData"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in authList"
                :key="index"
                :label="item.label"
                :value="item.val">
              </el-option>
            </el-select>
            </div>
          </el-col>
        </el-form-item>

        <el-form-item label="所属角色" prop="roleIds" :label-width="formLabelWidth">
            <el-col :span="22">
              <div>
            <el-select
              v-model="dataForm.roleIds"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in roledatas"
                :key="index"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
            </div>
          </el-col>
        </el-form-item>

          <!-- <el-form-item label="所属角色" prop="roleIds" :label-width="formLabelWidth">
            <el-col :span="22">
           
                <el-radio-group v-model="dataForm.roleIds">
                  <el-radio v-for ="item in roledatas" :label="item.id" :key="item.id"> {{ item.roleName }} </el-radio>
                </el-radio-group>
     
            </el-col>
          </el-form-item> -->
          
        </el-form>
        <div style="text-align: right">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="checkSure" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      roledatas: [],
      formLabelWidth: "140px",
      showValue: false,
      typeVal: "",
      rows: 3,
      authList: [
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
      registTime:'',
      rules: {
        userName: [
          { required: true, message: "请输入用户名",  trigger: "blur"}
        ],
        roleIds: [
          { required: true, message: "请输入角色类型", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ]
      }
    };
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
    dataForm: {
      type: Object,
      default: {},
    },
  },
  mounted() {
    //this.open(); //方法
  },
  methods: {
    open(){
      if(this.dataForm.userType !== ""){
        this.getRoleData(this.dataForm.userType);
      }
    },
    closeDialog() {
      this.showValue = false;
      this.$refs["rulesForm"].resetFields();
      this.roledatas=[];
    },
    checkSure() {
      this.$refs["rulesForm"].validate(valid => {
        if (valid) {
          let  arr=[];
          console.log("dwewe",this.roledatas);
          // for(let id of this.dataForm.roleIds){
          //     for(let item of this.roledatas){
          //       if(id === item.id)
          //       {
          //         arr.push(id);
          //       }
          //   }
          // }
          arr.push(this.dataForm.roleIds);
          console.log(this.dataForm.roleIds);
          this.dataForm.roleIds= this.dataForm.roleIds;
          this.$emit("add-sure", this.dataForm);
          this.showValue = false;
          this.$refs["rulesForm"].resetFields();
          this.roledatas=[];

        } else {
          console.log("error submit!!");
          return false;
        }
      });
      
    },
    getRoleData(val){
      this.roledatas=[];
      let url = this.common.serverUrl+"/system/getRoleInfoByType?"+ "roleType=" + val;
      this.common.execServerCall(url, "GET", "", "").then(list => {
        this.roledatas = list.data.data;
        this.dataForm.roleIds=this.roledatas[0].id;
      });
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
</style>
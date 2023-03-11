<template>
  <el-dialog :visible.sync="showValue" :title="dialogType" :before-close="closeDialog" @open="open" width="980px">
    <el-row class="trans-tree">
      <el-col :span="10">
        <div class="tree-title">全部菜单</div>
        <div class="tree-content">
          <el-tree :data="allTree" show-checkbox node-key="id" :props="defaultProps" ref="allTree">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button class="tree-btn" size="large" @click="getCheckedKeys">添加</el-button>
        <el-button class="tree-btn" size="large" @click="getDeletedKeys">移除</el-button>
      </el-col>
      <el-col :span="10">
        <div class="tree-title">已选菜单</div>
        <div class="tree-content">
          <el-tree :data="checkTree" show-checkbox node-key="id" :props="defaultProps" ref="checkTree">
          </el-tree>
        </div>
      </el-col>
    </el-row>
    <div class="btn-box">
      <el-button type="primary" @click="checkSure">保 存</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  methods: {
    open() {
      this.common.httpGet("/system/getAllMenuTree").then(list => {
        this.allTree = list.data.data;
      });
      this.common
        .httpGet("/system/getMenuTreeByRoleId?roleId=" + this.dataForm.id)
        .then(list => {
          this.checkTree = list.data.data;
          let arr = this.getCheckNodes(this.checkTree);
          this.$refs.allTree.setCheckedKeys(arr);
        });
    },
    getCheckNodes(checkTree) {
      let arr = [];
      let getArr = obj => {
        obj.map(val => {
          if (val.children.length > 0) {
            getArr(val.children);
          } else {
            arr.push(val.id);
          }
        });
      };
      getArr(checkTree);
      return arr;
    },
    getCheckedKeys() {
      let checkNodes = this.$refs.allTree.getCheckedKeys(),
        newArr = [];
      this.checkTree.map(val => {
        newArr.push(val);
      });
      checkNodes.map(val => {
        if (!isNaN(val)) {
          this.allTree.map(obj => {
            let firstObj = {
                id: obj.id,
                name: obj.name,
                children: []
              },
              diffStatus = 1;
            newArr.map(diff => {
              if (diff.id === obj.id) {
                firstObj = diff;
                diffStatus = 2;
              }
            });
            obj.children.map(ids => {
              let secondObj = {
                  id: ids.id,
                  name: ids.name,
                  children: []
                },
                sameStatus = 1,
                diffSStatus = 1;
              firstObj.children.map(diffS => {
                if (diffS.id === ids.id) {
                  secondObj = diffS;
                  diffSStatus = 2;
                }
                if (diffS.id === val) sameStatus = 2;
              });
              if (
                ids.id === val &&
                ids.children.length === 0 &&
                sameStatus === 1
              ) {
                firstObj.children.push(ids);
              } else if (ids.id !== val && ids.children.length !== 0) {
                ids.children.map(sids => {
                  if (sids.id === val) {
                    secondObj.children.push(sids);
                  }
                });
                if (secondObj.children.length !== 0 && diffSStatus === 1)
                  firstObj.children.push(secondObj);
              }
            });
            if (firstObj.children.length !== 0 && diffStatus === 1)
              newArr.unshift(firstObj);
          });
        }
      });
      this.checkTree = newArr;
    },
    getDeletedKeys() {
      let deletedKeys = this.$refs.checkTree.getCheckedKeys(),
        newArr = this.checkTree;
      deletedKeys.map(val => {
        newArr.map((obj, k) => {
          if (obj.id === val) {
            newArr.splice(k, 1);
            k--;
          } else {
            obj.children.map((fObj, fK) => {
              if (fObj.id === val) {
                obj.children.splice(fK, 1);
                fK--;
              } else {
                fObj.children.map((sObj, sK) => {
                  if (sObj.id === val) {
                    fObj.children.splice(sK, 1);
                    sK--;
                  }
                });
              }
            });
          }
        });
      });
      let arr = this.getCheckNodes(this.checkTree);
      this.$refs.allTree.setCheckedKeys(arr);
    },
    closeDialog() {
      this.showValue = false;
      this.$refs.checkTree.setCheckedNodes([]);
      this.$refs.allTree.setCheckedNodes([]);
      this.checkTree = [];
    },
    checkSure() {
      this.$refs.checkTree.setCheckedNodes(this.checkTree);
      let updateCheck = this.$refs.checkTree.getCheckedKeys();
      this.$emit("add-sure", updateCheck);
      this.showValue = false;
      this.$refs.checkTree.setCheckedNodes([]);
      this.$refs.allTree.setCheckedNodes([]);
      this.checkTree = [];
    }
  },
  watch: {
    value(val) {
      this.showValue = val;
    },
    showValue(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      allTree: [],
      checkTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      formLabelWidth: "140px",
      showValue: false
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
      default: {}
    }
  }
};
</script>
<style scoped>
.tree-title {
  text-align: center;
  width: 100%;
  font-size: 22px;
  font-weight: bold;
  margin: 15px 0;
}
.tree-btn {
  display: block;
  margin: 60px auto !important;
}
.btn-box {
  text-align: right;
}
</style>

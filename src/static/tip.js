module.exports = {
	data(){
		return {}
	},
	methods: {
		confirmBox(msg, confirmToDo){
			this.$confirm(msg, '提示', {
				closeOnClickModal: false,
				type: 'warning'
			}).then(confirmToDo)
				.catch((err) => {
					console.log(err);
				})
		},
		messageInfo(msg, typeString){
			this.$message({
				showClose: true,
				message: msg,
				type: typeString,
				duration: 2000
			})
		},
    confirmOperate(msg, confirmToDo){
      this.$confirm(msg, '提示', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(confirmToDo)
        .catch((err) => {
          console.log(err);
        })
    },
    resultInfo(msg, typeString){
      this.$message({
        showClose: true,
        message: msg,
        type: typeString,
        duration: 2000
      })
    },
	}
}

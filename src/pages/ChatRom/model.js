import api from "../../utils/requests"
export default {
  namespace:'chatMsg',
  state:{},
  effects:{
    *getAllMessage({payload},{call,put}){
      const url = `/chat/getMsg?toUserId=${payload}`
      const res = yield call(api.fetch,"get",url)
      if(res.code === 0){
        yield put({
          type: "user/getChatNotice"
        })
        yield put({
          type:"showMessage",
          payload:res.res
        })
      }
    },
    *sendMessage({payload},{call,put}){
      const res = yield call(api.fetch,"post","/chat/sendMsg",payload)
      if(res.code === 0){
        yield put({
          type:"showMessage",
          payload:res.res
        })
      }
    },
  },
  reducers:{
    showMessage(state,{payload}){
      return {...state,msgList:payload.msgList,guest:payload.guest}
    },
  }
}

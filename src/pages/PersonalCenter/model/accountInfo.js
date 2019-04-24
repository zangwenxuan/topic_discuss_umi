import request from "../../../utils/requests"
export default {
  namespace: "accountInfo",
  state:{},
  effects:{
    *getUserInfo({payload},{call,put}) {
      const res = yield call(request.fetch,"get",`/user/getUserInfo?uid=${payload}`)
      yield put({
        type: "freshUserInfo",
        payload: res
      })
    },
    *updateUser({payload},{call,put}){
      yield call(request.fetch,"post","/user/updateUser",payload)
      yield put({
        type: "user/getCurrentUser"
      })
      yield put({
        type: "getUserInfo"
      })
    }

    },
  reducers:{
    freshUserInfo(state,{payload}){
      return {
        ...state,
        userInfo: payload
      }
    }
  }

}

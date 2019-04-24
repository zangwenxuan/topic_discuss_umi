import request from '../../../utils/requests'
export default {
  namespace: "subscribe",
  state:{},
  effects:{
    *selectFeed(aciton,{call,put}){
      const res = yield call(request.fetch,"get","/feed/selectSubscribeFeed")
      yield put({
        type: "freshFeed",
        payload: res
      })
    }
  },
  reducers:{
    freshFeed(state,{payload}){
      return {...state,...payload}
    }
  }
}

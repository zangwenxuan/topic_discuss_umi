import request from "../../../utils/requests";
export default {
  namespace: "feedManager",
  state: {},
  effects: {
    *selectAll(_,{call,put}){
      const res = yield call(request.fetch,"get","/admin/selectAllFeed")
      yield put({
        type: "updateFeed",
        payload: res
      })
    }
  },
  reducers: {
    updateFeed(state,{payload}){
      return {
        ...state,
        feedList: payload
      }
    }
  }
};

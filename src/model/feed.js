import api from "../utils/requests";

export default {
  namespace: "feeds",
  state:{},
  effects:{
    *selectPersonalFeed({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/user/selectPersonalFeed?uid=${payload}`
      );
      yield put({
        type: "showPersonalFeed",
        payload: res
      });
    },
    *selectKeepFeed({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/user/selectPersonalKeep?uid=${payload}`
      );
      yield put({
        type: "showKeepFeed",
        payload: res
      });
    },
    *like({ payload }, { call, put }) {
      yield call(api.fetch, "post", "/content/like", payload);
    },
    *keep({ payload }, { call, put }) {
      yield call(api.fetch, "post", "/content/keep", payload);
    },
  },
  reducers:{
    *showPersonalFeed(state,{payload}){
      return {
        ...state,
        personalFeed:payload
      }
    },
    *showMasterFeed(state,{payload}){
      return {
        ...state,
        MasterFeed:payload
      }
    },
    *showKeepFeed(state,{payload}){
      return {
        ...state,
        keepFeed:payload
      }
    },
  }
}

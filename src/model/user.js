import api from "../utils/requests";
import { routerRedux } from "dva/router";
export default {
  namespace: "user",
  state: {
    status: undefined
  },
  effects: {
    *logout(action, { call, put }) {
      yield call(api.fetch, "get", "user/logout");
      sessionStorage.removeItem("user");
      yield put({
        type: "clearUser"
      });
    },
    *clearReadStatus(action,{call, put}){
      const res =yield call(api.fetch,"get","/chat/clearReadStatus");
      if(res.code === 0){
        yield put({
          type: "getChatNotice"
        })

      }
    },
    *getChatNotice(action, { call, put }) {
      const res = yield call(api.fetch, "get", "/chat/getChatNotice");
      if (res.code === 0) {
        yield put({
          type: "freshChatNotice",
          payload:res.res
        });
      }
    },
    *updateChatStatus({payload},{call,put}){
      const data = yield call(api.fetch,"put","/chat/updateChatStatus",payload)
      if(data.code === 0){
        const res = yield put({
          type: "getChatNotice"
        })
      }
    },
    *changeNoticeStatus({ payload }, { call, put, select }) {
      const data = yield select(state => state.user);
      const res = yield call(api.fetch, "put", "/user/changeNoticeStatus", {
        unreadFeedNotice: data.unreadFeedNotice,
        unreadSubscribeNotice: data.unreadSubscribeNotice
      });
      if (res.code === 0) {
        yield put({
          type: "clearNotice"
        });
      }
    },
    *getNotice(action, { call, put }) {
      const res = yield call(api.fetch, "get", "/user/getNotice");
      if (res.code === 0) {
        yield put({
          type: "freshNotice",
          payload: res.res
        });
      }
    },
    *checkUser({ payload }, { call, put }) {
      const res = yield call(api.fetch, "POST", "/user/check", payload);
      if (res.code == 0) {
        yield put({
          type: "updateLoginState",
          payload: { ...res, status: "ok" }
        });
        sessionStorage.setItem("user", JSON.stringify(res.res));
        yield put(routerRedux.replace("/"));
      } else {
        yield put({
          type: "updateLoginState",
          payload: { status: "error" }
        });
      }
    }
  },
  reducers: {
    freshChatNotice(state, { payload }) {
      return { ...state, chatNotice: payload };
    },
    clearNotice(state, action) {
      return { ...state, unreadFeedNotice: [], unreadSubscribeNotice: [] };
    },
    freshNotice(state, { payload }) {
      return {
        ...state,
        unreadFeedNotice: payload.unreadFeedNotice,
        unreadSubscribeNotice: payload.unreadSubscribeNotice,
        historyFeedNotice: payload.historyFeedNotice,
        historySubscribeNotice: payload.historySubscribeNotice
      };
    },
    updateLoginState(state, { payload }) {
      localStorage.setItem("token", payload.token);
      return { ...state, user: payload.res, status: payload.status };
    },
    clearUser(state, { payload }) {
      return { status: undefined };
    }
  }
};

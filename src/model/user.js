import request from "../utils/requests";
import { routerRedux } from "dva/router";
export default {
  namespace: "user",
  state: {
    captchaAvailable: undefined,
    nameAvailable: undefined,
    status: undefined,
    emailAvailable: undefined
  },
  effects: {
    *register({ payload }, { call, put }) {
      const res = yield call(request.fetch, "post", "/user/register", payload);
      if (res.code === 0) {
        yield put({
          type: "updateCaptchaStatus",
          payload: "ok"
        })
        sessionStorage.setItem("user", JSON.stringify(res.res));
        yield put(routerRedux.replace("/"));
      } else {
        yield put({
          type: "updateCaptchaStatus",
          payload: "error"
        })
      }
    },
    *logout(action, { call, put }) {
      yield call(request.fetch, "get", "user/logout");
      sessionStorage.removeItem("user");
      yield put({
        type: "clearUser"
      });
    },
    *checkEmail({payload},{call,put}){
      const res = yield call(request.fetch,"get",`/user/checkEmail?email=${payload}`)
      if(res.code === 0){
        yield put({
          type: "updateEmailStatus",
          payload: res.res?"ok":"error"
        })
      }
    },
    *checkName({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "get",
        `/user/checkName?name=${payload}`
      );
      if (res.code === 0) {
        yield put({
          type: "updateNameStatus",
          payload: res.res?"ok":"error"
        });
      }
    },
    *clearChatNotes(action,{call,put}){
      yield call(request.fetch,"delete","/chat/clearChatNotes")
      yield put({
        type: "getChatNotice"
      })
    },
    *clearReadStatus(action, { call, put }) {
      const res = yield call(request.fetch, "get", "/chat/clearReadStatus");
      if (res.code === 0) {
        yield put({
          type: "getChatNotice"
        });
      }
    },
    *getCaptcha({ payload }, { call, put }) {
      yield call(request.fetch, "get", `/user/getCaptcha?email=${payload}`);
    },
    *getChatNotice(action, { call, put }) {
      const res = yield call(request.fetch, "get", "/chat/getChatNotice");
      if (res.code === 0) {
        yield put({
          type: "freshChatNotice",
          payload: res.res
        });
      }
    },
    *deleteChatNote({payload},{call,put}){
      yield call(request.fetch,"delete","/chat/deleteChatNote",payload)
      yield put({
        type: "getChatNotice"
      })
    },
    *updateChatStatus({ payload }, { call, put }) {
      const data = yield call(
        request.fetch,
        "put",
        "/chat/updateChatStatus",
        payload
      );
      if (data.code === 0) {
        const res = yield put({
          type: "getChatNotice"
        });
      }
    },
    *changeNoticeStatus({ payload }, { call, put, select }) {
      const data = yield select(state => state.user);
      const res = yield call(request.fetch, "put", "/user/changeNoticeStatus", {
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
      const res = yield call(request.fetch, "get", "/user/getNotice");
      if (res.code === 0) {
        yield put({
          type: "freshNotice",
          payload: res.res
        });
      }
    },
    *checkUser({ payload }, { call, put }) {
      const res = yield call(request.fetch, "POST", "/user/check", payload);
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
    changeCaptcha(state,action){
      return {...state,captchaAvailable: undefined}
    },
    updateEmailStatus(state,{payload}){
      return {...state,emailAvailable: payload}
    },
    updateNameStatus(state, { payload }) {
      return { ...state, nameAvailable: payload };
    },
    updateCaptchaStatus(state,{payload}) {
      return {...state, captchaAvailable: payload}
    },
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

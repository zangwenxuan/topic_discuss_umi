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
      if (!!res) {
        yield put({
          type: "getCurrentUser"
        });
        yield put({
          type: "updateCaptchaStatus",
          payload: "ok"
        });
        localStorage.setItem("token", res);
        yield put(routerRedux.replace("/"));
      } else {
        yield put({
          type: "updateCaptchaStatus",
          payload: "error"
        });
      }
    },
    *logout(action, { call, put }) {
      yield call(request.fetch, "get", "user/logout");
      sessionStorage.removeItem("isLogin");
      localStorage.removeItem("token");
      yield put({
        type: "clearUser"
      });
    },
    *checkEmail({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "get",
        `/user/checkEmail?email=${payload}`
      );
      yield put({
        type: "updateEmailStatus",
        payload: res ? "ok" : "error"
      });
    },
    *checkName({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "get",
        `/user/checkName?name=${payload}`
      );
      yield put({
        type: "updateNameStatus",
        payload: res ? "ok" : "error"
      });
    },
    *clearChatNotes(action, { call, put }) {
      yield call(request.fetch, "delete", "/chat/clearChatNotes");
      yield put({
        type: "getChatNotice"
      });
    },
    *clearReadStatus(action, { call, put }) {
      const res = yield call(request.fetch, "get", "/chat/clearReadStatus");
      yield put({
        type: "getChatNotice"
      });
    },
    *getCaptcha({ payload }, { call, put }) {
      yield call(request.fetch, "get", `/user/getCaptcha?email=${payload}`);
    },
    *getChatNotice(action, { call, put }) {
      const res = yield call(request.fetch, "get", "/chat/getChatNotice");
      yield put({
        type: "freshChatNotice",
        payload: res
      });
    },
    *deleteChatNote({ payload }, { call, put }) {
      yield call(request.fetch, "delete", "/chat/deleteChatNote", payload);
      yield put({
        type: "getChatNotice"
      });
    },
    *updateChatStatus({ payload }, { call, put }) {
      yield call(request.fetch, "put", "/chat/updateChatStatus", payload);
      yield put({
        type: "getChatNotice"
      });
    },
    *changeNoticeStatus({ payload }, { call, put, select }) {
      const data = yield select(state => state.user);
      const res = yield call(request.fetch, "put", "/user/changeNoticeStatus", {
        unreadFeedNotice: data.unreadFeedNotice,
        unreadSubscribeNotice: data.unreadSubscribeNotice
      });
      yield put({
        type: "clearNotice"
      });
    },
    *getNotice(action, { call, put }) {
      const res = yield call(request.fetch, "get", "/user/getNotice");
      yield put({
        type: "getChatNotice"
      });
      yield put({
        type: "freshNotice",
        payload: res
      });
    },
    *checkUser({ payload }, { call, put }) {
      const res = yield call(request.fetch, "POST", "/user/check", payload);
      if (!!res) {
        yield put({
          type: "getCurrentUser"
        });
        yield put({
          type: "updateLoginState",
          payload: { status: "ok" }
        });
        localStorage.setItem("token", res);
        yield put(routerRedux.replace("/"));
      } else {
        yield put({
          type: "updateLoginState",
          payload: { status: "error" }
        });
      }
    },
    *loginWithoutChangePage({payload},{call,put}){
      const res = yield call(request.fetch, "POST", "/user/check", payload);
      if (!!res) {
        yield put({
          type: "getCurrentUser"
        });
        yield put({
          type: "updateLoginState",
          payload: { status: "ok" }
        });
        localStorage.setItem("token", res);
      } else {
        yield put({
          type: "updateLoginState",
          payload: { status: "error" }
        });
      }
    },
    *getCurrentUser(action, { call, put }) {
      const res = yield call(request.fetch, "get", "user/getCurrentUser");
      yield put({
        type: "updateCurrentUser",
        payload: res
      });
      sessionStorage.setItem("isLogin", JSON.stringify(true));
    },
  },
  reducers: {
    updateCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    changeCaptcha(state, action) {
      return { ...state, captchaAvailable: undefined };
    },
    updateEmailStatus(state, { payload }) {
      return { ...state, emailAvailable: payload };
    },
    updateNameStatus(state, { payload }) {
      return { ...state, nameAvailable: payload };
    },
    updateCaptchaStatus(state, { payload }) {
      return { ...state, captchaAvailable: payload };
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
      return { ...state, status: payload.status };
    },
    clearUser(state, { payload }) {
      return { status: undefined };
    }
  }
};

import request from "../../../utils/requests";

export default {
  namespace: "setPassword",
  state: {
    captchaStatus: undefined,
    passwordStatus: undefined
  },
  effects: {
    *getCaptcha(_, { call, put }) {
      yield call(request.fetch, "get", "/user/getMailCaptcha");
    },
    *checkCaptcha({ payload }, { call, put }) {
      yield put({
        type: "clearStatus"
      })
      const res = yield call(
        request.fetch,
        "post",
        "/user/checkCaptcha",
        payload
      );
      yield put({
        type: "changeCaptchaStatus",
        payload: res
      });
    },
    *submitPassword({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "post",
        "/user/setPassword",
        payload
      );
      if(res){
        yield put({
          type: "user/logout"
        })
      }
      yield put({
        type: "changePasswordStatus",
        payload: res
      });
    }
  },
  reducers: {
    clearStatus(){
      return {}
    },
    changeCaptchaStatus(state, { payload }) {
      return {
        ...state,
        captchaStatus: payload ? "ok" : "error"
      };
    },
    changePasswordStatus(state, { paylaod }) {
      return {
        ...state,
        passwordStatus: paylaod ? "ok" : "error"
      };
    }
  }
};

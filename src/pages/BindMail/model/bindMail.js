import request from "../../../utils/requests"

export default {
  namespace: "bindMail",
  state:{
    captchaStatus:undefined,
    emailCaptchaStatus:undefined,
    emailAvailable: undefined
  },
  effects:{
    *getCaptcha(_,{call}){
      yield call(request.fetch,"get","user/getMailCaptcha")
    },
    *getMailCaptcha({payload},{call}){
      yield call(request.fetch, "get", `/user/getCaptcha?email=${payload}`);
    },
    *checkCaptcha({payload},{call,put}){
      yield put({
        type: "clearStatus"
      })
      const res = yield call(request.fetch,"post","user/checkCaptcha",payload)
      yield put({
        type: "changeCaptchaStatus",
        payload: res?"ok":"error"
      })
    },
    *checkEmail({ payload }, { call, put }) {
      yield put({
        type: "clearEmailAvailable"
      });
      const res = yield call(
        request.fetch,
        "get",
        `/user/checkEmail?email=${payload}`
      );
      yield put({
        type: "updateEmailAvailable",
        payload: res ? "ok" : "error"
      });
    },
    *bindMail({payload},{call,put}){
      yield put({
        type: "clearStatus"
      })
      const res = yield call(request.fetch,"post","/user/bindMail",payload)
      yield put({
        type: "updateEmailCaptchaStatus",
        payload: res ? "ok" : "error"
      })
    }
  },
  reducers:{
    updateEmailCaptchaStatus(state,{payload}){
      return {...state,emailCaptchaStatus:payload}
    },
    clearStatus(state,_){
      return {}
    },
    changeCaptchaStatus(state,{payload}){
      return {
        ...state,captchaStatus: payload
      }
    },
    clearEmailAvailable(state,_){
      return {...state,emailAvailable: undefined}
    },
    updateEmailAvailable(state, { payload }) {
      return { ...state, emailAvailable: payload };
    }
  }
}

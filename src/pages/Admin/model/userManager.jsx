import request from "../../../utils/requests";
import {message} from "antd"
export default {
  namespace: "userManager",
  state: {},
  effects: {
    *selectAll(_,{call,put}){
      const res = yield call(request.fetch,"get","/admin/selectAllUser")
      yield put({
        type: "updateUser",
        payload: res
      })
    },
    *deleteUser({payload},{call,put}){
      const res = yield call(request.fetch,"delete","/admin/deleteUser",payload)
      yield put({
        type: "deleteFromUserList",
        payload: res
      })
    }
  },
  reducers: {
    updateUser(state,{payload}){
      return {
        ...state,
        userList: payload
      }
    },
    deleteFromUserList(state,{payload}){
      message.success("删除成功！")
      return{
        ...state,
        userList: state.userList.filter(u=>u.uid!==payload)
      }
    }
  }
};

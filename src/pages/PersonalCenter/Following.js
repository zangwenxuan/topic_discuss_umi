import React,{Component} from "react"
import {connect} from "dva";
import {Divider} from "antd";

import List from "../../components/UserList"

@connect(({follow,loading})=>({follow,loading:loading.effects['follow/selectFollowing']}))
class Following extends Component{
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    this.setState({
      uid: params.uid
    });
    dispatch({
      type: "follow/selectFollowing",
      payload: params.uid
    });
  }
  render(){
    const {follow:{followingList =[]}, loading} = this.props
    return (<div>
      <List data={followingList} loading={loading}/></div>)
  }
}
export default Following

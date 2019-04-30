import React, { Component } from "react";
import { connect } from "dva";
import { Divider } from "antd";

import List from "../../components/UserList";

@connect(({ follow, loading }) => ({
  follow,
  loading: loading.effects["follow/selectFollower"]
}))
class Follower extends Component {
  componentDidMount() {
    const {
      dispatch,
      match: { params }
    } = this.props;
    this.setState({
      uid: params.uid
    });
    dispatch({
      type: "follow/selectFollower",
      payload: params.uid
    });
  }
  render() {
    const {
      follow: { followerList = [] },
      loading,
    } = this.props;
    return (
      <div>
        <List data={followerList} follower loading={loading} />
      </div>
    );
  }
}

export default Follower;

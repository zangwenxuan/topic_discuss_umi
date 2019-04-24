import React, { Component } from "react";
import { connect } from "dva";

import List from "../../components/FeedList";

@connect(({ subscribe }) => ({ subscribe }))
class SubscribeFeed extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "subscribe/selectFeed"
    });
  }

  render() {
    const { subscribe = {} } = this.props;
    return (
      <div>
        <List feed={subscribe} />
      </div>
    );
  }
}
export default SubscribeFeed;

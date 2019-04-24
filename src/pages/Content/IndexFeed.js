import React, { Component } from "react";
import { connect } from "dva";

import List from "../../components/FeedList";

@connect(({ indexFeed, loading }) => ({ indexFeed, loading:loading.effects['indexFeed/selectFeed'] }))
class IndexFeed extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "indexFeed/selectFeed"
    });
  }

  render() {
    const { indexFeed = {}, loading } = this.props;
    return (
      <div>
        <List feed={indexFeed} listLoading={loading} />
      </div>
    );
  }
}

export default IndexFeed;

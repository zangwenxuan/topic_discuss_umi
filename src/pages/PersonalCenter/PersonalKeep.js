import React, { Component } from "react";
import { connect } from "dva";

import List from "../../components/FeedList";

@connect(({ personalKeep }) => ({ personalKeep }))
class PersonalKeep extends Component {
  state = {
    uid: undefined
  };
  componentDidMount() {
    const {
      dispatch,
      match: { params }
    } = this.props;
    this.setState({
      uid: params.uid
    });
    dispatch({
      type: "personalKeep/selectFeed",
      payload: params.uid
    });
  }

  render() {
    const { personalKeep } = this.props;
    return (
      <div>
        <List feed={personalKeep} />
      </div>
    );
  }
}

export default PersonalKeep;

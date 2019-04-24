import React, { Component } from "react";
import { connect } from "dva";

import List from "../../components/FeedList";

@connect(({ personalFeed,user }) => ({ personalFeed,user }))
class PersonalFeed extends Component {
  state={
    isSelf:false
  }
  componentDidMount() {
    const {
      dispatch,
      match: { params },
      user: { currentUser }
    } = this.props;
    this.setState({
      isSelf: !!currentUser && currentUser.uid === params.uid,
      uid: params.uid
    });
    dispatch({
      type: "personalFeed/selectPersonalFeed",
      payload: params.uid
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      match: { params },
      user: { currentUser }
    } = this.props;
    if (prevProps.user.currentUser !== this.props.user.currentUser) {
      this.setState({
        isSelf: !!currentUser && currentUser.uid === params.uid
      });
    }
  }

  handleCloseClick = item => {
    const { dispatch } = this.props;
    dispatch({
      type: "personalFeed/deleteFeed",
      payload: { feedId: item.feedId }
    });
  };

  render() {
    const { personalFeed = {} } = this.props;
    const {isSelf} = this.state
    return (
      <List
        feed={personalFeed}
        showClose={isSelf}
        onCloseClick={this.handleCloseClick}
      />
    );
  }
}

export default PersonalFeed

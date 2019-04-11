import React, { Component } from "react";
import { Card, Avatar, Icon, Tabs, List } from "antd";
import { StickyContainer, Sticky } from "react-sticky";
import { connect } from "dva";
import styles from "./index.less";

import FeedList from "../../components/FeedList";
import Button from "antd/lib/button";

const { Meta } = Card;
const TabPane = Tabs.TabPane;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar
        {...props}
        style={{ ...style, zIndex: 1, background: "#fff" }}
      />
    )}
  </Sticky>
);
@connect(({ user, feed, loading }) => ({
  user,
  feed,
  loading
}))
class PersonalCenter extends Component {
  state = {
    ws: undefined
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "feed/selectMyFeed"
    });
  }

  handleButtonClick = () => {
    const { dispatch, user } = this.props;
    dispatch({
      type: "websocket/sendMessage",
      payload: user.user
    });
  };

  handleTabClick = key => {
    console.log(key);
    const { dispatch } = this.props;
    console.log(this.props.feed);
    if (key == 1) {
      console.log(`key:${key}`);
      dispatch({
        type: "feed/selectMyFeed"
      });
    }
    if (key == 2) {
      console.log(`key:${key}`);
      dispatch({
        type: "feed/selectMyKeep"
      });
    }
    if (key == 3) {
      dispatch({
        type: "feed/selectMyMaster"
      });
    }
  };
  render() {
    return (
      <div>
        <Card style={{ width: "100%", height: "100px" }}>
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title="Card title"
            description="This is the description"
          />
        </Card>
        <StickyContainer>
          <Tabs
            defaultActiveKey="1"
            onChange={key => this.handleTabClick(key)}
            renderTabBar={renderTabBar}
            className={styles.tabs}
            style={{ marginTop: "1px" }}
          >
            <TabPane tab="我发布的" key="1">
              <FeedList />
            </TabPane>
            <TabPane tab="我收藏的" key="2">
              <FeedList />
            </TabPane>
            <TabPane tab="我订阅的" key="3">
              <FeedList />
            </TabPane>
            <TabPane tab="我订阅的" key="4">
              <Button onClick={this.handleButtonClick}>测试</Button>
            </TabPane>
          </Tabs>
        </StickyContainer>
      </div>
    );
  }
}

export default PersonalCenter;

import React, { Component } from "react";
import { Avatar, Collapse, Card, Layout, Menu, Tabs, Icon } from "antd";
import { connect } from "dva";
import router from "umi/router";

import styles from "./index.less";
import LoginModal from "../../components/LoginModal";
import EditorFeed from "../../components/EditorFeed";
import List from "../../components/FeedList";
import Tags from "../../components/Tag";
import { Sticky, StickyContainer } from "react-sticky";

const Panel = Collapse.Panel;
const Meta = Card.Meta;
const TabPane = Tabs.TabPane;
const { Header, Content } = Layout;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar
        closable={true}
        {...props}
        style={{ ...style, zIndex: 1, background: "#fff" }}
      />
    )}
  </Sticky>
);

@connect(({ user, feed, indexFeed, loading }) => ({
  user,
  feed,
  indexFeed,
  loading: loading.effects["indexFeed/selectFeed"]
}))
class ContentPanel extends Component {
  state = {
    themeName: "",
    loginVisible: false,
    activeKey: "index",
    tabList: [],
    isLogin: false
  };

  componentDidMount = () => {
    const {
      user: { currentUser },
      location: { query },
      dispatch
    } = this.props;
    this.setState({
      isLogin: !!currentUser
    });
    if (!query.key) {
      dispatch({
        type: "indexFeed/selectIndex"
      });
    } else {
      this.handleTabChange(query.key);
    }
  };

  componentDidUpdate = prevProps => {
    const {
      user: { currentUser },
      location: { query }
    } = this.props;
    const { activeKey } = this.state;
    if (prevProps.user.currentUser !== currentUser) {
      this.setState({
        isLogin: !!currentUser
      });
    }
    if (!!query.tab && query.tab !== activeKey) {
      this.handleTabChange(query.tab);
    }
    if (!query.tab && activeKey !== "index") {
      this.handleTabChange("index");
    }
  };

  handleTabChange = tab => {
    const { dispatch } = this.props;
    this.setState({
      activeKey: tab
    });
    if (tab === "index") {
      dispatch({
        type: "indexFeed/selectIndex"
      });
      return;
    }
    if (tab === "subscribe") {
      dispatch({
        type: "indexFeed/selectSubscribe"
      });
      return;
    }
    this.addTab(tab);
  };

  handleTabClick = key => {
    if (key === "index") {
      router.push("/index");
      return;
    }
    if (key === "subscribe") {
      router.push({ pathname: "/index", query: { tab: "subscribe" } });
    }
  };

  addTab = themName => {
    const { dispatch } = this.props;
    let { tabList } = this.state;
    const isTabExits = tabList.some(pane => pane.key === themName);
    if (!isTabExits) {
      this.setState({
        tabList: tabList.concat({
          title: themName,
          key: themName
        })
      });
    }
    dispatch({
      type: "indexFeed/selectByTheme",
      payload: themName
    });
  };

  removeTab = key => {
    let activeKey = this.state.activeKey;
    console.log(activeKey)
    let lastIndex;
    this.state.tabList.forEach((pane, i) => {
      if (pane.key === key) {
        lastIndex = i - 1;
      }
    });
    const tabList = this.state.tabList.filter(pane => pane.key !== key);
    if (tabList.length && activeKey === key) {
      if (lastIndex >= 0) {
        activeKey = tabList[lastIndex].key;
      } else {
        activeKey = tabList[0].key;
      }
    }
    if (tabList.length === 0) {
      activeKey = "index";
    }
    console.log(activeKey)
    this.setState({ tabList});
    router.push({ pathname: "/index", query: { tab: activeKey } });
  };

  handleClick = key => {
    if (key === "index") {
      router.push("/index");
      return;
    }
    if (key === "subscribe") {
      router.push({ pathname: "/index", query: { tab: "subscribe" } });
      return;
    }
    router.push({ pathname: "/index", query: { tab: key } });
  }

  CloseIcon = key => {
    return (
      <div>
        <span onClick={()=>this.handleClick(key)}>{key}</span>
        <Icon
          onClick={() => this.removeTab(key)}
          className={styles.icon}
          type={"close"}
        />
      </div>
    );
  };
  render() {
    const { indexFeed, loading } = this.props;
    const { activeKey, isLogin, tabList } = this.state;
    return (
      <div>
        <LoginModal
          visible={this.state.loginVisible}
          onCancel={() => this.setState({ loginVisible: false })}
        />
        <div className={styles.card}>
          <Card
            bordered={false}
            style={{ width: "60%", height: "60px" }}
            actions={[
              <span>关注：1000</span>,
              <span>关注：1000</span>,
              <span>关注：1000</span>
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="Card title"
            />
          </Card>
          <div className={styles.tag}>
            <div style={{ textAlign: "center", fontSize: "15px" }}>
              我感兴趣的标签:
            </div>
            <Tags changeTag={this.tagChange} ref="tags" />
          </div>
        </div>
        <Collapse bordered={false} style={{ marginBottom: "5px" }}>
          <Panel key={1} header={"点这里发布帖子和大家一起讨论吧"}>
            <EditorFeed />
          </Panel>
        </Collapse>
        <StickyContainer>
          <Tabs
            activeKey={activeKey}
            onChange={key => this.handleTabClick(key)}
            renderTabBar={renderTabBar}
            className={styles.tabs}
            style={{ marginTop: "1px" }}
          >
            {isLogin && <TabPane tab={"订阅"} key={"subscribe"} />}
            <TabPane tab={"推荐"} key={"index"} />
            {tabList.map(pane => (
              <TabPane tab={this.CloseIcon(pane.title)} key={pane.key} />
            ))}
          </Tabs>
        </StickyContainer>
        <List feed={indexFeed} listLoading={loading} />
      </div>
    );
  }
}

export default ContentPanel;

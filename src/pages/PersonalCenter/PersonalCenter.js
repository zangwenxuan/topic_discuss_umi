import React, { Component } from "react";
import { Menu, Icon, Switch, Layout } from "antd";
import Link from "umi/link";
import { connect } from "dva";
import router from "umi/router";

const { Header, Content, Footer, Sider } = Layout;

@connect(({ feed, user }) => ({ feed, user }))
class PersonalCenter extends Component {
  state = {
    uid: undefined,
    current: "1"
  };
  componentDidMount() {
    const {
      match: { params, path },
      user: { currentUser },
      location: { pathname }
    } = this.props;
    const isLogin = localStorage.getItem("token");
    if (!params.uid) {
      if (!!currentUser) {
        router.push(`/pc/${currentUser.uid}`);
      } else if (!isLogin) {
        router.push("/login");
      }
      return;
    }
    this.setState({
      uid: params.uid
    });
    if (pathname === `/pc/${params.uid}/release`) {
      this.setState({
        current: "2"
      });
    }
    if (pathname === `/pc/${params.uid}/keep`) {
      this.setState({
        current: "3"
      });
    }
    if (pathname === `/pc/${params.uid}/follower`) {
      this.setState({
        current: "4"
      });
    }
    if (pathname === `/pc/${params.uid}/following`) {
      this.setState({
        current: "5"
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      match: { params },
      user: { currentUser }
    } = this.props;
    if (!params.uid && !!currentUser) {
      router.push(`/pc/${currentUser.uid}`);
    }
    if (!!params.uid && params.uid !== this.state.uid) {
      this.setState({
        uid: params.uid
      });
    }
  }

  handleMenuClick = e => {
    const { uid } = this.state;
    this.setState({
      current: e.key
    });
    if (e.key === "1") {
      router.push(`/pc/${uid}`);
    }
    if (e.key === "2") {
      router.push(`/pc/${uid}/release`);
    }
    if (e.key === "3") {
      router.push(`/pc/${uid}/keep`);
    }
    if (e.key === "4") {
      router.push(`/pc/${uid}/follower`);
    }
    if (e.key === "5") {
      router.push(`/pc/${uid}/following`);
    }
  };
  render() {
    const { uid, current } = this.state;
    return (
      <Layout style={{ minHeight: "800px", width: "1200px" }}>
        <Sider
          theme={"light"}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <Menu
            onClick={this.handleMenuClick}
            style={{ height: "100%" }}
            defaultSelectedKeys={["1"]}
            selectedKeys={[current]}
            mode={"inline"}
            theme={"light"}
          >
            <Menu.Item key="1">
              <Icon type="user" />
              名片
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="mail" />
              动态
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="lock" />
              收藏
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="lock" />
              关注
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="lock" />
              粉丝
            </Menu.Item>
          </Menu>
        </Sider>
        <Content
          style={{
            margin: "0 0px 0",
            backgroundColor: "#fff",
            overflow: "auto"
          }}
        >
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            {this.props.children}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default PersonalCenter;

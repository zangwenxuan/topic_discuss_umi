import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import styles from "./index.less";
import Link from "umi/link";
import router from "umi/router";

const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
  state = {current: "1"};
  componentDidMount() {
    const {location:{pathname}} = this.props
    if(pathname === "/admin/usermanager"){
      this.setState({current:"1"})
    }
    if(pathname === "/admin/feedmanager"){
      this.setState({current:"2"})
    }
  }

  handleMenuClick = e => {
    this.setState({
      current: e.key
    });
    if (e.key === "1") {
      router.push("/admin/usermanager");
    }
    if(e.key === "2"){
      router.push("/admin/feedmanager")
    }
  };
  render() {
    const { current } = this.state;
    return (
      <Layout>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0
          }}
        >
          <Menu
            onClick={this.handleMenuClick}
            style={{ height: "100%" }}
            defaultSelectedKeys={["1"]}
            selectedKeys={[current]}
            mode={"inline"}
            theme={"dark"}
          >
            <div style={{ height: 150 }} />
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">用户管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">帖子管理</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span className="nav-text">nav 3</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="bar-chart" />
              <span className="nav-text">nav 4</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className={styles.content}>{this.props.children}</Content>
      </Layout>
    );
  }
}

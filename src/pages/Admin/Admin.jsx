import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Modal,
  Input,
  Button,
  Tooltip,
  message
} from "antd";
import styles from "./index.less";
import Link from "umi/link";
import router from "umi/router";
import { connect } from "dva";

const { Header, Content, Footer, Sider } = Layout;

@connect(({ admin }) => ({ admin }))
class Admin extends Component {
  state = { current: "1" };
  componentDidMount() {
    const {
      location: { pathname }
    } = this.props;
    if (pathname === "/admin/usermanager") {
      this.setState({ current: "1" });
    }
    if (pathname === "/admin/feedmanager") {
      this.setState({ current: "2" });
    }
  }

  handleMenuClick = e => {
    this.setState({
      current: e.key
    });
    if (e.key === "1") {
      router.push("/admin/usermanager");
    }
    if (e.key === "2") {
      router.push("/admin/feedmanager");
    }
  };

  checkPassword = () => {
    const { password } = this.state;
    const { dispatch } = this.props;
    if (!password) {
      message.error("请输入通行证");
      return;
    }
    dispatch({
      type: "admin/verityAdmin",
      payload: { password }
    });
  };
  handlePasswordChange = e => {
    this.setState({
      password: e.target.value
    });
  };
  render() {
    const { current, password } = this.state;
    const {
      admin: { visible }
    } = this.props;
    return (
      <Layout>
        <Modal
          visible={visible}
          closable={false}
          centered
          destroyOnClose
          mask
          footer={false}
        >
          <Input.Password
            addonAfter={
              <Tooltip title={"提交"}>
                <Icon
                  style={{ fontSize: 20 }}
                  onClick={this.checkPassword}
                  type={"check"}
                />
              </Tooltip>
            }
            placeholder={"输入通行证"}
            value={password}
            onChange={this.handlePasswordChange}
            onPressEnter={this.checkPassword}
          />
        </Modal>
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
          </Menu>
        </Sider>
        <Content className={styles.content}>
          {!visible && this.props.children}
        </Content>
      </Layout>
    );
  }
}
export default Admin;

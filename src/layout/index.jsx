import { Layout, Alert, Modal } from "antd";
import RenderAuthorized from "ant-design-pro/lib/Authorized";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import React, { Component } from "react";
import styles from "./index.less";

import Header from "./Header";
import Login from "../pages/Login/Login";
import LoginModal from "../components/LoginModal";

const Authorized = RenderAuthorized("user");
const noMatch = <Alert message="No permission." type="error" showIcon />;
const noMatchs = (
  <div style={{ height: "700px" }}>
    <Modal visible={true}>
      <Login />
    </Modal>
  </div>
);
const { Content, Footer } = Layout;

class BasicLayout extends Component {
  getRouterAuthority = (pathname, routeData) => {
    let pathnames = pathname.split("/");
    if (
      pathnames.length === 3 &&
      pathnames[2] !== "" &&
      pathnames[1] === "chatRom"
    ) {
      pathname = "/chatRom/:uid";
    }
    let routeAuthority = ["noAuthority"];
    routeAuthority = null;
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path === key) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };
  getChildren = () => {
    const { children,location:{pathname} } = this.props;
    let isError = true;
    const normal = children.props.children.filter(child => {
      if (!child.props.path) {
        return false;
      }
      console.log(`${children.props.location.pathname}=>${child.props.path}`)
      const childrenPaths = children.props.location.pathname.split("/");
      const childPaths = child.props.path.split("/");
      if (
        childrenPaths.length === childPaths.length &&
        childrenPaths[1] === childPaths[1]
      ) {
        isError = false;
      }
      if (children.props.location.pathname === child.props.path) {
        isError = false;
      }
      return true;
    });
    const error = children.props.children.filter(child => {
      if (!!child.props.path) {
        return false;
      }
      return true;
    });
    if (isError) {
      return [error[0]].map(child =>
        React.cloneElement(child, { showLogin: this.showLogin })
      );
    }
    return normal.map(child =>
      React.cloneElement(child, { showLogin: this.showLogin })
    );
  };
  render() {
    const {
      location: { pathname },
      route: { routes },
      children
    } = this.props;
    const routerConfig = this.getRouterAuthority(pathname, routes);
    return (
      <Layout>
        <Header />
        <Content style={{ padding: "0 50px",minHeight:"700px" }} className={styles.content}>
          {/*         <Row className={styles.row}>
          <Col span={22}  className={styles.content}>*/}
          {/*  <Authorized authority={routerConfig} noMatch={noMatchs}>
            <TransitionGroup>
              <CSSTransition key={this.props.location.pathname} classNames={styles.fade} timeout={3000}>
                { this.props.children }
              </CSSTransition>
            </TransitionGroup>
          </Authorized>*/}
          {/*{this.getChildren()}*/}
          {this.props.children}
          {/*{this.getChildren()}*/}
          {/* {children.props.children
            .filter(
              child =>
                children.props.location.path !== child.props.path ||
                (!!child.props.path &&
                  children.props.location.path !== child.props.path)
            )
            .map(child =>
              React.cloneElement(child, { showLogin: this.showLogin })
            )}*/}
          {/*          </Col>
            <Col span={1}>
              <Affix offsetTop={300} ><Button >侧边栏</Button><a href='#top'>Top</a></Affix>
            </Col>
          </Row>*/}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          NJIT ©2019 Created by Wenxuan Zang
        </Footer>
      </Layout>
    );
  }
}

export default BasicLayout;

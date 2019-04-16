import { Layout, Alert, Modal } from "antd";
import RenderAuthorized from "ant-design-pro/lib/Authorized";
import React, { Component } from "react";
import styles from "./index.less";

import Header from "./Header";
import Login from "../pages/login"

const Authorized = RenderAuthorized("user");
const noMatch = <Alert message="No permission." type="error" showIcon />;
const noMatchs = <div style={{height:"700px"}}><Modal  visible={true}><Login/></Modal></div>;
const { Content, Footer } = Layout;

class BasicLayout extends Component {
  getRouterAuthority = (pathname, routeData) => {
     let pathnames = pathname.split("/")
    if (pathnames.length === 3&&pathnames[2]!== ""&&pathnames[1] === "chatRom") {
      pathname = "/chatRom/:uid";
    }
    let routeAuthority = ["noAuthority"];
    routeAuthority = null
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
  render() {
    const {
      location: { pathname },
      route: { routes }
    } = this.props;
    const routerConfig = this.getRouterAuthority(pathname, routes);
    return (
      <Layout>
        <Header />
        <Content style={{ padding: "0 50px" }} className={styles.content}>
          {/*         <Row className={styles.row}>
          <Col span={22}  className={styles.content}>*/}
          <Authorized authority={routerConfig} noMatch={noMatchs}>
            {this.props.children}
          </Authorized>
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

import { List, message, Avatar, Spin } from "antd";
import reqwest from "reqwest";
import React from "react";

import styles from "./index.less"

import InfiniteScroll from "react-infinite-scroller";

const fakeDataUrl =
  "https://randomuser.me/request/?results=5&inc=name,gender,email,nat&noinfo";

const rdom = require('react-dom');
export default class InfiniteListExample extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true
  };

  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: res.results
      });
    });
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: res => {
        callback(res);
      }
    });
  };
  handleInfiniteOnLoad = () => {
    let data = this.state.data;
    this.setState({
      loading: true
    });
    if (data.length > 140) {
      message.warning("Infinite List loaded all");
      this.setState({
        hasMore: false,
        loading: false
      });
      return;
    }
    this.fetchData(res => {
      data = res.results.concat(data);
      this.setState({
        data,
        loading: false
      });
    });
  };
  handleScroll = e =>{
    const ele = rdom.findDOMNode(this);
    console.log(e.nativeEvent.deltaY)
    if (e.nativeEvent.deltaY <= 0) {
      /* scrolling up */
      if(ele.scrollTop <= 0) {
        console.log("**********")
        e.preventDefault();
      }
    }
    else
    {
      /* scrolling down */
      if(ele.scrollTop + ele.clientHeight >= ele.scrollHeight) {
        e.preventDefault();
      }
    }
  }

  render() {
    return (
      <div className={styles["demo-infinite-container"]} >
          <List
            onWheel={e =>{this.handleScroll(e)}}
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description={item.email}
                />
                <div>Content</div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className={styles["demo-loading-container"]}>
                <Spin />
              </div>
            )}
          </List>
      </div>
    );
  }
}

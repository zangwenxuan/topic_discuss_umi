import React, { Component } from "react";
import { Icon, Avatar, List, Tooltip, Popover, message, Tag,Collapse, Card,Divider ,Comment  } from "antd";
import Link from "umi/link";
import { connect } from "dva";
import moment from "moment";
import "moment/locale/zh-cn";

import styles from "./index.less";
import EditorFeed from "../../components/EditorFeed";
import FeedList from "../../components/FeedList"

import Tags from "../../components/Tag"
const Panel = Collapse.Panel
const Meta = Card.Meta;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

class ContentPanel extends Component {
  state = {
    visible: false,
    feedId: "",
    commentValue: "",
    themeName: "",
    keepList: [],
    likeList: [],
    keepNum: [],
    likeNum: [],
    messageNum: []
  };
  render() {
    return (
      <div>
        <div className={styles.card}>
          <Card bordered={false} style={{ width: "60%", height: "60px" }} actions={[<span>关注：1000</span>,<span>关注：1000</span>,<span>关注：1000</span>]}>
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="Card title"
            />
          </Card>
          <div className={styles.tag}>
            <div style={{textAlign:"center",fontSize:"15px"}}>我感兴趣的标签:</div>
            <Tags  changeTag={this.tagChange} ref="tags"/></div>
        </div>
        <Collapse bordered={false} style={{marginBottom:"10px"}} >
          <Panel key={1} header={"点这里发布帖子和大家一起讨论吧"}>
            <EditorFeed /></Panel></Collapse>
        <FeedList />
      </div>
    );
  }
}

export default ContentPanel

import React, { Component } from "react";
import { Avatar, Collapse, Card } from "antd";
import { connect } from "dva";

import styles from "./index.less";
import LoginModal from "../../components/LoginModal"
import EditorFeed from "../../components/EditorFeed";
import FeedList from "../../components/FeedList";
import Tags from "../../components/Tag";

const Panel = Collapse.Panel;
const Meta = Card.Meta;

@connect(({ feed }) => ({ feed }))
class ContentPanel extends Component {
  state = {
    themeName: "",
    loginVisible: false
  };

  componentDidMount = () => {
    const { match:{params}, dispatch } = this.props;
    if (!params.themeName) {
      dispatch({
        type: "feed/getContentList"
      });
    } else {
      dispatch({
        type: "feed/getContentListByTheme",
        payload: params.themeName
      });
      this.setState({
        themeName: params.themeName
      });
    }
  };

  componentDidUpdate = prevProps => {
    const { match, dispatch } = this.props;
    const { themeName } = this.state;
    const { params } = match;
    if (params.themeName && themeName !== params.themeName) {
      dispatch({
        type: "feed/getContentListByTheme",
        payload: params.themeName
      });
      this.setState({
        themeName: params.themeName
      });
    }
  };

  render() {
    return (
      <div>
        <LoginModal visible={this.state.loginVisible} onCancel={()=>this.setState({loginVisible:false})}/>
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
        <FeedList />
      </div>
    );
  }
}

export default ContentPanel;

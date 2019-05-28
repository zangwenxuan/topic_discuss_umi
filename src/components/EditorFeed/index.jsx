import React, { Component } from "react";
import { Button, Input, Icon, Avatar, Row, Col, message } from "antd";
import PicturesWall from "../PicturesWall";
import { connect } from "dva";
import styles from "./index.less";

import Editor from "../../components/BraftEditor";
import Tags from "../../components/Tag";
import BraftEditor from "braft-editor";
import { ContentUtils } from "braft-utils";

const TextArea = Input.TextArea;

@connect(({ user, sendFeed, loading }) => ({
  user,
  sendFeed,
  Loading: loading.effects["feed/submit"]
}))
class EditorFeed extends Component {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
    fileList: [],
    tagList: []
  };
  onPicChange = fileList => {
    this.setState({
      fileList
    });
  };
  tagChange = list => {
    this.setState({
      tagList: list
    });
  };
  onEditorChange = editorState => {
    this.setState({ editorState });
  };
  showLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/showLoginModal"
    });
  };
  onSubmit = () => {
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
    const { dispatch } = this.props;
    const { editorState, fileList, tagList } = this.state;
    let isEmpty = true;
    editorState.toRAW(true).blocks.forEach(l => {
      if (!l.text.match(/^[ ]*$/)) {
        isEmpty = false;
      }
    });
    if (isEmpty) {
      console.log(editorState.toRAW(true));
      message.error("帖子内容不能为空！");
      return;
    }
    const payload = {
      pic: fileList.map(f => f.response.res),
      content: editorState.toRAW(),
      themeList: tagList
    };
    dispatch({
      type: "feed/submit",
      payload
    });
    this.setState({
      fileList: [],
      tagList: [],
      editorState: ContentUtils.clear(this.state.editorState)
    });
    this.refs.tags.clear();
    this.refs.pic.clear();
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.main}>
        <Tags showTitle changeTag={this.tagChange} ref="tags" />
        <div className={styles.editor}>
          <Editor onChange={this.onEditorChange} value={editorState} />
        </div>
        <PicturesWall
          onPicChange={this.onPicChange}
          className={styles.picture}
          ref="pic"
        />
        <Button
          className={styles.submit}
          onClick={this.onSubmit}
          type="primary"
        >
          发布
        </Button>
      </div>
    );
  }
}

export default EditorFeed;

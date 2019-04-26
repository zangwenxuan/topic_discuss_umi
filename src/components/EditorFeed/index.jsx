import React, { Compenent } from "react";
import { Button, Input, Icon, Avatar, Row, Col } from "antd";
import PicturesWall from "../PicturesWall";
import { connect } from "dva";
import styles from "./index.less";
import { withRouter } from "react-router";

import Tags from "../../components/Tag";

const TextArea = Input.TextArea;

class EditorFeed extends React.Component {
  state = {
    fileList: [],
    tagList: [],
    value: ""
  };
  updatePic = fileList => {
    this.setState({
      fileList
    });
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
  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };
  onSubmit = () => {
    const { user, submit } = this.props;
    const { value, fileList, tagList } = this.state;
    const payload = {
      pic: fileList.map(f => f.response.res),
      content: value,
      themeList: tagList
    };
    submit(payload);
    this.setState({
      value: "",
      fileList: [],
      tagList: []
    });
    this.refs.tags.clear();
    this.refs.pic.clear();
  };
  handleInputConfirm = () => {
    const state = this.state;
    const { changeTag } = this.props;
    const inputValue = state.inputValue;
    let tags = state.tags;
    let colors = state.colors;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      colors.push(this.randomColor());
    }
    changeTag(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ""
    });
  };

  render() {
    const { value } = this.state;
    return (
      <div className={styles.main}>
        <Tags showTitle changeTag={this.tagChange} ref="tags" />
        <div className={styles.editor}>
          <Row gutter={6}>
            <Col span={22}>
              <TextArea
                rows={4}
                onChange={this.onChange}
                value={value}
                placeholder="输入你想讨论的内容"
              />
            </Col>
            <Col span={2} className={styles.submitCol}>
              <Button
                className={styles.submit}
                onClick={this.onSubmit}
                type="primary"
              >
                发布
              </Button>
            </Col>
          </Row>
        </div>
        <PicturesWall
          onPicChange={this.onPicChange}
          className={styles.picture}
          ref="pic"
        />
      </div>
    );
  }
}

function mapStateToProps({ user, sendFeed, loading }) {
  return {
    sendFeed,
    user,
    Loading: loading.effects["feed/submit"]
  };
}
function mapDispatchToProps(dispatch) {
  return {
    submit: payload => {
      dispatch({
        type: "feed/submit",
        payload
      });
    }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorFeed)
);

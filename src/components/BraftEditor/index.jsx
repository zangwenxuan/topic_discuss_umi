import React, { Component } from "react";
import BraftEditor from "braft-editor";
import { Icon } from "antd";
import "braft-editor/dist/index.css";
import { Menu } from "antd";
import classNames from "classnames"
import styles from "./index.less"

export default class BasicEditor extends Component {
  static defaultProps = {
    onChange:() => {}
  }
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
    pro: false,
    mainClassName: classNames(styles.mainNormal)
  };
  onEditorChange = editorState => {
    this.setState({ editorState });
  };
  onEditorMenuClick = e => {
    if (e.key === "normal") {
      this.setState({
        editorPro: false,
        mainClassName: classNames(styles.mainNormal)
      });
    }
    if (e.key === "pro") {
      this.setState({ editorPro: true,
        mainClassName: classNames(styles.mainPro)});
    }
  };
  render() {
    const { editorPro, mainClassName } = this.state;
    const { onChange, value } = this.props
    const extendControls = [
      "separator",
      {
        key: "my-dropdown",
        type: "dropdown",
        title: "切换基础/专业编辑器", // 指定鼠标悬停提示文案
        className: "my-dropdown", // 指定下拉组件容器的样式名
        html: null, // 指定在按钮中渲染的html字符串
        text: <Icon type={"more"} />, // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
        showArrow: false, // 指定是否显示下拉组件顶部的小三角形
        arrowActive: false, // 指定是否高亮下拉组件顶部的小三角形
        autoHide: true, // 指定是否在失去焦点时自动隐藏下拉组件
        component: (<Menu onClick={this.onEditorMenuClick}>
            <Menu.Item key={"normal"}>
              <span>基础编辑器</span>
            </Menu.Item>
            <Menu.Item key={"pro"}>
              <span>专业编辑器</span>
            </Menu.Item>
          </Menu>
        ) // 指定在下拉组件中显示的内容组件
      }
    ];
    const controlsPro = [
      "undo", "redo", "separator", "font-size", "line-height", "letter-spacing", "separator", "text-color",
      "bold", "italic", "underline", "strike-through", "separator", "superscript", "subscript", "remove-styles",
      "emoji", "separator", "text-indent", "text-align", "separator", "headings", "list-ul", "list-ol", "blockquote",
      "code", "separator", "link", "separator", "hr", "separator", "separator", "clear" ];
    const controlsNormal = [
      "emoji",
      "text-color",
      "bold",
      "italic",
      "underline",
      "strike-through"
    ];
    return (
      <div className={mainClassName}>
        <BraftEditor
          controls={editorPro ? controlsPro : controlsNormal}
          style={{ backgroundColor: "#fff",border: "2px solid #18181a1a" }}
          value={value}
          onChange={onChange}
          extendControls={extendControls}
        />
      </div>
    );
  }
}

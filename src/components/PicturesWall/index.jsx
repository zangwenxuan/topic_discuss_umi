import { Upload, Icon, Modal, message } from "antd";
import React from "react";
import { connect } from "dva";
import styles from "./index.less";

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }

  clear = () => {
    this.setState({
      fileList: [],
      fileNameList: []
    })
  }

  handleChange = ({ file, fileList }) => {
    console.log(file)
    this.props.onPicChange(fileList);
    return this.setState({fileList})
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className={styles["ant-upload-text"]}>Upload</div>
      </div>
    );
    return (
      <div className={styles.main}>
        <Upload
          action="/api/content/uploadPic"
          name="importFile"
          /* beforeUpload={this.beforeUpload}*/
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PicturesWall;
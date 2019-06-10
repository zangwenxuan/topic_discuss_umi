import React, { Component } from "react";
import { Input, Avatar, Button, Card, Modal, Upload, Icon, Spin } from "antd";
import { connect } from "dva";
import styles from "./AccountInfo.less";

const { Meta } = Card;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect(({ feeds, user, accountInfo, loading }) => ({
  feeds,
  user,
  accountInfo,
  loading: loading.effects["accountInfo/getUserInfo"]
}))
class Info extends Component {
  state = {
    isSelf: false,
    visible: false,
    currentModal: undefined,
    newAvatar: undefined,
    newCover: undefined,
    oldAvatar: undefined,
    oldCover: undefined,
    signature: undefined,
    userName: undefined
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
      user: { currentUser }
    } = this.props;
    this.setState({
      isSelf: !!currentUser && currentUser.uid === params.uid,
      uid: params.uid
    });
    dispatch({
      type: "accountInfo/getUserInfo",
      payload: params.uid
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      accountInfo: { userInfo },
      match: { params },
      user: { currentUser }
    } = this.props;
    if (prevProps.user.currentUser !== this.props.user.currentUser) {
      this.setState({
        isSelf: !!currentUser && currentUser.uid === params.uid
      });
    }
    if (prevProps.accountInfo.userInfo !== userInfo) {
      this.setState({
        oldAvatar: userInfo.avatar,
        oldCover: userInfo.cover,
        newAvatar: userInfo.avatar,
        newCover: userInfo.cover,
        signature: userInfo.signature,
        userName: userInfo.nickname
      });
    }
  }

  showAvatarModal = () => {
    this.setState({
      currentModal: "avatar"
    });
  };

  showCoverModal = () => {
    this.setState({
      currentModal: "cover"
    });
  };

  onCancel = () => {
    const { currentModal, oldAvatar, oldCover } = this.state;
    if (currentModal === "avatar") {
      this.setState({
        currentModal: undefined,
        imageUrl: undefined,
        newAvatar: oldAvatar
      });
    } else {
      this.setState({
        currentModal: undefined,
        imageUrl: undefined,
        newCover: oldCover
      });
    }
  };

  changeSign = e => {
    this.setState({
      signature: e.target.value
    });
  };

  handleChange = info => {
    const { currentModal } = this.state;
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      if (currentModal === "avatar") {
        this.setState({
          newAvatar: info.file.response.res
        });
      } else {
        this.setState({
          newCover: info.file.response.res
        });
      }
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };
  Upload = () => {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="importFile"
        listType="picture-card"
        showUploadList={false}
        action="/api/content/uploadPic"
        onChange={this.handleChange}
      >
        {imageUrl ? (
          <img
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            src={imageUrl}
            alt="avatar"
          />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  };
  submitSign = () => {
    const { dispatch } = this.props;
    const { signature } = this.state;
    dispatch({
      type: "accountInfo/updateUser",
      payload: { signature }
    });
  };
  handleButtonClick = () => {
    const { dispatch } = this.props;
    const { newAvatar, newCover, currentModal } = this.state;
    this.setState({
      currentModal: undefined,
      imageUrl: undefined
    });
    dispatch({
      type: "accountInfo/updateUser",
      payload:
        currentModal === "avatar" ? { avatar: newAvatar } : { cover: newCover }
    });
  };
  render() {
    const {
      newAvatar,
      newCover,
      userName,
      signature,
      currentModal,
      isSelf
    } = this.state;
    const { loading } = this.props;
    return (
      <div className={styles.main}>
        <Spin spinning={loading}>
          <div className={styles.modal}>
            <Modal
              style={{ top: 300 }}
              centered
              destroyOnClose
              keyboard
              mask
              maskClosable={true}
              onCancel={this.onCancel}
              title={false}
              visible={!!currentModal}
              footer={false}
            >
              <div style={{ width: "100%", display: "flex" }}>
                {this.Upload()}
                <Button onClick={this.handleButtonClick}>确认更换</Button>
              </div>
            </Modal>
          </div>
          <div className={styles.card}>
            <Card
              className={styles.content}
              cover={
                <div className={styles.cover}>
                  <img
                    style={{ width: "100%" }}
                    alt="example"
                    src={
                      newCover === null
                        ? "http://localhost:8080/pic/cover.jpg"
                        : `http://localhost:8080/pic/${newCover}`
                    }
                  />
                  {isSelf && (
                    <a
                      onClick={this.showCoverModal}
                      style={{ color: "#fff" ,fontSize: "30px"}}
                      className={styles.span}
                    >
                      更换封面
                    </a>
                  )}
                </div>
              }
            >
              <Meta
                avatar={
                  <div className={styles.avatarBox}>
                    <Avatar
                      size={80}
                      src={
                        newAvatar === null
                          ? "http://localhost:8080/pic/avatar.png"
                          : `http://localhost:8080/pic/${newAvatar}`
                      }
                    />
                    {isSelf && (
                      <a
                        onClick={this.showAvatarModal}
                        style={{
                          color: "#fff",
                          margin: "0 auto",
                          fontSize: "large"
                        }}
                        className={styles.span}
                      >
                        更换头像
                      </a>
                    )}
                  </div>
                }
                title={userName}
                description={
                  <Input
                    disabled={!isSelf}
                    onBlur={this.submitSign}
                    placeholder={"编辑个性签名"}
                    onChange={this.changeSign}
                    value={signature}
                  />
                }
              />
            </Card>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Info;

import React, { Component } from "react";
import { Table, Input, Button, Icon, Popconfirm, Divider } from "antd";
import Highlighter from "react-highlight-words";
import Link from "umi/link";
import { connect } from "dva";

@connect(({ userManager }) => ({ userManager }))
class UserList extends Component {
  state = {
    searchText: ""
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "userManager/selectAll"
    });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  deleteUser = uid => {
    const { dispatch } = this.props;
    dispatch({
      type: "userManager/deleteUser",
      payload: { uid }
    });
  };
  render() {
    const {
      userManager: { userList = [] }
    } = this.props;
    const columns = [
      {
        title: "Id",
        dataIndex: "uid",
        key: "uid",
        width: "15%",
        ...this.getColumnSearchProps("uid")
      },
      {
        title: "昵称",
        dataIndex: "nickname",
        key: "nickname",
        width: "15%",
        ...this.getColumnSearchProps("nickname")
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        width: "25%",
        ...this.getColumnSearchProps("email")
      },
      {
        title: "发帖数",
        dataIndex: "feedNum",
        key: "feedNum",
        width: "10%",
        sorter: (a, b) => a.feedNum - b.feedNum
      },
      {
        title: "粉丝数",
        dataIndex: "followerNum",
        key: "followerNum",
        width: "10%",
        sorter: (a, b) => a.followerNum - b.followerNum
      },
      {
        title: "关注数",
        dataIndex: "followingNum",
        key: "followingNum",
        width: "10%",
        sorter: (a, b) => a.followingNum - b.followingNum
      },
      {
        title: "Action",
        key: "action",
        render: record => (
          <div>
            <Link to={`/pc/${record.uid}`}>查看</Link>丨
            <Popconfirm
              onConfirm={() => this.deleteUser(record.uid)}
              title={"是否确认删除？"}
              okText={"确定"}
              cancelText={"取消"}
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    return (
      <div>
        <Divider orientation="left">当前用户数量：{userList.length}</Divider>
        <Table
          rowKey={record => record.uid}
          style={{ border: "1px solid #3933333d", backgroundColor: "#fff" }}
          columns={columns}
          dataSource={userList}
        />
      </div>
    );
  }
}

export default UserList;

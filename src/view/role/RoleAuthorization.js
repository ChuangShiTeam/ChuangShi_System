import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Row, Col, Spin, Button, Tree, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class RoleAuthorization extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			is_show: false,
			role_id: '',
			expandedKeys: [],
			checkedKeys: [],
			menuList: []
		}
	}

	componentDidMount() {
		notification.on('notification_role_authorization', this, function (data) {
			this.setState({
				is_show: true,
				role_id: data.role_id
			}, function () {
				this.handleLoad();
			});
		});
	}

	componentWillUnmount() {
		notification.remove('notification_role_authorization', this);
	}

	handleLoad() {
		this.setState({
			is_load: true
		});

		http.request({
			url: '/admin/role/menu/list',
			data: {
				role_id: this.state.role_id
			},
			success: function (data) {
				let menuList = data;
				let expandedArray = [];
				let checkedArray = [];
				for (let i = 0; i < menuList.length; i++) {
					let item = menuList[i];
					expandedArray.push(item.menu_id);
					if (item.is_select) {
                        checkedArray.push(item.menu_id);
					}
					for (let j = 0; j < item.children.length; j++) {
						let children = item.children[j];
						if (children.children && children.children.length > 0) {
							expandedArray.push(children.menu_id);
							for (let k = 0; k < children.children.length; k++) {
								let grandson = children.children[k];
								if (grandson.is_select) {
									checkedArray.push(grandson.menu_id);
								}
							}
						} else {
							if (children.is_select) {
								checkedArray.push(children.menu_id);
							}
						}
					}
				}

				this.setState({
					menuList: data,
					expandedKeys: expandedArray,
					checkedKeys: checkedArray
				});
			}.bind(this),
			complete: function () {
				this.setState({
					is_load: false
				})
			}.bind(this)
		});
	}

	handleSubmit() {
		this.setState({
			is_load: true
		});
		let array = [];

        if(this.state.checkedKeys) {
            for (let i = 0; i < this.state.checkedKeys.length; i++) {
                let item = this.state.checkedKeys[i];
                if (item.length === 32) {
                    array.push({
                        menu_id: item
                    });
                }
            }
		}

		http.request({
			url: '/admin/role/menu/update',
			data: {
				list: array,
				role_id: this.state.role_id
			},
			success: function (data) {
				message.success(constant.success);

				notification.emit('notification_role_index_load', {});

				this.handleCancel();
			}.bind(this),
			complete: function () {
				this.setState({
					is_load: false
				});
			}.bind(this)
		});
	}

	handleCancel() {
		this.setState({
			is_load: false,
			is_show: false,
			role_id: '',
			expandedKeys: [],
			checkedKeys: [],
			menuList: []
		});
	}

	onExpand(expandedKeys) {
		this.setState({
			expandedKeys: expandedKeys
		});
	}

	onCheck(checkedKeys, object) {
		this.setState({
			checkedKeys: checkedKeys
		});
	}

	render() {
		const TreeNode = Tree.TreeNode;

		return (
			<Modal title={'角色授权菜单'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
				   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
				   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleSubmit.bind(this)}>确定</Button>
                   ]}
			>
				<Spin spinning={this.state.is_load}>
					<Row>
						<Col span={4}>
						</Col>
						<Col span={20}>
							<Tree showLine checkable
								  checkStrictly
								  expandedKeys={this.state.expandedKeys}
								  checkedKeys={this.state.checkedKeys}
								  onExpand={this.onExpand.bind(this)}
								  onCheck={this.onCheck.bind(this)}
							>
								{
									this.state.menuList.map(function (item, index) {
										return (
											<TreeNode title={item.menu_name} key={item.menu_id}>
												{
													item.children.map(function (children, i) {
														return (
															<TreeNode title={children.menu_name} key={children.menu_id}>
																{
																	children.children?children.children.map(function (grandson, k) {
																		return (
																			<TreeNode title={grandson.menu_name}
																					  key={grandson.menu_id}>
																				{}
																			</TreeNode>
																		)
																	}):null
																}
															</TreeNode>
														)
													})
												}
											</TreeNode>
										)
									})
								}
							</Tree>
						</Col>
					</Row>
				</Spin>
			</Modal>
		);
	}
}

RoleAuthorization.propTypes = {};

export default connect(({role}) => ({role}))(RoleAuthorization);
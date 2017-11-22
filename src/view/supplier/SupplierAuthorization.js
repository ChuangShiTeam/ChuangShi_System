import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Row, Col, Spin, Button, Tree, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class SupplierAuthorization extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			is_show: false,
			user_id: '',
			checkedKeys: [],
			roleList: []
		}
	}

	componentDidMount() {
		notification.on('notification_supplier_authorization', this, function (data) {
			this.setState({
				is_show: true,
				user_id: data.user_id
			}, function () {
				this.handleLoad();
			});
		});
	}

	componentWillUnmount() {
		notification.remove('notification_supplier_authorization', this);
	}

	handleLoad() {
		this.setState({
			is_load: true
		});

		http.request({
			url: '/admin/user/role/list',
			data: {
				user_id: this.state.user_id
			},
			success: function (data) {
				let checkedArray = [];

				for (let i = 0; i < data.length; i++) {
					let item = data[i];
					if (item.is_select) {
						checkedArray.push(item.role_id);
					}
				}
				this.setState({
					roleList: data,
					checkedKeys: checkedArray
				});
			}.bind(this),
			complete: function () {
				this.setState({
					is_load: false
				});

			}.bind(this)
		});
	}

	handleSubmit() {
		this.setState({
			is_load: true
		});
		let array = [];

		for (let i = 0; i < this.state.checkedKeys.length; i++) {
			array.push({
				role_id: this.state.checkedKeys[i]
			})
		}
		http.request({
			url: '/admin/user/role/update',
			data: {
				list: array,
				user_id: this.state.user_id
			},
			success: function (data) {
				message.success(constant.success);

				notification.emit('notification_supplier_index_load', {});

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
			user_id: '',
			checkedKeys: [],
			roleList: []
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
			<Modal title={'供应商授权角色'} maskClosable={false} width={document.documentElement.clientWidth - 200}
				   className="modal"
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
							<Tree showLine checkable checkedKeys={this.state.checkedKeys}
								  onCheck={this.onCheck.bind(this)}>
								{
									this.state.roleList.map(function (item, index) {
										return (
											<TreeNode title={item.role_name} key={item.role_id}></TreeNode>
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

SupplierAuthorization.propTypes = {};

export default connect(({supplier}) => ({supplier}))(SupplierAuthorization);
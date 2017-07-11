import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message, Checkbox, Table} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class MemberSend extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			is_show: false,
			action: '',
			member_id: '',
			selectedRowKeys: [],
			app_id: '',
			app_list: [],
			user_name: '',
			total: 0,
			page_index: 1,
			page_size: 7,
			list: [],
			product_list: []
		}
	}

	componentDidMount() {
		notification.on('notification_member_send', this, function (data) {
			this.setState({
				is_show: true,
				action: 'send'
			});
			if (constant.action === 'system') {
				this.props.form.setFieldsValue({
					app_id: this.state.app_id
				});

				this.handleLoadApp();
			}
			this.handleLoad();
		});
		this.handleLoadProduct();
	}

	componentWillUnmount() {
		notification.remove('notification_member_send', this);
	}

	handleLoadApp() {
		http.request({
			url: '/app/' + constant.action + '/all/list',
			data: {},
			success: function (data) {
				this.setState({
					app_list: data
				});
			}.bind(this),
			complete: function () {

			}
		});
	}

	handleLoadProduct() {
		http.request({
			url: '/product/' + constant.action + '/all/list',
			data: {},
			success: function (data) {
				this.setState({
					product_list: data
				});
			}.bind(this),
			complete: function () {

			}
		});
	}

	handleSearch() {
		new Promise(function (resolve, reject) {
			let app_id = this.props.form.getFieldValue('app_id');
			if (validate.isUndefined(app_id)) {
				app_id = '';
			}

			let user_name = this.props.form.getFieldValue('user_name');

			this.setState({
				app_id: app_id,
				user_name: user_name,
				page_index: 1
			});
			resolve();
		}.bind(this)).then(function () {
			this.handleLoad();
		}.bind(this));
	}

	handleLoad() {
		this.setState({
			is_load: true
		});

		http.request({
			url: '/member/' + constant.action + '/list',
			data: {
				app_id: this.state.app_id,
				user_name: this.state.user_name,
				page_index: this.state.page_index,
				page_size: this.state.page_size
			},
			success: function (data) {
				this.setState({
					total: data.total,
					list: data.list
				});
			}.bind(this),
			complete: function () {
				this.setState({
					is_load: false
				});
			}.bind(this)
		});
	}

	handleChangeIndex(page_index) {
		new Promise(function (resolve, reject) {
			this.setState({
				page_index: page_index
			});
			resolve();
		}.bind(this)).then(function () {
			this.handleLoad();
		}.bind(this));
	}

	handleChangeSize(page_index, page_size) {
		new Promise(function (resolve, reject) {
			this.setState({
				page_index: page_index,
				page_size: page_size
			});
			resolve();
		}.bind(this)).then(function () {
			this.handleLoad();
		}.bind(this));
	}

	handleSubmit() {
		this.props.form.validateFieldsAndScroll((errors, values) => {
			if (!!errors) {
				return;
			}
			if (!this.state.member_id) {
				message.warn('请选择会员');
				return;
			}
			values.member_id = this.state.member_id;
			values.product_sku_id = this.state.product_list.length === 0 ?'123456':this.state.product_list[0].productSkuList[0].product_sku_id;
			this.setState({
				is_load: true
			});

			http.request({
				url: '/member/' + constant.action + '/' + this.state.action,
				data: values,
				success: function (data) {
					message.success(constant.success);

					notification.emit('notification_express_index_load', {});

					this.handleCancel();
				}.bind(this),
				complete: function () {
					this.setState({
						is_load: false
					});
				}.bind(this)
			});
		});
	}

	handleCancel() {
		this.setState({
			is_load: false,
			is_show: false,
			action: ''
		});

		this.props.form.resetFields();
	}

	render() {
		const FormItem = Form.Item;
		const Option = Select.Option;
		const {getFieldDecorator} = this.props.form;

		const columns = [{
			title: '名称',
			dataIndex: 'user_name'
		}];

		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
					member_id: selectedRows[0].member_id,
					selectedRowKeys: selectedRowKeys
				});
			},onSelect: (record, selected, selectedRows) => {
				if (record.member_id === this.state.member_id) {
					this.setState({
						member_id: '',
						selectedRowKeys: []
					});
				}
			},
			selectedRowKeys: this.state.selectedRowKeys,
			type: 'radio'
		};

		const pagination = {
			size: 'defalut',
			total: this.state.total,
			showTotal: function (total, range) {
				return '总共' + total + '条数据';
			},
			current: this.state.page_index,
			pageSize: this.state.page_size,
			showSizeChanger: true,
			onShowSizeChange: this.handleChangeSize.bind(this),
			onChange: this.handleChangeIndex.bind(this)
		};

		return (
			<Modal title={'会员发货'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
					<form>
						{
							constant.action === 'system' ?
								<Row>
									<Col span={8}>
										<FormItem hasFeedback {...{
											labelCol: {span: 6},
											wrapperCol: {span: 18}
										}} className="content-search-item" label="应用名称">
											{
												getFieldDecorator('app_id', {
													rules: [{
														required: true,
														message: constant.required
													}],
													initialValue: ''
												})(
													<Select allowClear placeholder="请选择应用">
														{
															this.state.app_list.map(function (item) {
																return (
																	<Option key={item.app_id}
																			value={item.app_id}>{item.app_name}</Option>
																)
															})
														}
													</Select>
												)
											}
										</FormItem>
									</Col>
								</Row>
								:
								''
						}
						<Row key="0" className="content-title">
							<Col span={8}>
								<div className="">会员信息</div>
							</Col>
							<Col span={16} className="content-button">
								<Button type="default" icon="search" size="default" className="margin-right"
										loading={this.state.is_load}
										onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
							</Col>
						</Row>
						<Row className="content-search margin-top">
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="content-search-item" label="名称">
									{
										getFieldDecorator('user_name', {
											initialValue: ''
										})(
											<Input type="text" placeholder="请输入名称" onPressEnter={this.handleSearch.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
							<Col span={8}>
							</Col>
						</Row>
						<Table key="2"
							   rowKey="member_id"
							   className="margin-top"
							   rowSelection={rowSelection}
							   loading={this.state.is_load} columns={columns}
							   dataSource={this.state.list} pagination={pagination}
							   bordered/>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="数量">
									{
										getFieldDecorator('stock_quantity', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: 0
										})(
											<InputNumber min={1} max={99999} placeholder={constant.placeholder + '数量'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row key="4" className="content-title">
							<Col span={8}>
								<div className="">快递单信息</div>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货公司">
									{
										getFieldDecorator('express_receiver_company', {
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货公司'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货人">
									{
										getFieldDecorator('express_receiver_name', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货人'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货人电话">
									{
										getFieldDecorator('express_receiver_tel', {
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货人电话'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货人手机">
									{
										getFieldDecorator('express_receiver_mobile', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货人手机'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货人邮编">
									{
										getFieldDecorator('express_receiver_postcode', {
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货人邮编'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货人省">
									{
										getFieldDecorator('express_receiver_province', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货人省'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货人市">
									{
										getFieldDecorator('express_receiver_city', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货人市'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货人区">
									{
										getFieldDecorator('express_receiver_area', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货人区'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="form-item" label="收货详细地址">
									{
										getFieldDecorator('express_receiver_address', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: ''
										})(
											<Input type="text" placeholder={constant.placeholder + '收货详细地址'} onPressEnter={this.handleSubmit.bind(this)}/>
										)
									}
								</FormItem>
							</Col>
						</Row>
					</form>
				</Spin>
			</Modal>
		);
	}
}

MemberSend.propTypes = {};

MemberSend = Form.create({})(MemberSend);

export default MemberSend;
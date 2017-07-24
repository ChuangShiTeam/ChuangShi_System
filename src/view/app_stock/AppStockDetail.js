import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, InputNumber, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class AppStockDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			is_show: false,
			action: '',
			app_id: ''
		}
	}

	componentDidMount() {
		notification.on('notification_app_stock_detail_save', this, function (data) {
			this.setState({
				is_show: true,
				action: 'save'
			});
		});
	}

	componentWillUnmount() {
		notification.remove('notification_app_stock_detail_save', this);
	}

	handleSubmit() {
		this.props.form.validateFieldsAndScroll((errors, values) => {
			if (!!errors) {
				return;
			}
			values.object_id = this.state.app_id;
			values.product_sku_id = this.props.app_stock.product_list[0].productSkuList[0].product_sku_id;
			values.product_id = this.props.app_stock.product_list[0].product.product_id;
			values.product_category_id = this.props.app_stock.product_list[0].product.product_category_id;
			values.stock_type = this.props.app_stock.stock_type;
			this.setState({
				is_load: true
			});

			http.request({
				url: '/stock/' + constant.action + '/' + this.state.action,
				data: values,
				success: function (data) {
					message.success(constant.success);

					notification.emit('notification_app_stock_index_load', {});

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

		return (
			<Modal title={'初始化公司库存'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
															this.props.app_stock.app_list.map(function (item) {
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
						<Row>
							<Col span={8}>
								<FormItem hasFeedback {...{
									labelCol: {span: 6},
									wrapperCol: {span: 18}
								}} className="content-search-item" label="仓库名称">
									{
										getFieldDecorator('warehouse_id', {
											rules: [{
												required: true,
												message: constant.required
											}],
											initialValue: ''
										})(
											<Select allowClear placeholder="请选择仓库">
												{
													this.props.app_stock.warehouse_list.map(function (item) {
														return (
															<Option key={item.warehouse_id}
																	value={item.warehouse_id}>{item.warehouse_name}</Option>
														)
													})
												}
											</Select>
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
					</form>
				</Spin>
			</Modal>
		);
	}
}

AppStockDetail.propTypes = {};

AppStockDetail = Form.create({})(AppStockDetail);

export default connect(({app_stock}) => ({app_stock}))(AppStockDetail);
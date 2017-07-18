import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class AppStockList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false
		}
	}

	componentDidMount() {
		if (constant.action === 'system') {
			this.props.form.setFieldsValue({
				app_id: this.props.app_stock.app_id
			});

			this.handleLoadApp();
		}

		this.props.form.setFieldsValue({
			product_name: this.props.app_stock.product_name
		});

		this.handleLoad();

		notification.on('notification_app_stock_list_load', this, function (data) {
			this.handleLoad();
		});
	}

	componentWillUnmount() {
		notification.remove('notification_app_stock_list_load', this);
	}

	handleLoadApp() {
		http.request({
			url: '/app/' + constant.action + '/all/list',
			data: {},
			success: function (data) {
				this.props.dispatch({
					type: 'app_stock/fetch',
					data: {
						app_list: data
					}
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

			var product_name = this.props.form.getFieldValue('product_name');

			this.props.dispatch({
				type: 'app_stock/fetch',
				data: {
					app_id: app_id,
					product_name: product_name,
					page_index: 1
				}
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
			url: '/app/stock/' + constant.action + '/stock/list',
			data: {
				app_id: this.props.app_stock.app_id,
				product_name: this.props.app_stock.product_name,
				page_index: this.props.app_stock.page_index,
				page_size: this.props.app_stock.page_size
			},
			success: function (data) {
				this.props.dispatch({
					type: 'app_stock/fetch',
					data: {
						total: data.total,
						list: data.list
					}
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
			this.props.dispatch({
				type: 'app_stock/fetch',
				data: {
					page_index: page_index
				}
			});

			resolve();
		}.bind(this)).then(function () {
			this.handleLoad();
		}.bind(this));
	}

	handleChangeSize(page_index, page_size) {
		new Promise(function (resolve, reject) {
			this.props.dispatch({
				type: 'app_stock/fetch',
				data: {
					page_index: page_index,
					page_size: page_size
				}
			});

			resolve();
		}.bind(this)).then(function () {
			this.handleLoad();
		}.bind(this));
	}

	render() {
		const FormItem = Form.Item;
		const Option = Select.Option;
		const {getFieldDecorator} = this.props.form;

		const columns = [{
			width: 150,
			title: '产品名称',
			dataIndex: 'product_name'
		}, {
			width: 150,
			title: '数量',
			dataIndex: 'sum_stock_quantity'
		}];

		const pagination = {
			size: 'defalut',
			total: this.props.app_stock.total,
			showTotal: function (total, range) {
				return '总共' + total + '条数据';
			},
			current: this.props.app_stock.page_index,
			pageSize: this.props.app_stock.page_size,
			showSizeChanger: true,
			onShowSizeChange: this.handleChangeSize.bind(this),
			onChange: this.handleChangeIndex.bind(this)
		};

		return (
			<QueueAnim>
				<Row key="0" className="content-title">
					<Col span={8}>
						<div className="">公司库存信息</div>
					</Col>
					<Col span={16} className="content-button">
						<Button type="default" icon="search" size="default" className="margin-right"
								loading={this.state.is_load}
								onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
					</Col>
				</Row>
				<Form key="1" className="content-search margin-top">
					<Row>
						{
							constant.action === 'system' ?
								<Col span={8}>
									<FormItem hasFeedback {...{
										labelCol: {span: 6},
										wrapperCol: {span: 18}
									}} className="content-search-item" label="应用名称">
										{
											getFieldDecorator('app_id', {
												initialValue: ''
											})(
												<Select allowClear placeholder="请选择应用">
													{
														this.props.stock.app_list.map(function (item) {
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
								:
								''
						}
						<Col span={8}>
							<FormItem hasFeedback {...{
								labelCol: {span: 6},
								wrapperCol: {span: 18}
							}} className="content-search-item" label="产品名称">
								{
									getFieldDecorator('product_name', {
										initialValue: ''
									})(
										<Input type="text" placeholder="请输入产品名称" onPressEnter={this.handleSearch.bind(this)}/>
									)
								}
							</FormItem>
						</Col>
					</Row>
				</Form>
				<Table key="2"
					   className="margin-top"
					   loading={this.state.is_load} columns={columns}
					   dataSource={this.props.app_stock.list} pagination={pagination}
					   bordered/>
			</QueueAnim>
		);
	}
}

AppStockList.propTypes = {};

AppStockList = Form.create({})(AppStockList);

export default connect(({app_stock}) => ({
	app_stock
}))(AppStockList);
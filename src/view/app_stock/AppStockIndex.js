import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Table, Popconfirm, message} from 'antd';

import AppStockDetail from './AppStockDetail';
import AppStockReplenish from './AppStockReplenish';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class AppStockIndex extends Component {
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
			stock_action: this.props.app_stock.stock_action
		});

		this.handleLoad();
        this.handleLoadProduct();

		notification.on('notification_app_stock_index_load', this, function (data) {
			this.handleLoad();
		});
	}

	componentWillUnmount() {
		notification.remove('notification_app_stock_index_load', this);
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

    handleLoadProduct() {
        http.request({
            url: '/product/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'app_stock/fetch',
                    data: {
                        product_list: data
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

			var stock_action = this.props.form.getFieldValue('stock_action');

			this.props.dispatch({
				type: 'app_stock/fetch',
				data: {
					app_id: app_id,
					stock_action: stock_action,
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
			url: '/app/stock/' + constant.action + '/list',
			data: {
				app_id: this.props.app_stock.app_id,
				stock_action: this.props.app_stock.stock_action,
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

	handleView(stock_id) {
		notification.emit('notification_app_stock_detail_view', {
			stock_id: stock_id
		});
	}

	handleDel(stock_id, system_version) {
		this.setState({
			is_load: true
		});

		http.request({
			url: '/app/stock/' + constant.action + '/delete',
			data: {
				stock_id: stock_id,
				system_version: system_version
			},
			success: function (data) {
				message.success(constant.success);

				this.handleLoad();
			}.bind(this),
			complete: function () {
				this.setState({
					is_load: false
				});
			}.bind(this)
		});
	}

	handleReplenish() {
		notification.emit('notification_app_stock_replenish', {});
	}

	render() {
		const FormItem = Form.Item;
		const Option = Select.Option;
		const {getFieldDecorator} = this.props.form;

		const columns = [{
			width: 150,
			title: '数量',
			dataIndex: 'stock_quantity'
		}, {
			width: 150,
			title: '出库/入库/平台补充',
			dataIndex: 'stock_action',
			render: (text, record, index) => (
				<span>
					{
						text === 'OUT'?'出库':text === 'IN'?'入库':text === 'REPLENISH'?'平台补充':null
					}
				</span>
			)
		}, {
			width: 150,
			title: '操作时间',
			dataIndex: 'system_create_time'
		}, {
			width: 100,
			title: constant.operation,
			dataIndex: '',
			render: (text, record, index) => (
				<span>
                  <a onClick={this.handleView.bind(this, record.stock_id)}>查看</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
							  cancelText={constant.popconfirm_cancel}
							  onConfirm={this.handleDel.bind(this, record.stock_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
			)
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
						<div className="">公司出库入库信息</div>
					</Col>
					<Col span={16} className="content-button">
						<Button type="default" icon="search" size="default" className="margin-right"
								loading={this.state.is_load}
								onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
						<Button type="primary" icon="plus-circle" size="default"
								onClick={this.handleReplenish.bind(this)}>平台补充</Button>
					</Col>
				</Row>
				<Table key="2"
					   rowKey="stock_id"
					   className="margin-top"
					   loading={this.state.is_load} columns={columns}
					   dataSource={this.props.app_stock.list} pagination={pagination}
					   bordered/>
				<AppStockDetail/>
				<AppStockReplenish/>
			</QueueAnim>
		);
	}
}

AppStockIndex.propTypes = {};

AppStockIndex = Form.create({})(AppStockIndex);

export default connect(({app_stock}) => ({
	app_stock
}))(AppStockIndex);
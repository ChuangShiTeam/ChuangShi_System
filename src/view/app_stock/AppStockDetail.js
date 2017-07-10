import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class AppStockDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			is_show: false,
			stock_id: ''
		}
	}

	componentDidMount() {
		notification.on('notification_app_stock_detail_view', this, function (data) {
			this.setState({
				is_show: true,
				stock_id: data.stock_id
			}, function () {
				this.handleLoad();
			});
		});
	}

	componentWillUnmount() {
		notification.remove('notification_app_stock_detail_view', this);
	}

	handleLoad() {
		this.setState({
			is_load: true
		});

		http.request({
			url: '/app/stock/' + constant.action + '/find',
			data: {
				stock_id: this.state.stock_id
			},
			success: function (data) {

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
			action: '',
			stock_id: '',
			system_version: ''
		});

		this.props.form.resetFields();
	}

	render() {
		const FormItem = Form.Item;
		const Option = Select.Option;
		const {getFieldDecorator} = this.props.form;

		return (
			<Modal title={'公司出库入库详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
				   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
				   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>
                   ]}
			>
				<Spin spinning={this.state.is_load}>
				</Spin>
			</Modal>
		);
	}
}

AppStockDetail.propTypes = {};

AppStockDetail = Form.create({})(AppStockDetail);

export default connect(({app_stock}) => ({app_stock}))(AppStockDetail);
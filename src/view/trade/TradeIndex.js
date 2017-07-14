import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import TradeDetail from './TradeDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class TradeIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.trade.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            trade_number: this.props.trade.trade_number
        });

        this.handleLoad();

        notification.on('notification_trade_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_trade_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'trade/fetch',
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

            let trade_number = this.props.form.getFieldValue('trade_number');

            this.props.dispatch({
                type: 'trade/fetch',
                data: {
                    app_id: app_id,
                    trade_number: trade_number,
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
            url: '/trade/' + constant.action + '/list',
            data: {
                app_id: this.props.trade.app_id,
                trade_number: this.props.trade.trade_number,
                page_index: this.props.trade.page_index,
                page_size: this.props.trade.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'trade/fetch',
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
                type: 'trade/fetch',
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
                type: 'trade/fetch',
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

    handleAdd() {
        notification.emit('notification_trade_detail_add', {});
    }

    handleEdit(trade_id) {
        notification.emit('notification_trade_detail_edit', {
            trade_id: trade_id
        });
    }

    handlePay(trade_number) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/wechat/pay/success',
            data: {
                trade_number: trade_number
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

    handleDel(trade_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/trade/' + constant.action + '/delete',
            data: {
                trade_id: trade_id,
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

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const columns = [{
            title: '用户',
            dataIndex: 'user_id'
        }, {
            title: '订单编号',
            dataIndex: 'trade_number'
        }, {
            title: '收货人',
            dataIndex: 'trade_receiver_name',
            render: (text, record, index) => (
                <span>{record.trade_receiver_name}({record.trade_receiver_mobile})</span>
            )
        }, {
            title: '收货人地址',
            dataIndex: 'trade_receiver_address',
            render: (text, record, index) => (
                <span>
                    {record.trade_receiver_province}-
                    {record.trade_receiver_city}-
                    {record.trade_receiver_area}-
                    {record.trade_receiver_address}
                </span>
            )
        }, {
            title: '商品数量',
            dataIndex: 'trade_product_quantity'
        }, {
            title: '订单金额',
            dataIndex: 'trade_product_amount'
        }, {
            title: '快递金额',
            dataIndex: 'trade_express_amount'
        }, {
            title: '折扣金额',
            dataIndex: 'trade_discount_amount'
        }, {
            title: '是否分成',
            dataIndex: 'trade_is_commission',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.trade_is_commission ? '需分成' : '不需分成'}
                </div>
            )
        }, {
            title: '是否付款',
            dataIndex: 'trade_is_pay',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.trade_is_pay ? '已付款' : '未付款'}
                </div>
            )
        }, {
            title: '是否收货',
            dataIndex: 'trade_is_confirm',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.trade_is_confirm ? '已收货' : '未收货'}
                </div>
            )
        }, {
            title: '订单流程',
            dataIndex: 'trade_flow'
        }, {
            title: '订单状态',
            dataIndex: 'trade_status',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.trade_status ? '正常' : '异常'}
                </div>
            )
        }, {
            title: '订单审计状态',
            dataIndex: 'trade_audit_status'
        }, {
            title: '订单备注',
            dataIndex: 'trade_message'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handlePay.bind(this, record.trade_number)}>付款</a>
                  <span className="divider"/>
                  <a onClick={this.handleEdit.bind(this, record.trade_id)}>{constant.find}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.trade.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.trade.page_index,
            pageSize: this.props.trade.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">订单信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleAdd.bind(this)}>{constant.add}</Button>
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
                                                        this.props.trade.app_list.map(function (item) {
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
                            }} className="content-search-item" label="订单编号">
                                {
                                    getFieldDecorator('trade_number', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入订单编号"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="trade_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.trade.list} pagination={pagination}
                       bordered/>
                <TradeDetail/>
            </QueueAnim>
        );
    }
}

TradeIndex.propTypes = {};

TradeIndex = Form.create({})(TradeIndex);

export default connect(({trade}) => ({
    trade
}))(TradeIndex);
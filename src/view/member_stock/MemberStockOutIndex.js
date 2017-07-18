import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table} from 'antd';

import MemberStockOutExpress from './MemberStockOutExpress';
import MemberStockOutDetail from './MemberStockOutDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class MemberStockOutIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.member_stock_out.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            express_no: this.props.member_stock_out.express_no,
            stock_receiver_name: this.props.member_stock_out.stock_receiver_name,
            express_sender_name: this.props.member_stock_out.express_sender_name
        });

        this.handleLoad();

        notification.on('notification_member_stock_out_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_out_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'member_stock_out/fetch',
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

            let stock_receiver_name = this.props.form.getFieldValue('stock_receiver_name');
            let express_no = this.props.form.getFieldValue('express_no');
            let express_sender_name = this.props.form.getFieldValue('express_sender_name');

            this.props.dispatch({
                type: 'member_stock_out/fetch',
                data: {
                    app_id: app_id,
                    express_no: express_no,
                    stock_receiver_name: stock_receiver_name,
                    express_sender_name: express_sender_name,
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
            url: '/member/stock/' + constant.action + '/out/list',
            data: {
                app_id: this.props.member_stock_out.app_id,
                express_no: this.props.member_stock_out.express_no,
                stock_receiver_name: this.props.member_stock_out.stock_receiver_name,
                express_sender_name: this.props.member_stock_out.express_sender_name,
                page_index: this.props.member_stock_out.page_index,
                page_size: this.props.member_stock_out.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'member_stock_out/fetch',
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
                type: 'member_stock_out/fetch',
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
                type: 'member_stock_out/fetch',
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
        notification.emit('notification_member_stock_out_detail_view', {
            stock_id: stock_id
        });
    }

    handleExpress(stock_id, stock_type) {
        notification.emit('notification_member_stock_out_express', {
            stock_id: stock_id,
            stock_type: stock_type
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            width: 150,
            title: '收货人',
            dataIndex: 'stock_receiver_name'
        }, {
            width: 150,
            title: '发货数量',
            dataIndex: 'stock_quantity'
        }, {
            width: 150,
            title: '快递单号',
            dataIndex: 'express_no'
        }, {
            width: 150,
            title: '发货人',
            dataIndex: 'express_sender_name'
        }, {
            width: 150,
            title: '来源',
            dataIndex: 'stock_type',
            render: (text, record, index) => (
                <span>
                    {
                        text === 'MEMBER'?'会员发货':text === 'TRADE'?'会员下订单':null
                    }
                </span>
            )
        }, {
            width: 150,
            title: '状态',
            dataIndex: 'stock_flow',
            render: (text, record, index) => (
                <span>
                    {
                        text === 'WAIT_SEND'?'待发货':text === 'WAIT_RECEIVE'?'待收货':text === 'COMPLETE'?'已完成':text === 'CANCEL'?'已取消':null
                    }
                </span>
            )
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleView.bind(this, record.stock_id)}>查看</a>
                    {
                        record.stock_flow === 'WAIT_SEND'?<span>
                            <span className="divider"/>
                            <a onClick={this.handleExpress.bind(this, record.stock_id, record.stock_type)}>填写快递单</a>
                        </span>:null
                    }

                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.member_stock_out.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.member_stock_out.page_index,
            pageSize: this.props.member_stock_out.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">发货单信息</div>
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
                                                        this.props.member_stock_out.app_list.map(function (item) {
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
                            }} className="content-search-item" label="收货人">
                                {
                                    getFieldDecorator('stock_receiver_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入收货人" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="发货人">
                                {
                                    getFieldDecorator('express_sender_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入发货人" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="快递单号">
                                {
                                    getFieldDecorator('express_no', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入快递单号" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="stock_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.member_stock_out.list} pagination={pagination}
                       bordered/>
                <MemberStockOutExpress/>
                <MemberStockOutDetail/>
            </QueueAnim>
        );
    }
}

MemberStockOutIndex.propTypes = {};

MemberStockOutIndex = Form.create({})(MemberStockOutIndex);

export default connect(({member_stock_out}) => ({
    member_stock_out
}))(MemberStockOutIndex);
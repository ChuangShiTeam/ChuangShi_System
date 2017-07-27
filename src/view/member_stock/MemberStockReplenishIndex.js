import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table} from 'antd';

import MemberStockReplenishDetail from './MemberStockReplenishDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class MemberStockReplenishIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.member_stock_replenish.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            warehouse_id: this.props.member_stock_replenish.warehouse_id,
            user_name: this.props.member_stock_replenish.user_name
        });

        this.handleLoad();
        this.handleLoadWarehouse();
        this.handleLoadProduct();

        notification.on('notification_member_stock_replenish_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_replenish_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'member_stock_replenish/fetch',
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
                    type: 'member_stock_replenish/fetch',
                    data: {
                        product_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleLoadWarehouse() {
        http.request({
            url: '/warehouse/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'member_stock_replenish/fetch',
                    data: {
                        warehouse_list: data
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

            let warehouse_id = this.props.form.getFieldValue('warehouse_id');
            let user_name = this.props.form.getFieldValue('user_name');

            this.props.dispatch({
                type: 'member_stock_replenish/fetch',
                data: {
                    app_id: app_id,
                    warehouse_id: warehouse_id,
                    user_name: user_name,
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
            url: '/stock/replenish/' + constant.action + '/list',
            data: {
                app_id: this.props.member_stock_replenish.app_id,
                stock_replenish_type: this.props.member_stock_replenish.stock_replenish_type,
                warehouse_id: this.props.member_stock_replenish.warehouse_id,
                user_name: this.props.member_stock_replenish.user_name,
                page_index: this.props.member_stock_replenish.page_index,
                page_size: this.props.member_stock_replenish.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'member_stock_replenish/fetch',
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
                type: 'member_stock_replenish/fetch',
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
                type: 'member_stock_replenish/fetch',
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

    handleView(stock_replenish_id) {
        notification.emit('notification_member_stock_replenish_detail_view', {stock_replenish_id: stock_replenish_id});
    }

    handleSave() {
        notification.emit('notification_member_stock_replenish_detail_save', {});
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            width: 150,
            title: '仓库名称',
            dataIndex: 'warehouse_name'
        }, {
            width: 150,
            title: '会员名称',
            dataIndex: 'user_name'
        }, {
            width: 150,
            title: '数量',
            dataIndex: 'stock_replenish_quantity'
        }, {
            width: 150,
            title: '报损/报溢',
            dataIndex: 'stock_replenish_action',
            render: (text, record, index) => (
                <span>
                    {
                        text === 'BREAKAGE'?'报损':text === 'OVERFLOW'?'报溢':null
                    }
                </span>
            )
        }, {
            width: 150,
            title: '报损/报溢时间',
            dataIndex: 'system_create_time'
        }, {
            width: 50,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleView.bind(this, record.stock_replenish_id)}>查看</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.member_stock_replenish.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.member_stock_replenish.page_index,
            pageSize: this.props.member_stock_replenish.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">会员报损报溢单信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleSave.bind(this)}>报损报溢</Button>
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
                                                        this.props.member_stock_replenish.app_list.map(function (item) {
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
                            }} className="content-search-item" label="仓库名称">
                                {
                                    getFieldDecorator('warehouse_id', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择仓库">
                                            {
                                                this.props.member_stock_replenish.warehouse_list.map(function (item) {
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
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="会员名称">
                                {
                                    getFieldDecorator('user_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入会员名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.member_stock_replenish.list} pagination={pagination}
                       bordered/>
                <MemberStockReplenishDetail/>
            </QueueAnim>
        );
    }
}

MemberStockReplenishIndex.propTypes = {};

MemberStockReplenishIndex = Form.create({})(MemberStockReplenishIndex);

export default connect(({member_stock_replenish}) => ({
    member_stock_replenish
}))(MemberStockReplenishIndex);
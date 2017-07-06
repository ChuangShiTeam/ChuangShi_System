import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import MemberStockDetail from './MemberStockDetail';
import constant from '../../../util/constant';
import notification from '../../../util/notification';
import validate from '../../../util/validate';
import http from '../../../util/http';

class MemberStockIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.member_stock.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            member_name: this.props.member_stock.member_name,
            stock_action: this.props.member_stock.stock_action,
            product_name: this.props.member_stock.product_name
        });

        this.handleLoad();

        notification.on('notification_member_stock_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'member_stock/fetch',
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
            var app_id = this.props.form.getFieldValue('app_id');
            if (validate.isUndefined(app_id)) {
                app_id = '';
            }

            var stock_action = this.props.form.getFieldValue('stock_action');
            var product_name = this.props.form.getFieldValue('product_name');
            var member_name = this.props.form.getFieldValue('member_name');

            this.props.dispatch({
                type: 'member_stock/fetch',
                data: {
                    app_id: app_id,
                    member_name: member_name,
                    stock_action: stock_action,
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
            url: '/stock/' + constant.action + '/list',
            data: {
                app_id: this.props.member_stock.app_id,
                stock_type: this.props.member_stock.stock_type,
                member_name: this.props.member_stock.member_name,
                stock_action: this.props.member_stock.stock_action,
                product_name: this.props.member_stock.product_name,
                page_index: this.props.member_stock.page_index,
                page_size: this.props.member_stock.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'member_stock/fetch',
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
                type: 'member_stock/fetch',
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
                type: 'member_stock/fetch',
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
        notification.emit('notification_member_stock_detail_add', {});
    }

    handleEdit(stock_id) {
        notification.emit('notification_member_stock_detail_edit', {
            stock_id: stock_id
        });
    }

    handleDel(stock_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/stock/' + constant.action + '/delete',
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

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            width: 150,
            title: '会员名称',
            dataIndex: 'member_name'
        }, {
            width: 150,
            title: '产品名称',
            dataIndex: 'product_name'
        }, {
            width: 150,
            title: '数量',
            dataIndex: 'stock_quantity'
        }, {
            width: 150,
            title: '出库/入库',
            dataIndex: 'stock_action'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.stock_id)}>{constant.edit}</a>
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
            total: this.props.member_stock.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.member_stock.page_index,
            pageSize: this.props.member_stock.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">会员出库入库信息</div>
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
                            }} className="content-search-item" label="会员名称">
                                {
                                    getFieldDecorator('member_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入会员名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
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
                       rowKey="stock_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.member_stock.list} pagination={pagination}
                       bordered/>
                <MemberStockDetail/>
            </QueueAnim>
        );
    }
}

MemberStockIndex.propTypes = {};

MemberStockIndex = Form.create({})(MemberStockIndex);

export default connect(({member_stock}) => ({
    member_stock
}))(MemberStockIndex);
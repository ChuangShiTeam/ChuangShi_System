import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import GezhoubaStockinfoDetail from './GezhoubaStockinfoDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class GezhoubaStockinfoIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.gezhouba_stockinfo.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            supplier_id: this.props.gezhouba_stockinfo.supplier_id,
            product_id: this.props.gezhouba_stockinfo.product_id,
        });

        this.handleLoad();

        notification.on('notification_gezhouba_stockinfo_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_gezhouba_stockinfo_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'gezhouba_stockinfo/fetch',
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

            let supplier_id = this.props.form.getFieldValue('supplier_id');
            let product_id = this.props.form.getFieldValue('product_id');

            this.props.dispatch({
                type: 'gezhouba_stockinfo/fetch',
                data: {
                    app_id: app_id,
                    supplier_id: supplier_id,
                    product_id: product_id,
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
            url: '/' + constant.action + '/gezhouba/stockinfo/list',
            data: {
                app_id: this.props.gezhouba_stockinfo.app_id,
                supplier_id: this.props.gezhouba_stockinfo.supplier_id,
                product_id: this.props.gezhouba_stockinfo.product_id,
                page_index: this.props.gezhouba_stockinfo.page_index,
                page_size: this.props.gezhouba_stockinfo.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'gezhouba_stockinfo/fetch',
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
                type: 'gezhouba_stockinfo/fetch',
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
                type: 'gezhouba_stockinfo/fetch',
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
        notification.emit('notification_gezhouba_stockinfo_detail_add', {});
    }

    handleEdit(stock_id) {
        notification.emit('notification_gezhouba_stockinfo_detail_edit', {
            stock_id: stock_id
        });
    }

    handleDel(stock_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/gezhouba/stockinfo/delete',
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
            title: '商品id',
            dataIndex: 'supplier_id'
        }, {
            title: '商品id',
            dataIndex: 'product_id'
        }, {
            title: '实际库存数量',
            dataIndex: 'stock_num'
        }, {
            title: '锁定库存数量',
            dataIndex: 'stock_lock_num'
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
            total: this.props.gezhouba_stockinfo.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.gezhouba_stockinfo.page_index,
            pageSize: this.props.gezhouba_stockinfo.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">信息</div>
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
                                                        this.props.gezhouba_stockinfo.app_list.map(function (item) {
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
                            }} className="content-search-item" label="商品id">
                                {
                                    getFieldDecorator('supplier_id', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入商品id" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="商品id">
                                {
                                    getFieldDecorator('product_id', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入商品id" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="stock_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.gezhouba_stockinfo.list} pagination={pagination}
                       bordered/>
                <GezhoubaStockinfoDetail/>
            </QueueAnim>
        );
    }
}

GezhoubaStockinfoIndex.propTypes = {};

GezhoubaStockinfoIndex = Form.create({})(GezhoubaStockinfoIndex);

export default connect(({gezhouba_stockinfo}) => ({
    gezhouba_stockinfo
}))(GezhoubaStockinfoIndex);
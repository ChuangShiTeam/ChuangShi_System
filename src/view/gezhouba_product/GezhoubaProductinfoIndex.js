import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import GezhoubaProductinfoDetail from './GezhoubaProductinfoDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class GezhoubaProductinfoIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.gezhouba_productinfo.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            product_name: this.props.gezhouba_productinfo.product_name,
        });

        this.handleLoad();

        notification.on('notification_gezhouba_productinfo_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_gezhouba_productinfo_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'gezhouba_productinfo/fetch',
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

            let product_name = this.props.form.getFieldValue('product_name');

            this.props.dispatch({
                type: 'gezhouba_productinfo/fetch',
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
            url: '/' + constant.action + '/gezhouba/productinfo/list',
            data: {
                app_id: this.props.gezhouba_productinfo.app_id,
                product_name: this.props.gezhouba_productinfo.product_name,
                page_index: this.props.gezhouba_productinfo.page_index,
                page_size: this.props.gezhouba_productinfo.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'gezhouba_productinfo/fetch',
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
                type: 'gezhouba_productinfo/fetch',
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
                type: 'gezhouba_productinfo/fetch',
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
        notification.emit('notification_gezhouba_productinfo_detail_add', {});
    }

    handleEdit(product_id) {
        notification.emit('notification_gezhouba_productinfo_detail_edit', {
            product_id: product_id
        });
    }

    handleDel(product_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/gezhouba/productinfo/delete',
            data: {
                product_id: product_id,
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
            title: '商品名称',
            dataIndex: 'product_name'
        }, {
            title: '商品描述',
            dataIndex: 'remark'
        }, {
            title: '品种',
            dataIndex: 'product_cart'
        }, {
            title: '单位',
            dataIndex: 'product_unit'
        }, {
            title: '规格',
            dataIndex: 'product_space'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.product_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.product_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.gezhouba_productinfo.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.gezhouba_productinfo.page_index,
            pageSize: this.props.gezhouba_productinfo.page_size,
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
                                                        this.props.gezhouba_productinfo.app_list.map(function (item) {
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
                            }} className="content-search-item" label="商品名称">
                                {
                                    getFieldDecorator('product_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入商品名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="product_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.gezhouba_productinfo.list} pagination={pagination}
                       bordered/>
                <GezhoubaProductinfoDetail/>
            </QueueAnim>
        );
    }
}

GezhoubaProductinfoIndex.propTypes = {};

GezhoubaProductinfoIndex = Form.create({})(GezhoubaProductinfoIndex);

export default connect(({gezhouba_productinfo}) => ({
    gezhouba_productinfo
}))(GezhoubaProductinfoIndex);
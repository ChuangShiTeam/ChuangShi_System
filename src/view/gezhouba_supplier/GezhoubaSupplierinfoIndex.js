import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import GezhoubaSupplierinfoDetail from './GezhoubaSupplierinfoDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class GezhoubaSupplierinfoIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.gezhouba_supplierinfo.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            supplier_name: this.props.gezhouba_supplierinfo.supplier_name,
            supplier_address: this.props.gezhouba_supplierinfo.supplier_address,
            supplier_tel: this.props.gezhouba_supplierinfo.supplier_tel,
        });

        this.handleLoad();

        notification.on('notification_gezhouba_supplierinfo_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_gezhouba_supplierinfo_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'gezhouba_supplierinfo/fetch',
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

            let supplier_name = this.props.form.getFieldValue('supplier_name');
            let supplier_address = this.props.form.getFieldValue('supplier_address');
            let supplier_tel = this.props.form.getFieldValue('supplier_tel');

            this.props.dispatch({
                type: 'gezhouba_supplierinfo/fetch',
                data: {
                    app_id: app_id,
                    supplier_name: supplier_name,
                    supplier_address: supplier_address,
                    supplier_tel: supplier_tel,
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
            url: '/' + constant.action + '/gezhouba/supplierinfo/list',
            data: {
                app_id: this.props.gezhouba_supplierinfo.app_id,
                supplier_name: this.props.gezhouba_supplierinfo.supplier_name,
                supplier_address: this.props.gezhouba_supplierinfo.supplier_address,
                supplier_tel: this.props.gezhouba_supplierinfo.supplier_tel,
                page_index: this.props.gezhouba_supplierinfo.page_index,
                page_size: this.props.gezhouba_supplierinfo.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'gezhouba_supplierinfo/fetch',
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
                type: 'gezhouba_supplierinfo/fetch',
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
                type: 'gezhouba_supplierinfo/fetch',
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
        notification.emit('notification_gezhouba_supplierinfo_detail_add', {});
    }

    handleEdit(supplier_id) {
        notification.emit('notification_gezhouba_supplierinfo_detail_edit', {
            supplier_id: supplier_id
        });
    }

    handleDel(supplier_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/gezhouba/supplierinfo/delete',
            data: {
                supplier_id: supplier_id,
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
            title: '商户名称',
            dataIndex: 'supplier_name'
        }, {
            title: '商户地址',
            dataIndex: 'supplier_address'
        }, {
            title: '商户联系电话',
            dataIndex: 'supplier_tel'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.supplier_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.supplier_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.gezhouba_supplierinfo.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.gezhouba_supplierinfo.page_index,
            pageSize: this.props.gezhouba_supplierinfo.page_size,
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
                                                        this.props.gezhouba_supplierinfo.app_list.map(function (item) {
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
                            }} className="content-search-item" label="商户名称">
                                {
                                    getFieldDecorator('supplier_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入商户名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="商户地址">
                                {
                                    getFieldDecorator('supplier_address', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入商户地址" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="商户联系电话">
                                {
                                    getFieldDecorator('supplier_tel', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入商户联系电话" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="supplier_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.gezhouba_supplierinfo.list} pagination={pagination}
                       bordered/>
                <GezhoubaSupplierinfoDetail/>
            </QueueAnim>
        );
    }
}

GezhoubaSupplierinfoIndex.propTypes = {};

GezhoubaSupplierinfoIndex = Form.create({})(GezhoubaSupplierinfoIndex);

export default connect(({gezhouba_supplierinfo}) => ({
    gezhouba_supplierinfo
}))(GezhoubaSupplierinfoIndex);
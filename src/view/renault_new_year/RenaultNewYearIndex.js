import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import RenaultNewYearDetail from './RenaultNewYearDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class RenaultNewYearIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.renault_new_year.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            new_year_name: this.props.renault_new_year.new_year_name,
            new_year_phone: this.props.renault_new_year.new_year_phone,
        });

        this.handleLoad();

        notification.on('notification_renault_new_year_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_renault_new_year_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'renault_new_year/fetch',
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

            let new_year_name = this.props.form.getFieldValue('new_year_name');
            let new_year_phone = this.props.form.getFieldValue('new_year_phone');

            this.props.dispatch({
                type: 'renault_new_year/fetch',
                data: {
                    app_id: app_id,
                    new_year_name: new_year_name,
                    new_year_phone: new_year_phone,
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
            url: '/' + constant.action + '/renault/new/year/list',
            data: {
                app_id: this.props.renault_new_year.app_id,
                new_year_name: this.props.renault_new_year.new_year_name,
                new_year_phone: this.props.renault_new_year.new_year_phone,
                page_index: this.props.renault_new_year.page_index,
                page_size: this.props.renault_new_year.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'renault_new_year/fetch',
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
                type: 'renault_new_year/fetch',
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
                type: 'renault_new_year/fetch',
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
        notification.emit('notification_renault_new_year_detail_add', {});
    }

    handleEdit(new_year_id) {
        notification.emit('notification_renault_new_year_detail_edit', {
            new_year_id: new_year_id
        });
    }

    handleDel(new_year_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/renault/new/year/delete',
            data: {
                new_year_id: new_year_id,
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

    handleExcel() {
        window.open(constant.host + '/admin/renault/new/year/all/export')
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '姓名',
            dataIndex: 'new_year_name'
        }, {
            title: '手机号码',
            dataIndex: 'new_year_phone'
        }, {
            title: '新年总结',
            dataIndex: 'new_year_summary'
        }, {
            title: '新年愿望',
            dataIndex: 'new_year_wish'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.new_year_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.new_year_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.renault_new_year.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.renault_new_year.page_index,
            pageSize: this.props.renault_new_year.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">留资信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="default" icon="file-excel" size="default" className="margin-right"
                                onClick={this.handleExcel.bind(this)}>导出留资信息</Button>
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
                                                        this.props.renault_new_year.app_list.map(function (item) {
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
                            }} className="content-search-item" label="姓名">
                                {
                                    getFieldDecorator('new_year_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入姓名" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="手机号码">
                                {
                                    getFieldDecorator('new_year_phone', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入手机号码" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="new_year_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.renault_new_year.list} pagination={pagination}
                       bordered/>
                <RenaultNewYearDetail/>
            </QueueAnim>
        );
    }
}

RenaultNewYearIndex.propTypes = {};

RenaultNewYearIndex = Form.create({})(RenaultNewYearIndex);

export default connect(({renault_new_year}) => ({
    renault_new_year
}))(RenaultNewYearIndex);
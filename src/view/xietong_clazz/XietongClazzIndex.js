import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import XietongClazzDetail from './XietongClazzDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class XietongClazzIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.xietong_clazz.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            organization_id: this.props.xietong_clazz.organization_id,
            clazz_name: this.props.xietong_clazz.clazz_name
        });

        this.handleLoad();
        this.handleLoadOrganization();

        notification.on('notification_xietong_clazz_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_clazz_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_clazz/fetch',
                    data: {
                        app_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleLoadOrganization() {
        http.request({
            url: '/admin/xietong/organization/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_clazz/fetch',
                    data: {
                        organization_list: data
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

            let clazz_name = this.props.form.getFieldValue('clazz_name');
            let organization_id = this.props.form.getFieldValue('organization_id');

            this.props.dispatch({
                type: 'xietong_clazz/fetch',
                data: {
                    app_id: app_id,
                    organization_id: organization_id,
                    clazz_name: clazz_name,
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
            url: '/' + constant.action + '/xietong/clazz/list',
            data: {
                app_id: this.props.xietong_clazz.app_id,
                organization_id: this.props.xietong_clazz.organization_id,
                clazz_name: this.props.xietong_clazz.clazz_name,
                page_index: this.props.xietong_clazz.page_index,
                page_size: this.props.xietong_clazz.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_clazz/fetch',
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
                type: 'xietong_clazz/fetch',
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
                type: 'xietong_clazz/fetch',
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
        notification.emit('notification_xietong_clazz_detail_add', {});
    }

    handleEdit(clazz_id) {
        notification.emit('notification_xietong_clazz_detail_edit', {
            clazz_id: clazz_id
        });
    }

    handleDel(clazz_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/clazz/delete',
            data: {
                clazz_id: clazz_id,
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
            title: '名称',
            dataIndex: 'clazz_name'
        }, {
            title: '所属组织机构',
            dataIndex: 'organization_name'
        }, {
            title: '选课限制人数',
            dataIndex: 'clazz_course_apply_limit'
        }, {
            title: '选课开始时间',
            dataIndex: 'clazz_course_apply_start_time'
        }, {
            title: '选课结束时间',
            dataIndex: 'clazz_course_apply_end_time'
        }, {
            title: '排序',
            dataIndex: 'clazz_sort'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.clazz_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.clazz_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.xietong_clazz.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.xietong_clazz.page_index,
            pageSize: this.props.xietong_clazz.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">班级信息</div>
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
                                                        this.props.xietong_clazz.app_list.map(function (item) {
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
                            }} className="content-search-item" label="组织机构">
                                {
                                    getFieldDecorator('organization_id', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择组织机构">
                                            {
                                                this.props.xietong_clazz.organization_list.map(function (item) {
                                                    return (
                                                        <Option key={item.organization_id}
                                                                value={item.organization_id}>{item.organization_name}</Option>
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
                            }} className="content-search-item" label="班级名称">
                                {
                                    getFieldDecorator('clazz_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入班级名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="clazz_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.xietong_clazz.list} pagination={pagination}
                       bordered/>
                <XietongClazzDetail/>
            </QueueAnim>
        );
    }
}

XietongClazzIndex.propTypes = {};

XietongClazzIndex = Form.create({})(XietongClazzIndex);

export default connect(({xietong_clazz}) => ({
    xietong_clazz
}))(XietongClazzIndex);
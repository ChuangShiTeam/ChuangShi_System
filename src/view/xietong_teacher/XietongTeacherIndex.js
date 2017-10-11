import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import XietongTeacherDetail from './XietongTeacherDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class XietongTeacherIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            clazz: []
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.xietong_teacher.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            organization_id: this.props.xietong_teacher.organization_id,
            teacher_name: this.props.xietong_teacher.teacher_name,
        });

        this.handleLoad();
        this.handleLoadOrganization();
        this.handleClazzList();

        notification.on('notification_xietong_teacher_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_teacher_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_teacher/fetch',
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
                    type: 'xietong_teacher/fetch',
                    data: {
                        organization_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleClazzList() {
        http.request({
            url: '/' + constant.action + '/xietong/clazz/all/list',
            data: {},
            success: function (data) {
                let array = [{
                    clazz_id: '',
                    clazz_name: '所有班级'
                }];

                for (let i = 0; i < data.length; i++) {
                    array.push(data[i]);
                }

                this.setState({
                    clazz: array
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

            let organization_id = this.props.form.getFieldValue('organization_id');
            let teacher_name = this.props.form.getFieldValue('teacher_name');

            this.props.dispatch({
                type: 'xietong_teacher/fetch',
                data: {
                    app_id: app_id,
                    organization_id: organization_id,
                    teacher_name: teacher_name,
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
            url: '/' + constant.action + '/xietong/teacher/list',
            data: {
                app_id: this.props.xietong_teacher.app_id,
                organization_id: this.props.xietong_teacher.organization_id,
                teacher_name: this.props.xietong_teacher.teacher_name,
                page_index: this.props.xietong_teacher.page_index,
                page_size: this.props.xietong_teacher.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_teacher/fetch',
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
                type: 'xietong_teacher/fetch',
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
                type: 'xietong_teacher/fetch',
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
        notification.emit('notification_xietong_teacher_detail_add', {
            clazz: this.state.clazz
        });
    }

    handleEdit(teacher_id) {
        notification.emit('notification_xietong_teacher_detail_edit', {
            teacher_id: teacher_id,
            clazz: this.state.clazz
        });
    }

    handleDel(teacher_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/teacher/delete',
            data: {
                teacher_id: teacher_id,
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
            title: '老师姓名',
            dataIndex: 'teacher_name'
        }, {
            title: '所属组织机构',
            dataIndex: 'organization_name'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.teacher_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.teacher_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.xietong_teacher.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.xietong_teacher.page_index,
            pageSize: this.props.xietong_teacher.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">教师信息</div>
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
                                                        this.props.xietong_teacher.app_list.map(function (item) {
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
                                                this.props.xietong_teacher.organization_list.map(function (item) {
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
                            }} className="content-search-item" label="老师姓名">
                                {
                                    getFieldDecorator('teacher_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入老师姓名" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="teacher_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.xietong_teacher.list} pagination={pagination}
                       bordered/>
                <XietongTeacherDetail/>
            </QueueAnim>
        );
    }
}

XietongTeacherIndex.propTypes = {};

XietongTeacherIndex = Form.create({})(XietongTeacherIndex);

export default connect(({xietong_teacher}) => ({
    xietong_teacher
}))(XietongTeacherIndex);
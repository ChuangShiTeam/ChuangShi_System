import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message, Upload} from 'antd';

import XietongStudentDetail from './XietongStudentDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import storage from '../../util/storage';
import http from '../../util/http';

class XietongStudentIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            clazz: [],
            selectedRowKeys: []
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.xietong_student.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            student_name: this.props.xietong_student.student_name,
            clazz_id: this.props.xietong_student.clazz_id,
        });

        this.handleLoad();

        this.handleClazzList();

        notification.on('notification_xietong_student_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_student_index_load', this);
    }

    handleClazzList() {
        http.request({
            url: '/' + constant.action + '/xietong/clazz/all/list',
            data: {
            },
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
            }.bind(this)
        });
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_student/fetch',
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

            let student_name = this.props.form.getFieldValue('student_name');
            let clazz_id = this.props.form.getFieldValue('clazz_id');

            this.props.dispatch({
                type: 'xietong_student/fetch',
                data: {
                    app_id: app_id,
                    student_name: student_name,
                    clazz_id: clazz_id,
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
            url: '/' + constant.action + '/xietong/student/list',
            data: {
                app_id: this.props.xietong_student.app_id,
                student_name: this.props.xietong_student.student_name,
                clazz_id: this.props.xietong_student.clazz_id,
                page_index: this.props.xietong_student.page_index,
                page_size: this.props.xietong_student.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_student/fetch',
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
                type: 'xietong_student/fetch',
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
                type: 'xietong_student/fetch',
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
        notification.emit('notification_xietong_student_detail_add', {clazz: this.state.clazz});
    }

    handleEdit(student_id) {
        notification.emit('notification_xietong_student_detail_edit', {
            student_id: student_id,
            clazz: this.state.clazz
        });
    }

    handleDel(student_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/student/delete',
            data: {
                student_id: student_id,
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

    handleDeleteAll() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/admin/xietong/student/all/delete',
            data: {},
            success: function (json) {
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

    handleChange(info) {
        if (info.file.status === 'done') {
            if (info.file.response.code == 200) {
                message.success(constant.success);
            } else {
                message.error(info.file.response.message);
            }

            this.setState({
                is_load: false
            });

            this.handleLoad();
        } else {
            this.setState({
                is_load: true
            });
        }
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const props = {
            name: 'file',
            multiple: false,
            showUploadList: false,
            accept: '.xls,.xlsx',
            action: constant.host + '/admin/xietong/student/upload',
            headers: {
                'app_id': constant.app_id,
                'token': storage.getToken(),
                'platform': constant.platform,
                'version': constant.version
            },
            onChange: this.handleChange.bind(this)
        };

        const columns = [{
            title: '班级',
            dataIndex: 'clazz_name'
        }, {
            title: '学生姓名',
            dataIndex: 'student_name'
        }, {
            title: '学生学号',
            dataIndex: 'student_number'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.student_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.student_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys
                });
            }
        };

        const pagination = {
            size: 'defalut',
            total: this.props.xietong_student.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.xietong_student.page_index,
            pageSize: this.props.xietong_student.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">学生信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        {/*<Button type="default" icon="delete" size="default" className="margin-right"*/}
                        {/*loading={this.state.is_load}*/}
                        {/*onClick={this.handleDeleteAll.bind(this)}>删除所有学生</Button>*/}
                        <Upload className="margin-right" {...props}>
                            <Button type="default" icon="upload" size="default" className="button-reload">导入学生资料</Button>
                        </Upload>
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
                                                        this.props.xietong_student.app_list.map(function (item) {
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
                            }} className="content-search-item" label="学生姓名">
                                {
                                    getFieldDecorator('student_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入学生姓名" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="所属班级">                                {
                                    getFieldDecorator('clazz_id', {
                                        initialValue: ''
                                    })(
                                        <Select placeholder="请选择班级">
                                            {
                                                this.state.clazz.map(function (item) {
                                                    return (
                                                        <Option key={item.clazz_id} value={item.clazz_id}>{item.clazz_name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="student_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.xietong_student.list} pagination={pagination}
                       bordered/>
                <XietongStudentDetail/>
            </QueueAnim>
        );
    }
}

XietongStudentIndex.propTypes = {};

XietongStudentIndex = Form.create({})(XietongStudentIndex);

export default connect(({xietong_student}) => ({
    xietong_student
}))(XietongStudentIndex);
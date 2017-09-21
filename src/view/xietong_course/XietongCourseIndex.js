import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message, Upload} from 'antd';

import XietongCourseDetail from './XietongCourseDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';
import storage from '../../util/storage';

class XietongCourseIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            clazz: [],
            teacher: []
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.xietong_course.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            course_name: this.props.xietong_course.course_name
        });

        this.handleLoad();

        this.handleClazzList();

        this.handleTeacherList();

        notification.on('notification_xietong_course_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_course_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_course/fetch',
                    data: {
                        app_list: data
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
            data: {
                clazz_name: '',
                page_index: 0,
                page_size: 0
            },
            success: function (data) {
                this.setState({
                    clazz: data
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleTeacherList() {
        http.request({
            url: '/' + constant.action + '/xietong/teacher/all/list',
            data: {},
            success: function (data) {
                this.setState({
                    teacher: data
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

            let course_name = this.props.form.getFieldValue('course_name');

            this.props.dispatch({
                type: 'xietong_course/fetch',
                data: {
                    app_id: app_id,
                    course_name: course_name,
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
            url: '/' + constant.action + '/xietong/course/list',
            data: {
                app_id: this.props.xietong_course.app_id,
                course_name: this.props.xietong_course.course_name,
                page_index: this.props.xietong_course.page_index,
                page_size: this.props.xietong_course.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_course/fetch',
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
                type: 'xietong_course/fetch',
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
                type: 'xietong_course/fetch',
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
        notification.emit('notification_xietong_course_detail_add', {
            clazz: this.state.clazz,
            teacher: this.state.teacher
        });
    }

    handleEdit(course_id) {
        notification.emit('notification_xietong_course_detail_edit', {
            course_id: course_id,
            clazz: this.state.clazz,
            teacher: this.state.teacher
        });
    }

    handleDel(course_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/course/delete',
            data: {
                course_id: course_id,
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

    handleChange(info) {
        if (info.file.status === 'done') {
            if (info.file.response.code === 200) {
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

    handleExcel() {
        window.open(constant.host + '/admin/xietong/course/apply/export')
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
            action: constant.host + '/admin/xietong/course/upload',
            headers: {
                'app_id': constant.app_id,
                'token': storage.getToken(),
                'platform': constant.platform,
                'version': constant.version
            },
            onChange: this.handleChange.bind(this)
        };

        const columns = [{
            title: '课程名称',
            dataIndex: 'course_name'
        }, {
            title: '老师姓名',
            dataIndex: 'course_teacher'
        }, {
            title: '课程时间',
            dataIndex: 'course_time',
            render: (text, record, index) => (
                <span>
                    {
                        text === 17 ? '星期一第七节' : ''
                    }
                    {
                        text === 27 ? '星期二第七节' : ''
                    }
                    {
                        text === 28 ? '星期二第八节' : ''
                    }
                    {
                        text === 29 ? '星期二第九节' : ''
                    }
                    {
                        text === 47 ? '星期四第七节' : ''
                    }
                    {
                        text === 48 ? '星期四第七节' : ''
                    }
                    {
                        text === 49 ? '星期四第九节' : ''
                    }
                    {
                        text === 56 ? '星期五第六节' : ''
                    }
                </span>
            )
        }, {
            title: '申请限制',
            dataIndex: 'course_apply_limit'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.course_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.course_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.xietong_course.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.xietong_course.page_index,
            pageSize: this.props.xietong_course.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">课程信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="default" icon="file-excel" size="default" className="margin-right"
                                onClick={this.handleExcel.bind(this)}>导出选课数据</Button>
                        <Upload className="margin-right" {...props}>
                            <Button type="default" icon="upload" size="default" className="button-reload">导入课程数据</Button>
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
                                                        this.props.xietong_course.app_list.map(function (item) {
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
                            }} className="content-search-item" label="课程名称">
                                {
                                    getFieldDecorator('course_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入课程名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="course_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.xietong_course.list} pagination={pagination}
                       bordered/>
                <XietongCourseDetail/>
            </QueueAnim>
        );
    }
}

XietongCourseIndex.propTypes = {};

XietongCourseIndex = Form.create({})(XietongCourseIndex);

export default connect(({xietong_course}) => ({
    xietong_course
}))(XietongCourseIndex);
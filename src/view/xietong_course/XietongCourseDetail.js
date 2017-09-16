import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, InputNumber, message, Popconfirm, Table} from 'antd';

import InputImage from '../../component/InputImage';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import XietongStudentHelp from '../xietong_student/XietongStudentHelp';

class XietongCourseDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            course_id: '',
            clazz: [],
            teacher: [],
            white: [],
            black: [],
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_xietong_course_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                clazz: data.clazz,
                teacher: data.teacher
            });
        });

        notification.on('notification_xietong_course_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                course_id: data.course_id,
                clazz: data.clazz,
                teacher: data.teacher
            }, function () {
                this.handleLoad();
                this.handleWhiteLoad(data.course_id);
                this.handleBlackLoad(data.course_id);
            });
        });

        notification.on('notification_xietong_course_student_return', this, function(data) {
            if (data.type == 'white') {
                this.handleWhiteSave(data.student_id);
            } else if (data.type == 'black') {
                this.handleBlackSave(data.student_id);
            }
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_course_detail_add', this);

        notification.remove('notification_xietong_course_detail_edit', this);

        notification.remove('notification_xietong_course_student_return', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/course/find',
            data: {
                course_id: this.state.course_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }
                let course_image = [];
                if (data.course_image_file !== null) {
                    course_image.push(data.course_image_file);
                }
                this.refs.course_image.handleSetValue(course_image);

                this.props.form.setFieldsValue({
                    clazz_id: JSON.parse(data.clazz_id),
                    course_teacher: data.course_teacher,
                    course_name: data.course_name,
                    course_time: data.course_time.toString(),
                    course_apply_limit: data.course_apply_limit,
                    course_address: data.course_address,
                    course_content: data.course_content,
                });

                this.setState({
                    system_version: data.system_version
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleWhiteLoad(course_id) {
        this.setState({
            is_load: true
        });
        http.request({
            url: '/' + constant.action + '/xietong/course/student/white/list',
            data: {
                course_id: course_id,
            },
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].key = data[i].course_student_id;
                }

                this.setState({
                    white: data
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleBlackLoad(course_id) {
        this.setState({
            is_load: true
        });
        http.request({
            url: '/' + constant.action + '/xietong/course/student/black/list',
            data: {
                course_id: course_id,
            },
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].key = data[i].course_student_id;
                }

                this.setState({
                    black: data
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleWhiteSave(student_id) {
        this.setState({
            is_load: true
        });
        http.request({
            url: '/' + constant.action + '/xietong/course/student/white/save',
            data: {
                course_id: this.state.course_id,
                student_id: student_id
            },
            success: function (json) {
                message.success(constant.success);

                setTimeout(function () {
                    this.handleWhiteLoad(this.state.course_id);
                }.bind(this), constant.timeout);
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleBlackSave(student_id) {
        this.setState({
            is_load: true
        });
        http.request({
            url: '/' + constant.action + '/xietong/course/student/black/save',
            data: {
                course_id: this.state.course_id,
                student_id: student_id
            },
            success: function (json) {
                message.success(constant.success);

                setTimeout(function () {
                    this.handleBlackLoad(this.state.course_id);
                }.bind(this), constant.timeout);
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleStudentDelete(course_student_id, type, system_version) {
        this.setState({
            is_load: true
        });
        http.request({
            url: '/' + constant.action + '/xietong/course/student/delete',
            data: {
                course_id: this.state.course_id,
                course_student_id: course_student_id,
                system_version: system_version
            },
            success: function (json) {
                message.success(constant.success);

                setTimeout(function () {
                    if (type == 'white') {
                        this.handleWhiteLoad(this.state.course_id);
                    } else {
                        this.handleBlackLoad(this.state.course_id);
                    }
                }.bind(this), constant.timeout);
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            let file_list = this.refs.course_image.handleGetValue();
            if (file_list.length === 0) {
                values.course_image = '';
            } else {
                values.course_image = file_list[0].file_id;
            }

            values.course_id = this.state.course_id;
            values.system_version = this.state.system_version;
            console.log('values', values);
            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/xietong/course/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_xietong_course_index_load', {});

                    this.handleCancel();
                }.bind(this),
                complete: function () {
                    this.setState({
                        is_load: false
                    });
                }.bind(this)
            });
        });
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            course_id: '',
            clazz: [],
            teacher: [],
            white: [],
            black: [],
            system_version: ''
        });

        this.refs.course_image.handleReset();

        this.props.form.resetFields();
    }

    handleBlack() {
        notification.emit('notification_xietong_student_help', {
            type: 'black',
            clazz: this.state.clazz
        });
    }

    handleWhite() {
        notification.emit('notification_xietong_student_help', {
            type: 'white',
            clazz: this.state.clazz
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const whiteColumns = [{
            width: 150,
            title: '班级',
            dataIndex: 'clazz_name',
            key: 'clazz_name'
        }, {
            width: 150,
            title: '学生姓名',
            dataIndex: 'student_name',
            key: 'student_name'
        }, {
            width: 150,
            title: '学号',
            dataIndex: 'student_number'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleStudentDelete.bind(this, record.course_student_id, 'white', record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const blackColumns = [{
            width: 150,
            title: '班级',
            dataIndex: 'clazz_name',
            key: 'clazz_name'
        }, {
            width: 150,
            title: '学生姓名',
            dataIndex: 'student_name',
            key: 'student_name'
        }, {
            width: 150,
            title: '学号',
            dataIndex: 'student_number'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleStudentDelete.bind(this, record.course_student_id, 'black', record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        return (
            <Modal title={'详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleSubmit.bind(this)}>确定</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <form>
                        {
                            constant.action === 'system' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="content-search-item" label="应用名称">
                                            {
                                                getFieldDecorator('app_id', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
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
                                </Row>
                                :
                                ''
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="所属班级">
                                    {
                                        getFieldDecorator('clazz_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required,
                                                type: 'array'
                                            }],
                                            initialValue: []
                                        })(
                                            <Select mode="multiple" placeholder="请选择班级">
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
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="课程老师">
                                    {
                                        getFieldDecorator('course_teacher', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '课程老师'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="课程名称">
                                    {
                                        getFieldDecorator('course_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '课程名称'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="课程时间">
                                    {
                                        getFieldDecorator('course_time', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }]
                                        })(
                                            <Select placeholder="请选择课程时间">
                                                <Option key="17" value="17">星期一第七节</Option>
                                                <Option key="27" value="27">星期二第七节</Option>
                                                <Option key="28" value="28">星期二第八节</Option>
                                                <Option key="47" value="47">星期四第七节</Option>
                                                <Option key="48" value="48">星期四第八节</Option>
                                                <Option key="56" value="56">星期五第六节</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="申请限制">
                                    {
                                        getFieldDecorator('course_apply_limit', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '申请限制'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="课程地址">
                                    {
                                        getFieldDecorator('course_address', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '课程地址'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="课程图片">
                                    <InputImage name="course_image" limit={1} ref="course_image"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="课程介绍">
                                    {
                                        getFieldDecorator('course_content', {
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={8} placeholder={constant.placeholder + '课程介绍'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.action === 'update'?
                                <span>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 0},
                                                wrapperCol: {span: 24}
                                            }} className="form-item" label="白名单">
                                                <Button key="white" type="ghost" size="default" icon="plus-circle"
                                                        onClick={this.handleWhite.bind(this)} style={{marginBottom: '15px'}}>新增白名单</Button>
                                                <Table columns={whiteColumns} dataSource={this.state.white} pagination={false} size="middle" bordered/>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 0},
                                                wrapperCol: {span: 24}
                                            }} className="form-item" label="黑名单">
                                                <Button key="black" type="ghost" size="default" icon="plus-circle"
                                                        onClick={this.handleBlack.bind(this)} style={{marginBottom: '15px'}}>新增黑名单</Button>
                                                <Table columns={blackColumns} dataSource={this.state.black} pagination={false} size="middle" bordered/>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </span>:null
                        }
                        <XietongStudentHelp />
                    </form>
                </Spin>
            </Modal>
        );
    }
}

XietongCourseDetail.propTypes = {};

XietongCourseDetail = Form.create({})(XietongCourseDetail);

export default connect(({xietong_course}) => ({xietong_course}))(XietongCourseDetail);
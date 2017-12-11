import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import XietongTeacherRecruitmentDetail from './XietongTeacherRecruitmentDetail';
import XietongTeacherRecruitmentPrint from './XietongTeacherRecruitmentPrint';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class XietongTeacherRecruitmentIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.xietong_teacher_recruitment.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            teacher_recruitment_name: this.props.xietong_teacher_recruitment.teacher_recruitment_name,
            teacher_recruitment_mobile: this.props.xietong_teacher_recruitment.teacher_recruitment_mobile,
            teacher_recruitment_faculty: this.props.xietong_teacher_recruitment.teacher_recruitment_faculty,
            teacher_recruitment_subject: this.props.xietong_teacher_recruitment.teacher_recruitment_subject
        });

        this.handleLoad();

        notification.on('notification_xietong_teacher_recruitment_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_teacher_recruitment_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_teacher_recruitment/fetch',
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

            let teacher_recruitment_name = this.props.form.getFieldValue('teacher_recruitment_name');
            let teacher_recruitment_mobile = this.props.form.getFieldValue('teacher_recruitment_mobile');
            let teacher_recruitment_faculty = this.props.form.getFieldValue('teacher_recruitment_faculty');
            let teacher_recruitment_subject = this.props.form.getFieldValue('teacher_recruitment_subject');

            this.props.dispatch({
                type: 'xietong_teacher_recruitment/fetch',
                data: {
                    app_id: app_id,
                    teacher_recruitment_name: teacher_recruitment_name,
                    teacher_recruitment_mobile: teacher_recruitment_mobile,
                    teacher_recruitment_faculty: teacher_recruitment_faculty,
                    teacher_recruitment_subject: teacher_recruitment_subject,
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
            url: '/' + constant.action + '/xietong/teacher/recruitment/list',
            data: {
                app_id: this.props.xietong_teacher_recruitment.app_id,
                teacher_recruitment_name: this.props.xietong_teacher_recruitment.teacher_recruitment_name,
                teacher_recruitment_mobile: this.props.xietong_teacher_recruitment.teacher_recruitment_mobile,
                teacher_recruitment_faculty: this.props.xietong_teacher_recruitment.teacher_recruitment_faculty,
                teacher_recruitment_subject: this.props.xietong_teacher_recruitment.teacher_recruitment_subject,
                page_index: this.props.xietong_teacher_recruitment.page_index,
                page_size: this.props.xietong_teacher_recruitment.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_teacher_recruitment/fetch',
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
                type: 'xietong_teacher_recruitment/fetch',
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
                type: 'xietong_teacher_recruitment/fetch',
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
        notification.emit('notification_xietong_teacher_recruitment_detail_add', {});
    }

    handleEdit(teacher_recruitment_id) {
        notification.emit('notification_xietong_teacher_recruitment_detail_edit', {
            teacher_recruitment_id: teacher_recruitment_id
        });
    }

    handlePrint(teacher_recruitment_id) {
        notification.emit('notification_xietong_teacher_recruitment_print', {
            teacher_recruitment_id: teacher_recruitment_id
        });
    }

    handleDel(teacher_recruitment_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/teacher/recruitment/delete',
            data: {
                teacher_recruitment_id: teacher_recruitment_id,
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
        window.open(constant.host + '/admin/xietong/teacher/recruitment/all/export')
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '姓名',
            dataIndex: 'teacher_recruitment_name'
        }, {
            title: '性别',
            dataIndex: 'teacher_recruitment_sex'
        }, {
            title: '手机号码',
            dataIndex: 'teacher_recruitment_mobile'
        }, {
            title: '应聘学部',
            dataIndex: 'teacher_recruitment_faculty'
        }, {
            title: '应聘学科',
            dataIndex: 'teacher_recruitment_subject'
        }, {
            width: 180,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.teacher_recruitment_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <a onClick={this.handlePrint.bind(this, record.teacher_recruitment_id)}>打印</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.teacher_recruitment_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.xietong_teacher_recruitment.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.xietong_teacher_recruitment.page_index,
            pageSize: this.props.xietong_teacher_recruitment.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">招聘信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="default" icon="file-excel" size="default" className="margin-right"
                                onClick={this.handleExcel.bind(this)}>导出招聘信息</Button>
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
                                                        this.props.xietong_teacher_recruitment.app_list.map(function (item) {
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
                                    getFieldDecorator('teacher_recruitment_name', {
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
                                    getFieldDecorator('teacher_recruitment_mobile', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入手机号码" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="应聘学部">
                                {
                                    getFieldDecorator('teacher_recruitment_faculty', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择应聘学部">
                                            <Option key={'小学部'} value={'小学部'}>小学部</Option>
                                            <Option key={'中学部'} value={'中学部'}>中学部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="应聘学科">
                                {
                                    getFieldDecorator('teacher_recruitment_subject', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入应聘学科" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="teacher_recruitment_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.xietong_teacher_recruitment.list} pagination={pagination}
                       bordered/>
                <XietongTeacherRecruitmentDetail/>
                <XietongTeacherRecruitmentPrint/>
            </QueueAnim>
        );
    }
}

XietongTeacherRecruitmentIndex.propTypes = {};

XietongTeacherRecruitmentIndex = Form.create({})(XietongTeacherRecruitmentIndex);

export default connect(({xietong_teacher_recruitment}) => ({
    xietong_teacher_recruitment
}))(XietongTeacherRecruitmentIndex);
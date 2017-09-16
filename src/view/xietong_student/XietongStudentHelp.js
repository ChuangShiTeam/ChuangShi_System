import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, Table} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class XietongStudentHelp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: '',
            is_load: false,
            is_show: false,
            is_preview: false,
            student_name: '',
            clazz_id: '',
            page_index: 1,
            page_size: 10,
            total: 0,
            list: [],
            selectedRowKeys: [],
            clazz: []
        }
    }

    componentDidMount() {
        notification.on('notification_xietong_student_help', this, function (data) {
            this.setState({
                is_show: true,
                type: data.type,
                clazz: data.clazz
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_student_help', this);
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            let student_name = this.props.form.getFieldValue('student_name');
            let clazz_id = this.props.form.getFieldValue('clazz_id');

            this.setState({
                student_name: student_name,
                clazz_id: clazz_id,
                page_index: 1
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
                app_id: constant.app_id,
                student_name: this.state.student_name,
                clazz_id: this.state.clazz_id,
                page_index: this.state.page_index,
                page_size: this.state.page_size
            },
            success: function (data) {
                this.setState({
                    total: data.total,
                    list: data.list
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
            this.setState({
                page_index: page_index
            });
            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleChangeSize(page_index, page_size) {
        new Promise(function (resolve, reject) {
            this.setState({
                page_index: page_index,
                page_size: page_size
            });
            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleSubmit() {
        if (this.state.selectedRowKeys.length > 0) {
            notification.emit('notification_xietong_course_student_return', {
                student_id: this.state.selectedRowKeys[0],
                type: this.state.type
            });
        }
        this.handleCancel();
    }

    handleCancel() {
        this.setState({
            type: '',
            is_load: false,
            is_show: false,
            is_preview: false,
            student_name: '',
            clazz_id: '',
            page_index: 1,
            page_size: 10,
            total: 0,
            list: [],
            selectedRowKeys: []
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            width: 150,
            title: '班级',
            dataIndex: 'clazz_name'
        }, {
            title: '学生名称',
            dataIndex: 'student_name'
        }, {
            width: 150,
            title: '学号',
            dataIndex: 'student_number'
        }];

        const rowSelection = {
            type: 'radio',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys
                });
            }
        };

        const pagination = {
            size: 'defalut',
            total: this.state.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.state.page_index,
            pageSize: this.state.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <Modal title={'选择学生'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                    <Row key="0" className="content-title">
                        <Col span={8}>
                        </Col>
                        <Col span={16} className="content-button">
                            <Button type="default" icon="search" size="default" className="margin-right"
                                    loading={this.state.is_load}
                                    onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        </Col>
                    </Row>
                    <Form key="1" className="content-search margin-top">
                        <Row>
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
                           rowSelection={rowSelection}
                           loading={this.state.is_load} columns={columns}
                           dataSource={this.state.list} pagination={pagination}
                           bordered/>
                </Spin>
            </Modal>
        );
    }
}

XietongStudentHelp.propTypes = {};

XietongStudentHelp = Form.create({})(XietongStudentHelp);

export default connect(({}) => ({}))(XietongStudentHelp);
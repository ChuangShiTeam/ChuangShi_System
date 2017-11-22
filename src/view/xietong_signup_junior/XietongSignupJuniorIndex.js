import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import XietongSignupJuniorDetail from './XietongSignupJuniorDetail';
import XietongSignupJuniorPrint from './XietongSignupJuniorPrint';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class XietongSignupJuniorIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.xietong_signup_junior.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            student_name: this.props.xietong_signup_junior.student_name,
            student_category: this.props.xietong_signup_junior.student_category,
            id_no: this.props.xietong_signup_junior.id_no,
        });

        this.handleLoad();

        notification.on('notification_xietong_signup_junior_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_signup_junior_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_signup_junior/fetch',
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

            let student_name = this.props.form.getFieldValue('student_name');
            let student_category = this.props.form.getFieldValue('student_category');
            let id_no = this.props.form.getFieldValue('id_no');

            this.props.dispatch({
                type: 'xietong_signup_junior/fetch',
                data: {
                    app_id: app_id,
                    student_name: student_name,
                    student_category: student_category,
                    id_no: id_no,
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
            url: '/' + constant.action + '/xietong/signup/junior/list',
            data: {
                app_id: this.props.xietong_signup_junior.app_id,
                student_name: this.props.xietong_signup_junior.student_name,
                student_category: this.props.xietong_signup_junior.student_category,
                id_no: this.props.xietong_signup_junior.id_no,
                page_index: this.props.xietong_signup_junior.page_index,
                page_size: this.props.xietong_signup_junior.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_signup_junior/fetch',
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
                type: 'xietong_signup_junior/fetch',
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
                type: 'xietong_signup_junior/fetch',
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
        notification.emit('notification_xietong_signup_junior_detail_add', {});
    }

    handleEdit(signup_id) {
        notification.emit('notification_xietong_signup_junior_detail_edit', {
            signup_id: signup_id
        });
    }

    handlePrint(signup_id) {
        notification.emit('notification_xietong_signup_junior_print', {
            signup_id: signup_id
        });
    }

    handleDel(signup_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/signup/junior/delete',
            data: {
                signup_id: signup_id,
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
        window.open(constant.host + '/admin/xietong/signup/junior/all/export')
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '学生姓名',
            dataIndex: 'student_name'
        }, {
            title: '报名分类',
            dataIndex: 'student_category'
        }, {
            title: '学生性别',
            dataIndex: 'student_sex'
        }, {
            title: '生日',
            dataIndex: 'student_birthday'
        }, {
            title: '担任职务',
            dataIndex: 'job'
        }, {
            title: '证件类型',
            dataIndex: 'id_type'
        }, {
            title: '证件号码',
            dataIndex: 'id_no'
        }, {
            title: '户籍地址',
            dataIndex: 'permanent_address'
        }, {
            title: '家庭住址',
            dataIndex: 'live_addresss'
        }, {
            width: 180,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.signup_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <a onClick={this.handlePrint.bind(this, record.signup_id)}>打印</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.signup_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.xietong_signup_junior.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.xietong_signup_junior.page_index,
            pageSize: this.props.xietong_signup_junior.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">初中报名信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="default" icon="file-excel" size="default" className="margin-right"
                                onClick={this.handleExcel.bind(this)}>导出报名信息</Button>
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
                                                        this.props.xietong_signup_junior.app_list.map(function (item) {
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
                            }} className="content-search-item" label="报名分类">
                                {
                                    getFieldDecorator('student_category', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择报名分类">
                                            <Option key="初中一年级新生" value="初中一年级新生">初中一年级新生</Option>
                                            <Option key="插班生" value="插班生">插班生</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="证件号码">
                                {
                                    getFieldDecorator('id_no', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入证件号码" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="signup_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.xietong_signup_junior.list} pagination={pagination}
                       bordered/>
                <XietongSignupJuniorDetail/>
                <XietongSignupJuniorPrint/>
            </QueueAnim>
        );
    }
}

XietongSignupJuniorIndex.propTypes = {};

XietongSignupJuniorIndex = Form.create({})(XietongSignupJuniorIndex);

export default connect(({xietong_signup_junior}) => ({
    xietong_signup_junior
}))(XietongSignupJuniorIndex);
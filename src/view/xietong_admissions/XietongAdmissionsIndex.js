import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import XietongAdmissionsDetail from './XietongAdmissionsDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class XietongAdmissionsIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.xietong_admissions.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            admissions_no: this.props.xietong_admissions.admissions_no,
            admissions_name: this.props.xietong_admissions.admissions_name,
        });

        this.handleLoad();

        notification.on('notification_xietong_admissions_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_admissions_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_admissions/fetch',
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

            let admissions_no = this.props.form.getFieldValue('admissions_no');
            let admissions_name = this.props.form.getFieldValue('admissions_name');

            this.props.dispatch({
                type: 'xietong_admissions/fetch',
                data: {
                    app_id: app_id,
                    admissions_no: admissions_no,
                    admissions_name: admissions_name,
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
            url: '/' + constant.action + '/xietong/admissions/list',
            data: {
                app_id: this.props.xietong_admissions.app_id,
                admissions_no: this.props.xietong_admissions.admissions_no,
                admissions_name: this.props.xietong_admissions.admissions_name,
                page_index: this.props.xietong_admissions.page_index,
                page_size: this.props.xietong_admissions.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'xietong_admissions/fetch',
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
                type: 'xietong_admissions/fetch',
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
                type: 'xietong_admissions/fetch',
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
        notification.emit('notification_xietong_admissions_detail_add', {});
    }

    handleEdit(admissions_id) {
        notification.emit('notification_xietong_admissions_detail_edit', {
            admissions_id: admissions_id
        });
    }

    handleDel(admissions_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/admissions/delete',
            data: {
                admissions_id: admissions_id,
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
            title: '序号',
            dataIndex: 'admissions_no'
        }, {
            title: '姓名',
            dataIndex: 'admissions_name'
        }, {
            title: '证件类型',
            dataIndex: 'admissions_certificate_type'
        }, {
            title: '证件号码(身份证号码）',
            dataIndex: 'admissions_certificate_number'
        }, {
            title: '性别',
            dataIndex: 'admissions_sex'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.admissions_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.admissions_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.xietong_admissions.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.xietong_admissions.page_index,
            pageSize: this.props.xietong_admissions.page_size,
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
                                                        this.props.xietong_admissions.app_list.map(function (item) {
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
                            }} className="content-search-item" label="序号">
                                {
                                    getFieldDecorator('admissions_no', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入序号" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="姓名">
                                {
                                    getFieldDecorator('admissions_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入姓名" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="admissions_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.xietong_admissions.list} pagination={pagination}
                       bordered/>
                <XietongAdmissionsDetail/>
            </QueueAnim>
        );
    }
}

XietongAdmissionsIndex.propTypes = {};

XietongAdmissionsIndex = Form.create({})(XietongAdmissionsIndex);

export default connect(({xietong_admissions}) => ({
    xietong_admissions
}))(XietongAdmissionsIndex);
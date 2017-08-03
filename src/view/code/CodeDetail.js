import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Checkbox, Input, Table, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class CodeDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            table_name: '',
            list: []
        }
    }

    componentDidMount() {
        notification.on('notification_code_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                table_name: data.table_name
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_code_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/code/' + constant.action + '/find',
            data: {
                table_name: this.state.table_name
            },
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].is_search = false;
                    data[i].is_can_search = true;
                    data[i].is_list = false;
                    data[i].is_can_list = true;
                    data[i].is_detail = true;
                    data[i].is_can_detail = true;
                    data[i].is_updatable = true;
                    data[i].is_can_updatable = true;

                    if (data[i].column_key === 'PRI') {
                        data[i].is_list = false;
                        data[i].is_can_list = false;
                        data[i].is_detail = false;
                        data[i].is_can_detail = false;
                        data[i].is_updatable = false;
                        data[i].is_can_updatable = false;
                    }

                    if (data[i].column_name === 'app_id') {
                        data[i].is_detail = false;
                        data[i].is_can_detail = false;
                        data[i].is_updatable = false;
                        data[i].is_can_updatable = false;
                    }

                    if (data[i].column_name === 'system_version') {
                        data[i].is_list = false;
                        data[i].is_can_list = false;
                    }

                    if (data[i].column_name.indexOf('system_') !== -1) {
                        data[i].is_detail = false;
                        data[i].is_can_detail = false;
                        data[i].is_updatable = false;
                        data[i].is_can_updatable = false;
                    }
                }

                this.setState({
                    list: data
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleChangeSearch(index) {
        let list = this.state.list;
        list[index].is_search = !list[index].is_search;
        this.setState({
            list: list
        });
    }

    handleChangeList(index) {
        let list = this.state.list;

        if (list[index].column_key === 'PRI' || list[index].column_name === 'system_version') {

        } else {
            list[index].is_list = !list[index].is_list;
            this.setState({
                list: list
            });
        }
    }

    handleChangeDetail(index) {
        let list = this.state.list;
        list[index].is_detail = !list[index].is_detail;
        this.setState({
            list: list
        });
    }

    handleChangeUpdate(index) {
        let list = this.state.list;
        list[index].is_updatable = !list[index].is_updatable;
        this.setState({
            list: list
        });
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            let is_app_id = false;
            let is_search = false;
            let is_list = false;
            for (let i = 0; i < this.state.list.length; i++) {
                if (this.state.list[i].is_search) {
                    is_search = true;
                }

                if (this.state.list[i].is_list) {
                    is_list = true;
                }
            }

            if (!is_search) {
                message.error("选择一个搜索字段" + (is_app_id ? ',除了app_id' : ''));

                return;
            }

            if (!is_list) {
                message.error("选择一个列表字段");

                return;
            }

            this.setState({
                is_load: true
            });

            values.table_name = this.state.table_name;
            values.list = this.state.list;

            http.request({
                url: '/admin/code/save',
                data: values,
                success: function (data) {
                    message.success(constant.success);
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
            table_name: '',
            list: []
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '名称',
            dataIndex: 'column_name'
        }, {
            width: 200,
            title: '备注',
            dataIndex: 'column_comment'
        }, {
            width: 150,
            title: '类型',
            dataIndex: 'column_type'
        }, {
            width: 100,
            title: '是否搜索',
            dataIndex: 'is_search',
            render: (text, record, index) => (
                record.is_can_search ?
                    <Checkbox checked={record.is_search}
                              onChange={this.handleChangeSearch.bind(this, index)}></Checkbox>
                    :
                    ''
            )
        }, {
            width: 100,
            title: '是否列表',
            dataIndex: 'is_list',
            render: (text, record, index) => (
                record.is_can_list ?
                    <Checkbox checked={record.is_list} onChange={this.handleChangeList.bind(this, index)}></Checkbox>
                    :
                    ''
            )
        }, {
            width: 100,
            title: '是否详情',
            dataIndex: 'is_detail',
            render: (text, record, index) => (
                record.is_can_detail ?
                    <Checkbox checked={record.is_detail}
                              onChange={this.handleChangeDetail.bind(this, index)}></Checkbox>
                    :
                    ''
            )
        }, {
            width: 100,
            title: '是否更新',
            dataIndex: 'is_updatable',
            render: (text, record, index) => (
                record.is_can_updatable ?
                    <Checkbox checked={record.is_updatable}
                              onChange={this.handleChangeUpdate.bind(this, index)}></Checkbox>
                    :
                    ''
            )
        }];

        return (
            <Modal title={'代码生成详情'} maskClosable={false} width={document.documentElement.clientWidth - 200}
                   className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleSubmit.bind(this)}>立即生成代码</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <form>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="package名称">
                                    {
                                        getFieldDecorator('package_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'package名称'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Table
                                rowKey={record => record.column_name}
                                size="default"
                                className="margin-top"
                                columns={columns}
                                dataSource={this.state.list} pagination={false}
                                bordered/>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

CodeDetail.propTypes = {};

CodeDetail = Form.create({})(CodeDetail);

export default connect(({admin}) => ({admin}))(CodeDetail);
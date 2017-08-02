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
        list[index].is_list = !list[index].is_list;
        this.setState({
            list: list
        });
    }

    handleChangeUpdate(index) {
        let list = this.state.list;
        list[index].is_update = !list[index].is_update;
        this.setState({
            list: list
        });
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            this.setState({
                is_load: true
            });

            http.request({
                url: '/admin/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_admin_index_load', {});

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
                <Checkbox checked={record.is_search} onChange={this.handleChangeSearch.bind(this, index)}></Checkbox>
            )
        }, {
            width: 100,
            title: '是否列表',
            dataIndex: 'is_list',
            render: (text, record, index) => (
                <Checkbox checked={record.is_list} onChange={this.handleChangeList.bind(this, index)}></Checkbox>
            )
        }, {
            width: 100,
            title: '是否更新',
            dataIndex: 'is_update',
            render: (text, record, index) => (
                <Checkbox checked={record.is_list} onChange={this.handleChangeUpdate.bind(this, index)}></Checkbox>
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
                               onClick={this.handleSubmit.bind(this)}>确定</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <form>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="分类编号">
                                    {
                                        getFieldDecorator('category_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '分类编号'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="form-table-col">
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="数据字段">

                                    <Table
                                        rowKey={record => record.column_name}
                                        className="margin-top"
                                        columns={columns}
                                        dataSource={this.state.list} pagination={false}
                                        bordered/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2}>
                            </Col>
                            <Col>
                                <Button type="primary" icon="check-circle" size="default" className="">立即生成代码</Button>
                            </Col>
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
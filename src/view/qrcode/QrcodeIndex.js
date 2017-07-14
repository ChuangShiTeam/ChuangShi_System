import React, {Component} from "react";
import {connect} from "dva";
import QueueAnim from "rc-queue-anim";
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from "antd";
import QrcodeDetail from "./QrcodeDetail";
import constant from "../../util/constant";
import notification from "../../util/notification";
import validate from "../../util/validate";
import http from "../../util/http";

class QrcodeIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.qrcode.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            qrcode_type: this.props.qrcode.qrcode_type
        });

        this.handleLoad();

        notification.on('notification_qrcode_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_qrcode_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'qrcode/fetch',
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

            let qrcode_type = this.props.form.getFieldValue('qrcode_type');

            this.props.dispatch({
                type: 'qrcode/fetch',
                data: {
                    app_id: app_id,
                    qrcode_type: qrcode_type,
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
            url: '/qrcode/' + constant.action + '/list',
            data: {
                app_id: this.props.qrcode.app_id,
                qrcode_type: this.props.qrcode.qrcode_type,
                page_index: this.props.qrcode.page_index,
                page_size: this.props.qrcode.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'qrcode/fetch',
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
                type: 'qrcode/fetch',
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
                type: 'qrcode/fetch',
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
        this.setState({
            is_load: true
        });

        http.request({
            url: '/qrcode/' + constant.action + '/add',
            data: {},
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

    handleEdit(qrcode_id) {
        notification.emit('notification_qrcode_detail_edit', {
            qrcode_id: qrcode_id
        });
    }

    handleDel(qrcode_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/qrcode/' + constant.action + '/delete',
            data: {
                qrcode_id: qrcode_id,
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
            title: '会员名称',
            dataIndex: 'object_id'
        }, {
            title: '二维码类型',
            dataIndex: 'qrcode_type'
        }, {
            width: 100,
            title: '二维码地址',
            dataIndex: 'qrcode_url',
            render: (text, record, index) => (
                <div className="clearfix">
                    <img alt="example" style={{ width: '100%' }} src={record.qrcode_url}/>
                </div>
            )
        }, {
            title: '关注人数',
            dataIndex: 'qrcode_add'
        }, {
            title: '取消人数',
            dataIndex: 'qrcode_cancel'
        }, {
            title: '二维码状态',
            dataIndex: 'qrcode_status',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.qrcode_status ? '正常' : '暂停'}
                </div>
            )
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.qrcode_id)}>{constant.find}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.qrcode.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.qrcode.page_index,
            pageSize: this.props.qrcode.page_size,
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
                                                        this.props.qrcode.app_list.map(function (item) {
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
                            }} className="content-search-item" label="类型">
                                {
                                    getFieldDecorator('qrcode_type', {
                                        initialValue: ''
                                    })(
                                        <Select placeholder="请选择类型">
                                            <Option value="MEMBER">会员</Option>
                                            <Option value="PLATFORM">平台</Option>
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
                       rowKey="qrcode_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.qrcode.list} pagination={pagination}
                       bordered/>
                <QrcodeDetail/>
            </QueueAnim>
        );
    }
}

QrcodeIndex.propTypes = {};

QrcodeIndex = Form.create({})(QrcodeIndex);

export default connect(({qrcode}) => ({
    qrcode
}))(QrcodeIndex);
import React, {Component} from "react";
import {connect} from "dva";
import QueueAnim from "rc-queue-anim";
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from "antd";
import MemberAddressDetail from "./MemberAddressDetail";
import constant from "../../util/constant";
import notification from "../../util/notification";
import validate from "../../util/validate";
import http from "../../util/http";

class MemberAddressIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.member_address.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            member_address_name: this.props.member_address.member_address_name
        });

        this.handleLoad();

        notification.on('notification_member_address_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_address_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'member_address/fetch',
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

            let member_address_name = this.props.form.getFieldValue('member_address_name');

            this.props.dispatch({
                type: 'member_address/fetch',
                data: {
                    app_id: app_id,
                    member_address_name: member_address_name,
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
            url: '/member/address/' + constant.action + '/list',
            data: {
                app_id: this.props.member_address.app_id,
                member_address_name: this.props.member_address.member_address_name,
                page_index: this.props.member_address.page_index,
                page_size: this.props.member_address.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'member_address/fetch',
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
                type: 'member_address/fetch',
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
                type: 'member_address/fetch',
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
        notification.emit('notification_member_address_detail_add', {});
    }

    handleEdit(member_address_id) {
        notification.emit('notification_member_address_detail_edit', {
            member_address_id: member_address_id
        });
    }

    handleDel(member_address_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/member/address/' + constant.action + '/delete',
            data: {
                member_address_id: member_address_id,
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
            title: '收货人',
            dataIndex: 'member_address_name'
        },{
            title: '手机号码',
            dataIndex: 'member_address_phone'
        },{
            title: '省份',
            dataIndex: 'member_address_province'
        },{
            title: '城市',
            dataIndex: 'member_address_city'
        },{
            title: '区域',
            dataIndex: 'member_address_area'
        },{
            title: '详细地址',
            dataIndex: 'member_address_street'
        },{
            title: '是否默认地址',
            dataIndex: 'member_delivery_is_default'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.member_address_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.member_address_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.member_address.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.member_address.page_index,
            pageSize: this.props.member_address.page_size,
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
                                                        this.props.member_address.app_list.map(function (item) {
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
                            }} className="content-search-item" label="名称">
                                {
                                    getFieldDecorator('member_address_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="member_address_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.member_address.list} pagination={pagination}
                       bordered/>
                <MemberAddressDetail/>
            </QueueAnim>
        );
    }
}

MemberAddressIndex.propTypes = {};

MemberAddressIndex = Form.create({})(MemberAddressIndex);

export default connect(({member_address}) => ({
    member_address
}))(MemberAddressIndex);
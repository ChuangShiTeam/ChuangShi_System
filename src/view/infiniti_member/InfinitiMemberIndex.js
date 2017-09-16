import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import InfinitiMemberDetail from './InfinitiMemberDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class InfinitiMemberIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.infiniti_member.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            member_redeem_code: this.props.infiniti_member.member_redeem_code,
        });

        this.handleLoad();

        notification.on('notification_infiniti_member_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_infiniti_member_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'infiniti_member/fetch',
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

            let member_redeem_code = this.props.form.getFieldValue('member_redeem_code');

            this.props.dispatch({
                type: 'infiniti_member/fetch',
                data: {
                    app_id: app_id,
                    member_redeem_code: member_redeem_code,
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
            url: '/' + constant.action + '/infiniti/member/list',
            data: {
                app_id: this.props.infiniti_member.app_id,
                member_redeem_code: this.props.infiniti_member.member_redeem_code,
                page_index: this.props.infiniti_member.page_index,
                page_size: this.props.infiniti_member.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'infiniti_member/fetch',
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
                type: 'infiniti_member/fetch',
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
                type: 'infiniti_member/fetch',
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
        notification.emit('notification_infiniti_member_detail_add', {});
    }

    handleEdit(user_id) {
        notification.emit('notification_infiniti_member_detail_edit', {
            user_id: user_id
        });
    }

    handleDel(user_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/infiniti/member/delete',
            data: {
                user_id: user_id,
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
            title: '会员姓名',
            dataIndex: 'member_name'
        }, {
            title: '会员电话',
            dataIndex: 'member_mobile'
        }, {
            title: '会员地址',
            dataIndex: 'member_address'
        }, {
            title: '兑换码',
            dataIndex: 'member_redeem_code'
        }, {
            title: '是否兑换',
            dataIndex: 'member_redeem_code_is_exchange'
        // }, {
        //     width: 100,
        //     title: constant.operation,
        //     dataIndex: '',
        //     render: (text, record, index) => (
        //         <span>
        //           <a onClick={this.handleEdit.bind(this, record.user_id)}>{constant.edit}</a>
        //           <span className="divider"/>
        //           <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
        //                       cancelText={constant.popconfirm_cancel}
        //                       onConfirm={this.handleDel.bind(this, record.user_id, record.system_version)}>
        //             <a>{constant.del}</a>
        //           </Popconfirm>
        //         </span>
        //     )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.infiniti_member.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.infiniti_member.page_index,
            pageSize: this.props.infiniti_member.page_size,
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
                        {/*<Button type="primary" icon="plus-circle" size="default"*/}
                                {/*onClick={this.handleAdd.bind(this)}>{constant.add}</Button>*/}
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
                                                        this.props.infiniti_member.app_list.map(function (item) {
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
                            }} className="content-search-item" label="兑换码">
                                {
                                    getFieldDecorator('member_redeem_code', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入兑换码" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="user_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.infiniti_member.list} pagination={pagination}
                       bordered/>
                <InfinitiMemberDetail/>
            </QueueAnim>
        );
    }
}

InfinitiMemberIndex.propTypes = {};

InfinitiMemberIndex = Form.create({})(InfinitiMemberIndex);

export default connect(({infiniti_member}) => ({
    infiniti_member
}))(InfinitiMemberIndex);
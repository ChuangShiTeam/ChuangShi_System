import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, message} from 'antd';

import JianglingMemberDetail from './JianglingMemberDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class JianglingMemberIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.jiangling_member.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            user_name: this.props.jiangling_member.user_name,
            member_redeem_code: this.props.jiangling_member.member_redeem_code,
        });

        this.handleLoad();

        notification.on('notification_jiangling_member_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_jiangling_member_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'jiangling_member/fetch',
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

            let user_name = this.props.form.getFieldValue('user_name');
            let member_redeem_code = this.props.form.getFieldValue('member_redeem_code');

            this.props.dispatch({
                type: 'jiangling_member/fetch',
                data: {
                    app_id: app_id,
                    user_name: user_name,
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
            url: '/' + constant.action + '/jiangling/member/list',
            data: {
                app_id: this.props.jiangling_member.app_id,
                user_name: this.props.jiangling_member.user_name,
                member_redeem_code: this.props.jiangling_member.member_redeem_code,
                page_index: this.props.jiangling_member.page_index,
                page_size: this.props.jiangling_member.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'jiangling_member/fetch',
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
                type: 'jiangling_member/fetch',
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
                type: 'jiangling_member/fetch',
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

    }

    handleEdit(user_id) {
        http.request({
            url: '/admin/jiangling/member/like/point/update',
            data: {
                user_id: user_id
            },
            success: function (data) {
                message.success(constant.success);

                this.handleLoad();
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleDel(user_name, system_version) {

    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '会员',
            dataIndex: 'user_name'
        }, {
            width: 150,
            title: '会员找不同积分',
            dataIndex: 'member_diffent_point'
        }, {
            width: 150,
            title: '会员集攒积分',
            dataIndex: 'member_like_point'
        }, {
            width: 150,
            title: '兑换码',
            dataIndex: 'member_redeem_code'
        }, {
            width: 150,
            title: '是否兑换',
            dataIndex: 'member_redeem_code_is_exchange'
        }, {
            width: 150,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.handleEdit.bind(this, record.user_id)}>兑换集攒积分</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.jiangling_member.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.jiangling_member.page_index,
            pageSize: this.props.jiangling_member.page_size,
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
                                                        this.props.jiangling_member.app_list.map(function (item) {
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
                            }} className="content-search-item" label="会员名称">
                                {
                                    getFieldDecorator('user_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入会员名称"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="兑换码">
                                {
                                    getFieldDecorator('member_redeem_code', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入兑换码"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="user_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.jiangling_member.list} pagination={pagination}
                       bordered/>
                <JianglingMemberDetail/>
            </QueueAnim>
        );
    }
}

JianglingMemberIndex.propTypes = {};

JianglingMemberIndex = Form.create({})(JianglingMemberIndex);

export default connect(({jiangling_member}) => ({
    jiangling_member
}))(JianglingMemberIndex);
import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import UniLotteryDetail from './UniLotteryDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class UniLotteryIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.uni_lottery.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            lottery_number: this.props.uni_lottery.lottery_number,
            lottery_user_mobile: this.props.uni_lottery.lottery_user_mobile
        });

        this.handleLoad();

        notification.on('notification_uni_lottery_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_uni_lottery_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'uni_lottery/fetch',
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

            let lottery_number = this.props.form.getFieldValue('lottery_number');
            let lottery_user_mobile = this.props.form.getFieldValue('lottery_user_mobile');

            this.props.dispatch({
                type: 'uni_lottery/fetch',
                data: {
                    app_id: app_id,
                    lottery_number: lottery_number,
                    lottery_user_mobile: lottery_user_mobile,
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
            url: '/' + constant.action + '/uni/lottery/list',
            data: {
                app_id: this.props.uni_lottery.app_id,
                lottery_number: this.props.uni_lottery.lottery_number,
                lottery_user_mobile: this.props.uni_lottery.lottery_user_mobile,
                page_index: this.props.uni_lottery.page_index,
                page_size: this.props.uni_lottery.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'uni_lottery/fetch',
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
                type: 'uni_lottery/fetch',
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
                type: 'uni_lottery/fetch',
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
        notification.emit('notification_uni_lottery_detail_add', {});
    }

    handleView(user_id) {
        notification.emit('notification_uni_lottery_detail_view', {
            user_id: user_id
        });
    }

    handleDel(user_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/uni/lottery/delete',
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
            title: '抽签号码',
            dataIndex: 'lottery_number'
        }, {
            title: '手机号码',
            dataIndex: 'lottery_user_mobile'
        }, {
            title: '用户性别',
            dataIndex: 'lottery_user_sex',
            render: (text, record, index) => (
                <span>
                    {text?'男':'女'}
                </span>
            )
        }, {
            title: '抽签次数',
            dataIndex: 'lottery_time'
        }, {
            title: '是否抽签',
            dataIndex: 'lottery_status',
            render: (text, record, index) => (
                <span>
                    {text?'是':'否'}
                </span>
            )
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleView.bind(this, record.user_id)}>查看</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.user_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.uni_lottery.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.uni_lottery.page_index,
            pageSize: this.props.uni_lottery.page_size,
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
                                                        this.props.uni_lottery.app_list.map(function (item) {
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
                            }} className="content-search-item" label="手机号码">
                                {
                                    getFieldDecorator('lottery_user_mobile', {
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
                            }} className="content-search-item" label="抽签号码">
                                {
                                    getFieldDecorator('lottery_number', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入抽签号码" onPressEnter={this.handleSearch.bind(this)}/>
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
                       dataSource={this.props.uni_lottery.list} pagination={pagination}
                       bordered/>
                <UniLotteryDetail/>
            </QueueAnim>
        );
    }
}

UniLotteryIndex.propTypes = {};

UniLotteryIndex = Form.create({})(UniLotteryIndex);

export default connect(({uni_lottery}) => ({
    uni_lottery
}))(UniLotteryIndex);
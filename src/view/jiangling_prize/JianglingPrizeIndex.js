import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import JianglingPrizeDetail from './JianglingPrizeDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class JianglingPrizeIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.jiangling_prize.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            prize_name: this.props.jiangling_prize.prize_name,
        });

        this.handleLoad();

        notification.on('notification_jiangling_prize_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_jiangling_prize_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'jiangling_prize/fetch',
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

            let prize_name = this.props.form.getFieldValue('prize_name');

            this.props.dispatch({
                type: 'jiangling_prize/fetch',
                data: {
                    app_id: app_id,
                    prize_name: prize_name,
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
            url: '/' + constant.action + '/jiangling/prize/list',
            data: {
                app_id: this.props.jiangling_prize.app_id,
                prize_name: this.props.jiangling_prize.prize_name,
                page_index: this.props.jiangling_prize.page_index,
                page_size: this.props.jiangling_prize.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'jiangling_prize/fetch',
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
                type: 'jiangling_prize/fetch',
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
                type: 'jiangling_prize/fetch',
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
        notification.emit('notification_jiangling_prize_detail_add', {});
    }

    handleEdit(prize_id) {
        notification.emit('notification_jiangling_prize_detail_edit', {
            prize_id: prize_id
        });
    }

    handleDel(prize_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/jiangling/prize/delete',
            data: {
                prize_id: prize_id,
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
            title: '奖品名称',
            dataIndex: 'prize_name'
        }, {
            title: '奖品概率',
            dataIndex: 'prize_probability'
        }, {
            title: '奖品总数量',
            dataIndex: 'prize_total_quantity'
        }, {
            title: '奖品每天数量',
            dataIndex: 'prize_day_quantity'
        }, {
            title: '奖品排序',
            dataIndex: 'prize_sort'
        }, {
            title: '是否默认中奖',
            dataIndex: 'prize_is_default_winning'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.prize_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.prize_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.jiangling_prize.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.jiangling_prize.page_index,
            pageSize: this.props.jiangling_prize.page_size,
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
                                                        this.props.jiangling_prize.app_list.map(function (item) {
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
                            }} className="content-search-item" label="奖品名称">
                                {
                                    getFieldDecorator('prize_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入奖品名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="prize_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.jiangling_prize.list} pagination={pagination}
                       bordered/>
                <JianglingPrizeDetail/>
            </QueueAnim>
        );
    }
}

JianglingPrizeIndex.propTypes = {};

JianglingPrizeIndex = Form.create({})(JianglingPrizeIndex);

export default connect(({jiangling_prize}) => ({
    jiangling_prize
}))(JianglingPrizeIndex);
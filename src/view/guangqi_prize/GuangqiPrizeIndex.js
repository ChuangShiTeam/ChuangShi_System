import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, message} from 'antd';

import GuangqiPrizeDetail from './GuangqiPrizeDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class GuangqiPrizeIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            prize_name: this.props.guangqi_prize.prize_name
        });

        this.handleLoad();

        notification.on('notification_guangqi_prize_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_prize_index_load', this);
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'guangqi_prize/fetch',
                data: {
                    prize_name: this.props.form.getFieldValue('prize_name'),
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
            url: '/guangqi/prize/admin/list',
            // url: '/guangqi/prize/draw',
            data: {
                prize_name: this.props.guangqi_prize.prize_name,
                page_index: this.props.guangqi_prize.page_index,
                page_size: this.props.guangqi_prize.page_size
                // customer_id: '06a4b614724f421e9b9b852f86a7c116'
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_prize/fetch',
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
                type: 'guangqi_prize/fetch',
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
                type: 'guangqi_prize/fetch',
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
        notification.emit('notification_guangqi_prize_detail_add', {});
    }

    handleEdit(prize_id) {
        notification.emit('notification_guangqi_prize_detail_edit', {
            prize_id: prize_id
        });
    }

    handleDel(prize_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/guangqi/prize/admin/delete',
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
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '名称',
            dataIndex: 'prize_name'
        }, {
            width: 100,
            title: '中奖率(%)',
            dataIndex: 'prize_probability'
        }, {
            width: 100,
            title: '总数',
            dataIndex: 'prize_quantity'
        }, {
            width: 100,
            title: '每天上限',
            dataIndex: 'prize_limit'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.prize_id)}>{constant.edit}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.guangqi_prize.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.guangqi_prize.page_index,
            pageSize: this.props.guangqi_prize.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">奖品管理</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="primary" icon="search" size="default"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="奖品名称">
                                {
                                    getFieldDecorator('prize_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入奖品名称"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="prize_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.guangqi_prize.list} pagination={pagination}
                       bordered/>
                <GuangqiPrizeDetail/>
            </QueueAnim>
        );
    }
}

GuangqiPrizeIndex.propTypes = {};

GuangqiPrizeIndex = Form.create({})(GuangqiPrizeIndex);

export default connect(({guangqi_prize}) => ({guangqi_prize}))(GuangqiPrizeIndex);
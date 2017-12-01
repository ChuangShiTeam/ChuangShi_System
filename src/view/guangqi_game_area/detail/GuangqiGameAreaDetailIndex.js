import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Table, Popconfirm, message} from 'antd';

import GuangqiGameAreaDetailDetail from './GuangqiGameAreaDetailDetail';
import constant from '../../../util/constant';
import notification from '../../../util/notification';
import validate from '../../../util/validate';
import http from '../../../util/http';

class GuangqiGameAreaDetailIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            game_area_detail_type: '',
            total: 0,
            page_index: 1,
            page_size: constant.page_size,
            list: []
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            game_area_detail_type: this.state.game_area_detail_type,
        });

        this.handleLoad();

        notification.on('notification_guangqi_game_area_detail_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_game_area_detail_index_load', this);
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            let game_area_detail_type = this.props.form.getFieldValue('game_area_detail_type');

            this.setState({
                game_area_detail_type: game_area_detail_type,
                page_index: 1
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
            url: '/' + constant.action + '/guangqi/game/area/detail/list',
            data: {
                game_area_id: this.props.params.game_area_id,
                game_area_detail_type: this.state.game_area_detail_type,
                page_index: this.state.page_index,
                page_size: this.state.page_size
            },
            success: function (data) {
                this.setState({
                    total: data.total,
                    list: data.list
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
            this.setState({
                page_index: page_index
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleChangeSize(page_index, page_size) {
        new Promise(function (resolve, reject) {
            this.setState({
                page_index: page_index,
                page_size: page_size
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleAdd() {
        notification.emit('notification_guangqi_game_area_detail_detail_add', {
            game_area_id: this.props.params.game_area_id
        });
    }

    handleEdit(game_area_detail_id) {
        notification.emit('notification_guangqi_game_area_detail_detail_edit', {
            game_area_detail_id: game_area_detail_id,
            game_area_id: this.props.params.game_area_id
        });
    }

    handleDel(game_area_detail_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/guangqi/game/area/detail/delete',
            data: {
                game_area_detail_id: game_area_detail_id,
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
            title: '类型',
            dataIndex: 'game_area_detail_type'
        }, {
            title: '图片',
            dataIndex: 'game_area_detail_image',
            render: (text, record, index) => (
                record.game_area_detail_image_file?
                    <div className="clearfix">
                        <img alt="example" style={{ height: '83px' }} src={constant.host + record.game_area_detail_image_file.file_original_path}/>
                    </div>:null
            )
        }, {
            title: '视频地址',
            dataIndex: 'game_area_detail_video'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.game_area_detail_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.game_area_detail_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.state.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.state.page_index,
            pageSize: this.state.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">赛区风采资料信息</div>
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
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="类型">
                                {
                                    getFieldDecorator('game_area_detail_type', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择类型">
                                            <Option key="图片" value="图片">图片</Option>
                                            <Option key="视频" value="视频">视频</Option>
                                        </Select>
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
                       rowKey="game_area_detail_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.state.list} pagination={pagination}
                       bordered/>
                <GuangqiGameAreaDetailDetail/>
            </QueueAnim>
        );
    }
}

GuangqiGameAreaDetailIndex.propTypes = {};

GuangqiGameAreaDetailIndex = Form.create({})(GuangqiGameAreaDetailIndex);

export default GuangqiGameAreaDetailIndex;
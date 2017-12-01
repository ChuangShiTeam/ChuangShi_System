import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, InputNumber, message} from 'antd';

import InputImage from '../../../component/InputImage';
import constant from '../../../util/constant';
import notification from '../../../util/notification';
import http from '../../../util/http';

class GuangqiGameAreaDetailDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            game_area_id: '',
            game_area_detail_id: '',
            game_area_detail_type: '图片',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_guangqi_game_area_detail_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                game_area_id: data.game_area_id
            });
        });

        notification.on('notification_guangqi_game_area_detail_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                game_area_id: data.game_area_id,
                game_area_detail_id: data.game_area_detail_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_game_area_detail_detail_add', this);

        notification.remove('notification_guangqi_game_area_detail_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/guangqi/game/area/detail/find',
            data: {
                game_area_detail_id: this.state.game_area_detail_id
            },
            success: function (data) {

                let game_area_detail_type = data.game_area_detail_type;
                this.setState({
                    game_area_detail_type: game_area_detail_type,
                    system_version: data.system_version
                });
                if (game_area_detail_type === '图片') {
                    let game_area_detail_image = [];
                    if (data.game_area_detail_image_file !== null) {
                        game_area_detail_image.push(data.game_area_detail_image_file);
                    }
                    this.refs.game_area_detail_image.handleSetValue(game_area_detail_image);
                }

                this.props.form.setFieldsValue({
                    game_area_detail_video: data.game_area_detail_video,
                    game_area_detail_sort: data.game_area_detail_sort
                });

            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            let game_area_detail_type = this.state.game_area_detail_type;
            if (game_area_detail_type === '图片') {
                let file_list = this.refs.game_area_detail_image.handleGetValue();
                if (file_list.length === 0) {
                    values.game_area_detail_image = '';
                } else {
                    values.game_area_detail_image = file_list[0].file_id;
                }
                values.game_area_detail_video = '';
            } else {
                values.game_area_detail_image = '';
            }

            values.game_area_detail_type = game_area_detail_type;
            values.game_area_id = this.state.game_area_id;
            values.game_area_detail_id = this.state.game_area_detail_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/guangqi/game/area/detail/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_guangqi_game_area_detail_index_load', {});

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
        let game_area_detail_type = this.state.game_area_detail_type;
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            game_area_id: '',
            game_area_detail_id: '',
            game_area_detail_type: '图片',
            system_version: ''
        });
        if (game_area_detail_type === '图片') {
            this.refs.game_area_detail_image.handleReset();
        }
        this.props.form.resetFields();
    }

    handleChangeType(value) {
        this.setState({
            game_area_detail_type: value
        })
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'赛区风采资料详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                        {
                            constant.action === 'system' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="content-search-item" label="应用名称">
                                            {
                                                getFieldDecorator('app_id', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
                                                    initialValue: ''
                                                })(
                                                    <Select allowClear placeholder="请选择应用">
                                                        {
                                                            this.props.guangqi_game_area_detail.app_list.map(function (item) {
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
                                </Row>
                                :
                                ''
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="类型">
                                    <Select placeholder="请选择类型" value={this.state.game_area_detail_type} onChange={this.handleChangeType.bind(this)}>
                                        <Option key="图片" value="图片">图片</Option>
                                        <Option key="视频" value="视频">视频</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.game_area_detail_type === '图片' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="form-item" label="图片">
                                            <InputImage name="game_area_detail_image" limit={1} aspect={90 / 60} ref="game_area_detail_image"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                :
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="form-item" label="视频地址">
                                            {
                                                getFieldDecorator('game_area_detail_video', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
                                                    initialValue: ''
                                                })(
                                                    <Input type="text" placeholder={constant.placeholder + '视频地址'} onPressEnter={this.handleSubmit.bind(this)}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="排序">
                                    {
                                        getFieldDecorator('game_area_detail_sort', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + ''} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

GuangqiGameAreaDetailDetail.propTypes = {};

GuangqiGameAreaDetailDetail = Form.create({})(GuangqiGameAreaDetailDetail);

export default GuangqiGameAreaDetailDetail;
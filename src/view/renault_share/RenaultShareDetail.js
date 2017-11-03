import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, InputNumber, message, Card, Table, Tooltip, Icon, Popconfirm} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class RenaultShareDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            page_index: 0,
            page_size: 10,
            total: 0,
            action: '',
            share_id: '',
            share_user_id: '',
            user_avatar: '',
            share_image_list: [],
            share_comment_list: [],
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_renault_share_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_renault_share_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                share_id: data.share_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_renault_share_detail_add', this);

        notification.remove('notification_renault_share_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/renault/share/find',
            data: {
                share_id: this.state.share_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }
                this.props.form.setFieldsValue({
                    user_name: data.user_name,
                    share_num: data.share_num,
                    like_num: data.like_num,
                    remark: data.remark
                });
                this.setState({
                    share_image_list: data.share_image_list,
                    share_user_id: data.share_user_id,
                    user_avatar: data.user_avatar,
                    system_version: data.system_version
                });
                this.handleLoadComment();
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleLoadComment() {
        http.request({
            url: '/' + constant.action + '/renault/share/comment/list',
            data: {
                share_id: this.state.share_id,
                page_index: this.state.page_index,
                page_size: this.state.page_size
            },
            success: function (data) {
                this.setState({
                    total: data.total,
                    share_comment_list: data.list
                });
            }.bind(this),
            complete: function () {

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
            this.handleLoadComment();
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
            this.handleLoadComment();
        }.bind(this));
    }

    handleCommentDel(comment_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/renault/share/comment/delete',
            data: {
                comment_id: comment_id,
                system_version: system_version
            },
            success: function (data) {
                message.success(constant.success);

                this.handleLoadComment();
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

            values.share_id = this.state.share_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/renault/share/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_renault_share_index_load', {});

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
            action: '',
            share_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const { TextArea } = Input;

        const columns = [{
            title: '会员昵称',
            dataIndex: 'user_name'
        }, {
            title: '会员头像',
            dataIndex: 'user_avatar',
            render: (text, record, index) => (
                text ?<span>
                  <img alt="example" style={{width: 83}} src={text} />
                </span>:null
            )
        }, {
            width: 200,
            title: '评论内容',
            dataIndex: 'remark',
            render: (text, record, index) => (
                text?<span>
                    {text.length > 15 ?
                        <span>
                            {text.substring(0, 30) + '...'}
                            <Tooltip placement="right" title={text}>
                                <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                        :text
                    }

                </span>
                    :null
            )
        },{
            title: '点赞次数',
            dataIndex: 'like_num'
        }, {
            title: '评论时间',
            dataIndex: 'system_create_time'
        }, {
            width: 50,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleCommentDel.bind(this, record.comment_id, record.system_version)}>
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
            <Modal title={'说说详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.renault_share.app_list.map(function (item) {
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
                        <h3>基本信息</h3>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="会员昵称">
                                    {
                                        getFieldDecorator('user_name', {
                                            initialValue: ''
                                        })(
                                            <Input disabled/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="会员头像">
                                    <div className="clearfix">
                                        <img alt="example" style={{ height: '200px' }}
                                             src={this.state.user_avatar}/>
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="分享数量">
                                    {
                                        getFieldDecorator('share_num', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '分享数量'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="点赞次数">
                                    {
                                        getFieldDecorator('like_num', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '点赞次数'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="说说心得">
                                    {
                                        getFieldDecorator('remark', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <TextArea rows={8} placeholder={constant.placeholder + '说说心得'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <h3>图片信息</h3>
                        <Row>
                            {
                                this.state.share_image_list.map((share_image, index) => {
                                    return (
                                        <Col span={4} key={index}>
                                            <Card bordered={false}>
                                                <div className="clearfix">
                                                    <img alt="example" style={{ height: '200px' }}
                                                         src={constant.host + share_image.file_path}/>
                                                </div>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }

                        </Row>
                        <h3>评价信息</h3>
                        <Row>
                            <Col span={24}>
                                <Table key="2"
                                       rowKey="comment_id"
                                       className="margin-top"
                                       loading={this.state.is_load} columns={columns}
                                       dataSource={this.state.share_comment_list} pagination={pagination}
                                       bordered/>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

RenaultShareDetail.propTypes = {};

RenaultShareDetail = Form.create({})(RenaultShareDetail);

export default connect(({renault_share}) => ({renault_share}))(RenaultShareDetail);
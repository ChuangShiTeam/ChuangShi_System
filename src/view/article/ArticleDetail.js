import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, Switch} from 'antd';

import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import validate from '../../util/validate';

class ArticleDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            article_id: '',
            article_is_outer_link: false,
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_article_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_article_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                article_id: data.article_id
            }, function () {
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_article_detail_add', this);

        notification.remove('notification_article_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/article/find',
            data: {
                article_id: this.state.article_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                let article_image = [];
                if (data.article_image_file !== null) {
                    article_image.push(data.article_image_file);
                }
                this.refs.article_image.handleSetValue(article_image);
                let article_is_outer_link = data.article_is_outer_link;
                this.setState({
                    article_is_outer_link: article_is_outer_link,
                    system_version: data.system_version
                });
                if (!article_is_outer_link) {
                    this.refs.article_content.handleSetValue(validate.unescapeHtml(data.article_content));
                }
                this.props.form.setFieldsValue({
                    article_category_id: data.article_category_id,
                    article_name: data.article_name,
                    article_author: data.article_author,
                    article_summary: data.article_summary,
                    article_outer_link: data.article_outer_link
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

            values.article_id = this.state.article_id;
            values.system_version = this.state.system_version;

            let file_list = this.refs.article_image.handleGetValue();
            if (file_list.length === 0) {
                values.article_image = '';
            } else {
                values.article_image = file_list[0].file_id;
            }

            let article_is_outer_link = this.state.article_is_outer_link;
            values.article_is_outer_link = article_is_outer_link;
            if (article_is_outer_link) {
                values.article_content = '';
                values.article_summary = '';
            } else {
                values.article_outer_link = '';
                values.article_content = this.refs.article_content.handleGetValue();
            }
            if (values.article_author) {
                values.article_author = '';
            }
            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/article/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_article_index_load', {});

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
        let article_is_outer_link = this.state.article_is_outer_link;
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            article_id: '',
            article_is_outer_link: false,
            system_version: ''
        });

        this.props.form.resetFields();

        this.refs.article_image.handleReset();
        if (!article_is_outer_link) {
            this.refs.article_content.handleReset();
        }
    }

    onChangeOuterLink(checked) {
        this.setState({
            article_is_outer_link: checked
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {TextArea} = Input;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'文章详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.article.app_list.map(function (item) {
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
                                }} className="form-item" label="文章名称">
                                    {
                                        getFieldDecorator('article_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '文章名称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="分类编号">
                                    {
                                        getFieldDecorator('article_category_id', {
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择分类编号">
                                                {
                                                    this.props.article.article_category_list.map(function (item) {
                                                        return (
                                                            <Option key={item.article_category_id}
                                                                    value={item.article_category_id}>{item.article_category_name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
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
                                }} className="form-item" label="文章作者">
                                    {
                                        getFieldDecorator('article_author', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '文章作者'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="文章图片">
                                    <InputImage name="article_image" limit={1} ref="article_image"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否外部链接">
                                    <Switch checked={this.state.article_is_outer_link} onChange={this.onChangeOuterLink.bind(this)} checkedChildren="是" unCheckedChildren="否"/>
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.article_is_outer_link?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="form-item" label="外部链接">
                                            {
                                                getFieldDecorator('article_outer_link', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
                                                    initialValue: ''
                                                })(
                                                    <Input type="text" placeholder={constant.placeholder + '外部链接'} onPressEnter={this.handleSubmit.bind(this)}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>:
                                <span>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 2},
                                                wrapperCol: {span: 22}
                                            }} className="form-item" label="文章摘要">
                                                {
                                                    getFieldDecorator('article_summary', {
                                                        initialValue: ''
                                                    })(
                                                        <TextArea rows={4} placeholder={constant.placeholder + '文章摘要'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                            }} className="form-item" label="文章内容">
                                                <InputHtml name="article_content" ref="article_content"/>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </span>
                        }
                    </form>
                </Spin>
            </Modal>
        );
    }
}

ArticleDetail.propTypes = {};

ArticleDetail = Form.create({})(ArticleDetail);

export default connect(({article}) => ({article}))(ArticleDetail);
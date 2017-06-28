import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, message} from 'antd';

import ImageHelp from './ImageHelp';
import constant from '../util/constant';
import notification from '../util/notification';

class InputImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_preview: false,
            image: '',
            list: []
        }
    }

    componentDidMount() {
        notification.on('notification_image_help_' + this.props.name + '_Submit', this, function (data) {
            var array = this.state.list;

            for (var i = 0; i < data.length; i++) {
                var isNotExit = true;

                for (var k = 0; k < this.state.list.length; k++) {
                    if (data[i].file_path === this.state.list[k].file_path) {
                        isNotExit = false;

                        break;
                    }
                }

                if (isNotExit) {
                    if (array.length < this.props.limit) {
                        array.push(data[i]);
                    }
                }
            }

            this.setState({
                list: array
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_image_help_' + this.props.name + '_Submit', this);
    }

    handleGetValue() {
        return this.state.list;
    }

    handleSetValue(data) {
        var array = [];

        for (var i = 0; i < data.length; i++) {
            array.push({
                file_id: data[i].file_id,
                file_path: data[i].file_path,
                status: false
            });
        }

        this.setState({
            list: array
        });
    }

    handleBeforeUpload(file) {
        var result = true;

        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {

        } else {
            message.error('图片格式不对');

            result = false;
        }

        if (file.size > 1024 * 1024 * 2) {
            message.error('图片大小超过2M');

            result = false;
        }

        return result;
    }

    handleCancel() {
        this.setState({
            is_preview: false
        });
    }

    handlePreview(file_id) {
        var file_path = '';
        for (var i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i].file_id === file_id) {
                file_path = this.state.list[i].file_path;
            }
        }

        this.setState({
            image: constant.host + file_path,
            is_preview: true
        });
    }

    handleDelete(file_id) {
        var index = -1;
        var list = this.state.list;

        for (var i = 0; i < list.length; i++) {
            if (list[i].file_id === file_id) {
                index = i;
            }
        }

        list.splice(index, 1);

        this.setState({
            list: list
        });
    }

    handleAdd() {
        notification.emit('notification_image_help_' + this.props.name + '_show', {});
    }

    handleMouseOver(file_id) {
        var list = [];

        for (var i = 0; i < this.state.list.length; i++) {
            var item = this.state.list[i];

            list.push({
                file_id: item.file_id,
                file_path: item.file_path,
                status: item.file_id === file_id
            });
        }

        this.setState({
            list: list
        });
    }

    handleMouseOut(file_id) {
        var list = [];

        for (var i = 0; i < this.state.list.length; i++) {
            var item = this.state.list[i];

            list.push({
                file_id: item.file_id,
                file_path: item.file_path,
                status: false
            });
        }

        this.setState({
            list: list
        });
    }

    handleReset() {
        this.setState({
            is_preview: false,
            image: '',
            list: []
        });
    }

    render() {

        return (
            <div>
                {
                    this.state.list.map(function (item) {
                        const mask = item.status ? "item-mask item-mask-active" : "item-mask";
                        return (
                            <div key={item.file_id} className="item">
                                <div className="item-image"
                                     style={{backgroundImage: 'url(' + constant.host + item.file_path + ')'}}></div>
                                <div onMouseOver={this.handleMouseOver.bind(this, item.file_id)}
                                     onMouseOut={this.handleMouseOut.bind(this)}>
                                    <div className={mask}></div>
                                    <i className="anticon anticon-eye-o item-preview-icon"
                                       style={{display: item.status ? 'inline' : 'none'}}
                                       onClick={this.handlePreview.bind(this, item.file_id)}/>
                                    <i className="anticon anticon-delete item-remove-icon"
                                       style={{display: item.status ? 'inline' : 'none'}}
                                       onClick={this.handleDelete.bind(this, item.file_id)}/>
                                </div>
                            </div>
                        )
                    }.bind(this))
                }
                {
                    this.state.list.length < this.props.limit ?
                        <div className="button" onClick={this.handleAdd.bind(this)}>
                            <i className="anticon anticon-plus button-icon"/>
                            <div className="ant-upload-text button-text">添加图片</div>
                        </div>
                        :
                        ''
                }
                <Modal visible={this.state.is_preview} footer={null} onCancel={this.handleCancel.bind(this)}>
                    <img alt="example" style={{width: '100%'}} src={this.state.image}/>
                </Modal>
                <ImageHelp name={this.props.name} type={this.props.type} limit={this.props.limit} ref="image"/>
            </div>
        );
    }
}

InputImage.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    limit: PropTypes.number
};

InputImage.defaultProps = {
    type: '',
    limit: 0
};

export default InputImage;

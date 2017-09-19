import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, message, Upload, Icon} from 'antd';

import constant from '../util/constant';
import storage from '../util/storage';

class FileUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			fileList: []
		}
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	handleGetValue() {
		return this.state.fileList;
	}

	handleSetValue(data) {
		let array = [];
		for (let i = 0; i < data.length; i++) {
			array.push({
				file_id: data[i].file_id,
				file_path: data[i].file_path,
				status: false
			});
		}

		this.setState({
			fileList: array
		});
	}

	handleBeforeUpload = (file) => {
		console.log('file', file);
		if (!(this.props.limit === 0) && this.props.limit <= this.state.fileList.length) {
			message.error('文件数量超过限制');
			return false;
		}

		if (file.size > 1024 * 1024 * 2) {
			message.error('文件大小超过2M');

			return false;
		}

		return true;
	};

	handleChange = (info) => {
		let fileList = info.fileList;

		if (info.file.status === 'done') {
			if (info.file.response.code === 200) {
				message.success(constant.success);
				fileList = fileList.map((file) => {
					if (file.response) {
						file.url = file.response.data.file_path;
					}
					return file;
				});

				fileList = fileList.filter((file) => {
					if (file.response) {
						return file.response.code === 200;
					}
					return true;
				});
			} else {
				message.error(info.file.response.message);
			}

			this.setState({
				is_load: false
			});
		} else if (info.file.status === 'uploading') {
			this.setState({
				is_load: true
			});
		} else if (info.file.status === 'error') {
			message.error(info.file.name + ' file upload failed');
		}

		this.setState({ fileList });
	}

	render() {
		const props = {
			name: 'file',
			multiple: true,
			action: constant.host + '/file/admin/upload',
			accept: this.props.type,
			headers: {
				'app_id': constant.app_id,
				'token': storage.getToken(),
				'platform': constant.platform,
				'version': constant.version
			},
			onChange: this.handleChange.bind(this),
			beforeUpload: this.handleBeforeUpload,
			disabled: this.props.limit === 0?false:(this.props.limit <= this.state.fileList.length?true:false),
			fileList: this.state.fileList
		};

		return (
			<Upload {...props}>
				<Button loading={this.state.is_load}>
					<Icon type="upload" /> 上传
				</Button>
			</Upload>
		);
	}
}

FileUpload.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string,
	limit: PropTypes.number.isRequired
};

FileUpload.defaultProps = {
	type: '',
	limit: 0
};

export default FileUpload;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TinyMCE from 'react-tinymce';

import ImageHelp from './ImageHelp'
import constant from '../util/constant';
import notification from '../util/notification';
import {compress} from '../util/function';

let htmlEditor;

class InputHtml extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount() {
    notification.on('notification_image_help_' + this.props.name + '_Submit', this, function (data) {
      let html = '';

      for (let i = 0; i < data.length; i++) {
        html += '<img src="' + constant.host + data[i].file_path + '" />';
      }

      htmlEditor.insertContent(html);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_image_help_' + this.props.name + '_Submit', this);

    htmlEditor.remove();
  }

  handleSetValue(content) {
    htmlEditor.setContent(content);
  }

  handleGetValue() {
    return compress(htmlEditor.getContent());
  }

  handleReset() {
    this.handleSetValue("");
  }

  render() {

    return (
      <div>
        <TinyMCE
          config={{
            menubar: false,
            border_width: 1,
            convert_urls: false,
            statusbar: false,
            elementpath: false,
            visual: false,
            keep_values: false,
            show_system_default_font: false,
            forced_root_block: 'div',
            plugins: 'code image imagetools autoresize media preview',
            imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
            toolbar: 'fontselect fontsizeselect | bold italic underline strikethrough removeformat | alignleft aligncenter alignright | media | mybutton image | code | preview',
            setup: function (editor) {
              htmlEditor = editor;

              editor.addButton('mybutton', {
                icon: 'mce-ico mce-i-browse',
                tooltip: 'Insert image',
                onclick: function () {
                  notification.emit('notification_image_help_' + this.props.name + '_show', {});
                }.bind(this)
              });
            }.bind(this)
          }}
        />
        <ImageHelp name={this.props.name} type={'original'} limit={0} aspect={0} ref="image"/>
      </div>
    );
  }
}

InputHtml.propTypes = {
  name: PropTypes.string.isRequired
};

export default InputHtml;

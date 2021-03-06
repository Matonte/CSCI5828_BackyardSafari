import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import React, {Component} from 'react';

// semantic-ui
import { Container, Form, Input, Button, Grid } from 'semantic-ui-react'

// alert
import Alert from 'react-s-alert';

// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'

 
class ImageUpload extends Component {

  constructor() {
   super();
    this.state = {
      data_uri: null,
      processing: false
    }
  }

  handleSubmit(e)
  {
    e.preventDefault();
    const _this = this;

    this.setState({
      processing: true
    });

    //FIXME - Need to add user ID here too
    const { data_uri, filename, filetype } = this.state
    const params = {
      data_uri: data_uri,
      filename: filename,
      filtype: filetype
    }

    // Upload picture
    MyAPI.upload_image(params)
    .then((data) =>
    {
      return new Promise((resolve, reject) =>
      {
        if (data.status !== 'success')
        {
          let error_text = 'Error';
          if (data.detail)
          {
            error_text = data.detail
          }
          reject(error_text)

        }
        else
        {
          // success
        }
      })
    })
    .then(() => {
      // redirect
      this.props.history.push("/dashboard")
    })
    .catch((err) => {
      console.log("err:", err)

      Alert.error(err, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
   })
  }

  render() {
    let processing;
  let uploaded;

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
          <img className='image-preview' src={this.state.data_uri} />
          <pre className='image-link-box'>{this.state.data_uri}</pre>
          //<img className='image-preview' src={this.state.uploaded_uri} />
          //<pre className='image-link-box'>{this.state.uploaded_uri}</pre>
        </div>
      );
    }

    if (this.state.processing) {
      processing = "Processing image, hang tight";
    }

    return (
      <div className='row'>
        <div className='col-sm-12'>
          <label>Upload an image</label>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <input type="file" onChange={this.handleFile} />
            <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Upload" />
            {processing}
          </form>
          {uploaded}
        </div>
      </div>
    );
  }
}

export default ImageUpload;

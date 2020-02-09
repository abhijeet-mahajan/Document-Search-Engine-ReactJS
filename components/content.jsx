//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Content extends React.Component {

  /** called with properties:
   *  app: An instance of the overall app.  Note that props.app.ws
   *       will return an instance of the web services wrapper and
   *       props.app.setContentName(name) will set name of document
   *       in content tab to name and switch to content tab.
   *  name:Name of document to be displayed.
   */
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      error: ""
    }
  }

  componentDidMount() {
    this.sendGetContentCall();
  }

  componentDidUpdate() {
    this.sendGetContentCall();
  }

  static async getContentData(WS, sContentName) {
    try {
      let oContentData = await WS.getContent(sContentName);
      return {content: oContentData.content};
    } catch (e) {
      let sErrorMessage = e.message;
      return {error: sErrorMessage};
    }
  }

  async sendGetContentCall (){
    let App = this.props.app;
    let WS = App.ws;
    let sContentName = App.state.contentName;
    let oContentData = await Content.getContentData(WS, sContentName);
    if (oContentData.error) {
      this.setState({error: oContentData.errorMessage});
    } else {
      this.setState({content: oContentData.content});
    }
  }

  render() {
    let App = this.props.app;
    let fileName = App.state.contentName;

    return (
      <section>
        <h1>{fileName}</h1>
        <pre>
          {this.state.content}
        </pre>
        <span className="error">{this.state.error}</span>
      </section>
    );
  }

}

module.exports = Content;

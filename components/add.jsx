//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Add extends React.Component {

  /** called with properties:
   *  app: An instance of the overall app.  Note that props.app.ws
   *       will return an instance of the web services wrapper and
   *       props.app.setContentName(name) will set name of document
   *       in content tab to name and switch to content tab.
   */
  constructor(props) {
    super(props);

    this.state = {
      error: ""
    }

    this.addFile = this.addFile.bind(this);
  }

  async addFile() {
    try {
      let fileData = document.getElementById("fileUpload").files[0];
      let fileString = await readFile(fileData);
      let fileName = fileData.name;
      await this.props.app.ws.addContent(fileName, fileString);
      this.props.app.setContentName(fileName);
    } catch (e) {
      let error = e.message;
      this.setState({
        error: error,
      });
    }
  };

  render() {
    return (
      <div className="tab-content">
        <form onChange={this.addFile}>
          <label className="label">Choose File:
            <input id="fileUpload" className="control" type="file"/>
          </label>
          <div className="error">{this.state.error}</div>
        </form>
      </div>
    );
  }

}

module.exports = Add;

/** Return contents of file (of type File) read from user's computer.
 *  The file argument is a file object corresponding to a <input
 *  type="file"/>
 */
async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  });
}

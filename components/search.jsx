//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Search extends React.Component {

  /** called with properties:
   *  app: An instance of the overall app.  Note that props.app.ws
   *       will return an instance of the web services wrapper and
   *       props.app.setContentName(name) will set name of document
   *       in content tab to name and switch to content tab.
   */
  constructor(props) {
    super(props);

    this.state = {
      searchKey: "",
      userKey: "",
      results: [],
      error: "",
    };

    this.searchInputChange = this.searchInputChange.bind(this);
    this.searchInputBlur = this.searchInputBlur.bind(this);
    this.setContentNameLocal = this.setContentNameLocal.bind(this);
  }

  searchInputChange(e) {
    let sSearchKey = e.target.value;
    this.setState({
      userKey: sSearchKey
    });
  }

  async searchInputBlur() {

    try {
      let oSearchResults = await this.props.app.ws.searchDocs(this.state.userKey, 0);
      let oToSet = {
        results: oSearchResults.results,
        searchKey: this.state.userKey
      };
      this.setState(oToSet);
    } catch (e) {
      let error = e.message;
      this.setState({
        error: error,
        results: [],
        searchKey: this.state.userKey
      });
    }
  }

  setContentNameLocal(sDocName) {
    this.props.app.setContentName(sDocName);
  }

  getSearchResults() {
    let _this = this;
    let results = this.state.results;
    if (!results.length) {
      return null;
    }

    return results.map(function (data) {
      let lines = data.lines.map(function (line, i) {
        return <span className="doc-line" key={i + 1000}>{line}</span>;
      });

      return (
        <div className="result">
          <a className="result-name" onClick={_this.setContentNameLocal.bind(_this, data.name)}>{data.name}</a>
          <br/>
          {lines}
        </div>);
    });
  }

  render() {

    let searchResults = this.getSearchResults();
    return (
      <div className="tab-content">
        <form>
          <label>
            <span className="label">Search Terms:</span>
            <span className="control">
              <input id="q" name="q" value={this.state.userKey}
                     onBlur={this.searchInputBlur}
                     onChange={this.searchInputChange}/><br/>
            </span>
          </label>
        </form>
        <div>
          {searchResults}
        </div>
        <span className="error">{this.state.error}</span>
      </div>);
  }

}

module.exports = Search;

import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import range from 'lodash/range'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headers: range(10).map(entry => 'header'),
      rows: range(10).map(row => range(10).map(entry => 'hey')),
      editing: null, // null or [x, y]
    }
  }

  edit(x, y) {
    this.setState({editing: [x, y]}, () => this.editingOtherEntry = false)
  }

  cancelEdit() {
    this.setState({editing: null})
  }

  currentlyEditing(x, y) {
    return Array.isArray(this.state.editing) && this.state.editing[0] === x && this.state.editing[1] === y
  }

  updateEntry(x, y, value) {
    this.setState({rows: this.state.rows.map((row, j) => row.map((entry, i) => i === x && j === y ? value : entry))})
  }

  render() {
    return (
      <div>
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              {this.state.headers.map((header, i) => (<th key={i}>{header}</th>))}
            </tr>
          </thead>
          <tbody>
            {this.state.rows.map((row, j) => (
              <tr key={j}>
                {row.map((entry, i) => (
                  <td
                    key={i}
                    onMouseUp={() => this.edit(i, j)}
                    className="col-xs-1"
                    style={Object.assign({position: 'relative'}, this.currentlyEditing(i, j) ? {padding: 0} : {})}>
                    {this.currentlyEditing(i, j)
                      ? <InputEntry handleUpdate={(value) => this.updateEntry(i, j, value)} handleBlur={() => this.cancelEdit()} />
                      : entry
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}


class InputEntry extends Component {
  componentDidMount() {
    this.refs.input.focus()
  }

  handleSubmit(e, value) {
    e.preventDefault()
    if (value.trim()) {
      this.props.handleUpdate(value.trim())
    }
  }

  render() {
    return (
      <form 
        onSubmit={e => this.handleSubmit(e, this.refs.input.value)}
        style={{position: 'absolute', top: 0, bottom: 0}}>
        <input
          className="form-control"
          ref="input"
          onBlur={this.props.handleBlur}
          style={{height: '100%'}} />
      </form>
    )
  }
}

InputEntry.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
}


render(<App />, document.querySelector('#root'))

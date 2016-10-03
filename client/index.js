import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import range from 'lodash/range'
const socket = io()


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headers: range(10).map(entry => 'header'),
      rows: range(10).map(row => range(10).map(entry => '')),
      editing: null, // null or [x, y]
    }
  }

  componentWillMount() {
    socket.on('receiveRows', rows => this.setState({rows}))
  }

  edit(x, y) {
    this.setState({editing: [x, y]}, () => socket.emit('sendRows', this.state.rows))
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
              {[<th className="col-xs-1"></th>]
                .concat(this.state.headers.map((header, i) =>
                  <th key={i} className="col-xs-1" style={{background: '#aaa'}}>
                    {String.fromCharCode(i + 'A'.charCodeAt(0))}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {this.state.rows.map((row, j) => (
              <tr key={j}>
                {[<td className="col-xs-1" style={{background: '#aaa', fontWeight: 'bold'}}>
                    {j + 1}
                  </td>].concat(row.map((entry, i) =>
                    <td
                      key={i}
                      onMouseUp={() => this.edit(i, j)}
                      className="col-xs-1"
                      style={Object.assign(
                        {position: 'relative'},
                        this.currentlyEditing(i, j) ? {padding: 0} : {}
                      )}>
                      {this.currentlyEditing(i, j)
                        ? <InputEntry
                            defaultValue={entry}
                            handleUpdate={(value) => this.updateEntry(i, j, value)}
                            handleBlur={() => this.cancelEdit()} />
                        : entry || <br />
                      }
                    </td>))
                }
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
    this.props.handleUpdate(value)
  }

  render() {
    return (
      <form 
        onSubmit={e => this.handleSubmit(e, this.refs.input.value)}
        style={{position: 'absolute', top: 0, bottom: 0}}>
        <input
          className="form-control"
          defaultValue={this.props.defaultValue}
          ref="input"
          onBlur={() => {
            this.props.handleUpdate(this.refs.input.value)
            this.props.handleBlur()
          }}
          style={{height: '100%'}} />
      </form>
    )
  }
}

InputEntry.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
}


render(<App />, document.querySelector('#root'))

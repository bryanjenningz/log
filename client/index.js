import React, {Component} from 'react'
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

  render() {
    return (
      <div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              {this.state.headers.map((header, i) => (<th key={i}>{header}</th>))}
            </tr>
          </thead>
          <tbody>
            {this.state.rows.map((row, j) => (
              <tr key={j}>
                {row.map((entry, i) => (
                  <td key={i} onMouseUp={() => this.edit(i, j)}>
                    {Array.isArray(this.state.editing) && this.state.editing[0] === i && this.state.editing[1] === j
                      ? <InputEntry onBlur={() => this.cancelEdit()} />
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

  render() {
    return (
      <input ref="input" onBlur={this.props.onBlur} />
    )
  }
}


render(<App />, document.querySelector('#root'))

import { Component } from 'react'

// Shows the error on screen instead of a blank page (useful while building)
export default class ErrorBoundary extends Component {
  state = { error: null, stack: '' }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ stack: info.componentStack || '' })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4">
          <h1 className="text-xl font-bold text-red-800">Something went wrong</h1>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-red-50 p-3 text-sm text-red-900">
            {String(this.state.error)}
          </pre>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-slate-100 p-3 text-xs text-slate-700">
            {this.state.stack.split('\n').slice(0, 8).join('\n')}
          </pre>
          <p className="mt-3 text-sm text-slate-600">
            Take a screenshot of this message and share it.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
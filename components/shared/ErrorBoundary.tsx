"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Section render error:", error.message)
    // Report to Sentry if available — dynamic import so it doesn't block render
    import("@sentry/nextjs")
      .then(({ captureException }) => captureException(error, { extra: { errorInfo } }))
      .catch(() => {})
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
          <p className="text-grey font-medium">Something went wrong loading this section.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            className="px-5 py-2 rounded-full border border-slate-200 text-sm text-grey hover:border-brand hover:text-brand transition-colors"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class InstagramErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Error is handled by showing the fallback UI
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-8 text-center">
          <p className="text-gray-500">Unable to load Instagram feed</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default InstagramErrorBoundary;

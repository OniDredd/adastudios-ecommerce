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
    console.error('Instagram Feed Error:', error);
    console.error('Error Info:', errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-8 text-center">
          <p className="text-gray-500 mb-2">Unable to load Instagram feed</p>
          <p className="text-sm text-gray-400">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default InstagramErrorBoundary;

import React from "react";
import { HiXCircle } from "react-icons/hi";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, data: unknown) {
    // Report to Sentry or whatever
    console.error(error, data);
  }

  render() {
    if (this.state.hasError)
      return (
        <div className="rounded-md bg-red-50 p-4 select-none">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiXCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-red-700">
                Something went wrong.{" "}
                <span
                  className="font-medium text-red-800 underline cursor-pointer"
                  onClick={() => this.setState({ hasError: false })}
                >
                  Try again
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    return this.props.children;
  }
}

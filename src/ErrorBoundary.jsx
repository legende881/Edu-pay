import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#FEF2F2', color: '#991B1B', fontFamily: 'sans-serif', height: '100vh' }}>
          <h2>Oups, une erreur est survenue !</h2>
          <p>L'application n'a pas pu se charger correctement.</p>
          <pre style={{ background: '#FEE2E2', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

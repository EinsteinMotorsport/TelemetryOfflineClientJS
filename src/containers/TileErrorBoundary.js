import React from 'react'

class TileErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        console.log("hä")
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
      }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true })
        // You can also log the error to an error reporting service
        //console.error('Error in Tile', error, info);
        console.log("hä2")
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <>
                <h1>Something went wrong.</h1>
                <button onClick={() => this.setState({
                    hasError: false
                })}>Retry</button>
            </>
        }
        return this.props.children
    }
}

export default TileErrorBoundary

import React from 'react'

class TileErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
      }

    componentDidCatch(error, info) {
        console.error('Error in Tile', error, info)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <>
                <div>An Error occured in this Tile</div>
                <button onClick={() => this.setState({
                    hasError: false
                })}>Retry</button>
            </>
        }
        return this.props.children
    }
}

export default TileErrorBoundary

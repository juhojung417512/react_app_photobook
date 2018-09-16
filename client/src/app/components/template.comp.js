import React from "react"

export default class App extends React.Component {
	render() {
		return (
			<div className="App">
				{this.props.children}
				{/* <LoadingBar /> */}
			</div>
		);
	}
}
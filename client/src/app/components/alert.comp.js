import React, {
    Component
} from 'react';
import {
    hot
} from 'react-hot-loader'

@hot(module)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            isAlert : true,
            timeup : null
        };
    }

    componentDidMount(){
        let timeup = setTimeout(()=>{
            this.setState({
                isAlert : false
            })
            this.props.closeAlert()
        }, 20000)
        this.setState({
            timeup : timeup
        })
    }

    onClickConfirm = ()=>{
        this.props.closeAlert()
        clearTimeout(this.state.timeup)
        this.setState({
            isAlert : false,
            timeup : null
        })
    }

    

    componentWillReceiveProps(nProps){
    }

    render() {
        return (
            <div>
                {this.state.isAlert ? <div className="alert">
                    {this.props.msg}
                    <div className="confirm-button" onClcik={this.onClickConfirm}>확인</div>
                </div> : null}
            </div>
            
        );
    }
}
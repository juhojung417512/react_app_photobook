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
            nowType : null,
            activeStyle : {borderBottom: '10px solid #EFF1F7',backgroundColor: '#5ACCF3', color:'white'},
            deactiveStyle : {borderBottom: '10px solid #EFF1F7', color:'black'},
            photoList : null
        };
    }

    componentDidMount(){
        this.setState({
            photoList : this.props.photoList,
            nowType: 'Template'
        })
    }

    componentWillReceiveProps(nProps){
        // if(this.state.photoList !== nProps.photo.props.photoList){
        //     this.setState({
        //         nowType: 'Photo',
        //         photoList : nProps.photo.props.photoList
        //     })
        // }

        if(this.state.nowType !== this.props.state){
            switch(this.props.state){
                case 'Photo':
                    this.setState({
                        nowType: 'Photo'
                    })
                    break
                case 'Template':
                    this.setState({
                        nowType: 'Template'
                    })
                    break
                case 'Sticker':
                    this.setState({
                        nowType: 'Sticker'
                    })
                    break
                default:
                    this.setState({
                        nowType: 'Template'
                    })
                    break
            }
        }
    }

    onClickTopItem = (type) =>{
        this.props.setType(type)
        this.setState({
            nowType : type
        })
    }

    render() {
        return (
            <div className="divider">
                <div className="top">
                    <div className="top-item" style={this.state.nowType === 'Photo'? this.state.activeStyle : this.state.deactiveStyle} 
                        onClick={this.onClickTopItem.bind(this,'Photo')}>
                        <img alt="divider_img" src={this.state.nowType ==='Photo' ? require('../resources/icon_photo_on.png') 
                        : require('../resources/icon_photo_off.png') }/>사진</div>
                    <div className="top-item" style={this.state.nowType === 'Template'? this.state.activeStyle : this.state.deactiveStyle} 
                        onClick={this.onClickTopItem.bind(this,'Template')}>
                        <img alt="divider_img" src={this.state.nowType === 'Template' ? require('../resources/icon_template_on.png')
                        : require('../resources/icon_template_off.png')}/>템플릿</div>
                    <div className="top-item" style={this.state.nowType === 'Sticker'? this.state.activeStyle : this.state.deactiveStyle} 
                        onClick={this.onClickTopItem.bind(this,'Sticker')}>
                        <img alt="divider_img" src={this.state.nowType ==='Sticker' ? require('../resources/icon_sticker_on.png') 
                        : require('../resources/icon_sticker_off.png')}/>스티커</div>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
            
        );
    }
}
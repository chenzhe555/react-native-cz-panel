import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Animated, PanResponder, FlatList} from 'react-native';

export default class CZPanel extends Component{
    ShowType = {
        SwitchButton: 1,
        ShowAll: 2
    };

    SwitchButtonWidthHeight = 60;

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        let originRef = this;
        console.log = (function (originFunc) {
            return function (info) {
                if (originRef.consoles) {
                    if (typeof info == 'string' && info.length > 0) originRef.consoles.push(info);
                } else {
                    originRef.consoles = [];
                }
                originFunc.call(console, info);
            }
        })(console.log);
        console.log('');
        this.SCREENW = Dimensions.get('window').width;
        this.SCREENH = Dimensions.get('window').height;

        this.state = {
            width: new Animated.Value(this.SwitchButtonWidthHeight),
            height: new Animated.Value(this.SwitchButtonWidthHeight),
            left: new Animated.Value(this.SwitchButtonWidthHeight/2),
            top: new Animated.Value(this.SwitchButtonWidthHeight/2),
            radius: new Animated.Value(this.SwitchButtonWidthHeight/2),
            showType: this.ShowType.SwitchButton
        }
        this.createSwitchButtonGesture();
        this.isScroll = false;
        this.switchButtonViewLeft = this.SwitchButtonWidthHeight/2;
        this.switchButtonViewTop = this.SwitchButtonWidthHeight/2;
    }
    /************************** 继承方法 **************************/
    /************************** 通知 **************************/
    /************************** 创建视图 **************************/
    /************************** 网络请求 **************************/
    /************************** 自定义方法 **************************/

    generateSwitchButtonView() {
        const { width, height, left, top, radius } = this.state;

        return (
            <Animated.View ref='switchButtonView' {...this._switchButtonPanResponder.panHandlers} style={[styles.SwitchButtonView, styles.CenterStyle, {width: width, height: height, left: left, top: top, borderRadius: radius}]}>
                <Image source={require('./images/pikaqiu_icon.jpeg')} style={{width: 40, height: 40, borderRadius: 20}}/>
            </Animated.View>
        );
    }

    generatePanelView() {
        const { width, height, left, top, radius } = this.state;
        const { consoles } = this;
        return (
            <Animated.View style={[styles.PanelView, {width: width, height: height, left: left, top: top, borderRadius: radius}]}>
                <View style={[styles.PanelTopView]}>
                    <TouchableOpacity onPress={this._closePanelView.bind(this)}>
                        <View style={[styles.CenterStyle, {width: 60, height: 60, marginRight: 10}]}>
                            <Image source={require('./images/exit_icon.png')} style={{width: 26, height: 26}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{flex: 1}]}>
                    <FlatList
                        style={[{flex: 1}]}
                        data={consoles}
                        renderItem={this._renderConsoleItem.bind(this)}
                    />
                </View>
            </Animated.View>
        );
    }

    createSwitchButtonGesture() {
        //https://reactnative.cn/docs/0.51/panresponder/
        this._switchButtonPanResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
            onPanResponderGrant: (evt, gestureState) => {
                console.log('裴雪阳');
                console.log('杨新宇');
                this.isClicked = true;
            },
            // 最近一次的移动距离为gestureState.move{X,Y}
            // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx < 5 && gestureState.dx > -5 && gestureState.dy < 5 && gestureState.dy > -5) {
                    this.isClicked = true;
                } else {
                    this.isClicked = false;
                    let left = this.switchButtonViewLeft + gestureState.dx;
                    let top = this.switchButtonViewTop + gestureState.dy;
                    this.refs.switchButtonView.setNativeProps({
                        left: left <= 0 ? 0 : left,
                        top: top <= 0 ? 0 : top
                    });
                }
            },
            // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
            // 一般来说这意味着一个手势操作已经成功完成。
            onPanResponderRelease: (evt, gestureState) => {
                if (this.isClicked) {
                    this._clickSwitchButton();
                } else {
                    this.switchButtonViewLeft += gestureState.dx;
                    this.switchButtonViewTop += gestureState.dy;
                }
            }
        });
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /************************** List相关方法 **************************/
    _renderConsoleItem(item) {
        return (
            <View>
                <Text style={[{fontSize: 19, color: 'red'}]}>{item.item}</Text>
            </View>
        )
    }
    /************************** Render中方法 **************************/
    _clickSwitchButton() {
        const { SCREENW, SCREENH } = this;
        Animated.parallel([
            Animated.timing(this.state.width,{toValue: SCREENW,duration: 300}),
            Animated.timing(this.state.height,{toValue: SCREENH,duration: 300}),
            Animated.timing(this.state.left,{toValue: 0,duration: 300}),
            Animated.timing(this.state.top,{toValue: 0,duration: 300}),
            Animated.timing(this.state.radius,{toValue: 0,duration: 300})
        ]).start( () => {
            this.setState({
                showType: this.ShowType.ShowAll
            });
        });
    }

    _closePanelView() {
        Animated.parallel([
            Animated.timing(this.state.width,{toValue: this.SwitchButtonWidthHeight,duration: 300}),
            Animated.timing(this.state.height,{toValue: this.SwitchButtonWidthHeight,duration: 300}),
            Animated.timing(this.state.left,{toValue: this.switchButtonViewLeft,duration: 300}),
            Animated.timing(this.state.top,{toValue: this.switchButtonViewTop,duration: 300}),
            Animated.timing(this.state.radius,{toValue: this.SwitchButtonWidthHeight/2,duration: 300})
        ]).start( () => {
            this.setState({
                showType: this.ShowType.SwitchButton
            });
        });
    }


    render() {
        const { showType } = this.state;

        let contentView = null;
        if (showType == this.ShowType.SwitchButton) {
            contentView = this.generateSwitchButtonView();
        } else {
            contentView = this.generatePanelView();
        }

        return (
            <View style={[styles.MainView]}>
                {contentView}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainView: {
        position: 'absolute',
        zIndex: 10000,
        backgroundColor: 'red',
        width: 0,
        height: 0
    },

    SwitchButtonView: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    PanelView: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    PanelTopView: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    CenterStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})


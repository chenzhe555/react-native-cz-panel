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

        //重写console.log方法，只存储字符串相关信息
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

        //赋值初始值
        this.SCREENW = Dimensions.get('window').width;
        this.SCREENH = Dimensions.get('window').height;
        //开关按钮x
        this.switchButtonViewLeft = this.SwitchButtonWidthHeight/2;
        //开关按钮y
        this.switchButtonViewTop = this.SwitchButtonWidthHeight/2;
        this.state = {
            width: new Animated.Value(this.SwitchButtonWidthHeight),
            height: new Animated.Value(this.SwitchButtonWidthHeight),
            left: new Animated.Value(this.SwitchButtonWidthHeight/2),
            top: new Animated.Value(this.SwitchButtonWidthHeight/2),
            radius: new Animated.Value(this.SwitchButtonWidthHeight/2),
            showType: this.ShowType.SwitchButton
        }

        //创建手势响应事件
        this.createPanGesture();
    }
    /************************** 继承方法 **************************/
    /************************** 通知 **************************/
    /************************** 创建视图 **************************/
    /************************** 网络请求 **************************/
    /************************** 自定义方法 **************************/

    //创建手势响应事件
    createPanGesture() {
        //https://reactnative.cn/docs/0.51/panresponder/
        this._switchButtonPanResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onPanResponderGrant: this._onPanResponderGrant.bind(this),
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease: this._onPanResponderRelease.bind(this)
        });
    }

    // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
    _onPanResponderGrant(evt, gestureState) {
        if (this.state.showType == this.ShowType.SwitchButton) {
            console.log('裴雪阳');
            console.log('杨新宇');
            this.isClicked = true;
        }
    }

    // 最近一次的移动距离为gestureState.move{X,Y}
    // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
    _onPanResponderMove(evt, gestureState) {
        if (this.state.showType == this.ShowType.SwitchButton) {
            if (gestureState.dx < 5 && gestureState.dx > -5 && gestureState.dy < 5 && gestureState.dy > -5) {
                this.isClicked = true;
            } else {
                this.isClicked = false;
                //考虑部分边界条件，可不处理
                let left = this.switchButtonViewLeft + gestureState.dx;
                let top = this.switchButtonViewTop + gestureState.dy;
                //setState卡顿，效果不好，直接调用setNativeProps修改样式
                this.refs.mainContentView.setNativeProps({
                    left: left <= 0 ? 0 : left,
                    top: top <= 0 ? 0 : top
                });
            }
        }
    }

    // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
    // 一般来说这意味着一个手势操作已经成功完成。
    _onPanResponderRelease(evt, gestureState) {
        if (this.state.showType == this.ShowType.SwitchButton) {
            if (this.isClicked) {
                this._clickSwitchButton();
            } else {
                this.switchButtonViewLeft += gestureState.dx;
                this.switchButtonViewTop += gestureState.dy;
            }
        }
    }

    //生成开关按钮视图
    generateSwitchButtonView() {
        return (
            <View style={[styles.CenterStyle, styles.SwitchButtonView]}>
                <Image source={require('./images/pikaqiu_icon.jpeg')} style={{width: 40, height: 40, borderRadius: 20}}/>
            </View>
        );
    }

    generatePanelView() {
        const { consoles } = this;
        return (
            <View style={[styles.PanelView]}>
                <View style={[styles.PanelTopView]}>
                    <TouchableOpacity onPress={this._closePanelView.bind(this)} style={[{marginRight: 10}]}>
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
            </View>
        );
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
            Animated.timing(this.state.width,{toValue: SCREENW,duration: 400}),
            Animated.timing(this.state.height,{toValue: SCREENH,duration: 400}),
            Animated.timing(this.state.left,{toValue: 0,duration: 400}),
            Animated.timing(this.state.top,{toValue: 0,duration: 400}),
            Animated.timing(this.state.radius,{toValue: 0,duration: 400})
        ]).start( () => {
            this.setState({
                showType: this.ShowType.ShowAll
            });
        });
    }

    _closePanelView() {
        Animated.parallel([
            Animated.timing(this.state.width,{toValue: this.SwitchButtonWidthHeight,duration: 100}),
            Animated.timing(this.state.height,{toValue: this.SwitchButtonWidthHeight,duration: 100}),
            Animated.timing(this.state.left,{toValue: this.switchButtonViewLeft,duration: 100}),
            Animated.timing(this.state.top,{toValue: this.switchButtonViewTop,duration: 100}),
            Animated.timing(this.state.radius,{toValue: this.SwitchButtonWidthHeight/2,duration: 100})
        ]).start( () => {
            this.setState({
                showType: this.ShowType.SwitchButton
            });
        });
    }


    render() {
        const { showType, left, top, width, height, radius } = this.state;
        const { switchButtonViewLeft, switchButtonViewTop, SwitchButtonWidthHeight, SCREENW, SCREENH } = this;

        let contentView = null;
        let allStyles = [];
        allStyles.push({
            position: 'absolute',
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.5)',
            left: left,
            top: top,
            width: width,
            height: height,
            borderRadius: radius
        });
        if (showType == this.ShowType.SwitchButton) {
            contentView = (
                <Animated.View ref='mainContentView' {...this._switchButtonPanResponder.panHandlers} style={allStyles}>
                    {this.generateSwitchButtonView()}
                </Animated.View>
            );
        } else if (showType == this.ShowType.ShowAll) {
            contentView = (
                <Animated.View style={allStyles}>
                    {this.generatePanelView()}
                </Animated.View>
            );
        }

        return (contentView);
    }
}

const styles = StyleSheet.create({
    SwitchButtonView: {
        flex: 1
    },

    PanelView: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1
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


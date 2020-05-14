import React, {useRef, useEffect, Children, } from "react"
import {motion, MotionStyle} from "framer-motion"

export default {
    title:"panel"
} 

interface ContainerProps {
    width ?: number;
    height ?: number;
    style ?: MotionStyle;
    children ?: any;
}

const Container = (userProps : ContainerProps) => {
    const margin = 10;


    const defaultStyle_child : MotionStyle = {
        backgroundColor:'blue',
    };
    const overrideStyle_child : MotionStyle = {
        margin,
        flexShrink: 0
    }
    const injectProps = (child : any, index : number) => {
        const userStyle_child : MotionStyle = child.props.style;
        const finalStyle_child : MotionStyle = {...defaultStyle_child, ...userStyle_child, ...overrideStyle_child};
        return React.cloneElement(child, {style:finalStyle_child});
    }
    const userStyle : MotionStyle = userProps.style;
    const defaultStyle : MotionStyle = {
        width: 256,
        height: 180,
        backgroundColor: `grey`
    }
    const overrideStyle : MotionStyle = {
        display:`flex`,
        flexDirection: `column`,
        alignItems: `center`,
        overflowY: `scroll`,
        overflowX: `hidden`
    }
    const finalStyle : MotionStyle = {
        ...userStyle,
        ...defaultStyle,
        ...overrideStyle
    }
    const finalProps = {...userProps, style:finalStyle};

    return (
        <motion.div {...finalProps}>
            {Children.map(userProps.children, injectProps)}
            <div id={"footer"} style={{height:1,width:1,flexShrink:0}}/>
        </motion.div>
    );
}

export const AHABPanel = () =>
{
    const style = {width:100,height:100};
    return (
        <Container style={{border: "4px solid black"}}>
            <div id={"child_0"} style={style}></div>
            <div id={"child_1"} style={style}></div>
            <div id={"child_2"} style={style}></div>
        </Container>
    );
}
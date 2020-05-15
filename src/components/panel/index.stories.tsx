import React, {useRef, useEffect, Children, } from "react"
import {motion, MotionStyle, HTMLMotionProps} from "framer-motion"
import {merge} from "lodash"
import config from "../../utility/config";

export default {
    title:"panel"
} 
interface ContainerProps extends Partial<HTMLMotionProps<"div">>{}
interface ChildProps extends Partial<HTMLMotionProps<"div">>{}
const Container = (userProps : ContainerProps) => {
    /**
     *  Child Config
     * _______________________________________________
     */
    let childConfig = new config<ChildProps>();
    childConfig.default = {
        style :{
            backgroundColor:'black',
        }
    };
    childConfig.override = {
        style : {
            margin: 10,
            flexShrink: 0
        },
        whileHover : {scale:1.2}
    }
    const injectStyle = (child : any, index : number) => {
        childConfig.user = child.props;
        return React.cloneElement(child, childConfig.final());
    }

    /**
     *  Wrapper Config
     * _______________________________________________
     */
    const wrapperConfig = new config<ContainerProps>();
    wrapperConfig.default = {
        style: {
            backgroundColor: `grey`,
            width: 256,
            height: 180,
        }
    }
    wrapperConfig.user = userProps;
    wrapperConfig.override = {
        style: {        
            display:`flex`,
            flexDirection: `column`,
            alignItems: `center`,
            overflowY: `scroll`,
            overflowX: `hidden`
        }
    };

    return (
        <motion.div {...wrapperConfig.final()}>
            {Children.map(userProps.children, injectStyle)}
            <div id={"footer"} style={{height:1,width:1,flexShrink:0}}/>
        </motion.div>
    );
}

export const AHABPanel = () =>
{
    const style = {width:100,height:100, backgroundColor:'blue', border: '1px solid cyan'};
    return (
        <Container style={{border: "4px solid black"}}>
            <motion.div id={"child_0"} style={style}></motion.div>
            <motion.div id={"child_1"} style={style}></motion.div>
            <motion.div id={"child_2"} style={style}></motion.div>
        </Container>
    );
}
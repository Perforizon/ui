import React, { useRef, useEffect,useState, Ref, useLayoutEffect } from "react";
import {motion, MotionStyle} from "framer-motion";
import {merge} from "lodash";
import "../../fonts/fira/stylesheet.css";
import "./scrollbar.css";
import config from "../../utility/config";

export default {
    title: `scrollbar`
}
const FakeContent = ({id}) => {
    const style : MotionStyle = {
        marginTop: 16,
        marginBottom: 16,
        width: `100%`,
        height: 32,
        backgroundColor: `maroon`,
        color: `white`,
        fontSize: 20,
        fontFamily: `fira_coderegular`
    }
    return <motion.div id={`fake-content`} style={style}>{`${id}=> Lorem != Ipsum`}</motion.div>
}

interface ScrollBarProps {
    perspectiveControlStyle ?: MotionStyle;
    thumbStyle ?: MotionStyle;
}

export const ScrollBarTest = (props : ScrollBarProps) => {
    const perspectiveCtrlRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const perspectiveCtrlStyle = new config<MotionStyle>();
    perspectiveCtrlStyle.default = {
        position: `relative`,
        width: 256,
        height: 512,
        backgroundColor: `coral`
    }
    perspectiveCtrlStyle.user = props.perspectiveControlStyle;
    perspectiveCtrlStyle.override = {
        overflowX: `hidden`,
        overflowY: `scroll`,
        perspective: `1px`,
        perspectiveOrigin: `top left`,
        scrollbarWidth: `none`
    }

    const thumbStyle = new config<MotionStyle>();
    const [thumbTransform, setThumbTransform] = useState(``);

    thumbStyle.default = {
        width: 64,
        height: 128,
        backgroundColor: `blue`
    }
    thumbStyle.user = props.thumbStyle;
    thumbStyle.override = {
        position: `absolute`,
        left:0,
        top:0,
        transform: thumbTransform,
        transformOrigin: `top left`
    }

    useLayoutEffect(()=>{
        const viewRect = perspectiveCtrlRef.current.getBoundingClientRect();
        const viewHeight = viewRect.height;
        const viewWidth = viewRect.width;
        const scrollableHeight = (perspectiveCtrlRef.current.scrollHeight);
        const thumbHeight = thumbRef.current.getBoundingClientRect().height;
        const thumbWidth = thumbRef.current.getBoundingClientRect().width;
        const maxScrollDistance = scrollableHeight-viewHeight;
        const maxScrollbarOffset = viewHeight-thumbHeight;
        const scaling =maxScrollbarOffset/maxScrollDistance;

        setThumbTransform(`
               scale(${1 / scaling})
               matrix3d(
                 1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 0, -1
               )
               translateZ(${-2 + 1 - 1 / scaling}px)
               translateX(${viewWidth-thumbWidth}px)
            `)
    }, [perspectiveCtrlRef, thumbRef]);

    return (
        <motion.div 
            id={"perspective-ctrl"} 
            ref={perspectiveCtrlRef}
            style={perspectiveCtrlStyle.final()}
        >
            <motion.div id={"thumb"} ref={thumbRef} style={thumbStyle.final()}/>
            <FakeContent id={0}/>
            <FakeContent id={1}/>
            <FakeContent id={2}/>
            <FakeContent id={3}/>
            <FakeContent id={4}/>
            <FakeContent id={5}/>
            <FakeContent id={6}/>
            <FakeContent id={7}/>
            <FakeContent id={8}/>
            <FakeContent id={9}/>
            <FakeContent id={10}/>
            <FakeContent id={11}/>
            <FakeContent id={12}/>
            <FakeContent id={13}/>
            <FakeContent id={14}/>
            <FakeContent id={15}/>
            <FakeContent id={16}/>
            <FakeContent id={17}/>
            <FakeContent id={18}/>
            <FakeContent id={19}/>
            <FakeContent id={0}/>
            <FakeContent id={1}/>
            <FakeContent id={2}/>
            <FakeContent id={3}/>
            <FakeContent id={4}/>
            <FakeContent id={5}/>
            <FakeContent id={6}/>
            <FakeContent id={7}/>
            <FakeContent id={8}/>
            <FakeContent id={9}/>
            <FakeContent id={10}/>
            <FakeContent id={11}/>
            <FakeContent id={12}/>
            <FakeContent id={13}/>
            <FakeContent id={14}/>
            <FakeContent id={15}/>
            <FakeContent id={16}/>
            <FakeContent id={17}/>
            <FakeContent id={18}/>
            <FakeContent id={19}/>
            <div id={"footer"} style={{width:`100%`, height:1}}/>
        </motion.div>
    );
}
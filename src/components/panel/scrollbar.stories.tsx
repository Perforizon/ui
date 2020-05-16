import React, { useRef, useEffect,useState, Ref, useLayoutEffect } from "react";
import CSS from "csstype";
import {motion, MotionStyle, MotionValue, useMotionValue, useTransform} from "framer-motion";
import {Clamp} from "@perforizon/math";
import "../../fonts/fira/stylesheet.scss";
import "./scrollbar.scss";
import config from "../../utility/config";

export default {
    title: `scrollbar`
}
const LoremIpsum = ({id}) => {
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
    const scrollViewPortRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const trackRef =  useRef<HTMLDivElement>(null);
    const scrollViewPortStyle = new config<MotionStyle>();
    scrollViewPortStyle.default = {
        position: `relative`,
        width: 256+17,
        height: 256,
        /** prevent microsoft edge from scrolling to the right when 
         * user highlights text and drags right
         */
        msScrollLimitXMax: 0,
        backgroundColor: `coral`
    }
    scrollViewPortStyle.user = props.perspectiveControlStyle;
    scrollViewPortStyle.override = {
        overflowX: `hidden`,
        overflowY: `scroll`,
        perspective: `1px`,
        perspectiveOrigin: `top left`,
        scrollbarWidth: `none`,
        transformStyle: `preserve-3d`,
        WebkitOverflowScrolling: `touch`,
    }
    const trackStyle = new config<MotionStyle>();
    const [scrollHeight, setScrollHeight] = useState(0);
    trackStyle.default = {
        width:32,
        border: `6px solid black`,
        backgroundColor:`blue`
    }
    trackStyle.override = {
        position:`absolute`,
        top:0,
        height: scrollHeight
    }

    const thumbStyle = new config<MotionStyle>();
    const [thumbTransform, setThumbTransform] = useState(``);
    thumbStyle.default = {
        width: 32,
        height: 128,
        backgroundColor: `rgb(200,200,220)`,
        border: `6px solid black`,
    }
    thumbStyle.user = props.thumbStyle;
    thumbStyle.override = {
        position: `absolute`,
        transform: thumbTransform,
        transformOrigin: `top left`,
        zIndex: 1
    }

    const variants = {
        default : {
            backgroundColor: `rgb(200,200,220)`,
            borderColor: `rgb(150,150,180)`
        },
        focus : {
            backgroundColor: `rgb(255,255,255)`,
            borderColor: `rgb(200,200,220)`
        }
    }

    useEffect(()=>{
        // Edge requires a transform on the document body and a fixed position element
        // in order for it to properly render the parallax effect as you scroll.
        if (getComputedStyle(document.body).transform == "none")
        {
            document.body.style.transform = "translateZ(0)";
            document.body.style.translate = "no";
        }
        if (!document.getElementById("microsoft-edge-fixed-position-scroll-div"))
        {
            const fixedPos = document.createElement("div");
            fixedPos.id = "microsoft-edge-fixed-position-scroll-div"
            fixedPos.style.position = "fixed";
            fixedPos.style.top = "0";
            fixedPos.style.width = "1px";
            fixedPos.style.height = "1px";
            fixedPos.style.zIndex = "1"; 
            document.body.insertBefore(fixedPos, document.body.firstChild);
        }
    }, [])

    useLayoutEffect(()=>{
        const viewBoundingRect = scrollViewPortRef.current.getBoundingClientRect();
        const viewHeight = viewBoundingRect.height;
        const viewWidth = viewBoundingRect.width;
        const viewScrollHeight = (scrollViewPortRef.current.scrollHeight);

        const thumbBoundingRect = thumbRef.current.getBoundingClientRect();
        const thumbHeight = thumbBoundingRect.height;
        const thumbWidth = thumbBoundingRect.width;

        const viewScrollHeightDelta = Math.abs(viewHeight-viewScrollHeight);
        const viewThumbHeightDelta = Math.abs(viewHeight-thumbHeight);

        const scaling = 1/(viewThumbHeightDelta/viewScrollHeightDelta);

        setThumbTransform(`
               scale(${scaling})
               matrix3d(
                 1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 ${viewWidth-thumbWidth}, 0, ${-2 + 1 - scaling}, -1
               )
        `);
        thumbRef.current.style.left = `calc(${getComputedStyle(thumbRef.current).left} * ${-scaling})`;
        thumbRef.current.style.top = `calc(${getComputedStyle(thumbRef.current).top} * ${-scaling})`;
        trackRef.current.style.left = `${viewWidth - trackRef.current.getBoundingClientRect().width}px`
        trackRef.current.style.height = `${viewScrollHeight}px`
    }, [scrollViewPortRef, thumbRef]);

    const scrollViewPortStyleFinal = scrollViewPortStyle.finalize();
    const scrollMaskStyle : MotionStyle = {
        width:scrollViewPortStyleFinal.width,
        height:scrollViewPortStyleFinal.height,
        overflowX: `hidden`
    };

    return (
        <motion.div id={"scroll-view-port-mask"} style={scrollMaskStyle}>
            <motion.div 
                id={"scroll-view-port"} 
                className={"perforizon-scrollbar-viewport"}
                ref={scrollViewPortRef}
                style={scrollViewPortStyle.finalize()}
            >   
                <motion.div 
                    id={"thumb"} 
                    ref={thumbRef} 
                    style={thumbStyle.finalize()}
                    whileHover={"focus"}
                    whileTap={"focus"}
                    variants={variants}
                />
                <motion.div ref={trackRef} style={trackStyle.finalize()}></motion.div>
                <LoremIpsum id={0}/>
                <LoremIpsum id={1}/>
                <LoremIpsum id={2}/>
                <LoremIpsum id={3}/>
                <LoremIpsum id={4}/>
                <LoremIpsum id={5}/>
                <LoremIpsum id={6}/>
                <LoremIpsum id={7}/>
                <LoremIpsum id={8}/>
                <LoremIpsum id={9}/>
                <LoremIpsum id={10}/>
                <LoremIpsum id={11}/>
                <LoremIpsum id={12}/>
                <LoremIpsum id={13}/>
                <LoremIpsum id={14}/>
                <LoremIpsum id={15}/>
                <LoremIpsum id={16}/>
                <LoremIpsum id={17}/>
                <LoremIpsum id={18}/>
                <LoremIpsum id={19}/>
                <LoremIpsum id={20}/>
                <LoremIpsum id={21}/>
                <LoremIpsum id={22}/>
                <LoremIpsum id={23}/>
                <LoremIpsum id={24}/>
                <LoremIpsum id={25}/>
                <LoremIpsum id={26}/>
                <LoremIpsum id={27}/>
                <LoremIpsum id={28}/>
                <LoremIpsum id={29}/>
                <LoremIpsum id={30}/>
                <LoremIpsum id={31}/>
                <LoremIpsum id={32}/>
                <LoremIpsum id={33}/>
                <LoremIpsum id={34}/>
                <LoremIpsum id={35}/>
                <LoremIpsum id={36}/>
                <LoremIpsum id={37}/>
                <LoremIpsum id={38}/>
                <LoremIpsum id={39}/>
                <LoremIpsum id={40}/>
                <div id={"footer"} style={{width:`100%`, height:1}}/>
            </motion.div>
        </motion.div>
    );
}


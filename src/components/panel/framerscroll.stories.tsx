
import React, { useRef, useEffect,useState, Ref, useLayoutEffect } from "react";
import CSS from "csstype";
import {motion, MotionStyle, MotionValue, Variants, useMotionValue, useTransform} from "framer-motion";
import {Clamp} from "@perforizon/math";
import "./scrollbar.scss";
import "../../styles/no-select.scss";
import config, { configPrimitive, useConfigRef } from "../../utility/config";

export default {
    title: 'framer scroll'
}

interface LoremIpsumProps {
    id ?: number
}
const LoremIpsum = (props : LoremIpsumProps) =>
{
    const style : MotionStyle = {
        height: 20,
        width: `100%`,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: `rgb(255, 179, 189)`,
        userSelect: `none`
    }
    return (
        <motion.div style={style}>
            {props.id}
        </motion.div>
    );
}
class FramerScrollTransform {
    x: string; y: string; z:string;
    scaleX : number; scaleY: number; scaleZ: number;
    constructor(){
        this.x = `0px`;
        this.y = `0px`;
        this.z = `0px`;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
    }
    cssString = () => {
        return `
        translateX(${this.x}) 
        translateY(${this.y}) 
        translateZ(${this.z})`
    }
}
interface FramerScrollVariant extends  CSS.Properties {
    variantTransform ?: FramerScrollTransform;
}
interface FramerScrollVaraints {
    default ?: CSS.Properties;
    hover ?: CSS.Properties;
    active ?: CSS.Properties;
}
interface FramerScrollProps {
    viewportStyle ?: CSS.Properties;
    contentWrapperStyle ?: CSS.Properties;
    trackStyle ?: CSS.Properties;
    thumbStyle ?: CSS.Properties;

    viewportProps ?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    contentWrapperProps ?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    trackProps ?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    thumbProps ?:  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

    thumbVariants ?: FramerScrollVaraints;
    trackVariants ?: FramerScrollVaraints;

    isThumbHeightDynamic ?: boolean;
    scrollSensitivity ?: number;
}

export const FramerScroll = (userProps : FramerScrollProps) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const thumbTransformRef = useRef(new FramerScrollTransform());
    const trackTransformRef = useRef(new FramerScrollTransform());

    const props = useConfigRef<FramerScrollProps>();
    props.current = {
        isThumbHeightDynamic : true,
        scrollSensitivity : 12,
        /**  Styles */
        viewportStyle : {
            width: `256px`,
            height: `256px`,
            backgroundColor: `rgb(200, 250, 220)`,
            pointerEvents: `auto`,
            userSelect: `auto`,
            position: `relative`,
            overflow: `hidden`
        },
        contentWrapperStyle : {
            transition: `transform .5s linear 0s`
        },
        trackStyle : {
            height: `100%`,
            position: `absolute`,
            top: 0,
            left: `100%`,
            zIndex: 1,
            width: `20px`,
            transformOrigin: `top right`,
            backgroundColor: `rgba(0, 0, 102, .3)`,
            opacity: 0,
            transition: `transform .4s cubic-bezier(.33,.8,.42,.96) 0s,  opacity .2s ease 0s`
        },
        thumbStyle : {
            position:`absolute`,
            top: 0,
            right: 0,
            zIndex: 1,
            width: `20px`,
            height: `64px`,
            transformOrigin: `top right`,
            opacity: 0,
            borderRadius: `5px`,
            backgroundColor: `rgb(180,180,255)`,
            transition: `
                transform .4s cubic-bezier(.33,.8,.42,.96) 0s,
                opacity .2s ease 0s,
                background-color .3s ease 0s
                `,
        },
        thumbVariants : {
            default: {
                backgroundColor: `rgb(180,180,255)`,
                opacity: 0
            },
            hover : {
                opacity: 1,
            },
            active : {
                backgroundColor: `rgb(240,240,255)`,
            }
        },
        trackVariants : {

        }
    }
    props.merge(userProps);

    const contentWrapperYRef = useRef(0);
    const processScrollAnimationFrame = useRef(false);
    const wheelHandler = (event : WheelEvent ) => {
        /**
         * `requestAnimationFrame` prevents slight jitter
         * using `processScrollAnimationFrame` to throttle prevents excess calls 
         * which may result in less frames per second
         * https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
         */
        if (!processScrollAnimationFrame.current)
        {
            requestAnimationFrame(
                ()=>{        
                    const viewportBoundingRect = viewportRef.current.getBoundingClientRect();
                    const thumbBoundingRect = thumbRef.current.getBoundingClientRect();
                    const viewportHeight = viewportBoundingRect.height;
                    const thumbHeight =  thumbBoundingRect.height;
                    const maxThumbDelta = viewportHeight-thumbHeight;
                    const maxScrollDelta = viewportRef.current.scrollHeight-viewportHeight

                    contentWrapperYRef.current = Clamp(contentWrapperYRef.current+(-Math.sign(event.deltaY)*props.current.scrollSensitivity), 0, -maxScrollDelta)
                    thumbTransformRef.current.y = `${(-contentWrapperYRef.current/maxScrollDelta*maxThumbDelta)}px`;
                    contentWrapperRef.current.style.transform = `translateY(${contentWrapperYRef.current}px)`;
                    thumbRef.current.style.transform = thumbTransformRef.current.cssString();

                    processScrollAnimationFrame.current = false;
                }
            );
            processScrollAnimationFrame.current = true;
        }
    }

    const isDragging = useRef(false);
    const dragStart = (y: number) => 
    {
        isDragging.current = true;
        viewportRef.current.style.pointerEvents = `none`;
        viewportRef.current.style.userSelect = `none`;
        Object.keys(props.current.thumbVariants.active).forEach((key) => {
            thumbRef.current.style[key] = props.current.thumbVariants.active[key]
        });
    }
    const dragEnd = () => 
    {
        isDragging.current = false;
        viewportRef.current.style.pointerEvents = props.current.viewportStyle.pointerEvents.valueOf() as string;
        viewportRef.current.style.userSelect = props.current.viewportStyle.userSelect.valueOf() as string;
        viewportBlur();
    }
    const dragMove = (y: number) => {
        const viewportBoundingRect = viewportRef.current.getBoundingClientRect();
        const thumbBoundingRect = thumbRef.current.getBoundingClientRect();
        const viewportHeight = viewportBoundingRect.height;
        const thumbHeight = thumbBoundingRect.height;
        const maxThumbDelta = viewportHeight-thumbHeight;
        const maxScrollDelta = viewportRef.current.scrollHeight-viewportHeight

        const yDelta = Clamp(y-thumbHeight/2, 0, maxThumbDelta);
        thumbTransformRef.current.y = `${yDelta}px`;
        contentWrapperYRef.current = -yDelta/maxThumbDelta * maxScrollDelta;
       
        thumbRef.current.style.transform = thumbTransformRef.current.cssString();
        contentWrapperRef.current.style.transform = `translateY(${contentWrapperYRef.current}px)`;
    }
    const viewportBlur = () => {
        Object.keys(props.current.thumbVariants.default).forEach((key) => {
            thumbRef.current.style[key] = props.current.thumbVariants.default[key]
        });
        trackRef.current.style.opacity = `0`;
        trackTransformRef.current.x = `0%`;
        
        thumbRef.current.style.transform = thumbTransformRef.current.cssString();
        trackRef.current.style.transform = trackTransformRef.current.cssString();
    }
    const viewportHover = () => {
        Object.keys(props.current.thumbVariants.hover).forEach((key) => {
            thumbRef.current.style[key] = props.current.thumbVariants.hover[key]
        });
        thumbRef.current.style.transform = thumbTransformRef.current.cssString();
        trackRef.current.style.opacity = `1`;
        trackTransformRef.current.x = `-100%`;
        trackRef.current.style.transform = trackTransformRef.current.cssString();
    }
    const mouseDownHandler = (event : MouseEvent) => {
        dragStart(event.clientY);
        dragMove(event.clientY);
    }
    const thumbMouseUpHandler = () => {
        if (isDragging.current)
            dragEnd();
    }
    const thumbMouseMoveHandler = (event : MouseEvent) => {
        if (isDragging.current)
        {
            dragMove(event.clientY);
        }
    }
    const viewportHoverStartHandler = () => {
        viewportHover();
    }
    const viewportHoverEndHandler = () => {
        if (!isDragging.current)
        {
            viewportBlur();
        }
    }
    
    useEffect(()=>{        
        viewportRef.current.addEventListener(`mouseover`, viewportHoverStartHandler);
        viewportRef.current.addEventListener(`mouseleave`, viewportHoverEndHandler);
        window.addEventListener(`mouseup`, thumbMouseUpHandler, {passive: true});
        return () => {
            viewportRef.current.removeEventListener(`mouseover`, viewportHoverStartHandler);
            viewportRef.current.removeEventListener(`mouseleave`, viewportHoverEndHandler);
            window.removeEventListener(`mouseup`, thumbMouseUpHandler);
        }
    },[]);

    useEffect(()=>{
        trackRef.current.addEventListener(`mousedown`, mouseDownHandler, {passive:true});
        thumbRef.current.addEventListener(`mousedown`, mouseDownHandler, {passive:true});
        window.addEventListener(`mousemove`, thumbMouseMoveHandler);
        return () => {
            trackRef.current.removeEventListener(`mousedown`, mouseDownHandler);
            thumbRef.current.removeEventListener(`mousedown`, mouseDownHandler);
            window.removeEventListener(`mousemove`, thumbMouseMoveHandler);
        }
    },[])

    useEffect(()=>{
        viewportRef.current.addEventListener(`wheel`, wheelHandler, {passive:true});
        return () => {
            viewportRef.current.removeEventListener(`wheel`, wheelHandler);
        }
    },[]);

    useLayoutEffect(()=>{
        const viewportHeight = viewportRef.current.getBoundingClientRect().height;
        thumbRef.current.style.height = `${Math.pow(viewportHeight, 2)/viewportRef.current.scrollHeight}px`;
    },[])

    return (
        <div 
            id={"viewport"}
            ref={viewportRef}
            style={props.current.viewportStyle}
        >
            <div
                id={"track"}
                ref={trackRef}
                style={props.current.trackStyle}
            >
                <div
                id={"thumb"}
                ref={thumbRef}
                style={props.current.thumbStyle}
                />
            </div>
            <div 
                id={"content-wrapper"}
                ref={contentWrapperRef}
                style={props.current.contentWrapperStyle}
            >
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
                <div id={"footer"} style={{width:`100%`, height:1}}/>
            </div>
        </div>
    )
}
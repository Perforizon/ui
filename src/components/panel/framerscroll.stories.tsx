
import React, { useRef, useEffect,useState, Ref, useLayoutEffect } from "react";
import CSS from "csstype";
import {merge} from "lodash-es";
import {motion, MotionStyle, MotionValue, Variants, useMotionValue, useTransform} from "framer-motion";
import {VEC3} from "@perforizon/math"
import {Clamp} from "@perforizon/math";
import "../../fonts/fira/stylesheet.scss";
import "./scrollbar.scss";
import "../../styles/no-select.scss";
import config, { configPrimitive } from "../../utility/config";

export default {
    title: 'framer scroll'
}

interface LoremIpsumProps {
    id : number
}
const LoremIpsum = (props : LoremIpsumProps) =>
{
    const style : MotionStyle = {
        height: 20,
        width: `100%`,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: `rgb(255, 179, 189)`
    }
    return (
        <motion.div style={style}>
            {props.id}
        </motion.div>
    );
}

interface FramerScrollProps {
    viewPortStyle ?: MotionStyle;
    contentWrapperStyle ?: MotionStyle;
    trackStyle ?: MotionStyle;
    thumbStyle ?: MotionStyle;

    dynamicThumbHeight ?: boolean;
    scrollSensitivity ?: number;
}

/** transform with no rotation */
class SimpleTransform {
    x: number; y: number; z:number;
    scaleX : number; scaleY: number; scaleZ: number;
    constructor(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
    }
    matrix = () => {
        return `translateX(${this.x}px) translateY(${this.y}px)`
    }
}

export const FramerScroll = (props : FramerScrollProps) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const thumbTransformRef = useRef<SimpleTransform>(new SimpleTransform());
    const trackTransformRef = useRef<SimpleTransform>(new SimpleTransform());

    const dynamicThumbHeightConfig = new configPrimitive<boolean>();
    dynamicThumbHeightConfig.default = true;
    dynamicThumbHeightConfig.user = props.dynamicThumbHeight;
    const [isThumbHeightDynamic, setDynamicThumbHeight] = dynamicThumbHeightConfig.useFinal();

    const scrollSensitivityConfig = new configPrimitive<number>();
    scrollSensitivityConfig.default = 12;
    scrollSensitivityConfig.user = props.scrollSensitivity;
    const [scrollSensitivity, setScrollSensitivity] = scrollSensitivityConfig.useFinal();

    const viewportStyleConfig =  new config<MotionStyle>();
    viewportStyleConfig.default = {
        width: 256,
        height: 256,
        backgroundColor: `rgb(200, 250, 220)`,
        pointerEvents: `auto`,
        userSelect: `auto`,
        position: `relative`,
        overflow: `hidden`
    }
    viewportStyleConfig.user = props.viewPortStyle;
    const viewportStyle = viewportStyleConfig.final();

    const contentWrapperStyleConfig = new config<MotionStyle>();
    contentWrapperStyleConfig.default = {
        transition: `transform .5s linear 0s`
    }
    contentWrapperStyleConfig.user = props.contentWrapperStyle;
    const contentWrapperStyle = contentWrapperStyleConfig.final();

    const trackStyleConfig = new config<MotionStyle>();
    trackStyleConfig.default = {
        height: `100%`,
        position: `absolute`,
        top: 0,
        right: 0,
        zIndex: 1,
        width: 20,
        transformOrigin: `top right`,
        backgroundColor: `rgb(0, 0, 102)`,
        opacity: 0,
        transition: `transform .4s cubic-bezier(.33,.8,.42,.96) 0s,  opacity .2s ease 0s`
    };
    trackStyleConfig.user = props.trackStyle;
    const trackStyle = trackStyleConfig.final();

    const thumbStyleConfig = new config<MotionStyle>();
    thumbStyleConfig.default = {
        position:`absolute`,
        top: 0,
        right: 0,
        zIndex: 1,
        width: 20,
        height: 64,
        transformOrigin: `top right`,
        opacity: 0,
        backgroundColor: `rgb(180,180,255)`,
        transition: `transform .4s cubic-bezier(.33,.8,.42,.96) 0s, opacity .2s ease 0s`
    }
    thumbStyleConfig.user = props.thumbStyle;
    const thumbStyle = thumbStyleConfig.final();





    
    const contentWrapperYRef = useRef(0);

    const wheelHandler = (event : WheelEvent ) => {
        const viewportBoundingRect = viewportRef.current.getBoundingClientRect();
        const thumbBoundingRect = thumbRef.current.getBoundingClientRect();
        const viewportHeight = viewportBoundingRect.height;
        const thumbHeight =  thumbBoundingRect.height;
        const maxThumbDelta = viewportHeight-thumbHeight;
        const maxScrollDelta = viewportRef.current.scrollHeight-viewportHeight

        contentWrapperYRef.current = Clamp(contentWrapperYRef.current+(-Math.sign(event.deltaY)*scrollSensitivity), 0, -maxScrollDelta)
        thumbTransformRef.current.y = (-contentWrapperYRef.current/maxScrollDelta*maxThumbDelta);
        contentWrapperRef.current.style.transform = `translateY(${contentWrapperYRef.current}px)`;
        thumbRef.current.style.transform = thumbTransformRef.current.matrix();
    }

    const isDragging = useRef(false);
    const startDragPos = useRef(0);

    const dragStart = (y: number) => 
    {
        isDragging.current = true;
        viewportRef.current.style.pointerEvents = `none`;
        viewportRef.current.style.userSelect = `none`;
        startDragPos.current = y;
    }
    const dragEnd = () => 
    {
        isDragging.current = false;
        viewportRef.current.style.pointerEvents = viewportStyle.pointerEvents.valueOf() as string;
        viewportRef.current.style.userSelect = viewportStyle.userSelect.valueOf() as string;
        thumbDefault();
    }
    const dragMove = (y: number) => {
        const viewportBoundingRect = viewportRef.current.getBoundingClientRect();
        const thumbBoundingRect = thumbRef.current.getBoundingClientRect();
        const viewportHeight = viewportBoundingRect.height;
        const thumbHeight = thumbBoundingRect.height;
        const maxThumbDelta = viewportHeight-thumbHeight;
        const maxScrollDelta = viewportRef.current.scrollHeight-viewportHeight

        const yDelta = Clamp(y-thumbHeight/2, 0, maxThumbDelta);
        thumbTransformRef.current.y = yDelta;
        contentWrapperYRef.current = -yDelta/maxThumbDelta * maxScrollDelta;
       
        thumbRef.current.style.transform = thumbTransformRef.current.matrix();
        contentWrapperRef.current.style.transform = `translateY(${contentWrapperYRef.current}px)`;
    }
    const thumbDefault = () => {
        thumbRef.current.style.opacity = `0`;
        thumbRef.current.style.transform = thumbTransformRef.current.matrix();
        trackRef.current.style.opacity = `0`;
        trackRef.current.style.transform = trackTransformRef.current.matrix();
    }
    const thumbFocus = () => {
        thumbRef.current.style.opacity = `1`;
        thumbRef.current.style.transform = thumbTransformRef.current.matrix();
        trackRef.current.style.opacity = `1`;
        trackRef.current.style.transform = trackTransformRef.current.matrix();
    }
    const trackMouseDownHandler = (event : MouseEvent) => {
        dragStart(event.clientY);
        dragMove(event.clientY);
    }
    const thumbMouseDownHandler = (event : MouseEvent) => {
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
        thumbFocus();
    }
    const viewportHoverEndHandler = () => {
        if (!isDragging.current)
        {
            thumbDefault();
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
        trackRef.current.addEventListener(`mousedown`, trackMouseDownHandler, {passive:true});
        thumbRef.current.addEventListener(`mousedown`, thumbMouseDownHandler);
        window.addEventListener(`mousemove`, thumbMouseMoveHandler);
        return () => {
            trackRef.current.removeEventListener(`mousedown`, trackMouseDownHandler);
            thumbRef.current.removeEventListener(`mousedown`, thumbMouseDownHandler);
            window.removeEventListener(`mousemove`, thumbMouseMoveHandler);
        }
    },[isThumbHeightDynamic])

    useEffect(()=>{
        viewportRef.current.addEventListener(`wheel`, wheelHandler);
        return () => {
            viewportRef.current.removeEventListener(`wheel`, wheelHandler);
        }
    },[scrollSensitivity, isThumbHeightDynamic]);

    useLayoutEffect(()=>{
        const viewportHeight = viewportRef.current.getBoundingClientRect().height;
        thumbRef.current.style.height = `${Math.pow(viewportHeight, 2)/viewportRef.current.scrollHeight}px`;
    },[isThumbHeightDynamic])

    return (
        <motion.div 
            id={"viewport"}
            ref={viewportRef}
            style={viewportStyle}
        >
            <motion.div
                id={"track"}
                ref={trackRef}
                style={trackStyle}
            />
            <motion.div
                id={"thumb"}
                ref={thumbRef}
                style={thumbStyle}
            />
            <motion.div 
                id={"content-wrapper"}
                ref={contentWrapperRef}
                style={contentWrapperStyle}
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
            </motion.div>
        </motion.div>
    )
}
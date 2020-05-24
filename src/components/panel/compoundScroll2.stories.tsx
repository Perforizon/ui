import React, { forwardRef,useState, Component, isValidElement, ComponentElement, ReactElement, HTMLAttributes, useEffect, useImperativeHandle, useRef, MutableRefObject, Children, ComponentType, cloneElement, useLayoutEffect } from "react";
import { motion, HTMLMotionProps, useMotionValue, MotionStyle } from "framer-motion";
import {Clamp} from "@perforizon/math";
export default {
  title: "0CompoundScroll",
};
interface LoremIpsumProps {
    id ?: number
}
const LoremIpsum = (props : LoremIpsumProps) =>
{
    const style : MotionStyle = {
        position: "relative",
        height: 20,
        width: `100%`,
        backgroundColor: `rgb(255, 179, 189)`,
        marginBottom: "5px",
        userSelect: `none`
    }
    return (
        <motion.div style={style}>
            {props.id}
        </motion.div>
    );
}
//======================================================================















interface ScrollbarElement extends ReactElement<any, ComponentType> {
    type : ComponentType & {
        scrollbarId: string
    }
}
interface ViewportProps extends HTMLMotionProps<"div">{
    scrollbarSensitivity ?: number;
    dynamicThumbHeight ?: boolean;
}
const Viewport = forwardRef<HTMLDivElement, ViewportProps>((props, publicRef) => {
    console.log()
    const defaultProps : ViewportProps = {
        scrollbarSensitivity: 5,
        dynamicThumbHeight: true,
        style : {
            position: "relative",
            overflow: "hidden" , 
            verticalAlign: "top"
        }
    }
    props = {...defaultProps, ...props};

    const internalRef = useRef<HTMLDivElement>(null);
    const contentRefRef = useRef<MutableRefObject<HTMLDivElement>>(null);
    useImperativeHandle(publicRef, () => internalRef.current);
    
    const scrollWheelInput = useRef(0);
    const scrollPointerInput = useRef(0);
    const updateSizeInput = useRef(0);
    const scrollWheelEvent = new CustomEvent("scroll-wheel", {detail:scrollWheelInput});
    const scrollPointerEvent = new CustomEvent("scroll-pointer", {detail:scrollPointerInput});
    const updateSizeEvent = new CustomEvent("scroll-update-size", {detail: updateSizeInput});

    const wheelHandler = (event : WheelEvent) => {
        scrollWheelInput.current = event.deltaY;
        internalRef.current.dispatchEvent(scrollWheelEvent);
    }

    const children = Children.map(props.children, (child) => {
        if (isValidElement(child)){
            const type = (child as ScrollbarElement).type;
            if (type.scrollbarId == "Content")
            {
                return cloneElement(child as ReactElement<ContentPropsInternal>, {parent: internalRef, updateSizeEvent, updateSizeInput, contentRefRefOUT:contentRefRef});
            }
            if (type.scrollbarId == "Track")
            {
                return cloneElement(child as ReactElement<TrackPropsInternal>, {parent: internalRef, contentRefRef});
            }
        }
        return child;
    });

    useEffect(
        ()=>{
            internalRef.current.addEventListener("wheel", wheelHandler, {passive:true});
            return () => {
                internalRef.current.removeEventListener("wheel", wheelHandler);
            }
        },[]
    )
    return <motion.div {...props} style={{...defaultProps.style, ...props.style}} ref={internalRef}>{children}</motion.div>;
});

interface ContentProps extends  HTMLMotionProps<"div">{}
interface ContentPropsInternal extends ContentProps {
    parent : MutableRefObject<HTMLDivElement>;
    updateSizeEvent : CustomEvent;
    updateSizeInput : MutableRefObject<number>;
    contentRefRefOUT : MutableRefObject<MutableRefObject<HTMLDivElement>>;
}
let ContentInternal : (props : ContentProps, ref : MutableRefObject<HTMLDivElement>) => JSX.Element = (props : ContentPropsInternal, publicRef) => {
    const defaultProps : ContentProps = {
        style : {
            position:"absolute",
            top: 0,
            left: 0,
            width: "100%"
        }
    }
    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(publicRef, () => internalRef.current);
    const y = useMotionValue(0);
    const scrollHandler = (event : CustomEvent) => {
        const deltaY = event.detail.current;
        const scrollHeight = Math.max(0, internalRef.current.getBoundingClientRect().height - props.parent.current.getBoundingClientRect().height);
        y.set(Clamp(y.get() - deltaY, -scrollHeight, 0));
    }

    useLayoutEffect(()=>{
        if (props.parent.current)
        {
            props.updateSizeInput.current = internalRef.current.getBoundingClientRect().height;
            props.parent.current.dispatchEvent(props.updateSizeEvent);
        }
    });

    useEffect(()=>{
        props.contentRefRefOUT.current = internalRef;
        props.parent?.current?.addEventListener("scroll-wheel", scrollHandler, {passive:true});
        return () => {
            props.parent?.current?.addEventListener("scroll-wheel", scrollHandler);
        }
    }, []);

return <motion.div {...props} style={{...defaultProps.style, ...props.style, y}} ref={internalRef}>{props.children}</motion.div>
}
ContentInternal = forwardRef(ContentInternal);
const Content = Object.assign(ContentInternal, {scrollbarId:"Content"});

interface TrackProps extends  HTMLMotionProps<"div">{}
interface TrackPropsInternal extends ContentProps {
    parent : MutableRefObject<HTMLDivElement>;
    contentRefRef : MutableRefObject<MutableRefObject<HTMLDivElement>>;
}
let TrackInternal : (props : TrackProps, ref : MutableRefObject<HTMLDivElement>) => JSX.Element = (props : TrackPropsInternal, publicRef :  MutableRefObject<HTMLDivElement>) => {
    const defaultProps : TrackProps = {
        style : {
            position:"absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: "1vw",
            backgroundColor: "rgb(220,220,220)"
        }
    }
    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(publicRef, () => internalRef.current);

    const children = Children.map(props.children, (child) => {
        if (isValidElement(child)){
            const type = (child as ScrollbarElement).type;
            if (type.scrollbarId == "Thumb")
            {
                return cloneElement(child as ReactElement<ThumbPropsInternal>, {parent: props.parent, contentRefRef:props.contentRefRef});
            }
        }
        return child;
    });

    return <motion.div {...props} style={{...defaultProps.style, ...props.style}} ref={internalRef}>{children}</motion.div>
}
TrackInternal = forwardRef(TrackInternal);
const Track = Object.assign(TrackInternal, {scrollbarId:"Track"});

interface ThumbProps extends  HTMLMotionProps<"div">{}
interface ThumbPropsInternal extends ContentProps {
    parent : MutableRefObject<HTMLDivElement>;
    contentRefRef : MutableRefObject<MutableRefObject<HTMLDivElement>>;
}
let ThumbInternal : (props : ThumbProps, ref : MutableRefObject<HTMLDivElement>) => JSX.Element = (props : ThumbPropsInternal, publicRef :  MutableRefObject<HTMLDivElement>) => {
    const defaultProps : ThumbProps = {
        style : {
            position:"absolute",
            top: 0,
            right: 0,
            height: "1vh",
            width: "100%",
            backgroundColor: "rgb(63,63,63)"
        }
    }
    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(publicRef, () => internalRef.current);

    const updateSizeHandler = (event : CustomEvent) => {
        const contentHeight = event.detail.current;
        const viewportHeight = props.parent.current.getBoundingClientRect().height;
        internalRef.current.style.height = `${viewportHeight/(contentHeight | 1) * viewportHeight}px`;
    }

    // not sure why this is necessary. (useEffect that calls dispatchEvent(updateSize) 
    // in Cotntent component is supposed to initialize so i don't have to pass a ref to a ref
    // but it does not seem to have an effect).
    useEffect(()=>{
        const contentHeight = props.contentRefRef.current.current.getBoundingClientRect().height;
        const viewportHeight = props.parent.current.getBoundingClientRect().height;
        internalRef.current.style.height = `${viewportHeight/(contentHeight | 1) * viewportHeight}px`;
    },[]);

    useEffect(()=>{
        props.parent.current.addEventListener("scroll-update-size", updateSizeHandler);
    }, []);
    
    return <motion.div {...props} style={{...defaultProps.style, ...props.style}} ref={internalRef}>{props.children}</motion.div>
}
ThumbInternal = forwardRef(ThumbInternal);
const Thumb = Object.assign(ThumbInternal, {scrollbarId:"Thumb"});

export const Story = () => {
    const [loremIpsums, setLoremIpsums] = useState<ReactElement[]>(new Array<ReactElement>());
    const i = useRef(0);

    return (
        <div>
            goodbye
        <Viewport 
            style={{width:50, height:50, backgroundColor:"red"}}       
            onClick={()=>{
                setLoremIpsums(loremIpsums.concat(<LoremIpsum id={i.current}/>));
                i.current = i.current+1;
            }}
        >
            <Content style={{transition: "transform .3s"}}>
                {loremIpsums}   
                {/* <div style={{position:"relative", width:"100%", height:"1px", transition: `transform .5s linear 0s` }}></div> */}
            </Content>
            <Track>
                <Thumb></Thumb>
            </Track>
        </Viewport>
        </div>
    );
};

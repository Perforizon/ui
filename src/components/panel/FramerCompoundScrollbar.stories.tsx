import React, {useRef, useImperativeHandle,Ref, useLayoutEffect,RefObject, FunctionComponent, useState, DetailedReactHTMLElement,HTMLProps,ReactHTMLElement, forwardRef,FunctionComponentElement, ForwardRefRenderFunction,RefAttributes, ForwardRefExoticComponent, PropsWithoutRef, MutableRefObject, ReactNode, Children, ClassicComponentClass, ReactElement, ComponentElement, HTMLAttributes, cloneElement, useEffect, HtmlHTMLAttributes, isValidElement} from "react"
import {motion, ForwardRefComponent, HTMLMotionProps, MotionAdvancedProps, MotionStyle, MotionProps, useMotionValue, MotionValue} from "framer-motion"
import {Clamp} from "@perforizon/math";
import {merge} from "lodash-es"
import CSS from "csstype"

export default {
    title: "Framer Compound Scrollbar"
}

interface ViewportProps extends HTMLMotionProps<"div"> {
    key ?: string;
    children ?: ReactNode | ReactNode[];
    ref ?: MutableRefObject<HTMLDivElement>;
    scrollbarSensitivity ?: number;
}
interface ContentWrapperProps extends HTMLMotionProps<"div"> {}
interface ContentPropsInternal extends ContentWrapperProps {
    contentY ?: MotionValue;
}
interface TrackProps extends  HTMLMotionProps<"div">  {}
interface TrackPropsInternal extends TrackProps {
    viewportRef ?: MutableRefObject<HTMLDivElement>;
    isDraggingRef ?: MutableRefObject<boolean>;
    contentY ?: MotionValue;
}
interface ThumbProps extends  HTMLMotionProps<"div">  {
}
interface ThumbPropsInternal extends ThumbProps {
    viewportRef : MutableRefObject<HTMLDivElement>;
    isDraggingRef ?: MutableRefObject<boolean>;
    contentY ?: MotionValue;
}
declare type ScrollbarStaticProps =  {type:{scrollbarID:string}};
declare type TrackElement = {props: TrackPropsInternal} & ScrollbarStaticProps;
declare type ThumbElement = {props: ThumbPropsInternal} & ScrollbarStaticProps;
declare type ViewportRenderFunction = (render: ForwardRefRenderFunction<HTMLDivElement, ViewportProps>) => ForwardRefExoticComponent<PropsWithoutRef<ViewportProps> & RefAttributes<HTMLDivElement>>;
declare type Viewport = ViewportRenderFunction;

interface DragStartEvent {
    isDraggingRef : MutableRefObject<boolean>;
    viewportRef : MutableRefObject<HTMLDivElement>;
}
interface DragEndEvent {
    isDraggingRef : MutableRefObject<boolean>;
    viewportRef : MutableRefObject<HTMLDivElement>;
}
interface DragMoveEvent {
    viewportRef : MutableRefObject<HTMLDivElement>;
    thumbRef : MutableRefObject<HTMLDivElement & MotionProps>;
    clientY: number;
    thumbY: MotionValue;
    thumbX: MotionValue;
}
const dragStart = (event : DragStartEvent) => {
    event.isDraggingRef.current = true;
    event.viewportRef.current.style.pointerEvents = "none";
    event.viewportRef.current.style.userSelect = "none";
}
const dragMove = (event : DragMoveEvent) => {
    const viewportBoundingRect = event.viewportRef.current.getBoundingClientRect();
    const thumbBoundingRect = event.thumbRef.current.getBoundingClientRect();
    const viewportHeight = viewportBoundingRect.height;
    const thumbHeight = thumbBoundingRect.height;
    const maxThumbDelta = viewportHeight-thumbHeight;
    const newDeltaY = Clamp(event.clientY-viewportBoundingRect.y-thumbHeight/2, 0, maxThumbDelta);
    event.thumbY.set(newDeltaY);
    // event.thumbRef.current.style.y = newDeltaY;
    // event.thumbRef.current.style.y = `${event.clientY}px`;
    // contentWrapperYRef.current = -yDelta/maxThumbDelta * maxScrollDelta;
   
    // thumbRef.current.style.transform = thumbTransformRef.current.cssString();
    // contentWrapperRef.current.style.transform = `translateY(${contentWrapperYRef.current}px)`;
}
const dragEnd = (event : DragEndEvent) => {
    event.isDraggingRef.current = false;
    event.viewportRef.current.style.pointerEvents = "initial";
    event.viewportRef.current.style.userSelect = "initial";
}

const useConfigProps = <P extends object>(defaultProps:P, userProps:P) => {
    const props = useRef<P>(merge({}, defaultProps, userProps));
    return props;
}
const useForwardRef = <T extends object>(publicRef:MutableRefObject<T>, privateRef:MutableRefObject<T>) => {
    useImperativeHandle(publicRef, () : T => privateRef.current);
}
const useForceUpdate = () => {
    const [forceUpdate, setForceUpdate] = useState(0);
    return () => setForceUpdate(forceUpdate+1);
}
let _Viewport = (props : ViewportProps, userRef : MutableRefObject<HTMLDivElement>) => {
    const defaultProps : ViewportProps = {
        scrollbarSensitivity: .1,
        style : {
            position: "relative",
            overflow:"hidden",
        }
    }
    props = {...defaultProps, ...props, style: {...defaultProps.style, ...props.style}};
    const viewportRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef<boolean>(false);
    const scrollInput =  useRef(0);
    const contentY = useMotionValue(0);

    const dragEndHandler = () => {
        dragEnd({isDraggingRef, viewportRef:viewportRef});
    }; 
    const wheelHandler = (event : WheelEvent) => {
        scrollInput.current = Clamp(scrollInput.current+props.scrollbarSensitivity*Math.sign(event.deltaY), 0, 1);
    }
    useEffect(()=>{
        window.addEventListener("mouseup", dragEndHandler, {passive: true});
        viewportRef.current.addEventListener("wheel", wheelHandler, {passive: true});
        return ()=>{
            window.removeEventListener("mouseup", dragEndHandler);
            window.removeEventListener("wheel", wheelHandler);
        }
    },[]);

    const processScrollAnimationFrame = useRef(false);

    const children = Children.map(
        props.children,
        (child) => {
            const type = (child  as ScrollbarStaticProps).type;
            if (type)
            {
                if (type.scrollbarID == "Track")
                {
                    const _wheelHandler = (event : WheelEvent) => {
                        wheelHandler(event);
                    }
    
                    return cloneElement(child as ReactElement<TrackPropsInternal>, {viewportRef, isDraggingRef, contentY});
                }
                if (type.scrollbarID == "Content")
                {
                    console.log("CONTENT FOUND");
                    console.log((child as FunctionComponentElement<any>).ref);
                    return cloneElement(child as ReactElement<ContentPropsInternal>, {contentY});
                }
            }

            return child;
        }
    )
    
    return (
        <motion.div {...props} ref={viewportRef}>
            {children}
        </motion.div>
    )
} 
_Viewport = forwardRef(_Viewport);
const Viewport = Object.assign(_Viewport, {scrollbarID:"Viewport"});

let _Content : (props : ContentWrapperProps, ref : MutableRefObject<HTMLDivElement>) => JSX.Element = (props : ContentPropsInternal, publicRef : MutableRefObject<HTMLDivElement>) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const defaultProps : ContentWrapperProps = {
        style : {
            position: "relative",
            width: "100%"
        }
    }
    const defaultChildProps : HTMLAttributes<any> = {
        style : {
            position: "relative",
            minHeight: "10vh",
            width: "100%",
            marginTop: "1vw",
            marginBottom: "1vw",
            backgroundColor: "rgb(200, 200, 200)",
            userSelect: "none"
        }
    }

    const children = Children.map(props.children, (child)=>{
        const childElement = child as ReactHTMLElement<any>
        if (isValidElement(child))
            return cloneElement(childElement, {...childElement.props, style: {...defaultChildProps.style, ...childElement.props?.style}});
        else return child;
    });

    useForwardRef(publicRef, internalRef);
    return (
        <motion.div {...props} style={{...defaultProps.style, ...props.style}} ref={internalRef}>
            {children}
        </motion.div>
    )
}
_Content = forwardRef(_Content);
const Content = Object.assign(_Content, {scrollbarID:"Content"});

let _Track : ((props : TrackProps, ref : MutableRefObject<HTMLDivElement>) => JSX.Element) = (props : TrackPropsInternal, publicRef : MutableRefObject<HTMLDivElement>) => {
    const defaultProps : TrackProps = {
        style:{
            backgroundColor: "rgb(63,63,63)",
            position: "absolute",
            height: "100%",
            width: "1vw",
            right: 0,
            top: 0
        }
    }
    const internalRef = useRef<HTMLDivElement>(null);
    useForwardRef(publicRef, internalRef);

    const children = Children.map(
        props.children,
        (child) => {
            const type = (child as ScrollbarStaticProps).type;

            if (type)
            {
                if (type.scrollbarID == "Thumb")
                {
                    const thumbElement = child as ThumbElement;
                    let motionValueAssignments = {};
                    if (!thumbElement.props.style || !thumbElement.props.style.y)
                        Object.assign(motionValueAssignments, {y:useMotionValue(0)});
                    if (!thumbElement.props.style || !thumbElement.props.style.x)
                        Object.assign(motionValueAssignments, {x:useMotionValue(0)});
                    return cloneElement(child as ReactElement<ThumbPropsInternal>, {viewportRef: props.viewportRef, isDraggingRef: props.isDraggingRef, contentY:props.contentY, style:{...motionValueAssignments, ...thumbElement.props.style}});
                }
            }

            return child;
        }
    )

    return (       
        <motion.div {...props} style={{...defaultProps.style, ...props.style}} ref={internalRef}>
            {children}
        </motion.div>
    )
};
_Track = forwardRef(_Track);
const Track = Object.assign(_Track, {scrollbarID:"Track"});

let _Thumb : (props: ThumbProps, ref : MutableRefObject<HTMLDivElement>) => JSX.Element = (props : ThumbPropsInternal, publicRef : MutableRefObject<HTMLDivElement>) => {
    const defaultProps : ViewportProps = {
        style:{
            position: "absolute",
            width: "100%",
            backgroundColor: "rgb(127,127,127)",
            top: 0,
            right: 0
        }
    }
    const internalRef = useRef<HTMLDivElement & MotionProps>(null);

    const dragStartHandler = (event : MouseEvent) => {
        dragStart({isDraggingRef:props.isDraggingRef,viewportRef:props.viewportRef});
        dragMove({viewportRef:props.viewportRef, thumbRef:internalRef, clientY:event.clientY, thumbX: props.style.x as MotionValue, thumbY: props.style.y as MotionValue});
    }
    const dragMoveHandler = (event : MouseEvent) => {
        if (props.isDraggingRef.current)
            dragMove({viewportRef:props.viewportRef, thumbRef:internalRef, clientY:event.clientY, thumbX: props.style.x as MotionValue, thumbY: props.style.y as MotionValue});
    }
    const updateSize = () => {
        const viewportHeight = props.viewportRef.current.getBoundingClientRect().height;
        internalRef.current.style.height = `${Math.pow(viewportHeight, 2)/props.viewportRef.current.scrollHeight}px`;
    }
    useEffect(()=>{        
        updateSize();
        internalRef.current.addEventListener(`mousedown`, dragStartHandler, {passive:true});
        window.addEventListener(`mousemove`, dragMoveHandler);
        return () => {
            internalRef.current.removeEventListener(`mousedown`, dragStartHandler);
            window.removeEventListener(`mousemove`, dragMoveHandler);
        }
    }, []);

    useLayoutEffect(()=>{
        if (props.viewportRef.current){
            updateSize();
        }
    });

    useForwardRef(publicRef, internalRef);

    return (
        <motion.div {...props} style={{...defaultProps.style, ...props.style}} ref={internalRef}>
            {props.children}
        </motion.div>
    )
}
_Thumb = forwardRef(_Thumb);
const Thumb = Object.assign(_Thumb, {scrollbarID:"Thumb"});

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
export const CompoundScrollbar = () => {
    const [loremIpsums, setLoremIpsums] = useState<ReactElement[]>(new Array<ReactElement>());
    const i = useRef(0);
    return (
        <div>
            <Viewport 
                id={"lm-v"} 
                style={{maxWidth:500, maxHeight:500, backgroundColor:"rgb(250,180,80)"}}
                onClick={()=>{
                    setLoremIpsums(loremIpsums.concat(<LoremIpsum id={i.current}/>));
                    i.current = i.current+1;
                }}
            >
                <p style={{userSelect:"none"}}>hello my name is Liam</p>
                <p style={{userSelect:"none"}}>hello my name is Dio</p>
                <Content>
                    {loremIpsums}   
                    hello
                </Content>
                <Track>
                    <Thumb id={"lm-t"}/>
                </Track>
            </Viewport>
        </div>
    )
}
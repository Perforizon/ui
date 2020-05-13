import React, { useRef, forwardRef,useState, useLayoutEffect } from "react";
import CSS from "csstype";
import {motion, Variants, PanInfo, HTMLMotionProps, useDragControls, useMotionValue, useTransform, MotionStyle, TapInfo} from "framer-motion";
import "../../../styles/no-select.scss";

export interface BoxSliderProps  extends HTMLMotionProps<"div">{
    fillVariants ?: Variants,
    barVariants ?: Variants,
    innerCursorVariants ?: Variants,
    innerLineXVariants ?: Variants,
    innerLineYVariants ?: Variants,
    outerCursorXVariants ?: Variants
    outerCursorYVariants ?: Variants,

    fillStyle ?: MotionStyle,
    barStyle ?: MotionStyle,
    innerCursorStyle ?: MotionStyle,
    innerLineXStyle ?: MotionStyle,
    innerLineYStyle ?: MotionStyle,
    outerCursorXStyle ?: MotionStyle,
    outerCursorYStyle ?: MotionStyle,
    
    barWidth : number,
    barHeight: number,
    innerCursorWidth : number,
    innerCursorHeight : number,
    outerCursorWidth ?: number,
    outerCursorHeight ?: number,
    outerCursorOffset?:number,
    innerCursorSVG?: React.StatelessComponent<React.SVGAttributes<SVGElement>>
    outerCursorSVG?: React.StatelessComponent<React.SVGAttributes<SVGElement>>

    setInputX : React.Dispatch<React.SetStateAction<number>>,
    setInputY : React.Dispatch<React.SetStateAction<number>>,
    /**
     * Set to `true` if position and size of the element will never change.
     * This will not use the slider's `React.Ref` as a drag constraint and 
     * instead use the initial position and sizes of the slider as constraints,
     * preventing some drag constraint bugs.
     */
}

export const BoxSlider = forwardRef((props : BoxSliderProps, ref : React.Ref<HTMLDivElement>) =>
{ 
    /*
     * ================================================================
     *  states
     * ================================================================                                                              
     */
    const dragControls = useDragControls();
    const dragX = useMotionValue(null);
    const dragY = useMotionValue(null);
    const dragXOuterCursorTransform = useTransform(dragX, (x)=> x);
    const dragYOuterCursorTransform = useTransform(dragY, (x)=> x);
    const innerLineXTransform = useTransform(dragX, (x) => x/props.barWidth);

    const divRef : React.Ref<HTMLDivElement> = useRef(null);
    const [divRect, setDivRect] = useState<DOMRect>(null);
    useLayoutEffect(()=>{
        setDivRect(divRef.current?.getBoundingClientRect());
    }, [divRef]);
    /*
     * ================================================================
     *  css styles
     * ================================================================                                                              
     * default styles:
     * get injected before user styles, to provide 
     * bare-bones style properties to see where the component will 
     * located.
     */
    const wrapperDefaultStyle : MotionStyle = {
        position: "relative"
    }
    const barDefaultStyle : MotionStyle = {
        height: 10,
        backgroundColor:"BurlyWood"
    };
    const outerCursorXDefaultStyle : MotionStyle = {
        backgroundColor:"black",
        fill: "BlanchedAlmond",
        stroke : "brown",
        strokeWidth: 0
    };
    const outerCursorYDefaultStyle : MotionStyle = {
        backgroundColor:"black",
        fill: "BlanchedAlmond",
        stroke : "brown",
        strokeWidth: 0
    };
    const innerLineXDefaultStyle : MotionStyle = {
        stroke: "brown",
        strokeDasharray: 1,
        strokeWidth: 1
    }
    const innerLineYDefaultStyle : MotionStyle = {
        stroke: "brown",
        strokeDasharray: 1,
        strokeWidth: 1  
    }
    const innerCursorDefaultStyle : MotionStyle = {
        backgroundColor:"cornsilk",
        width: 15,
        height: 15
    };
    const fillDefaultStyle : MotionStyle = {
        backgroundColor: "LightCoral"
    }
    /* override styles:
     * get injected after default, and user styles
     * to prevent user styles from interfering with required style
     * properties.
     */
    const wrapperStyle : MotionStyle = {
        width: props.barWidth,
        height: props.barHeight
    }
    const barOverrideStyle : MotionStyle = {
        position:"absolute",
        top:0,
        left:0,
        height: props.barHeight,
        width:props.barWidth,
        overflow:"hidden"
    }
    const innerLineXOverrideStyle : MotionStyle = {
        originX: .5,
        originY: .5
    }
    const innerLineYOverrideStyle : MotionStyle = {
        originX: .5,
        originY: .5
    }
    const innerCursorOverrideStyle : MotionStyle = {
        /* set `position: "relative"` and `top: -props.barHeight`
         * to initialize the inner cursor in the correct position.
         * (when `x: dragX` is present `y: -props.barHeight` gets
         * ignored until a drag event occurs, resulting in the inner 
         * cursor being in the wrong position until the user drags
         * the slider)
         */
        position: "absolute",
        left: -props.innerCursorWidth/2,
        top: -props.innerCursorWidth/2,
        x: dragX,
        y: dragY,
        width: props.innerCursorWidth,
        height: props.innerCursorHeight,
        originX: .5,
        originY: .5
    }
    
    const strokeWidth = props.outerCursorXStyle?(props.outerCursorXStyle.strokeWidth? props.outerCursorXStyle.strokeWidth as number: 0):0;
    const outerCursorOffset = props.outerCursorOffset?props.outerCursorOffset:0;
    const outerCursorHeight = props.outerCursorHeight?props.outerCursorHeight:0;
    const outerCursorXOverrideStyle : MotionStyle = {
        position:"absolute",
        left:-props.outerCursorWidth/2,
        top: props.barHeight+strokeWidth+outerCursorOffset,
        width: props.outerCursorWidth,
        x:dragXOuterCursorTransform,
        /* set `verticalAlign: "top"` to prevent the outer cursor
         * <img/> component from drifting away from the top of its
         *  border at sizes below 15px.
         */
        verticalAlign: "top",
        height: props.outerCursorHeight,
        originX: .5,
        originY: 0
    }
    const outerCursorYOverrideStyle : MotionStyle = {
        position:"absolute",
        top: -outerCursorHeight/2,
        left: strokeWidth+outerCursorOffset-props.outerCursorWidth/2+props.barWidth, //strokeWidth+outerCursorOffset, //-props.outerCursorWidth/2,
        width: props.outerCursorWidth,
        y:dragYOuterCursorTransform,
        rotateZ:-90,
        /* set `verticalAlign: "top"` to prevent the outer cursor
         * <img/> component from drifting away from the top of its
         *  border at sizes below 15px.
         */
        height: props.outerCursorHeight,
        originX: .5,
        originY: 0
    }

    function startDrag(event) {
        dragControls.start(event, { snapToCursor: true })
    }
    /*
     * ================================================================
     * components
     * ================================================================                                                              
     */
    const OuterCursorSVG = () => {
        if (props.outerCursorSVG)
            return <props.outerCursorSVG id="slider-outer-cursor-svg" width={props.outerCursorWidth} style={{overflow:"visible"}}/>
        else
            return <div id="slider-outer-cursor-svg:null"></div>
    }
    const InnerCursorSVG = () => {
        if (props.innerCursorSVG)
            return <props.innerCursorSVG id="slider-outer-cursor-svg" width={props.innerCursorWidth} style={{overflow:"visible", position:"absolute", top:0}}/>
        else
            return <div id="slider-outer-cursor-svg:null"></div>
    }

    return (
        <motion.div
            id={"slider-wrapper"}
            ref={ref}
            {...props}
            style={{...wrapperDefaultStyle, ...props.style, ...wrapperStyle}}
            variants={props.variants}
            /** 
             *  "no-select" to prevent svg image from being highlighted 
            */
            className={"no-select"}
        >
            {props.children}
            <motion.div 
                id={"slider-bar"}
                /**
                 *  using the proper order: 
                 *   1. DefaultStyle will be loaded first,  
                 *   2. props style will overload default style settings,
                 *   3. OverrideStyle will override an user settings (aka override style settings are required)
                */
                style={{...barDefaultStyle, ...props.barStyle, ...barOverrideStyle}} 
                onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
                    const inputX = divRect? (event.clientX - divRect.x) / divRect.width : 0;
                    const inputY = divRect? (event.clientY - divRect.y) / divRect.height : 0;
                    props.setInputX(inputX);
                    props.setInputY(1-inputY);
                    startDrag(event)
                }}
                ref={divRef}
                variants={props.barVariants}
            >
                {/**
                  * slider-fill must come before inner-cursor so it is rendered beneath it in the layering order
                  * slider-fill and slider-inner-cursor are both children of slider-bar to take advantage of
                  * slider-bar's `overflow: hidden` css property
                  */}
                 <svg  id={"slider-inner-lines"} height={props.barHeight} width={props.barWidth}>
                    <motion.line 
                        id={"slider-inner-line-x"} 
                        x1={dragXOuterCursorTransform} 
                        y1={0} 
                        x2={dragXOuterCursorTransform} 
                        y2={props.barHeight} 
                        style={{...innerLineXDefaultStyle, ...props.innerLineXStyle, ...innerLineXOverrideStyle}} 
                        variants={props.innerLineXVariants}
                    />
                    <motion.line 
                        id={"slider-inner-line-y"} 
                        x1={0} 
                        y1={dragYOuterCursorTransform} 
                        x2={props.barWidth} 
                        y2={dragYOuterCursorTransform} 
                        style={{...innerLineYDefaultStyle, ...props.innerLineYStyle, ...innerLineYOverrideStyle}} 
                        variants={props.innerLineYVariants}
                    />
                </svg> 
                <motion.div
                    id={"slider-inner-cursor"}
                    style={{...innerCursorDefaultStyle, ...props.innerCursorStyle, ...innerCursorOverrideStyle}}
                    initial={{x:props.barWidth, y:0}}
                    drag
                    /**
                     * use drag constraints left/right/top/bottom instead of ref drag constraint
                     * because React.Ref drag constraint currently causes glitches with dragging
                     */
                    dragConstraints={{bottom: props.barHeight, top: 0, left:0, right:props.barWidth}}
                    dragElastic={false}
                    dragMomentum={false}
                    dragControls={dragControls}
                    dragPropagation={false}
                    onDrag={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo)=>{
                        props.setInputX(info.point.x/(props.barWidth));
                        props.setInputY(1-info.point.y/(props.barHeight));
                    }}
                    variants={props.innerCursorVariants}
                >
                    <InnerCursorSVG/>
                </motion.div>
            </motion.div>
            <motion.div 
                id={"slider-outer-cursor-x"} 
                variants={props.outerCursorXVariants}
                style={{...outerCursorXDefaultStyle, ...props.outerCursorXStyle, ...outerCursorXOverrideStyle}}
            >
                <OuterCursorSVG/>
            </motion.div>
            <motion.div 
                id={"slider-outer-cursor-y"} 
                variants={props.outerCursorYVariants}
                style={{...outerCursorYDefaultStyle, ...props.outerCursorYStyle, ...outerCursorYOverrideStyle}}
            >
                <OuterCursorSVG/>
            </motion.div>
        </motion.div>
    );
});
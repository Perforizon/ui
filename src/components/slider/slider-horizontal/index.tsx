import React, {useRef} from "react";
import {motion, Variants, PanInfo, HTMLMotionProps, useDragControls, useMotionValue, useTransform, MotionStyle} from "framer-motion";
import "../../../styles/no-select.scss";

interface SliderProps  extends HTMLMotionProps<"div">{
    outerCursorSVGUrl ?: string,

    fillVariants ?: Variants,
    barVariants ?: Variants,
    innerCursorVariants ?: Variants,
    outerCursorVariants ?: Variants

    fillStyle ?: MotionStyle,
    barStyle ?: MotionStyle,
    innerCursorStyle ?: MotionStyle,
    outerCursorStyle ?: MotionStyle,

    barWidth : number,
    barHeight: number,
    innerCursorWidth : number,
    outerCursorWidth ?: number,
    outerCursorHeight ?: number,
    setInput : React.Dispatch<React.SetStateAction<number>>,
    /**
     * Set to `true` if position and size of the element will never change.
     * This will not use the slider's `React.Ref` as a drag constraint and 
     * instead use the initial position and sizes of the slider as constraints,
     * preventing some drag constraint bugs.
     */
}

export const HorizontalSlider = (props : SliderProps) =>
{ 
    /*
     * ================================================================
     *  states
     * ================================================================                                                              
     */
    const dragControls = useDragControls();
    const dragX = useMotionValue(null);
    const dragXCursor1Transform = useTransform(dragX, (x)=> x);
    const fillScaleXTransform = useTransform(dragX, (x) => x/props.barWidth);
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
        backgroundColor:"grey"
    };
    const outerCursorDefaultStyle : MotionStyle = {
        backgroundColor:"black"
    };
    const innerCursorDefaultStyle : MotionStyle = {
        backgroundColor:"white",
        width: 15,
        height: 15
    };
    const fillDefaultStyle : MotionStyle = {
        backgroundColor: "green"
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
    const innerCursorOverrideStyle : MotionStyle = {
        /* set `position: "relative"` and `top: -props.barHeight`
         * to initialize the inner cursor in the correct position.
         * (when `x: dragX` is present `y: -props.barHeight` gets
         * ignored until a drag event occurs, resulting in the inner 
         * cursor being in the wrong position until the user drags
         * the slider)
         */
        position: "relative",
        top: -props.barHeight,
        left: -props.innerCursorWidth/2,
        x: dragX,
        width:props.innerCursorWidth,
        height: props.barHeight,
        originX: .5
    }
    const outerCursorOverrideStyle : MotionStyle = {
        position:"absolute",
        left:-props.outerCursorWidth/2,
        top: props.barHeight,
        width: props.outerCursorWidth,
        x:dragXCursor1Transform,
        /* set `verticalAlign: "top"` to prevent the outer cursor
         * <img/> component from drifting away from the top of its
         *  border at sizes below 15px.
         */
        verticalAlign: "top",
        height: props.outerCursorHeight,
        originX: .5,
        originY: 0
    }
    const fillOverrideStyle : MotionStyle = {
        originX: 0,
        width: "100%",
        height: "100%",
        scaleX: fillScaleXTransform
    }

    function startDrag(event) {
        dragControls.start(event, { snapToCursor: true })
    }
    /*
     * ================================================================
     * components
     * ================================================================                                                              
     */
    return (
        <motion.div
            id={"slider-wrapper"}
            {...props}
            style={{...wrapperDefaultStyle, ...props.style, ...wrapperStyle}}
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
                onMouseDown={startDrag}
                variants={props.barVariants}
            >
                {/**
                  * slider-fill must come before inner-cursor so it is rendered beneath it in the layering order
                  * slider-fill and slider-inner-cursor are both children of slider-bar to take advantage of
                  * slider-bar's `overflow: hidden` css property
                  */}
                <motion.div 
                    id={"slider-fill"} 
                    style={{...fillDefaultStyle, ...props.fillStyle, ...fillOverrideStyle}}
                    variants={props.fillVariants}
                />
                <motion.div
                    id={"slider-inner-cursor"}
                    style={{...innerCursorDefaultStyle, ...props.innerCursorStyle, ...innerCursorOverrideStyle}}
                    initial={{x:props.barWidth}}
                    /**
                     * dragDirectionLock combined with a specific drag direction i.e. `drag={"x"}` or `drag={"y"}` 
                     * prevents some framer-motion drag glitches
                     */
                    dragDirectionLock
                    drag={"x"}
                    dragConstraints={{left:0, right:props.barWidth}}
                    dragElastic={false}
                    dragMomentum={false}
                    dragControls={dragControls}
                    dragPropagation={false}
                    onDrag={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo)=>{props.setInput(info.point.x/(props.barWidth))}}
                    variants={props.innerCursorVariants}
                >
                </motion.div>
            </motion.div>
            <motion.img
                id={"slider-outer-cursor"}
                src={props.outerCursorSVGUrl}
                style={{...outerCursorDefaultStyle, ...props.outerCursorStyle, ...outerCursorOverrideStyle}}
                variants={props.outerCursorVariants}
                width={props.outerCursorWidth}
                /* call preventDefault to prevent dragging on svg to be interpreted as trying to drag the svg file */
                onMouseDown={(e : React.MouseEvent<HTMLImageElement, MouseEvent>)=>{
                    startDrag(e);
                    e.preventDefault()
                }}
            >
            </motion.img>
        </motion.div>
    );
}
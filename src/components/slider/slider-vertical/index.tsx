import React, { useRef } from "react";
import CSS from "csstype";
import {motion, Variants, PanInfo, HTMLMotionProps, useDragControls, useMotionValue, useTransform, MotionStyle} from "framer-motion";
import "../../../styles/no-select.scss";
import OuterCursor from "../../../images/slider/outerCursor.svg"

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
    outerCursorOffset?:number,
    outerCursorSVG?: React.StatelessComponent<React.SVGAttributes<SVGElement>>
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
    const outerCursorRef : React.Ref<HTMLDivElement> = useRef(null);
    const dragControls = useDragControls();
    const dragX = useMotionValue(null);
    const dragXCursor1Transform = useTransform(dragX, (x)=> x);
    const fillScaleXTransform = useTransform(dragX, (x) => (1-x/props.barHeight));
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
    const outerCursorDefaultStyle : MotionStyle = {
        backgroundColor:"black",
        fill: "BlanchedAlmond",
        stroke : "brown",
        strokeWidth: 0
    };

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
    const innerCursorOverrideStyle : MotionStyle = {
        /* set `position: "relative"` and `top: -props.barHeight`
         * to initialize the inner cursor in the correct position.
         * (when `x: dragX` is present `y: -props.barHeight` gets
         * ignored until a drag event occurs, resulting in the inner 
         * cursor being in the wrong position until the user drags
         * the slider)
         */
        position: "relative",
        top: -props.barHeight-props.innerCursorWidth/2,
        y: dragX,
        width: props.barWidth,
        height:props.innerCursorWidth,
        originY: .5
    }
    const strokeWidth = props.outerCursorStyle?(props.outerCursorStyle.strokeWidth? props.outerCursorStyle.strokeWidth as number: 0):0;
    const outerCursorOffset = props.outerCursorOffset?props.outerCursorOffset:0;
    const outerCursorHeight = props.outerCursorHeight?props.outerCursorHeight:0;
    const outerCursorOverrideStyle : MotionStyle = {
        position:"absolute",
        top: -outerCursorHeight/2,
        left: strokeWidth+outerCursorOffset-props.outerCursorWidth/2+props.barWidth, //strokeWidth+outerCursorOffset, //-props.outerCursorWidth/2,
        width: props.outerCursorWidth,
        y:dragXCursor1Transform,
        rotateZ:-90,
        /* set `verticalAlign: "top"` to prevent the outer cursor
         * <img/> component from drifting away from the top of its
         *  border at sizes below 15px.
         */
        height: props.outerCursorHeight,
        originX: .5,
        originY: 0
    }
    const fillOverrideStyle : MotionStyle = {
        originY: 1,
        width: "100%",
        height: "100%",
        scaleY: fillScaleXTransform
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
            return <props.outerCursorSVG id="outer-cursor-svg" width={props.outerCursorWidth} style={{overflow:"visible"}}/>
        else
            return <div id="outer-cursor-svg:null"></div>
    }
    
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
                    initial={{y:0}}
                    /**
                     * dragDirectionLock combined with a specific drag direction i.e. `drag={"x"}` or `drag={"y"}` 
                     * prevents some framer-motion drag glitches
                     */
                    dragDirectionLock
                    drag={"y"}
                    /**
                     * use drag constraints left/right/top/bottom instead of ref drag constraint
                     * because React.Ref drag constraint currently causes glitches with dragging
                     */
                    dragConstraints={{top:0, bottom:props.barHeight}}
                    dragElastic={false}
                    dragMomentum={false}
                    dragControls={dragControls}
                    dragPropagation={false}
                    onDrag={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo)=>{props.setInput(1-info.point.y/(props.barHeight))}}
                    variants={props.innerCursorVariants}
                >
                </motion.div>
            </motion.div>
            <motion.div 
                id={"slider-outer-cursor"} 
                variants={props.outerCursorVariants}
                style={{...outerCursorDefaultStyle, ...props.outerCursorStyle, ...outerCursorOverrideStyle}}
                ref={outerCursorRef}
            >
                <OuterCursorSVG/>
            </motion.div>
        </motion.div>
    );
}
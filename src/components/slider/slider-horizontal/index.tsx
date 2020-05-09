import React, {useRef} from "react";
import {motion, Variants, PanInfo, HTMLMotionProps, useDragControls, useMotionValue, useTransform, MotionStyle} from "framer-motion";
import myicon from "./outerCursor.svg";

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
    outerCursorWidth : number,
    setInput : React.Dispatch<React.SetStateAction<number>>
}

export const HorizontalSlider = (props : SliderProps) =>
{ 
    /*
     * ================================================================
     *  states
     * ================================================================                                                              
     */

    const canvasRef = useRef(null);
    const dragControls = useDragControls();
    const dragX = useMotionValue(null);
    const dragXCursor1Transform = useTransform(dragX, (x)=> x-props.outerCursorWidth/2);
    const fillScaleXTransform = useTransform(dragX, (x) => x/props.barWidth);
    /*
     * ================================================================
     *  css styles
     * ================================================================                                                              
     */
    // defaults
    const barDefaultStyle : MotionStyle = {
        height: "10px",
        backgroundColor:"grey"
    };
    const outerCursorDefaultStyle : MotionStyle = {
        backgroundColor:"black"
    };
    const innerCursorDefaultStyle : MotionStyle = {
        backgroundColor:"white",
        width: "15px",
        height: "15px"
    };
    const fillDefaultStyle : MotionStyle = {
        backgroundColor: "green"
    }
    // overrides (cannot be overriden by user supplied styles)
    const barOverrideStyle : MotionStyle = {
        height: props.barHeight+"px",
        width:props.barWidth+"px",
        overflow:"hidden"
    }
    const cursorAnchorStyle : MotionStyle = {
        y: -props.barHeight,
        width:"1px",
        height: "100%",
    }
    const outerCursorOverrideStyle : MotionStyle = {
        x:dragXCursor1Transform,
        /* prevents image from drifting downwards based on it's size */
        verticalAlign: "top",
        width: `${props.outerCursorWidth}px`,
        originX: .5,
        originY: 0
    }
    const innerCursorOverrideStyle : MotionStyle = {
        x:-props.innerCursorWidth/2,
        width: `${props.innerCursorWidth}px`,
        height: "100%",
    }
    const fillOverrideStyle : MotionStyle = {
        originX: 0,
        width: "100%",
        height: "100%",
        scaleX: fillScaleXTransform
    }

    /*
     * ================================================================
     * components
     * ================================================================                                                              
     */
    function startDrag(event) {
        dragControls.start(event, { snapToCursor: true })
    }
    return (
        /*
         * slider-cursor anchor is 1 pixel wide so that it interacts with framer-motion's drag attributes correctly
         *      inner-cursor is the upper cursor set inside the slider bar
         *      outer-cursor is the pointer indicator below the bar
         *      slider-fill is the fill that follows the the inner-cursor
         */
        <motion.div id={"slider-wrapper"} {...props} whileHover={"highlight"} initial={"default"}>
            <motion.div 
                id={"slider-bar"}
                style={{...barDefaultStyle, ...props.barStyle, ...barOverrideStyle}} 
                ref={canvasRef} 
                onMouseDown={startDrag}
            >
                {/* 
                  * slider-fill must be below inner-cursor so it does not overlap it
                  */}
                <motion.div 
                    id={"slider-fill"} 
                    style={{...fillDefaultStyle, ...props.fillStyle, ...fillOverrideStyle}}
                />
                <motion.div
                    id={"slider-cursor-anchor"}
                    style={{...cursorAnchorStyle, x:dragX}}
                    dragDirectionLock
                    drag={"x"}
                    dragConstraints={canvasRef}
                    dragElastic={false}
                    dragMomentum={false}
                    dragControls={dragControls}
                    dragPropagation={false}
                    onDrag={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo)=>{props.setInput(info.point.x/(props.barWidth-1))}}
                >
                    <motion.div 
                        id={"slider-inner-cursor"}
                        style={{...innerCursorDefaultStyle, ...props.innerCursorStyle, ...innerCursorOverrideStyle}}
                        variants={props.innerCursorVariants}
                    />
                </motion.div>
            </motion.div>
            <motion.img
                id={"slider-outer-cursor"}
                src={props.outerCursorSVGUrl}
                style={{...outerCursorDefaultStyle, ...props.outerCursorStyle, ...outerCursorOverrideStyle}}
                variants={props.outerCursorVariants}
                width={props.outerCursorWidth}
            >
            </motion.img>
        </motion.div>
    );
}
import React from "react"
import {SwatchCanvas, SwatchCanvasProps} from "@perforizon/colorpicker"
import { motion, HTMLMotionProps } from "framer-motion"
import { VEC4 } from "@perforizon/math"

interface SwatchProps extends HTMLMotionProps<"div">{
    width: number;
    height: number;
    webglColor : VEC4;
    webglOpacity : number;
}

export const Swatch = (props : SwatchProps) => {
    const defaultStyle = {
        width: props.width,
        height: props.height
    }
    const defaultSwatchCanvasProps = {
        width:props.width,
        height:props.height,
        color:props.webglColor,
        patternColor0:[.7,.7,.7,1] as VEC4,
        patternColor1: [1,1,1,1] as VEC4, 
        patternSize:8,
        opacity:.8
    }
    return (
        <motion.div 
            id={"swatch"}
            style={{
                ...defaultStyle,
                ...props.style
            }}
            {...props}
        >
            <SwatchCanvas 
                {...{...defaultSwatchCanvasProps, color:props.webglColor, opacity:props.webglOpacity}}
                style={{position:"absolute", top:0, left:0}}
            />
        </motion.div>
    )
}

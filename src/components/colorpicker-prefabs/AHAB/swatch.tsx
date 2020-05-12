import React from "react"
import {SwatchCanvas, SwatchCanvasProps} from "@perforizon/colorpicker"
import { motion, HTMLMotionProps } from "framer-motion"
import { VEC4 } from "@perforizon/math"

export const Swatch = (props : HTMLMotionProps<"div"> & {swatchCanvasProps?:Partial<SwatchCanvasProps>}) => {
    const defaultStyle = {
        boxShadow:`0px 0px 0px 2px rgba(154,154,155,1)`,
        width: `200px`,
        height: `200px`
    }
    const defaultSwatchCanvasProps = {
        width:200,
        height:200,
        color:[1,0,0,1] as VEC4,
        patternColor0:[.7,.7,.7,.7] as VEC4,
        patternColor1: [.4,.4,.4,.7] as VEC4, 
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
                {...{...defaultSwatchCanvasProps, ...props.swatchCanvasProps}}
            />
        </motion.div>
    )
}

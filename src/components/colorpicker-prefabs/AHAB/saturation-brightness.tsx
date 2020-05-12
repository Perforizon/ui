import React, {useState, useRef} from "react";
import {BoxSlider, BoxSliderProps} from '../../slider/slider-box';
import InnerCursorSVG from "../../../images/slider/inner-cursor-box.svg"
import {SaturationBrightnessCanvas} from "@perforizon/colorpicker";
import {motion, HTMLMotionProps} from "framer-motion"

interface SaturationBrightnessProps extends HTMLMotionProps<"div"> {
    width: number;
    height: number;
    borderSize : number;
    boxSliderProps ?: Partial<BoxSliderProps>;
}

export const SaturationBrightness = (props : SaturationBrightnessProps) => { 
    const height = props.height;
    const width = props.width;
    const [inputX, setInputX] = useState(1);
    const [inputY, setInputY] = useState(1);
    const innerCursorVariants = {
        "default" :
        {
            fill: "rgb(200,200,200)",   
            rotateZ: 135,
        },
        "highlight" :
        {
            fill: "rgb(255,255,255)",
            rotateZ: 135,
            scale: 2
        },
        "press" :
        {
            fill: "rgb(255,255,255)",
            rotateZ: 135,
        }
    }
    const outerCursorVariants = {
        "default" : {
            fill: "rgb(200,200,200)",
            scale: 1
        },
        "highlight" : {
            fill: "rgb(255,255,255)",
            scale: 1.5
        },
        "press" : {
            fill: "rgb(255,255,255)",
            scale: 1.5
        }
    }
    const sliderLineVariants = {
        "default" : {
            opacity: 0,
            stroke: "rgba(154,154,155)"
        },
        "highlight" : {
            opacity: 1,
            stroke: "rgba(255,255,255)"
        },
        "press" : {
            opacity: 1,
            stroke: "rgba(255,255,255)"
        }
    }

    return (
      <motion.div id={"saturation-brightness"} {...props}>
        <BoxSlider 
          setInputX={setInputX} 
          setInputY={setInputY}
          barHeight={height}
          barWidth={width}
          innerCursorWidth={15} 
          innerCursorHeight={15}
          outerCursorWidth={15}
          innerCursorSVG={InnerCursorSVG}
          innerCursorVariants={innerCursorVariants}
          outerCursorXVariants={outerCursorVariants}
          outerCursorYVariants={outerCursorVariants}
          innerLineXVariants={sliderLineVariants}
          innerLineYVariants={sliderLineVariants}
          barStyle={{backgroundColor:"rgba(0,0,0,0)", ...props.boxSliderProps.barStyle}}
          innerLineXStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 4}}
          innerLineYStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 3}}
          innerCursorStyle={{fill:"rgb(200,200,200,1)", backgroundColor:"rgba(0,0,0,0)", strokeWidth:1, stroke: "rgb(154,154,155,1)"}}
          outerCursorXStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorYStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorOffset={2.1}
          initial={"default"}
          whileHover={"highlight"}
          whileTap={"press"}
        >
            <SaturationBrightnessCanvas width={width} height={height} color={[1,0,0,1]}></SaturationBrightnessCanvas>
        </BoxSlider>
      </motion.div>
    )
  };
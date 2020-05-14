import React from "react";
import {BoxSlider, BoxSliderProps} from '../../slider/slider-box';
import InnerCursorSVG from "../../../images/slider/inner-cursor-box.svg"
import {SaturationBrightnessCanvas} from "@perforizon/colorpicker";
import {motion, HTMLMotionProps} from "framer-motion"
import {VEC4} from "@perforizon/math";

interface SaturationBrightnessProps extends HTMLMotionProps<"div"> {
    width: number;
    height: number;
    borderSize:number;
    boxSliderProps ?: Partial<BoxSliderProps>;
    setSaturationInput : React.Dispatch<React.SetStateAction<number>>;
    setBrightnessInput : React.Dispatch<React.SetStateAction<number>>;
    webglColor : VEC4;
}

export const SaturationBrightness = (props : SaturationBrightnessProps) => { 
    const height = props.height;
    const width = props.width;
    const borderSize = props.borderSize;
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
    const sliderVariants = {
      default : {
        /** background color same as box shadow to prevent 1px gap glitch */
        backgroundColor: `rgba(150,150,180,1)`,
        boxShadow:`0px 0px 0px ${borderSize}px rgba(150,150,180,1)`
      },
      highlight : {
        backgroundColor: `rgba(200,200,220,1)`,
        boxShadow:`0px 0px 0px ${borderSize}px rgba(200,200,220,1)`
      }
    }   

    return (
      <motion.div id={"saturation-brightness"} {...props}>
        <BoxSlider 
          setInputX={props.setSaturationInput} 
          setInputY={props.setBrightnessInput}
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
          barStyle={{backgroundColor:"rgba(0,0,0,0)", ...props.boxSliderProps?.barStyle}}
          innerLineXStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 4}}
          innerLineYStyle={{stroke:"rgb(154,154,155,1)", strokeWidth: 1, strokeDasharray: 3}}
          innerCursorStyle={{fill:"rgb(200,200,200,1)", backgroundColor:"rgba(0,0,0,0)", strokeWidth:1, stroke: "rgb(154,154,155,1)"}}
          outerCursorXStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorYStyle={{backgroundColor: "rgba(0,0,0,0)", strokeWidth:1, stroke:"rgb(154,154,155,1)"}}
          outerCursorOffset={2.1}
          initial={"default"}
          whileHover={"highlight"}
          whileTap={"highlight"}

          variants={sliderVariants}
        >
            <SaturationBrightnessCanvas width={width} height={height} color={props.webglColor} style={{position:"absolute", top:0, left:0, width:props.width, height:props.height}}></SaturationBrightnessCanvas>
        </BoxSlider>
      </motion.div>
    )
  };
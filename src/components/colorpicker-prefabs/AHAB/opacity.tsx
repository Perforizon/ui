import React from "react";
import {VEC4} from "@perforizon/math"
import {HorizontalSlider} from '../../slider/slider-horizontal';
import OuterCursorSVG from "../../../images/slider/outer-cursor.svg"
import {OpacityCanvas} from "@perforizon/colorpicker";
import "../../../styles/no-select.scss";
import { motion, HTMLMotionProps } from "framer-motion";

interface OpacityProps extends HTMLMotionProps<"div"> {
  width:number;
  height:number;
  borderSize:number;
  setOpacityInput : React.Dispatch<React.SetStateAction<number>>;
  webglColor : VEC4;
}

export const Opacity = (props : OpacityProps) =>{ 
    const width = props.width;
    const height = props.height;
    const borderSize = props.borderSize;
    const innerCursorVariants = {
      default : {
          boxShadow:"0px 0px 0px 0px rgba(255,255,255,1)",
          scaleX: 1,
          transition: {
            type: "tween",
            duration: .1
          }
      },
      highlight : {
          boxShadow:"0px 0px 2px 2px rgba(200,200,220,1)",
          scaleX: 2,
          backgroundColor: "rgba(255,255,255,1)",
          transition: {
            type: "tween",
            duration: .1
          }
      }
    }
    const outerCursorVariants = {
        default : {
            opacity: .7,
            scale : 1,
            stroke: `rgb(150,150,180)`,
            fill: `rgba(200,200,220,1)`
        },
        highlight : {
            opacity: 1,   
            scale: 2,
            stroke: `rgb(200,200,220)`,
            fill: `rgba(255,255,255,1)`,
            transition: {
              type: "tween",
              duration: .1
            }
        }
    }
    const fillVariants = {
      default : {
        backgroundColor: "rgba(200,200,200,0)"
      },
      highlight : {
        backgroundColor: "rgba(255,255,255,0)"
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
      <motion.div id={"opacity"} {...props}>
        <HorizontalSlider 
          setInput={props.setOpacityInput} 
          barHeight={height}
          barWidth={width}
          innerCursorWidth={5} 
          outerCursorWidth={15} 
          fillVariants={fillVariants}
          outerCursorVariants={outerCursorVariants}
          innerCursorVariants={innerCursorVariants}
          barStyle={{
            background: "rgba(0,0,0,0)",
          }}
          innerCursorStyle={{backgroundColor: "rgba(200,200,220,1"}}
          outerCursorSVG={OuterCursorSVG}
          outerCursorStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            fill:"red",
            top:155,
            stroke:"rgb(150,150,180)",
            strokeWidth:1,
          }}
          outerCursorOffset={borderSize}
          whileHover={"highlight"}
          whileTap={"highlight"}
          initial={"default"}
          variants={sliderVariants}
        >
          <OpacityCanvas 
            width={width} 
            height={height} 
            color={props.webglColor}
            patternColor0={[.7,.7,.7,1]}
            patternColor1={[1,1,1,1]}
            patternSize={8}
            style={{position:"absolute", top:0, left:0, width:props.width, height:props.height}}
          />
        </HorizontalSlider>
      </motion.div>
    )
  };
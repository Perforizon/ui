import React, {useState} from "react";
import {VerticalSlider} from '../../slider/slider-vertical';
import OuterCursorSVG from "../../../images/slider/outer-cursor.svg";
import {HueCanvas} from "@perforizon/colorpicker";
import {motion, HTMLMotionProps} from "framer-motion";
import "../../../styles/no-select.scss";

interface HueProps extends HTMLMotionProps<"div"> {
    width: number;
    height: number;
    borderSize : number;
    setHueInput : React.Dispatch<React.SetStateAction<number>>;
}

export const Hue = (props : HueProps) =>{ 
    const borderSize=props.borderSize;
    const width = props.width;
    const height = props.height;

    const innerCursorVariants = {
      default : {
          boxShadow:"0px 0px 25px 2px rgba(255,255,255,.5)",
          backgroundColor: "rgba(150,150,180,1)",
          scaleY: 1,
          transition: {
            type: "tween",
            duration: .1
          }
      },
      highlight : {
          boxShadow:"0px 0px 2px 2px rgba(200,200,220,1)",
          backgroundColor: "rgba(255,255,255,1)",
          scaleY: 2,
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
            stroke:"rgb(150,150,180)",
            fill: `rgba(200,200,220,1)`
        },
        highlight : {
            opacity: 1,   
            scale: 2,
            stroke:"rgb(200,200,220)",
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
        /** background color same as box shadow to prevent 1 px gap glitch */
        backgroundColor:`rgba(150,150,180,1)`,
        boxShadow:`0px 0px 0px ${borderSize}px rgba(150,150,180,1)`
      },
      highlight : {
        backgroundColor:`rgba(200,200,220,1)`,
        boxShadow:`0px 0px 0px ${borderSize}px rgba(200,200,220,1)`
      }
    }
    return (
      <motion.div id={"hue"} {...props}>
        <VerticalSlider 
          setInput={props.setHueInput} 
          barHeight={height}
          barWidth={width}
          innerCursorWidth={5} 
          outerCursorWidth={15} 
          fillVariants={fillVariants}
          outerCursorVariants={outerCursorVariants}
          innerCursorVariants={innerCursorVariants}
          innerCursorStyle={{  backgroundColor: "rgba(200,200,220,1)",}}
          barStyle={{
            background: "rgba(0,0,0,0)",
          }}
          outerCursorSVG={OuterCursorSVG}
          outerCursorStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            fill:"red",
            stroke:"rgb(150,150,180)",
            strokeWidth:1,
          }}
          outerCursorOffset={borderSize}
          whileHover={"highlight"}
          whileTap={"highlight"}
          initial={"default"}
          variants={sliderVariants}
        >
          <HueCanvas 
            width={width} 
            height={height} 
          />
        </VerticalSlider>
      </motion.div>
    )
  };
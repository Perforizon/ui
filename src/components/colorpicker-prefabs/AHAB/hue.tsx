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
}

const defaultStyle = {

}

export const Hue = (props : HueProps) =>{ 
    const [input, setInput] = useState(1);
  
    const width = props.width;
    const height = props.height;
    const borderSize = props.borderSize;

    const innerCursorVariants = {
      default : {
          boxShadow:"0px 0px 25px 2px rgba(255,255,255,.5)",
          scaleY: 1,
          transition: {
            type: "tween",
            duration: .1
          }
      },
      highlight : {
          boxShadow:"0px 0px 4px 2px rgba(255,255,255,1)",
          scaleY: 2,
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
            fill: `rgba(200,200,200,1)`
        },
        highlight : {
            opacity: 1,   
            scale: 2,
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
    return (
      <motion.div id={"hue"} style={{...defaultStyle, ...props.style}}>
        <VerticalSlider 
          setInput={setInput} 
          barHeight={height}
          barWidth={width}
          innerCursorWidth={5} 
          outerCursorWidth={15} 
          fillVariants={fillVariants}
          outerCursorVariants={outerCursorVariants}
          innerCursorVariants={innerCursorVariants}
          barStyle={{
            background: "rgba(0,0,0,0)",
            boxShadow:`0px 0px 0px ${borderSize}px rgba(154,154,155,1)`
          }}
          innerCursorStyle={{backgroundColor: "rgba(240,240,240,1", boxShadow:"0px 0px 4px 2px rgba(255,255,255,0)"}}
          outerCursorSVG={OuterCursorSVG}
          outerCursorStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            fill:"red",
            stroke:"rgb(154,154,155)",
            strokeWidth:1,
          }}
          outerCursorOffset={borderSize}
          whileHover={"highlight"}
          whileTap={"highlight"}
          initial={"default"}
        >
          <HueCanvas 
            width={width} 
            height={height} 
          />
        </VerticalSlider>
      </motion.div>
    )
  };
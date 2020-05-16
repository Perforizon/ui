import React, {useState} from "react";
import {VerticalSlider} from '.';
import OuterCursorSVG from "../../../images/slider/outer-cursor.svg";
import {HueCanvas} from "@perforizon/colorpicker";
import "../../../styles/no-select.scss";
import {} from "framer-motion";

export default {
  title: "Slider-Vertical"
};

export const Vertical = () =>{ 

  const [input, setInput] = useState(1);
  return (
    <div>
      <VerticalSlider 
        setInput={setInput} 
        barHeight={200}
        barWidth={20}
        innerCursorWidth={8} 
        outerCursorWidth={15} 
        outerCursorSVG={OuterCursorSVG}
        outerCursorStyle={{backgroundColor: "rgba(0,0,0,0)"}}
      />
      <br/>
      <br/>
      <text className={"no-select"}>
        {"input: " + input.toFixed(4)}
      </text>
    </div>
  )
};

export const AHAB = () =>{ 
  const innerCursorVariants = {
    default : {
        boxShadow:"0px 0px 30px 5px rgba(255,255,255,1)",
        scaleY: 1
    },
    highlight : {
        boxShadow:"0px 0px 30px 5px rgba(255,255,255,1)",
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
          fill: "rgba(200,200,200,1)"
      },
      highlight : {
          opacity: 1,   
          scale: 2,
          fill: "rgba(255,255,255,1)",
          transition: {
            type: "tween",
            duration: .1
          }
      }
  }
  const fillVariants = {
    default : {
      backgroundColor: "rgba(104,106,106,1)"
    },
    highlight : {
      backgroundColor: "rgba(200,200,200,1)"
    }
  }
  const [input, setInput] = useState(1);
  const sliderBorderSize = 2;
  return (
    <div>
      <VerticalSlider 
        setInput={setInput} 
        barHeight={280}
        barWidth={30}
        innerCursorWidth={5} 
        outerCursorWidth={15}
        outerCursorOffset={sliderBorderSize}
        fillVariants={fillVariants}
        outerCursorVariants={outerCursorVariants}
        innerCursorVariants={innerCursorVariants}
        barStyle={{
          background: "linear-gradient(97.64deg, #020305 0.45%, #0B0D0F 100%)",
          boxShadow:`0px 0px 0px ${sliderBorderSize}px rgba(154,154,155,1)`
        }}
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1", boxShadow:"0px 0px 60px 5px rgba(255,255,255,0)"}}
        outerCursorSVG={OuterCursorSVG}
        outerCursorStyle={{backgroundColor: "rgba(0,0,0,0)", stroke:"rgb(154,154,155)", strokeWidth: 1}}
        whileHover={"highlight"}
        whileTap={"highlight"}
        initial={"default"}
      />
      <br/>
      <br/>
      <text className={"no-select"}>
        {"input: " + input.toFixed(4)}
      </text>
    </div>
  )
};

export const Hue = () =>{ 
  const [input, setInput] = useState(1);

  const width = 30;
  const height = 280;
  const borderWidth = 2;
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
    <div>
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
          boxShadow:`0px 0px 0px ${borderWidth}px rgba(154,154,155,1)`
        }}
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1", boxShadow:"0px 0px 4px 2px rgba(255,255,255,0)"}}
        outerCursorSVG={OuterCursorSVG}
        outerCursorStyle={{
          backgroundColor: "rgba(0,0,0,0)",
          fill:"red",
          stroke:"rgb(154,154,155)",
          strokeWidth:1,
        }}
        outerCursorOffset={borderWidth}
        whileHover={"highlight"}
        whileTap={"highlight"}
        initial={"default"}
      >
        <HueCanvas 
          width={width} 
          height={height} 
        />
      </VerticalSlider>
      <br/>
      <br/>
      <text className={"no-select"}>
        {"input: " + input.toFixed(4)}
      </text>
    </div>
  )
};



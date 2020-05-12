import React, {useState} from "react";
import {HorizontalSlider} from '.';
import OuterCursorSVG from "../../../images/slider/outer-cursor.svg"
import {OpacityCanvas} from "@perforizon/colorpicker";
import "../../../styles/no-select.scss";

export default {
  title: "Slider-Horizontal"
};

export const Horizontal = () =>{ 
  const outerCursorVariants = {
    default : {
        scale : 1/10
    },
    highlight : {
        scale: 2/10
    }
}
  const [input, setInput] = useState(1);
  return (
    <div>
      <HorizontalSlider 
        setInput={setInput} 
        barHeight={20}
        barWidth={200}
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
        boxShadow:"0px 0px 25px 5px rgba(255,255,255,0)",
        scaleX: 1
    },
    highlight : {
        boxShadow:"0px 0px 30px 5px rgba(255,255,255,1)",
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
      <HorizontalSlider 
        setInput={setInput} 
        barHeight={30}
        barWidth={280}
        fillVariants={fillVariants}
        barStyle={{
          background: "linear-gradient(97.64deg, #020305 0.45%, #0B0D0F 100%)",
          boxShadow:`0px 0px 0px ${sliderBorderSize}px rgba(154,154,155,1)`
        }}
        innerCursorWidth={5} 
        innerCursorVariants={innerCursorVariants}
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1", boxShadow:"0px 0px 60px 5px rgba(255,255,255,0)"}}
        outerCursorVariants={outerCursorVariants}
        outerCursorWidth={15}
        outerCursorOffset={sliderBorderSize}
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

export const Opacity = () =>{ 
  const [input, setInput] = useState(1);

  const width = 280;
  const height = 30;
  const borderWidth = 2;
  const innerCursorVariants = {
    default : {
        boxShadow:"0px 0px 0px 1px rgba(255,255,255,.5)",
        scaleX: 1,
        transition: {
          type: "tween",
          duration: .1
        }
    },
    highlight : {
        boxShadow:"0px 0px 2px 2px rgba(200,200,200,1)",
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
      <HorizontalSlider 
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
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1"}}
        outerCursorSVG={OuterCursorSVG}
        outerCursorStyle={{
          backgroundColor: "rgba(0,0,0,0)",
          fill:"red",
          top:155,
          stroke:"rgb(154,154,155)",
          strokeWidth:1,
        }}
        outerCursorOffset={borderWidth}
        whileHover={"highlight"}
        whileTap={"highlight"}
        initial={"default"}
      >
        <OpacityCanvas 
          width={width} 
          height={height} 
          color={[1,0,0,1]}
          patternColor0={[.7,.7,.7,.7]}
          patternColor1={[.4,.4,.4,.7]}
          patternSize={16}
        />
      </HorizontalSlider>
      <br/>
      <br/>
      <text className={"no-select"}>
        {"input: " + input.toFixed(4)}
      </text>
    </div>
  )
};
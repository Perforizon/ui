import React, {useState} from "react";
import {HorizontalSlider} from '.';
import outerCursorSVGUrl from "./outerCursor.svg";
import {OpacityCanvas} from "@perforizon/colorpicker";

import "../../../styles/no-select.scss";

export default {
  title: "Slider"
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
        barStyle={{backgroundColor: "red"}}
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1"}}
        outerCursorStyle={{backgroundColor: "rgba(0,0,0,0)"}}
        outerCursorSVGUrl={outerCursorSVGUrl}
      />
      <br/>
      <br/>
      <text className={"no-select"}>
        {"input: " + input.toFixed(4)}
      </text>
    </div>
  )
};

export const HorizontalAhabStyle = () =>{ 
  const innerCursorVariants = {
    default : {
        boxShadow:"0px 0px 25px 5px rgba(255,255,255,0)",
        scaleX: 1
    },
    highlight : {
        boxShadow:"0px 0px 25px 2px rgba(255,255,255,1)",
        scaleX: 2,
        transition: {
          type: "tween",
          duration: .1
        }
    }
  }
  const outerCursorVariants = {
      default : {
          filter: "invert(0.0)",
          opacity: .7,
          scale : 1
      },
      highlight : {
          filter: "invert(1)",
          opacity: 1,   
          scale: 2,
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
  return (
    <div>
      <HorizontalSlider 
        setInput={setInput} 
        barHeight={30}
        barWidth={280}
        innerCursorWidth={5} 
        outerCursorWidth={15} 
        fillVariants={fillVariants}
        outerCursorVariants={outerCursorVariants}
        innerCursorVariants={innerCursorVariants}
        barStyle={{
          background: "linear-gradient(97.64deg, #020305 0.45%, #0B0D0F 100%)",
          boxShadow:"0px 0px 0px 2px rgba(154,154,155,1)"
        }}
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1"}}
        outerCursorStyle={{backgroundColor: "rgba(0,0,0,0)"}}
        outerCursorSVGUrl={outerCursorSVGUrl}
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

export const HorizontalOpacityStyle = () =>{ 
  const width = 280;
  const height = 30;
  const borderWidth = 2;
  const innerCursorVariants = {
    default : {
        boxShadow:"0px 0px 25px 2px rgba(255,255,255,.5)",
        scaleX: 1,
        transition: {
          type: "tween",
          duration: .1
        }
    },
    highlight : {
        boxShadow:"0px 0px 25px 2px rgba(255,255,255,1)",
        scaleX: 2,
        transition: {
          type: "tween",
          duration: .1
        }
    }
  }
  const outerCursorVariants = {
      default : {
          filter: "invert(0.0)",
          opacity: .7,
          scale : 1
      },
      highlight : {
          filter: "invert(1)",
          opacity: 1,   
          scale: 2,
          transition: {
            type: "tween",
            duration: .1
          }
      }
  }
  const fillVariants = {
    default : {
      backgroundColor: "rgba(200,200,200,.1)"
    },
    highlight : {
      backgroundColor: "rgba(255,255,255,.5)"
    }
  }
  const [input, setInput] = useState(1);
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
        outerCursorStyle={{backgroundColor: "rgba(0,0,0,0)"}}
        outerCursorSVGUrl={outerCursorSVGUrl}
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
          style={{position:"absolute", top:"0px", left:"0px"}}
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
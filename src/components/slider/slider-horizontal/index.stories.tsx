import React, {useState} from "react";
import {HorizontalSlider} from '.';
import outerCursorSVGUrl from "./outerCursor.svg";

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
  const [input, setInput] = useState(0);
  return (
    <div>
      <HorizontalSlider 
        setInput={setInput} 
        barHeight={10}
        barWidth={100}
        innerCursorWidth={8} 
        outerCursorWidth={10} 
        barStyle={{backgroundColor: "red"}}
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1"}}
        outerCursorStyle={{backgroundColor: "rgba(0,0,0,0)"}}
        outerCursorSVGUrl={outerCursorSVGUrl}
      />
      {"input: " + input.toFixed(4)}
    </div>
  )
};

export const HorizontalStyled = () =>{ 
  const innerCursorVariants = {
    default : {
        scaleX: 1
    },
    highlight : {
        scaleX: 2
    }
  }
  const outerCursorVariants = {
      default : {
          scale : 1
      },
      highlight : {
          scale: 2
      }
  }
  const [input, setInput] = useState(0);
  return (
    <div>
      <HorizontalSlider 
        setInput={setInput} 
        barHeight={15}
        barWidth={140}
        innerCursorWidth={5} 
        outerCursorWidth={15} 
        outerCursorVariants={outerCursorVariants}
        innerCursorVariants={innerCursorVariants}
        fillStyle={{
          backgroundColor: "rgba(104,106,106,1)"
        }}
        barStyle={{
          background: "linear-gradient(97.64deg, #020305 0.45%, #0B0D0F 100%)",
          boxShadow:"0px 0px 0px 2px rgba(154,154,155,1)"
        }}
        innerCursorStyle={{backgroundColor: "rgba(240,240,240,1"}}
        outerCursorStyle={{backgroundColor: "rgba(0,0,0,0)"}}
        outerCursorSVGUrl={outerCursorSVGUrl}
      />
      {"input: " + input.toFixed(4)}
    </div>
  )
};
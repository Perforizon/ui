
import React from "react";
import Scrollbar, {Scrollbars} from "react-custom-scrollbars"

export default {
    title: "lib scrollbar"
}

interface LoremIpsumProps {
    id : number
}
const LoremIpsum = (props : LoremIpsumProps) =>
{
    const style : React.CSSProperties = {
        height: 400,
        width: `100%`,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: `rgb(255, 179, 189)`,
        userSelect: `none`
    }
    return (
        <div style={style}>
            {props.id}
        </div>
    );
}

export const libscroll = () => {
    return (
    <Scrollbars style={{width:500, height:50}} renderView={LoremIpsum}>
        <div>im a scrollbar</div>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
        <LoremIpsum id={0}></LoremIpsum>
    </Scrollbars>
    )
}
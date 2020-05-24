import React, { useState, useRef,ReactElement, cloneElement, ComponentType, HTMLAttributes, MutableRefObject, forwardRef, useImperativeHandle, Children, isValidElement, useEffect } from "react"
import CSS from "csstype"

export default {
    title : "compund scroll 3"
}

interface ViewportProps extends HTMLAttributes<HTMLDivElement> {
    scrollbarSensitivity ?: number;
}
interface ScrollbarComponent {
    scrollbarId : string;
    defaultStyle : CSS.Properties;
}
interface ScrollbarElement extends ReactElement<any, ComponentType> {
    type : ComponentType & ScrollbarComponent;
}
interface ViewportComponent extends ScrollbarComponent{
    (props : ViewportProps) : JSX.Element;
}
interface ContentProps extends HTMLAttributes<HTMLDivElement>{}
interface ContentPropsInternal extends ContentProps {
    outRef : MutableRefObject<MutableRefObject<HTMLDivElement>>;
}
interface ContentComponent extends ScrollbarComponent {
    (props : ContentProps) : JSX.Element;
}
interface TrackProps extends HTMLAttributes<HTMLDivElement>{}
interface TrackPropsInternal extends TrackProps {
    outRefTrack : MutableRefObject<MutableRefObject<HTMLDivElement>>;
    outRefThumb : MutableRefObject<MutableRefObject<HTMLDivElement>>;
}
interface TrackComponent extends ScrollbarComponent {
    (props : TrackProps) : JSX.Element;
}
interface ThumbProps extends HTMLAttributes<HTMLDivElement>{}
interface ThumbPropsInternal extends ThumbProps  {
    outRef : MutableRefObject<MutableRefObject<HTMLDivElement>>;
}
interface ThumbComponent extends ScrollbarComponent {
    (props : ThumbProps) : JSX.Element;
}


/**
 *  `Content's` and `Thumb's` `translation` css property will be overwritten. To apply a 
 *  translation, use `transform` css property instead.
 */
class ScrollBar
{
    static Viewport : ViewportComponent = Object.assign(
        forwardRef((props: ViewportProps, publicRef:MutableRefObject<HTMLDivElement>)=>{
            const Content = useRef<MutableRefObject<HTMLDivElement>>(null);
            const Track = useRef<MutableRefObject<HTMLDivElement>>(null);
            const Thumb = useRef<MutableRefObject<HTMLDivElement>>(null);
            
            const internalRef = useRef<HTMLDivElement>(null);
            useImperativeHandle(publicRef, ()=>internalRef.current);

            const children = Children.map(props.children, (child)=>{
                if (isValidElement(child))
                {
                    const type = (child as ScrollbarElement).type
                    if (type.scrollbarId == "Content")
                        return cloneElement(child as ReactElement<ContentPropsInternal>, {outRef: Content});
                    else if (type.scrollbarId == "Track")
                        return cloneElement(child as ReactElement<TrackPropsInternal>, {outRefTrack: Track, outRefThumb: Thumb});
                    else 
                        return child
                }
                return child
            })

            useEffect(()=>{
                console.log("CONTENT", Content);
                console.log("TRACK", Content);
                console.log("THUMB", Thumb);
            },[])
            return <div {...props} style={{...ScrollBar.Viewport.defaultStyle,...props.style}} ref={internalRef}>{children}</div>
        }), {
            defaultStyle: { overflow:"hidden"} as CSS.Properties,
            scrollbarId: "Viewport"
        }
    );
    static Content : ContentComponent = Object.assign(
        forwardRef((props: ContentPropsInternal, publicRef:MutableRefObject<HTMLDivElement>)=>{
            const internalRef = useRef<HTMLDivElement>(null);
            useImperativeHandle(publicRef, ()=>internalRef.current);
            props.outRef.current = internalRef;
            return <div {...props} ref={internalRef}>{props.children}</div>
        }),{
            defaultStyle: { 
                position: "relative",
                width: "100%",
            } as CSS.Properties,
            scrollbarId: "Content"
        }
    );
    static Track : TrackComponent = Object.assign(
        forwardRef((props : TrackPropsInternal, publicRef:MutableRefObject<HTMLDivElement>)=>{
            const internalRef = useRef<HTMLDivElement>(null);
            useImperativeHandle(publicRef, ()=>internalRef.current);
            props.outRefTrack.current = internalRef;
            const children = Children.map(props.children, (child)=>{
                if (isValidElement(child))
                {
                    const type = (child as ScrollbarElement).type
                    if (type.scrollbarId == "Thumb")
                        return cloneElement(child as ReactElement<ThumbPropsInternal>, {outRef: props.outRefThumb});
                    else 
                        return child
                }
                return child
            })
            return <div  {...props} style={{...ScrollBar.Track.defaultStyle,...props.style}} ref={internalRef}>{children}</div>
        }), {
            defaultStyle: { 
                position:"absolute",
                top:0,
                right: 0,
                height:"100%",
                width: "1vw",
                backgroundColor: "rgb(220,220,220)"
            } as CSS.Properties,
            scrollbarId: "Track"
        }
    );
    static Thumb : ThumbComponent  = Object.assign(
        forwardRef((props: ThumbPropsInternal, publicRef:MutableRefObject<HTMLDivElement>)=>{
            const internalRef = useRef<HTMLDivElement>(null);
            useImperativeHandle(publicRef, ()=>internalRef.current);
            props.outRef.current = internalRef;
            return <div  {...props} style={{...ScrollBar.Thumb.defaultStyle,...props.style}} ref={internalRef}>{props.children}</div>
        }),{
            defaultStyle : {
                height: "1vh",
                width: "100%",
                backgroundColor: "rgb(63,63,63)"
            },
            scrollbarId: "Thumb"
        }
    )
}

export const CompoundScroll3 = () => {
    const ParentStyle : CSS.Properties = {
        width: "100px",
        height: "100px",
        backgroundColor: "blue"
    }
    const Variants : CSS.Properties[] = new Array<CSS.Properties>();
    Variants.push({
        ...ParentStyle,
        backgroundColor:"red"
    })
    Variants.push({
        ...ParentStyle,
        backgroundColor:"green"
    })
    const [currentStyle, setCurrentStyle] = useState<CSS.Properties>(ParentStyle);
    const variantIndex = useRef(0);
    return (
        <ScrollBar.Viewport 
            style={currentStyle} 
            onClick={()=>{
                setCurrentStyle(Variants[variantIndex.current])
                variantIndex.current = (variantIndex.current+1) % Variants.length;
            }
        }>
            <ScrollBar.Content>
            </ScrollBar.Content>
            <ScrollBar.Track>
                <ScrollBar.Thumb/>
            </ScrollBar.Track>
        </ScrollBar.Viewport >
    )
}
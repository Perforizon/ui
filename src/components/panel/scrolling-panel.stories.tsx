import React, { useState, useRef,ReactElement, cloneElement, ComponentType, HTMLAttributes, MutableRefObject, forwardRef, useImperativeHandle, Children, isValidElement, useEffect, useLayoutEffect } from "react"
import {Clamp} from "@perforizon/math"
import CSS from "csstype"

//======================================================================
interface LoremIpsumProps {
    id ?: number
}
const LoremIpsum = (props : LoremIpsumProps) =>
{
    const style : CSS.Properties = {
        position: "relative",
        height: "20px",
        width: `100%`,
        backgroundColor: `rgb(255, 179, 189)`,
        marginBottom: "5px",
        userSelect: `none`
    }
    return (
        <div style={style}>
            {props.id}
        </div>
    );
}
//======================================================================

export default {
    title : "scrolling-panel"
}

interface ViewportProps extends HTMLAttributes<HTMLDivElement> {
    scrollbarSensitivity ?: number;
    onScrollLeave ?: (event:MouseEvent) => void;
    onScrollOver ?: (event:MouseEvent) => void;
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
    defaultProps : ViewportProps;
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
class ScrollingPanel
{
    static Viewport : ViewportComponent = Object.assign(
        forwardRef((props: ViewportProps, publicRef:MutableRefObject<HTMLDivElement>)=>{
            props = {...ScrollingPanel.Viewport.defaultProps, ...props, style:{...ScrollingPanel.Viewport.defaultStyle,...props.style}};

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

            const scrollY = useRef(0);
            const processWheelAnimationFrame = useRef(false);
            const wheelHandler = (event : WheelEvent) => {
                /**
                 * `requestAnimationFrame` prevents slight jitter
                 * using `processScrollAnimationFrame` to throttle prevents excess calls 
                 * which may result in less frames per second
                 * https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
                 */
                if (!processWheelAnimationFrame.current)
                {
                    requestAnimationFrame(
                        ()=>{        
                            const viewportHeight = internalRef.current.getBoundingClientRect().height;
                            // set content y
                            const deltaY = Math.sign(event.deltaY) * props.scrollbarSensitivity;
                            const contentScrollHeight = Math.max(0, Content.current.current.getBoundingClientRect().height - viewportHeight);
                            scrollY.current = Clamp(scrollY.current - deltaY, -contentScrollHeight, 0);
                            Content.current.current.style.translate = `0px ${scrollY.current}px`;

                            // set thumb y
                            const thumbScrollHeight = viewportHeight-Thumb.current.current.getBoundingClientRect().height;
                            Thumb.current.current.style.translate = `0px ${-scrollY.current/contentScrollHeight * thumbScrollHeight}px`;

                            processWheelAnimationFrame.current = false;
                        }
                    );
                    processWheelAnimationFrame.current = true;
                }
            };

            const lastMousePos = useRef({x:0,y:0});
            const previousScrollHeight = useRef(0);
            // update thumb size on content size change
            useLayoutEffect(()=>{
                // set thumb size
                const viewportRect = internalRef.current.getBoundingClientRect();
                const contentHeight = Content.current.current.getBoundingClientRect().height;
                const viewportHeight = viewportRect.height;
                Thumb.current.current.style.height = `${viewportHeight/(contentHeight | 1) * viewportHeight}px`;
                
                // set thumb y
                const contentScrollHeight = Math.max(0, contentHeight - viewportHeight);
                const thumbScrollHeight = viewportHeight-Thumb.current.current.getBoundingClientRect().height;
                Thumb.current.current.style.translate = `0px ${-scrollY.current/contentScrollHeight * thumbScrollHeight}px`;

                // call onScrollOver if thumbScrollHeight is greater than 0 and mouse is hovering
                if (previousScrollHeight.current == 0 && contentScrollHeight > 0)
                {
                    if (
                            // is mouse X within viewport's horizontal bounds?
                            lastMousePos.current.x > viewportRect.x && lastMousePos.current.x < viewportRect.x + viewportRect.width &&
                            // is mouse Y within viewport's vertical bounds?
                            lastMousePos.current.y > viewportRect.y && lastMousePos.current.y < viewportRect.y + viewportRect.height
                        )
                        internalRef.current.dispatchEvent(new MouseEvent("mouseover"));
                }
                previousScrollHeight.current = contentScrollHeight;
            });

            const isDragging = useRef(false);
            const dragStart = (y: number) => 
            {
                isDragging.current = true;
                internalRef.current.style.pointerEvents = `none`;
                internalRef.current.style.userSelect = `none`;
            }
            const dragEnd = () => 
            {
                isDragging.current = false;
                internalRef.current.style.pointerEvents = props.style.pointerEvents.valueOf();
                internalRef.current.style.userSelect = props.style.userSelect.valueOf();
            }
            const processMoveAnimationFrame = useRef(false);
            const dragMove = (y: number) => {
                if (!processMoveAnimationFrame.current)
                {
                    requestAnimationFrame(
                        ()=>{    
                            const viewportBoundingRect = internalRef.current.getBoundingClientRect();
                            const thumbBoundingRect = Thumb.current.current.getBoundingClientRect();
                            const viewportY = viewportBoundingRect.y;
                            const viewportHeight = viewportBoundingRect.height;
                            const thumbHeight = thumbBoundingRect.height;
                            const thumbScrollHeight = viewportHeight-thumbHeight;
                            if (thumbScrollHeight > 0)
                            {
                                const contentScrollHeight = Content.current.current.getBoundingClientRect().height-viewportHeight
                        
                                const thumbY = Clamp(y-viewportY-thumbHeight/2, 0, thumbScrollHeight);
                                // TODO fix THUMB not snapping to center on cursor
                                Thumb.current.current.style.translate = `0px ${thumbY}px`;
                                const contentY = -thumbY/thumbScrollHeight * contentScrollHeight;

                                Content.current.current.style.translate = `0px ${contentY}px`;
                                scrollY.current = contentY;
                            }

                            processMoveAnimationFrame.current= false;
                        }
                    )
                    processMoveAnimationFrame.current = true;
                }
            }
            const MouseDownHandler = (event:MouseEvent) =>{
                dragStart(event.clientY);
                dragMove(event.clientY);
            }
            const MouseUpHandler = (event:MouseEvent) => {
                if (isDragging.current)
                {
                    dragEnd();
                    props.onScrollLeave(event);
                }
            }
            const MouseMoveHandler = (event:MouseEvent) => {
                if (isDragging.current)
                {
                    dragMove(event.clientY);
                }
                lastMousePos.current = {x: event.clientX, y: event.clientY};
            }
            const MouseLeaveHandler = (event:MouseEvent) => {
                if (!isDragging.current)
                {
                    props.onScrollLeave(event);
                }
            }
            const MouseOverHandler = (event:MouseEvent) => {
                const contentHeight = Content.current.current.getBoundingClientRect().height;
                const viewportHeight = internalRef.current.getBoundingClientRect().height;
                const contentScrollHeight = Math.max(0, contentHeight - viewportHeight);
                if (contentScrollHeight > 0)
                    props.onScrollOver(event);
            }
            useEffect(()=>{
                internalRef.current.addEventListener("wheel", wheelHandler, {passive:true});
                internalRef.current.addEventListener("mouseleave", MouseLeaveHandler);
                internalRef.current.addEventListener("mouseover", MouseOverHandler);
                Track.current.current.addEventListener("mousedown", MouseDownHandler, {passive:true});
                window.addEventListener("mouseup", MouseUpHandler, {passive:true});
                window.addEventListener("mousemove", MouseMoveHandler, {passive:true});
                return ()=>{ 
                    internalRef.current.removeEventListener("wheel", wheelHandler);
                    internalRef.current.removeEventListener("mouseleave", MouseLeaveHandler);
                    Track.current.current.removeEventListener("mousedown", MouseDownHandler);
                    window.removeEventListener("mouseup", MouseUpHandler);
                    window.removeEventListener("mousemove", MouseMoveHandler);
                }
            },[])
            return <div {...props} ref={internalRef}>{children}</div>
        }), {
            defaultStyle: { 
                position:"relative",
                overflow:"hidden",
                pointerEvents: "initial",
                userSelect: "initial"
            } as CSS.Properties,
            scrollbarId: "Viewport",
            defaultProps: {
                scrollbarSensitivity: 10
            }
        }
    );
    /**
     *  css property `translate` is set automatically by the component's internals
     *  attempting to set `translate` through props will not produce any effect.
     */
    static Content : ContentComponent = Object.assign(
        forwardRef((props: ContentPropsInternal, publicRef:MutableRefObject<HTMLDivElement>)=>{
            const internalRef = useRef<HTMLDivElement>(null);
            useImperativeHandle(publicRef, ()=>internalRef.current);
            props.outRef.current = internalRef;
            return <div {...props} style={{...ScrollingPanel.Content.defaultStyle,...props.style}} ref={internalRef}>{props.children}</div>
        }),{
            defaultStyle: { 
                position: "relative",
                width: "100%",
                // use overflow:hidden so that the content div's size includes margins.
                // otherwise the scroll functionality does function properly
                overflow: "hidden"
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
            return <div  {...props} style={{...ScrollingPanel.Track.defaultStyle,...props.style}} ref={internalRef}>{children}</div>
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
    /**
     *  css property `translate` is set automatically by the component's internals
     *  attempting to set `translate` through props will not produce any effect.
     */
    static Thumb : ThumbComponent  = Object.assign(
        forwardRef((props: ThumbPropsInternal, publicRef:MutableRefObject<HTMLDivElement>)=>{
            const internalRef = useRef<HTMLDivElement>(null);
            useImperativeHandle(publicRef, ()=>internalRef.current);
            props.outRef.current = internalRef;
            return <div  {...props} style={{...ScrollingPanel.Thumb.defaultStyle,...props.style}} ref={internalRef}>{props.children}</div>
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

export const ScrollingPanelStory = () => {
    const ViewportStyle : CSS.Properties = {
        width: "100px",
        maxHeight: "700px",
        backgroundColor: "lightskyblue"
    }
    const Variants : CSS.Properties[] = new Array<CSS.Properties>();
    Variants.push({
        ...ViewportStyle,
        backgroundColor:"red"
    })
    Variants.push({
        ...ViewportStyle,
        backgroundColor:"lightskyblue",
        transition: ".4s cubic-bezier(.33,.8,.42,.96) 0s"
    })
    const [currentStyle, setCurrentStyle] = useState<CSS.Properties>(ViewportStyle);
    const [trackVariantStyle, setTrackVariantStyle] = useState<CSS.Properties>({});
    const variantIndex = useRef(0);

    const [loremIpsums, setLoremIpsums] = useState<ReactElement[]>(new Array<ReactElement>());
    const i = useRef(0);

    return (
        <ScrollingPanel.Viewport 
            style={ViewportStyle}

            onClick={()=>{
                // on click add lorem ipsum elements to test scrollbar functionality
                setLoremIpsums(loremIpsums.concat(<LoremIpsum id={i.current}/>));
                i.current++;
            }}

            onScrollOver={()=>{
                setTrackVariantStyle({
                    translate: "0px 0px"
                })
            }}

            onScrollLeave={()=>{
                setTrackVariantStyle({
                    translate: "100% 0px"
                })
            }} 

            scrollbarSensitivity={20}
        >
            <ScrollingPanel.Content style={{transition: "translate .4s cubic-bezier(.33,.8,.42,.96) 0s"}}>
                <p style={{userSelect:"none"}}>Content</p>
                {loremIpsums}
            </ScrollingPanel.Content>
            <ScrollingPanel.Track style={{
                    translate: "100% 0px",
                    transition: "translate .4s cubic-bezier(.33,.8,.42,.96) 0s, height .2s",
                    ...trackVariantStyle
                }}>
                <ScrollingPanel.Thumb 
                    style={{minHeight:"15px", transition: "translate .4s cubic-bezier(.33,.8,.42,.96) 0s, height .2s"}}
                />
            </ScrollingPanel.Track>
        </ScrollingPanel.Viewport>
    )
}
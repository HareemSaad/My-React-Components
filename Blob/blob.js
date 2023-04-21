import React, { useEffect, useRef } from 'react';
import { gsap, Sine } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import './style.css';

export const Blob = (props) => {
  
    // Blob reference
    const blobWrapper = useRef(null);
    const blob = useRef(null);
    const blobText = useRef(null);
  
    useEffect(() => {
  
      // Transition of blob animation
      const tl = gsap.timeline({
        ScrollTrigger: {
          trigger: blobWrapper.current,
          toggleActions: 'play pause reverse reset',
          start: 'center center',
          end: 'bottom center',
          scrub: true,
        },
      });
      tl.to(blobText.current, { innerHTML: props.txt, fontSize: '20px' });
      // animation to shrink the blob to this size
      props.shrink === 'false' ? console.log("no shrink") : tl.to(blob.current, {
          height: props.newHeight,
          width: props.newWidth,
          top: 'unset',
          left: 'unset',
          right: '10px',
          bottom: '10px',
          transform: 'translate(0,0)',
          ease: 'power4',
          duration: 3,
        });
    }, []);
  
    return (
      <>
        <div className='blob' style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: props.initialHeight,
          width: props.initialWidth,
          borderRadius: '50%',
          cursor: 'pointer',
          pointerEvents: 'auto',
          textAlign: 'center',
          padding: '5rem',
          color: 'var(--pm-8)',
          fontSize: 'var(--text-subtitle-1)'
        }} ref={blob}>
        <span ref={blobText} style={{position: 'absolute', zIndex: '2'}}></span>
        
        <BlobAnimation color={props.color} x={props.x} y={props.y} imgBlob={props.imgBlob} imgLink={props.imgLink}/>
        </div>

      </>
    );
  }

// Blob Animation Component
const BlobAnimation = (props) => {
  const patternId = `pattern-${Math.floor(Math.random() * 100000)}`; // Generate a unique pattern id
  {console.log(`${props.color} !important`)}
    // Blob animation
    const blob = useRef(null)
  
    useEffect(() => {
      const random = (min, max) => {
        if (max == null) {
          max = min
          min = 0
        }
        if (min > max) {
          const tmp = min
          min = max
          max = tmp
        }
        return min + (max - min) * Math.random()
      }
  
      const cardinal = (data, closed, tension) => {
        if (data.length < 1) return "M0 0"
        if (tension == null) tension = 1
  
        const size = data.length - (closed ? 0 : 1)
        let path = "M" + data[0].x + " " + data[0].y + " C"
  
        for (let i = 0; i < size; i++) {
          let p0, p1, p2, p3
  
          if (closed) {
            p0 = data[(i - 1 + size) % size]
            p1 = data[i]
            p2 = data[(i + 1) % size]
            p3 = data[(i + 2) % size]
          } else {
            p0 = i == 0 ? data[0] : data[i - 1]
            p1 = data[i]
            p2 = data[i + 1]
            p3 = i == size - 1 ? p2 : data[i + 2]
          }
  
          const x1 = p1.x + ((p2.x - p0.x) / 6) * tension
          const y1 = p1.y + ((p2.y - p0.y) / 6) * tension
  
          const x2 = p2.x - ((p3.x - p1.x) / 6) * tension
          const y2 = p2.y - ((p3.y - p1.y) / 6) * tension
  
          path +=
            " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + p2.x + " " + p2.y
        }
  
        return closed ? path + "z" : path
      }
  
      const createBlob = options => {
        const points = []
        const path = blob
        const slice = (Math.PI * 2) / options.numPoints
        const startAngle = random(Math.PI * 2, 0.25)
  
        const tl = gsap.timeline({
          onUpdate: update,
          paused: true
        })
  
        for (let i = 0; i < options.numPoints; i++) {
          const angle = startAngle + i * slice
          const duration = random(options.minDuration, options.maxDuration)
  
          const point = {
            x: options.centerX + Math.cos(angle) * options.minRadius,
            y: options.centerY + Math.sin(angle) * options.minRadius
          }
  
          const tween = gsap.to(point, duration, {
            x: options.centerX + Math.cos(angle) * options.maxRadius,
            y: options.centerY + Math.sin(angle) * options.maxRadius,
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut
          })
  
          tl.add(tween, -random(duration, 0))
          points.push(point)
        }
  
        options.tl = tl
        options.points = points
  
        tl.progress(1)
          .progress(0)
          .timeScale(0)
        update()
  
        function update() {
          const path = blob.current
          path.setAttribute("d", cardinal(points, true, 1))
        }
  
        return options
      }
  
      const blob1 = createBlob({
        element: blob,
        numPoints: 8,
        centerX: 500,
        centerY: 500,
        minRadius: 375,
        maxRadius: 425,
        minDuration: 1,
        maxDuration: 2
      })
      gsap.to(blob1.tl, 10, {
        timeScale: 2,
        onStart() {
          blob1.tl.play()
        }
      })
    }, [])
  
    return (
      <svg className='svg' viewBox="0 0 1000 1000" style={{height: '100% !important', width: '100% !important'}}>
        <defs>
          <pattern id={patternId} x="0" y="0" width="100%" height="100%">
            <image href={props.imgLink} width="100%" x={props.x} y={props.y}/>
          </pattern>
        </defs>
          {/* <path className='blob1' ref={blob} style={{fill: props.color}}/> */}
          {console.log("is blob :: ", props.imgBlob === 'true')}
          {props.imgBlob === 'true' ? <path className='blob1' ref={blob} style={{height: '100%', width: '100%', transition: '0.2s', strokeLinecap: 'butt', strokeDasharray: '0', fill: `url(#${patternId})`}}/> : <path className='blob1' ref={blob} style={{height: '100%', width: '100%', transition: '0.2s', strokeLinecap: 'butt', strokeDasharray: '0', fill: props.color}}/>}

      </svg>
    )
  }

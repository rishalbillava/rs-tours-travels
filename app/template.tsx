'use client';
import * as m from 'motion/react-m';
import type {ReactNode} from 'react';
import {useMotion} from '../components/MotionProvider';
export default function Template({children}:{children:ReactNode}){const {paused}=useMotion();return <m.div initial={paused?false:{opacity:.8,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35,ease:'easeOut'}}>{children}</m.div>}

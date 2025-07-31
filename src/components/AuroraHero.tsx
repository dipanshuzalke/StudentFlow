import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { useEffect } from 'react';
import HeroText from './HeroText';
import { FaArrowRightLong } from "react-icons/fa6";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const COLORS = ["#13ffaa", "#1e67c6", "#ce84cf", "#dd335c"];

const AuroraHero = () => {
    const color = useMotionValue(COLORS[0])

    const background = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`
    const border = useMotionTemplate`1px solid ${color}`
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`
    useEffect(() => {
        animate(color, COLORS, {
            ease: 'easeInOut',
            duration: 10,
            repeat: Infinity,
            repeatType: 'mirror'
        })
    })
    const navigate = useNavigate();
    const { user } = useApp();

    const handleStart = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <motion.section
            style={{background}}
            className="relative min-h-screen flex flex-col items-center justify-center gap-[2.5vw] z-9
            overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
        > 
            <HeroText/>
            <motion.div 
                className='group flex items-center justify-center gap-2 px-5 py-4 rounded-full
                font-semibold text-[1vw] leading-4 bg-gray-950 transition-colors hover:bg-gray-950/50 cursor-pointer z-50'
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                style={{border, boxShadow}}
                onClick={handleStart}
            >
                Start now
                <FaArrowRightLong 
                    className='text-[1vw] transition-transform group-hover:-rotate-45 
                    group-active:rotate-45'
                />
            </motion.div>
            
            <div className='absolute w-full h-full top-0 left-0 z-0 pointer-events-none'>
                <Canvas>
                    <Stars
                        radius={100}
                        depth={50}
                        count={5000}
                        factor={4}
                        saturation={0}
                        fade
                    />
                </Canvas>
            </div>
        </motion.section>
    )
}

export default AuroraHero

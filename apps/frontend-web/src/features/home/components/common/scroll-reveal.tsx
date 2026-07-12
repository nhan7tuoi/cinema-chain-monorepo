"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
    children: ReactNode,
    delay?: number,
    duration?: number;
    y?: number,
    className?: string
};
export function ScrollReveal(
    {
        children,
        delay = 0,
        duration = 0.5,
        y = 28,
        className

    }: ScrollRevealProps) {
    const reduceMotion = useReducedMotion();
    return (
        <motion.div
            className={className}

            initial={
                reduceMotion ? false :
                    {
                        opacity: 0,
                        y
                    }}

            whileInView={
                reduceMotion ? undefined :
                    {
                        opacity: 1,
                        y: 0
                    }}
            viewport={{
                once: true
            }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    )
}

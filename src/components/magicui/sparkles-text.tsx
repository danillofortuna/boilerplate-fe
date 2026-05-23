"use client";

import React, { CSSProperties, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
    id: string;
    x: string;
    y: string;
    color: string;
    delay: number;
    scale: number;
    lifespan: number;
}

interface SparklesTextProps {
    children: React.ReactNode;
    className?: string;
    sparklesCount?: number;
    colors?: {
        first: string;
        second: string;
    };
}

export const SparklesText: React.FC<SparklesTextProps> = ({
    children,
    className,
    sparklesCount = 10,
    colors = {
        first: "#A07CFE",
        second: "#FE8FB5",
    },
}) => {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        const generateSparkle = (): Sparkle => {
            return {
                id: `${Date.now()}-${Math.random()}`,
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                color: Math.random() > 0.5 ? colors.first : colors.second,
                delay: Math.random() * 2,
                scale: Math.random() * 1 + 0.3,
                lifespan: Math.random() * 10 + 5,
            };
        };

        const interval = setInterval(() => {
            setSparkles((currentSparkles) => {
                const newSparkles = currentSparkles.filter(
                    (sparkle) =>
                        parseFloat(sparkle.id.split("-")[0]) >
                        Date.now() - sparkle.lifespan * 1000,
                );
                if (newSparkles.length < sparklesCount) {
                    newSparkles.push(generateSparkle());
                }
                return newSparkles;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [colors.first, colors.second, sparklesCount]);

    return (
        <div
            className={cn("relative inline-block", className)}
            style={
                {
                    "--sparkles-first-color": `${colors.first}`,
                    "--sparkles-second-color": `${colors.second}`,
                } as CSSProperties
            }
        >
            <span className="relative z-10">{children}</span>
            <span className="absolute inset-0">
                {sparkles.map((sparkle) => (
                    <SparkleComponent key={sparkle.id} {...sparkle} />
                ))}
            </span>
        </div>
    );
};

interface SparkleProps extends Sparkle { }

const SparkleComponent: React.FC<SparkleProps> = ({ x, y, color, delay, scale }) => {
    return (
        <motion.span
            className="absolute inline-block"
            style={{
                left: x,
                top: y,
                color: color,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 1, 0],
                scale: [0, scale, 0],
            }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: "easeInOut",
            }}
        >
            <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5 0L6.123 3.877L10 5L6.123 6.123L5 10L3.877 6.123L0 5L3.877 3.877L5 0Z"
                    fill="currentColor"
                />
            </svg>
        </motion.span>
    );
};
